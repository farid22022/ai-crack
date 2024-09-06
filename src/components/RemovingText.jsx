import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../pages/Loading";
import Title from "./Title";
import Swal from "sweetalert2";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const RemovingText = () => {

    const { register, handleSubmit } = useForm();
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const onSubmit = async (data) => {
        setLoading(true);
        const photo = data.image[0];
        const form = new FormData();
        form.append('image_file', photo);

        
            // Remove background using the external API
            const response = await fetch("https://clipdrop-api.co/remove-text/v1", {
                method: "POST",
                headers: {
                    "x-api-key": import.meta.env.VITE_CD_API_KEY,
                },
                body: form,
            });

            const buffer = await response.arrayBuffer();
            const blob = new Blob([buffer], { type: `image/${data.format}` }); // Adjust type based on your response
            const file = new File([blob], "upscaled-image.jpg", { type: "image/jpg" });

            // Upload the processed image to ImgBB
            const imgbbFormData = new FormData();
            imgbbFormData.append('image', file);

            const res = await axios.post(image_hosting_api, imgbbFormData, {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            });

            const newImageUrl = res.data.data.display_url;
            const imageDetails = {
                upScaledImage: newImageUrl,
                email: user?.email,
            };

            // Save image details to your server
            const dbRes = await axios.post("https://ai-photo-crack.vercel.app/removingText/removeText", imageDetails);
            if (dbRes?.data?.insertedId) {
                Swal.fire("Success");
                setLoading(false)
                navigate(`/`);
            }
        
    };

    if (loading) return <Loading />;
    return (
        <div className="mx-auto">
            <Title className="p-5 ml-4 mb-10">Remove Text</Title>
            <div className="mt-10 ml-12">
                <h3 className="ml-8 text-orange-600">The original image should be a PNG, JPEG or WebP file, with a maximum resolution of 16 megapixels and a max file size of 30 Mb.</h3>
            </div>
            <form
                className="grid grid-cols-1 text-center justify-center items-center rounded-md p-3 shadow-2xl shadow-blue-800 w-2/5 mx-auto mt-12"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Image*</span>
                    </label>
                    <input className="hover:bg-neutral-950 transition-all duration-300 input input-bordered w-1/3" type="file" {...register("image")} />
                </div>
                <button className="transition-all duration-1000 hover:text-xl hover:mt-4 btn w-1/4 mt-4">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default RemovingText;