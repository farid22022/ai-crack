import { useLoaderData } from "react-router-dom";


const PaintingDetails = () => {
    const data = useLoaderData();
    return (

        <div className="container">
            <div className="grid md:grid-cols-2 gap-2">
                <div>
                    <img className="w-full" src={data?.url}/>
                </div>
                <div className="space-y-5">
                    <h2 className="text-2xl">{data?.title}</h2>
                    <p>{data.details}</p>
                </div>
            </div>
            
        </div>
    );
};

export default PaintingDetails;