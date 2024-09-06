import { Link } from "react-router-dom";


const PaintingCard = ({painting}) => {
    return (
        <div className="relative hover:mt-4 transition-all duration-300 rounded-lg">
            <img src={painting?.url} alt="" className="rounded-lg"/>
            <div className="detail absolute transition-all duration-1000 inset-0 w-full h-full opacity-5 bg-slate-400 hover:opacity-80 hover:rounded-lg flex flex-col gap-3 justify-center items-center rounded-md">
                <p className="text-2xl text-center text-gray-900">{painting?.title}</p>
                <button>
                    <Link to={`/paintings/${painting._id}`}>Details</Link>
                </button>
            </div>
            
        </div>
    );
};

export default PaintingCard;