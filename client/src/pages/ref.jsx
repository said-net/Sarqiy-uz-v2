import { useNavigate, useParams } from "react-router-dom";

function Refferer() {
    const nv = useNavigate()
    const { id } = useParams();
    localStorage.setItem('ref_id', id);
    setTimeout(() => {
        nv('/');
    }, 1500);
    return (
        <div className="flex items-center justify-center w-full h-[100vh] fixed top-0 left-0 z-[9999999999999] bg-[#00000078] backdrop-blur">
            <h1 className="text-[20px] text-white">Kuting...</h1>
        </div>
    );
}

export default Refferer;