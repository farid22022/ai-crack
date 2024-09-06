import { useContext, useState } from "react";
import Title from "./Title";
// import Loading from "./Loading";

import Swal from "sweetalert2";
import axios from "axios";
import { AuthContext } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import Loading from "../pages/Loading";
const Generate = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const paintings_types = [
        "Oil Painting",
        "Watercolor Painting",
        "Acrylic Painting",
        "Pastel Painting",
        "Ink Wash Painting",
        "Gouache Painting",
        "Fresco",
        "Encaustic Painting",
        "Spray Painting",
        "Digital Painting"
      ];
      
      const painting_categories = [
        "Portrait",
        "Landscape",
        "Still Life",
        "Abstract",
        "Historical",
        "Religious",
        "Genre Painting",
        "Surrealism",
        "Pop Art",
        "Expressionism"
      ];
      
    const [activeCat, setActiveCat] = useState("")
    const [activeType, setActiveType] = useState("")
    const [images, setImages] = useState([]);
    const [loading , setLoading] = useState(false)
    const handleSubmit = (e) =>{
        const prompt = e.target.prompt.value;
        
        e.preventDefault();

        if(activeCat.length === 0){
            return Swal.fire("error","Please choose a category")
        }
        if(activeType.length === 0){
            return Swal.fire("error","Please choose a type")
        }
        if(prompt.length < 10){
            return Swal.fire("error","Add minimum 10-30 character. Not more")
        }
        setLoading(true);
        axios.post("https://ai-photo-crack.vercel.app/paintings/generate",{
            prompt,
            type:activeCat,
            category: activeCat,
            email:user?.email
        })
            .then(res =>{
                if(res?.data?.insertedId){
                    Swal.fire("Success")
                    navigate(`/paintings/${res?.data?.insertedId}`);
                    setLoading(false);
                }
            })
        
        


        
    }

    if(loading) return <Loading></Loading>
    return (
        <div className="container">
            <Title>Generate Paintings</Title>
            <form onSubmit={handleSubmit} className="flex flex-wrap mt-10 justify-center gap-2">
                <input
                    type="text"
                    name="prompt"
                    placeholder="What kind of painting do you need"
                    className="input input-bordered w-10/12"
                />
                <button className="btn btn-primary">Generate</button>
            </form>
            {/* <div className="grid lg:grid-cols-2 gap-5">
                {images.map((image,index) =>(
                    <div key={index}>
                        <img className="border-8 p-5 w-full" src={image} alt=""/>
                    </div>
                    ))}
            </div> */}

            <div className="grid md:grid-cols-2 pt-10">
                <div className="">
                    <h2 className="text-xl font-bold">Choose A Category</h2>
                    <div className="space-x-5 space-y-3">
                        {painting_categories.map((cat,index) =>(
                            <button 
                                key={index} 
                                className={`${activeCat === cat&& "bg-orange-400"}`}
                                onClick={() => setActiveCat(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-x-5 space-y-3">
                <h2 className="text-xl font-bold">Choose A Category</h2>
                {paintings_types.map((type,index) =>(
                            <button 
                                key={index} 
                                className={`${activeType === type&& "bg-orange-400"}`}
                                onClick={() => setActiveType(type)}
                            >
                                {type}
                            </button>
                        ))}
                </div>
            </div> 
            


        </div>
    );
};

export default Generate;