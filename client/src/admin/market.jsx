import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { FaBoxes, FaCopy } from "react-icons/fa";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input } from "@material-tailwind/react";
import { FaX } from "react-icons/fa6";

function AdminMarket() {
    const [state, setState] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [category, setCategory] = useState('all')
    const { uId } = useSelector(e => e.auth);
    const [openFlow, setOpenFlow] = useState({ id: '', title: '' });
    const [targetApi, setTargetApi] = useState('');
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/category/getall`).then(res => {
            const { data, ok } = res.data;
            setIsLoad(true);
            if (ok) {
                setCategories(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib koring!")
        });
    }, []);

    useEffect(() => {
        axios(`${API_LINK}/product/get-for-admins/${category}`, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { data, ok } = res.data;
            setIsLoad(true);
            console.log(data);
            if (ok) {
                setState(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib koring!")
        });
    }, [category]);

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
        <div className="flex items-center justify-start flex-col w-full p-[0_10px]">
            <Link to={`/dashboard`} className="w-full underline mb-[10px]">Ortga</Link>
            <div className="flex items-center justify-start w-full overflow-x-scroll h-[80px] bg-white rounded shadow-md p-[0_10px]">
                <div onClick={() => setCategory('all')} className="flex items-center justify-start flex-col w-[50px] mr-[20px]">
                    <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full border overflow-hidden">
                        <FaBoxes className="text-[30px] text-blue-gray-600" />
                    </div>
                    <p className="text-[12px]">Barchasi</p>
                </div>
                {isLoad && categories[0] &&
                    categories?.map((c, i) => {
                        return (
                            <div onClick={() => setCategory(c?.id)} key={i} className="flex items-center justify-start flex-col w-[50px] mr-[20px]">
                                <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full border overflow-hidden p-[10px]">
                                    <img src={c.image} alt={i} />
                                </div>
                                <p className="text-[10px] w-full ">{c?.title?.slice(0, 7)}...</p>
                            </div>
                        )
                    })
                }
            </div>
            {/*  */}
            {isLoad && state[0] &&
                <div className="grid grid-cols-2 gap-[10px] my-[10px]">
                    {state?.map((p, i) => {
                        return (
                            <div key={i} className="flex items-center justify-start flex-col w-[172px] h-[400px] p-[3px] bg-white shadow-md rounded relative">
                                {p?.bonus && <span className="absolute top-[5px] left-[5px] bg-red-500 px-[5px] rounded text-[12px] text-white">{p?.bonus_about}</span>}
                                <div className="flex items-center justify-center w-full overflow-hidden h-[190px]">
                                    <img src={p?.image} alt="r" />
                                </div>
                                <div className="flex items-start justify-start flex-col w-full">
                                    <p className="w-full p-[0_2%] my-[10px]">
                                        {p?.title?.slice(0, 15) + '...'}
                                    </p>
                                    <div className="flex items-center justify-start w-full h-[20px]">
                                        {p?.old_price &&
                                            <p className="text-gray-700 text-[12px] font-normal w-full px-[2%]"><s>{Number(p?.old_price).toLocaleString()} so'm</s> <span className="text-[red]">-{String((p?.old_price - p?.price) / (p?.old_price) * 100).slice(0, 5)}%</span></p>
                                        }
                                    </div>
                                    <p className=" w-full p-[0_2%] font-bold text-[16px] text-black">{Number(p.price).toLocaleString()} so'm</p>
                                    {/*  */}
                                    <div className="w-full h-[1px] bg-blue-gray-100"></div>
                                    <p className="text-[12px]">To'lov: <span className="text-[15px]">{Number(p?.for_admins).toLocaleString()} s'om</span></p>
                                    {/*  */}
                                    <span className="w-full h-[30px] border-[2px] rounded border-green-500 flex items-center justify-center uppercase tracking-[2px] mb-[10px]" onClick={() => setOpenFlow({ id: p?.pid, title: p?.title })}>
                                        Oqim
                                    </span>
                                    {/*  */}
                                    <span className="w-full h-[30px] rounded bg-green-500 flex items-center justify-center uppercase tracking-[1px] mb-[10px] text-white shadow-md" onClick={() => getAds(p?.id)}>
                                        Reklama posti
                                    </span>
                                    <span className="w-full flex items-center justify-center h-[30px] uppercase tracking-[1px] mb-[10px] text-red-500 text-[12px] shadow-md" onClick={() => setTargetApi(p?.pid)}>
                                        TARGET API
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
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

            <Dialog open={targetApi !== ''} className="p-[5px]">
                <DialogHeader className="w-full flex items-center justify-between">
                    <h1 className="text-[14px]">Target uchun API</h1>
                    <IconButton onClick={() => setTargetApi('')} className="rounded-full text-[20px]" color="blue-gray">
                        <FaX />
                    </IconButton>
                </DialogHeader>
                <DialogBody className="border-y">
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input value={`API-LINK: https://k-ch.na4u.ru/target`} disabled />
                        <IconButton onClick={() => { navigator.clipboard.writeText(`https://k-ch.na4u.ru/target`); toast.success("Linkdan Nusxa olindi!", { autoClose: 1000 }) }}>
                            <FaCopy />
                        </IconButton>
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input value={`KALIT(Stream): https://sharqiy.uz/oqim/${uId}/${targetApi}`} disabled />
                        <IconButton onClick={() => { navigator.clipboard.writeText(`https://sharqiy.uz/oqim/${uId}/${targetApi}`); toast.success("Strimdan nusxa olindi!", { autoClose: 1000 }) }}>
                            <FaCopy />
                        </IconButton>
                    </div>
                </DialogBody>
                {/* <DialogFooter>
                    <Button color="green" className="rounded" onClick={() => { navigator.clipboard.writeText(`https://k-ch.na4u.ru/target/${uId}/${targetApi}`); toast.success("Nusxa olindi!", { autoClose: 1000 }) }}>Nusxa olish</Button>
                </DialogFooter> */}
            </Dialog>
        </div>
    );
}

export default AdminMarket;