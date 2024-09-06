// import axios from "axios";
import { useForm } from "react-hook-form";
// import Swal from "sweetalert2";
import Title from "./Title";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import Loading from "../pages/Loading";
import Swal from "sweetalert2";
import {  useNavigate } from "react-router-dom";
const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
const Uncrop = () => {
    const { register, handleSubmit } = useForm();
    const { user } = useContext(AuthContext)
    const [loading , setLoading] = useState(false)
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true)
        console.log(data);
        const imageFile = data.image[0];
        const formData = new FormData();
        formData.append('image_file', imageFile);
        formData.append('extend_left', `${data.number1}`);
        formData.append('extend_down', `${data.number2}`);
        
        const response = await fetch("https://clipdrop-api.co/uncrop/v1", {
            method: "POST",
            headers: {
                "x-api-key": import.meta.env.VITE_CD_API_KEY,
            },
            body: formData,
        });

        const buffer = await response.arrayBuffer();
        const blob = new Blob([buffer], { type: `image/${data.format}` }); // Adjust type based on your response
        console.log(blob);

        // Convert the blob into a File object
        const file = new File([blob], "upscaled-image.jpg", { type: "image/jpg" });

        // Prepare FormData for Imgbb API
        const imgbbFormData = new FormData();
        imgbbFormData.append('image', file);

        const res = await axios.post(image_hosting_api, imgbbFormData, {
            headers: {
                'content-type': 'multipart/form-data',
            },
        });

        const newImageUrl = res.data.data.display_url;
        const imageDetails = {
            upScaledImage : newImageUrl,
            email:user?.email
        }
        console.log("New Image URL:", newImageUrl);
        axios.post("https://ai-photo-crack.vercel.app/uncropping/uncroppost",imageDetails)
            .then(res =>{
                if(res?.data?.insertedId){
                    Swal.fire("Success")
                    navigate(`/uncroppedImages`);
                    setLoading(false);
                }
            })
        
        
    };

    if(loading) return <Loading></Loading>
    return (
        <div className="mx-auto">
            <Title className="p-5 ml-2 mb-10">Crop or Uncrop Image</Title>
            <div className="mt-10 ml-12">
                <h3>[1] The original image should be a JPG, PNG or WebP, with a maximum resolution of 10 megapixels and a max file size of 30 Mb.</h3>
                <h3>[2] (optional) extend_left integer field corresponding to the number of pixels to add to the left of the image, maximum of 2k, defaults to 0.</h3>
                <h3>[3] (optional) extend_right integer field corresponding to the number of pixels to add to the right of the image, maximum of 2k, defaults to 0.</h3>
                <h3>[4] (optional) extend_up integer field corresponding to the number of pixels to add at the top of the image, maximum of 2k, defaults to 0.</h3>
            </div>
            <div className="text-center text-3xl mt-7 ">
                <h1 className="text-blue-700 shadow-info ">Input negative numbers for uncrop the image</h1>
            </div>
            <form className="grid grid-cols-1 text-center justify-center items-center rounded-md p-3 shadow-2xl shadow-blue-800 w-2/5 mx-auto mt-12" onSubmit={handleSubmit(onSubmit)}
                >

                    
    
                    <div className="form-control w-full ">
                        <label className="label">
                            <span className="label-text">Image *</span>
                        </label>
                        <input className="hover:bg-neutral-950 transition-all duration-300 input input-bordered w-1/3" type="file" {...register("image")} />
                    </div>

                    <div className="flex w-1/3 space-x-5">
                        <div className=" form-control w-full "> 
                            <label className="label">
                                <span className="label-text">Extend Left</span>
                            </label>
                            <input className="hover:bg-neutral-950 transition-all duration-300 input input-bordered " {...register("number1", { required: true })} />
                        </div>

                        <div className=" form-control w-full "> 
                            <label className="label">
                                <span className="label-text">Extend Down</span>
                            </label>
                            <input className="hover:bg-neutral-950 transition-all duration-300 input input-bordered" {...register("number2", { required: true })} />
                        </div>
                    </div>
                    <div className=" form-control w-1/3 "> 
                            <label className="label">
                                <span className="label-text">format</span>
                            </label>
                            <input className="hover:bg-neutral-950 transition-all duration-300 input input-bordered " {...register("format", { required: true })} />
                        </div>

                    <button className=" transition-all duration-1000 hover:text-xl hover:mt- btn w-1/4 mt-4">
                        Submit
                    </button>
                </form>
        </div>
    );
};

export default Uncrop;