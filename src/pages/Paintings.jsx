import { useLoaderData } from "react-router-dom";
import PaintingCard from "../components/PaintingCard";

const Paintings = () => {
    const data = useLoaderData();
    

    return (
        <div className="container">
            <h2>All Paintings here</h2>
            <div className="grid md:grid-cols-3 gap-5">
                {data.map((painting,index) =><PaintingCard
                 key={index}
                 painting={painting}></PaintingCard>)}
            </div>
        </div>
    );
};

export default Paintings;