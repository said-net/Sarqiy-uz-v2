import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Spinner } from "@material-tailwind/react";

function Competition() {
    const [list, setList] = useState([]);
    const [competiton, setCompetition] = useState({ title: '', image: '', about: '', start: '', end: '' });
    const [isLoad, setIsLoad] = useState(false);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/competition/get-one-for-admins`, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg, data, competition } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setList(data);
                setCompetition(competition);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, []);
    return (
        <div className="flex items-center justify-start flex-col w-full p-[10px]">
            <Link to={`/dashboard`} className="w-full underline ">Ortga</Link>
            <div className="flex items-center justify-start flex-col w-full min-h-[500px] p-[5px] bg-white shadow-md">
                {!isLoad && <Spinner />}
                {isLoad && !competiton?.title && <p>Konkurs mavjud emas!</p>}
                {isLoad && competiton?.title &&
                    <>
                        <div className="flex items-center justify-start flex-col w-full mb-[10px]">
                            <img src={competiton?.image} alt="rasm" />
                            <p className="text-[25px] w-full text-start border-b">{competiton.title}</p>
                            <p className="w-full text-start border-b text-[14px]">{competiton.about}</p>
                        </div>
                        <div className="flex items-center justify-start flex-col w-full mb-[10px]">
                            <div className="flex items-center justify-between w-full border-b h-[50px]">
                                <p className="border-[2px] border-[#ee2828] p-[5px_10px] rounded-[4px]">{competiton.start} dan</p>
                                <p className="border-[2px] border-[#4af71f] p-[5px_10px] rounded-[4px]">{competiton.end} gacha</p>
                            </div>
                            <div className="flex items-center justify-between w-full border-b">
                                <p className="w-[10%] text-center text-[12px] sm:text-[14px]">O'rin</p>
                                <p className="w-[30%] text-center text-[12px] sm:text-[14px]">Ism</p>
                                <p className="w-[30%] text-center text-[12px] sm:text-[14px]">Raqam</p>
                                <p className="w-[30%] text-center text-[12px] sm:text-[14px]">Sotuv</p>
                            </div>

                            {list?.map((l, i) => {
                                return (
                                    <div key={i} className={`flex items-center justify-between w-full ${(i + 1) % 2 !== 0 ? 'bg-gray-200' : 'bg-white'} h-[50px]`}>
                                        <p className="w-[10%] text-center text-[12px] sm:text-[14px]">{i + 1}</p>
                                        <p className="w-[30%] text-center text-[12px] sm:text-[14px]">{l?.name}</p>
                                        <p onClick={() => window.location.href = 'tel:' + l.phone} className="w-[30%] text-center text-[12px] sm:text-[14px] cursor-pointer">{l?.phone?.slice(0, 9)}****</p>
                                        <p className="w-[30%] text-center text-[12px] sm:text-[14px]">{l?.flows} ta</p>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                }
            </div>
        </div>
    );
}

export default Competition;