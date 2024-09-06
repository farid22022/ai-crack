// import axios from "axios";
import { useForm } from "react-hook-form";
// import Swal from "sweetalert2";
import Title from "./Title";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Navigate } from "react-router-dom";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Upscale = () => {
    const { register, handleSubmit } = useForm();
    const { user } = useContext(AuthContext)

    const onSubmit = async (data) => {
        console.log(data);
        const imageFile = data.image[0];
        const formData = new FormData();
        formData.append('image_file', imageFile);
        formData.append('target_width', data.number1);
        formData.append('target_height', data.number2);
        
        const response = await fetch("https://clipdrop-api.co/image-upscaling/v1/upscale", {
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
        console.log("New Image URL:", newImageUrl);

        const upscaledImageDetails = {
            upScaledImage : newImageUrl,
            email:user?.email
        }

        const response2 =await axios.post("https://ai-photo-crack.vercel.app/upscaling/uppost",upscaledImageDetails)
        console.log(response2.data.insertedId)
        Navigate('/upscaledImages')
        
    };
    
    return (
        <div className="mx-auto">
            <Title className="p-5 ml-2 mb-10">Image Upscale</Title>
            <div className="mt-10 ml-12">
                <h3>[1] The original image should be a PNG, JPEG or WebP file, with a maximum resolution of 16 megapixels and a max file size of 30 Mb.</h3>
                <h3>[2] A required target_width text field which is the desired width in pixels, a valid value is an integer between 1 & 4096.</h3>
                <h3>[3] A required target_height text field which is the desired height in pixels, a valid value is an integer between 1 & 4096.</h3>
            </div>
            <form className="grid grid-cols-1 text-center justify-center items-center rounded-md p-3 shadow-2xl shadow-blue-800 w-2/5 mx-auto mt-12" onSubmit={handleSubmit(onSubmit)}
                >

                    
    
                    <div className="form-control w-full ">
                        <label className="label">
                            <span className="label-text">Image*</span>
                        </label>
                        <input className="hover:bg-neutral-950 transition-all duration-300 input input-bordered w-1/3" type="file" {...register("image")} />
                    </div>

                    <div className="flex w-1/3 space-x-5">
                        <div className=" form-control w-full "> 
                            <label className="label">
                                <span className="label-text">Width</span>
                            </label>
                            <input className="hover:bg-neutral-950 transition-all duration-300 input input-bordered " {...register("number1", { required: true })} />
                        </div>

                        <div className=" form-control w-full "> 
                            <label className="label">
                                <span className="label-text">Height</span>
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

export default Upscale;