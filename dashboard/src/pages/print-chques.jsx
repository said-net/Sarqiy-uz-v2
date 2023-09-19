import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Spinner } from "@material-tailwind/react";

function PrintChques() {
    const [cheques, setCheques] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [page, setPage] = useState(1);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/boss/get-all-cheques/${page}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            setIsLoad(true)
            const { data, ok, msg, operators } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                setCheques(data)
            }
        }).catch(() => {
            setIsLoad(true)
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, []);
    return (
        <>
            {!isLoad && <Spinner />}
            {isLoad && !cheques[0] && <p>Cheklar mavjud emas!</p>}
            {isLoad && cheques[0] &&
                <div className="grid grid-cols-2 gap-[10px] p-[5px]">
                    {cheques?.map((c, i) => {
                        return (
                            <div className="flex items-center justify-start flex-col relative p-[5px] border-[2px] border-blue-gray-500 w-[95mm] h-[95mm]">
                                
                            </div>
                        )
                    })}
                </div>
            }
        </>
    );
}

export default PrintChques;