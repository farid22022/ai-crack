import { useLoaderData } from "react-router-dom";


const UncroppedImages = () => {

    const imagesCollection = useLoaderData()
    return (
        <div className="mx-auto">
            <h3>Total Images : {imagesCollection.length}</h3>
            <div className="grid md:grid-cols-3 gap-5">
                {imagesCollection.map((image,index) =><div  key={index}>
                    <div className="p-3">
                        <img className="hover:mt-5 transition-all duration-1000 hover:z-10" src={image.upScaledImage} key={index}/>
                    </div>
                    <div className="p-3">
                        Creator's email: <a className="text-blue-700">{image.email}</a>
                    </div>
                </div>)}
            </div>
        </div>
    );
};

export default UncroppedImages;