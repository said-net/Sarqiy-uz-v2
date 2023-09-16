import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Spinner } from "@material-tailwind/react";
import { FaBoxes, FaCheckCircle, FaMoneyBill, FaMoneyBillWave, FaNewspaper, FaPhone, FaShoppingCart, FaTaxi } from "react-icons/fa";
import { FaBox, FaUsers, FaX } from "react-icons/fa6";

function AdminStats() {
    const [date, setDate] = useState('all');
    const [isLoad, setIsLoad] = useState(false);
    const [state, setState] = useState({});
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/user/get-stats/${date}`, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg, data } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg)
            } else {
                toast.success(msg);
                setState(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!");
        })
    }, [date]);

    return (
        <div className="flex items-center justify-start flex-col w-full">
            <Link to={`/dashboard`} className="w-full underline mb-[10px] ml-[35px]">Ortga</Link>
            {!isLoad && <Spinner />}
            {isLoad &&
                <div className="flex items-center justify-between w-[90%] h-[50px] bg-white shadow-md mb-[10px] rounded p-[0_10px]">
                    <p className={` ${date === 'all' ? 'underline text-black' : 'text-blue-gray-400'} text-[12px]`} onClick={() => setDate('all')}>Umumiy</p>
                    {/*  */}
                    <p className={` ${date === 'month' ? 'underline text-black' : 'text-blue-gray-400'} text-[12px]`} onClick={() => setDate('month')}>Oylik</p>
                    {/*  */}
                    <p className={` ${date === 'yesterday' ? 'underline text-black' : 'text-blue-gray-400'} text-[12px]`} onClick={() => setDate('yesterday')}>Kecha</p>
                    {/*  */}
                    <p className={` ${date === 'today' ? 'underline text-black' : 'text-blue-gray-400'} text-[12px]`} onClick={() => setDate('today')}>Bugun</p>
                </div>
            }
            {isLoad &&
                <>
                    <div className="flex items-center justify-start w-[90%] h-[50px] bg-white shadow-md rounded p-[5px] relative mb-[10px]">
                        <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-blue-50 mr-[20px]">
                            <FaShoppingCart className="text-[20px] text-blue-500" />
                        </div>
                        <p className="text-blue-500 absolute top-[5px] right-[5px] text-[12px]">Sotuvlar</p>
                        <p className="text-[20px]">{state?.all}<sub className="ml-[10px] text-blue-gray-500">ta</sub></p>
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-start w-[90%] h-[50px] bg-white shadow-md rounded p-[5px] relative mb-[10px]">
                        <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-cyan-50 mr-[20px]">
                            <FaNewspaper className="text-[20px] text-cyan-500" />
                        </div>
                        <p className="text-cyan-500 absolute top-[5px] right-[5px] text-[12px]">Yangi buyurtmalar</p>
                        <p className="text-[20px]">{state?.pending}<sub className="ml-[10px] text-blue-gray-500">ta</sub></p>
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-start w-[90%] h-[50px] bg-white shadow-md rounded p-[5px] relative mb-[10px]">
                        <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-teal-50 mr-[20px]">
                            <FaBox className="text-[20px] text-teal-500" />
                        </div>
                        <p className="text-teal-500 absolute top-[5px] right-[5px] text-[12px]">Dostavkaga tayyor</p>
                        <p className="text-[20px]">{state?.success}<sub className="ml-[10px] text-blue-gray-500">ta</sub></p>
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-start w-[90%] h-[50px] bg-white shadow-md rounded p-[5px] relative mb-[10px]">
                        <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-purple-50 mr-[20px]">
                            <FaTaxi className="text-[20px] text-purple-500" />
                        </div>
                        <p className="text-purple-500 absolute top-[5px] right-[5px] text-[12px]">Yetkazilmoqda</p>
                        <p className="text-[20px]">{state?.sended}<sub className="ml-[10px] text-blue-gray-500">ta</sub></p>
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-start w-[90%] h-[50px] bg-white shadow-md rounded p-[5px] relative mb-[10px]">
                        <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-green-50 mr-[20px]">
                            <FaCheckCircle className="text-[20px] text-green-500" />
                        </div>
                        <p className="text-green-500 absolute top-[5px] right-[5px] text-[12px]">Yetkazilgan</p>
                        <p className="text-[20px]">{state?.delivered}<sub className="ml-[10px] text-blue-gray-500">ta</sub></p>
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-start w-[90%] h-[50px] bg-white shadow-md rounded p-[5px] relative mb-[10px]">
                        <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-red-50 mr-[20px]">
                            <FaX className="text-[20px] text-red-500" />
                        </div>
                        <p className="text-red-500 absolute top-[5px] right-[5px] text-[12px]">Bekor qilingan</p>
                        <p className="text-[20px]">{state?.reject}<sub className="ml-[10px] text-blue-gray-500">ta</sub></p>
                    </div>
                    
                    {/*  */}
                    <div className="flex items-center justify-start w-[90%] h-[50px] bg-white shadow-md rounded p-[5px] relative mb-[10px]">
                        <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-red-50 mr-[20px]">
                            <FaBoxes className="text-[20px] text-red-500" />
                        </div>
                        <p className="text-red-500 absolute top-[5px] right-[5px] text-[12px]">Arxivlangan</p>
                        <p className="text-[20px]">{state?.archive}<sub className="ml-[10px] text-blue-gray-500">ta</sub></p>
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-start w-[90%] h-[50px] bg-white shadow-md rounded p-[5px] relative mb-[10px]">
                        <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-orange-50 mr-[20px]">
                            <FaPhone className="text-[20px] text-orange-500" />
                        </div>
                        <p className="text-orange-500 absolute top-[5px] right-[5px] text-[12px]">Qayta aloqa</p>
                        <p className="text-[20px]">{state?.wait}<sub className="ml-[10px] text-blue-gray-500">ta</sub></p>
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-start w-[90%] h-[50px] bg-white shadow-md rounded p-[5px] relative mb-[10px]">
                        <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-green-50 mr-[20px]">
                            <FaMoneyBill className="text-[20px] text-green-500" />
                        </div>
                        <p className="text-green-500 absolute top-[5px] right-[5px] text-[12px]">Sotuvdan foyda</p>
                        <p className="text-[20px]">{Number(state?.profit).toLocaleString()}<sub className="ml-[10px] text-blue-gray-500">so'm</sub></p>
                    </div>
                    {/*  */}
                    {date === 'all' &&
                        <>
                            <div className="flex items-center justify-start w-[90%] h-[50px] bg-white shadow-md rounded p-[5px] relative mb-[10px]">
                                <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-blue-50 mr-[20px]">
                                    <FaUsers className="text-[20px] text-blue-500" />
                                </div>
                                <p className="text-blue-500 absolute top-[5px] right-[5px] text-[12px]">Referallar</p>
                                <p className="text-[20px]">{Number(state?.refferals).toLocaleString()}<sub className="ml-[10px] text-blue-gray-500">ta</sub></p>
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-start w-[90%] h-[50px] bg-white shadow-md rounded p-[5px] relative mb-[10px]">
                                <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-indigo-50 mr-[20px]">
                                    <FaUsers className="text-[20px] text-indigo-500" />
                                </div>
                                <p className="text-indigo-500 absolute top-[5px] right-[5px] text-[12px]">Referallardan foyda</p>
                                <p className="text-[20px]">{Number(state?.refProfit).toLocaleString()}<sub className="ml-[10px] text-blue-gray-500">so'm</sub></p>
                            </div>
                            {/*  */}
                            <div className="flex items-center justify-start w-[90%] h-[50px] bg-white shadow-md rounded p-[5px] relative mb-[10px]">
                                <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-green-50 mr-[20px]">
                                    <FaMoneyBillWave className="text-[20px] text-green-500" />
                                </div>
                                <p className="text-green-500 absolute top-[5px] right-[5px] text-[12px]">Umumiy foyda</p>
                                <p className="text-[20px]">{Number(state?.profit + state?.refProfit).toLocaleString()}<sub className="ml-[10px] text-blue-gray-500">so'm</sub></p>
                            </div>
                        </>
                    }
                </>
            }
        </div>
    );
}

export default AdminStats;