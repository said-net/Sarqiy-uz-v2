import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { IconButton, Spinner } from "@material-tailwind/react";
import QRCode from "react-qr-code";
import { FaAngleLeft, FaAngleRight, FaShoppingCart } from "react-icons/fa";
function PrintCheques() {
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
            const { data, ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                setCheques(data)
            }
        }).catch(() => {
            setIsLoad(true)
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, [page]);
    return (
        <div className="flex items-center justify-start flex-col w-full min-h-[150vh] p-[70px_0]">
            {!isLoad && <Spinner />}
            {isLoad && !cheques[0] && <p>Cheklar mavjud emas!</p>}
            {isLoad && cheques[0] &&
                <div className="flex items-start justify-center w-[21cm] h-[890px] p-[10px] rounded-[10px] relative bg-white">
                    <div className="flex items-center justify-start flex-col  mx-[5px]">
                        {cheques?.map((c, i) => {
                            return (
                                (i + 1) % 2 == 0 && <div key={i} className="flex items-start justify-start flex-col border-black border min-h-[6.5cm] w-[9cm] relative mb-[10px] rounded-[10px]">
                                    <div className="flex items-start justify-between flex-col w-[70%] border-r border-black min-h-[6.5cm] p-[10px]">
                                        <p className="text-[13px]"><b>Mijoz:</b> {c?.name} | {c?.phone}</p>
                                        <p className="text-[13px]"><b>Manzil:</b> {c?.location}</p>
                                        <p className="text-[13px]"><b>Maxsulot:</b> {c?.product} <b>| {c?.count} ta</b></p>

                                        <p className="text-[13px]"><b>Umumiy:</b> {Number(c?.total_price)?.toLocaleString()} so'm</p>
                                        <p className="text-[13px]"><b>Izoh:</b> {c?.about}</p>
                                        <p className="text-[13px]"><b>Operator:</b> {c?.operator_name} | {c?.operator_phone}</p>
                                        <p className="text-[13px]"><b>Call-Center:</b> +998339306464</p>
                                    </div>
                                    <div className="flex items-center justify-center w-[30%] h-[7cm] absolute right-[0] flex-col">
                                        <b className="mb-[20px] text-[13px] flex items-center justify-center">
                                            <FaShoppingCart className="mr-[5px]" />
                                            SHARQIY.UZ
                                        </b>

                                        <QRCode value="https://SHARQIY.UZ" size={80} />
                                        <p className="text-[13px] mt-[10px]"><b>ORDER-ID:</b> {c?.id}</p>
                                        <p>{c?.date}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex items-center justify-start flex-col mx-[5px]">
                        {cheques?.map((c, i) => {
                            return (
                                (i + 1) % 2 == 1 && <div key={i} className="flex items-start justify-start flex-col border-black border min-h-[6.5cm] w-[9cm] relative mb-[10px] rounded-[10px]">
                                    <div className="flex items-start justify-between flex-col w-[70%] border-r border-black min-h-[6.5cm] p-[10px]">
                                        <p className="text-[13px]"><b>Mijoz:</b> {c?.name} | {c?.phone}</p>
                                        <p className="text-[13px]"><b>Manzil:</b> {c?.location}</p>
                                        <p className="text-[13px]"><b>Maxsulot:</b> {c?.product} | <b>{c?.count} ta</b></p>

                                        <p className="text-[13px]"><b>Umumiy:</b> {Number(c?.total_price)?.toLocaleString()} so'm</p>
                                        <p className="text-[13px]"><b>Izoh:</b> {c?.about}</p>
                                        <p className="text-[13px]"><b>Operator:</b> {c?.operator_name} | {c?.operator_phone}</p>
                                        <p className="text-[13px]"><b>Call-Center:</b> +998339306464</p>
                                    </div>
                                    <div className="flex items-center justify-center w-[30%] h-[7cm] absolute right-[0] flex-col">
                                        <b className="mb-[10px] text-[13px] flex items-center justify-center">
                                            <FaShoppingCart className="mr-[5px]" />
                                            SHARQIY.UZ
                                        </b>
                                        <QRCode value="https://SHARQIY.UZ" size={80} />
                                        <p className="text-[13px] mt-[10px]"><b>ORDER-ID:</b> {c?.id}</p>
                                        <p>{c?.date}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex items-center justify-center w-full absolute bottom-[10px]">
                        <IconButton onClick={() => setPage(page - 1)} disabled={page <= 1} color="blue-gray" className="rounded-full">
                            <FaAngleLeft />
                        </IconButton>
                        <IconButton className="mx-[10px] rounded-full" disabled color="red">
                            {page}
                        </IconButton>
                        <IconButton onClick={() => setPage(page + 1)} color="blue-gray" className="rounded-full">
                            <FaAngleRight />
                        </IconButton>
                    </div>
                </div>
            }
        </div>
    );
}

export default PrintCheques;