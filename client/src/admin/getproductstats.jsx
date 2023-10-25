import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
// import { FaBoxes, FaEye, FaNewspaper, FaTaxi } from "react-icons/fa";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input } from "@material-tailwind/react";
import { FaX } from "react-icons/fa6";

function AdminProductStats() {
    const [state, setState] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { uId } = useSelector(e => e.auth);
    const [openFlow, setOpenFlow] = useState({ id: '', title: '' });
    const [select, setSelect] = useState('');

    useEffect(() => {
        axios(`${API_LINK}/product/get-stats-for-admins`, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { data, ok } = res.data;
            setIsLoad(true);
            if (ok) {
                setState(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib koring!")
        });
    }, []);

    function getAds(id) {
        axios(`${API_LINK}/product/get-ads-post/${id}`, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg)
            }
        }).catch(err => {
            console.log(err);
            toast.error("Aloqani tekshirib qayta urunib koring!")
        })
    }
    return (
        <div className="flex items-start justify-start flex-col w-full overflow-scroll p-[50px_10px]">
            {/*  */}
            <div className="flex items-center justify-center border border-gray-500">
                <p className="w-[50px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">ID</p>
                <p className="w-[80px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">RASMI</p>
                <p className="w-[180px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">MAHSULOT</p>
                <p className="w-[85px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">TASHRIF</p>
                <p className="w-[85px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">YANGI</p>
                <p className="w-[85px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">ARXIVLANGAN</p>
                <p className="w-[85px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">RAD ETILGAN</p>
                <p className="w-[85px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">KOPIYA</p>
                <p className="w-[85px] h-[50px] flex items-center justify-center border-r border-gray-500 flex-col text-center text-[11px]">
                    <span>DOSTAVKAGA</span>
                    <span>TAYYOR</span>
                </p>
                <p className="w-[100px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">YETKAZILMOQDA</p>
                <p className="w-[100px] h-[50px] flex items-center justify-center text-center text-[11px] border-r border-gray-500">YETKAZILGAN</p>
                <p className="w-[180px] h-[50px] flex items-center justify-center text-center text-[11px]">FOYDA(SO'M)</p>
            </div>
            {isLoad && state[0] &&
                state?.map((p, i) => {
                    return (
                        <div onClick={() => setSelect(String(i))} className={`flex items-center justify-center border border-gray-500 border-t-0 ${select === String(i) && 'bg-gray-300'} cursor-pointer`}>
                            <p className="w-[50px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                                {i + 1}
                            </p>
                            <div className="w-[80px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                                <img src={p?.image} alt="i" className="w-[30px] rounded-[10px]" />
                            </div>
                            <p className="w-[180px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                                {p?.title}
                            </p>
                            <p className="w-[85px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                                {p?.views}
                            </p>
                            <p className="w-[85px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                                {p?.pending}
                            </p>
                            <p className="w-[85px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                                {p?.archived}
                            </p>
                            <p className="w-[85px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                                {p?.rejected}
                            </p>
                            <p className="w-[85px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                                {p?.copy}
                            </p>
                            <p className="w-[85px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                                {p?.success}
                            </p>
                            <p className="w-[100px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                                {p?.sended}
                            </p>
                            <p className="w-[100px] h-[50px] flex items-center justify-center text-center text-[11px] border-r border-gray-500">
                                {p?.delivered}
                            </p>
                            <p className="w-[180px] h-[50px] flex items-center justify-center text-center text-[11px]">
                                {Number(p?.profit)?.toLocaleString()}
                            </p>
                        </div>
                        // <div key={i} className="flex items-center justify-start flex-col w-[172px] h-[470px] p-[3px] bg-white shadow-md rounded relative">
                        //     {p?.bonus && <span className="absolute top-[5px] left-[5px] bg-red-500 px-[5px] rounded text-[12px] text-white">{p?.bonus_about}</span>}
                        //     <div className="flex items-center justify-center w-full overflow-hidden h-[190px]">
                        //         <img src={p?.image} alt="r" />
                        //     </div>
                        //     <div className="flex items-start justify-start flex-col w-full">
                        //         <p className="w-full p-[0_2%] my-[10px]">
                        //             {p?.title?.slice(0, 15) + '...'}
                        //         </p>
                        //         {/* stats */}
                        //         <p className="flex items-center justify-start text-[13px]"><FaEye className="mr-[5px]" />Tashriflar: {p?.views} ta</p>

                        //         <p className="flex items-center justify-start text-[13px]"><FaNewspaper className="mr-[5px]" />Yangi: {p?.pending} ta</p>

                        //         <p className="flex items-center justify-start text-[13px]"><FaBoxes className="mr-[5px]" />Tayyor: {p?.success} ta</p>

                        //         <p className="flex items-center justify-start text-[13px]"><FaTaxi className="mr-[5px]" />Yuborildi: {p?.sended} ta</p>

                        //         <p className="flex items-center justify-start text-[13px]"><FaCircleCheck className="mr-[5px]" />Yetkazildi: {p?.delivered} ta</p>

                        //         {/*  */}
                        //         <div className="flex items-center justify-start w-full h-[20px]">
                        //             {p?.old_price &&
                        //                 <p className="text-gray-700 text-[12px] font-normal w-full px-[2%]"><s>{Number(p?.old_price).toLocaleString()} so'm</s> <span className="text-[red]">-{String((p?.old_price - p?.price) / (p?.old_price) * 100).slice(0, 5)}%</span></p>
                        //             }
                        //         </div>
                        //         <p className=" w-full p-[0_2%] font-bold text-[16px] text-black">{Number(p.price).toLocaleString()} so'm</p>
                        //         {/*  */}
                        //         <div className="w-full h-[1px] bg-blue-gray-100"></div>
                        //         <p className="text-[12px]">To'lov: <span className="text-[15px]">{Number(p?.for_admins).toLocaleString()} s'om</span></p>
                        //         {/*  */}
                        //         <span className="w-full h-[30px] border-[2px] rounded border-green-500 flex items-center justify-center uppercase tracking-[2px] mb-[10px]" onClick={() => setOpenFlow({ id: p?.pid, title: p?.title })}>
                        //             Oqim
                        //         </span>
                        //         {/*  */}
                        //         <span className="w-full h-[30px] rounded bg-green-500 flex items-center justify-center uppercase tracking-[1px] mb-[10px] text-white shadow-md" onClick={() => getAds(p?.id)}>
                        //             Reklama posti
                        //         </span>
                        //     </div>
                        // </div>
                    )
                })
            }
            <Dialog open={openFlow?.id !== ''} className="p-[5px]">
                <DialogHeader className="w-full flex items-center justify-between">
                    <h1 className="text-[14px]">{openFlow?.title}</h1>
                    <IconButton onClick={() => setOpenFlow({ id: '', title: '' })} className="rounded-full text-[20px]" color="blue-gray">
                        <FaX />
                    </IconButton>
                </DialogHeader>
                <DialogBody className="border-y">
                    <Input label="Siz uchun oqim" value={`https://sharqiy.uz/oqim/${uId}/${openFlow.id}`} disabled />
                </DialogBody>
                <DialogFooter>
                    <Button color="green" className="rounded" onClick={() => { navigator.clipboard.writeText(`https://sharqiy.uz/oqim/${uId}/${openFlow.id}`); toast.success("Nusxa olindi!", { autoClose: 1000 }) }}>Nusxa olish</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default AdminProductStats;