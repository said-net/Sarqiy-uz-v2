import axios from "axios";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaLink } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { FaMoneyBill, FaUsers } from "react-icons/fa6";
import { Button, Spinner } from "@material-tailwind/react";

function AdminRefs() {
    const { uId } = useSelector(e => e.auth);
    const [state, setState] = useState({});
    const [isLoad, setIsLoad] = useState(false);
    useEffect(() => {
        axios(`${API_LINK}/user/get-refs`, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg, data } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setState(data)
            }
        }).catch(err => {
            console.log(err);
            toast.error("Aloqani tekshirib qayta urunib koring!")
        })
    }, [])
    return (
        <div className="flex items-center justify-start flex-col w-full p-[0_10px]">
            <div className="flex items-start justify-start flex-col w-full bg-white shadow-md rounded min-h-[300px] p-[10px]">
                <p className="mb-[10px] flex items-center justify-center"><FaCheckCircle className="text-blue-500 mr-[10px]" />Eslatma:</p>
                <p className="pb-[10px] border-b mb-[10px] text-[14px]">Referallar bu siz saytga taklif qilgan adminlar hisoblanadi. Taklif qilgan adminlaringiz amalga oshirgan sotuvidan sizga <span className="mx-[0px] text-blue-500">{!isLoad ? <Spinner /> : Number(state?.comission).toLocaleString()}</span> so'm taqdim etiladi. Quyidagi havola orqali adminlarni taklif qiling va ko'proq daromad oling!</p>
                <p className="flex items-center justify-center text-[15px] mb-[10px]"><FaLink className="mr-[5px]" />Referal havolangiz: <span className="ml-[5px] text-blue-500">https://sharqiy.uz/ref/{uId}</span></p>
                {/*  */}
                <p className="flex items-center justify-center text-[15px] mb-[10px]"><FaUsers className="mr-[5px]" />Referallar soni: <span className="ml-[5px] text-blue-500">{!isLoad ? <Spinner /> : state?.refs} ta</span></p>
                {/*  */}
                <p className="flex items-center justify-center text-[15px] mb-[10px]"><FaMoneyBill className="mr-[5px]" />Foyda: <span className="ml-[5px] text-blue-500">{!isLoad ? <Spinner /> : Number(state?.profit).toLocaleString()} so'm</span></p>
                <Button color="green" className="rounded w-full" onClick={() => { navigator.clipboard.writeText(`https://sharqiy.uz/ref/${uId}`); toast.success("Nusxa olindi!", { autoClose: 1000 }) }}>Nusxa olish</Button>
            </div>
        </div>
    );
}

export default AdminRefs;