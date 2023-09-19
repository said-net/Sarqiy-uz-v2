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
                <div className="flex items-center justify-start flex-col w-[19cm] p-[10px] bg-white rounded mt-[10px] h-[29cm] shadow-sm">
                    <div className="flex items-center justify-between w-full border-black border h-[50px]">
                        <p className="flex items-center justify-center w-[50px] h-[50px] border border-black text-[10px]">
                            ID
                        </p>
                        <p className="flex items-center justify-center w-[150px] h-[50px] border border-black text-[10px]">
                            YUBORUVCHI
                        </p>
                        <p className="flex items-center justify-center w-[150px] h-[50px] border border-black text-[10px]">
                            MIJOZ
                        </p>
                        <p className="flex items-center justify-center w-[150px] h-[50px] border border-black text-[10px]">
                            MANZIL
                        </p>
                        <p className="flex items-center justify-center w-[150px] h-[50px] border border-black text-[10px]">
                            MAXSULOT
                        </p>
                        <p className="flex items-center justify-center w-[150px] h-[50px] border border-black text-[10px]">
                            IZOH
                        </p>
                        <p className="flex items-center justify-center w-[150px] h-[50px] border border-black text-[10px]">
                            SUMMA
                        </p>
                        <p className="flex items-center justify-center w-[150px] h-[50px] border border-black text-[10px]">
                            QR Kod
                        </p>
                    </div>
                    {cheques?.map((c, i) => {
                        return (
                            <div className="flex items-center justify-between w-full border-black border h-[100px]">

                            </div>
                        )
                    })}
                </div>
            }
        </>
    );
}

export default PrintChques;