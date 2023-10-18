import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { API_LINK } from "../config";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Spinner } from "@material-tailwind/react";
import { BiCopy, BiNews, BiTrash } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";

function GetFlows() {
    const [flows, setFlows] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [refresh, setRefresh] = useState(false);
    // 
    useEffect(() => {
        setIsLoad(false)
        axios(`${API_LINK}/flow/get-my-flows`, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            setIsLoad(true)
            const { ok, data } = res.data;
            if (ok) {
                setFlows(data);
            }
        });
    }, [refresh]);
    // 
    function GetAds(id) {
        axios(`${API_LINK}/flow/get-ads-post/${id}`, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg } = res.data;
            if (ok) {
                toast.success(msg);
            } else {
                toast.error(msg)
            }
        });
    }
    // 
    const [del, setDel] = useState({ title: '', id: '' });
    function DeleteFlow() {
        axios.delete(`${API_LINK}/flow/delete-flow/${del?.id}`, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg } = res.data;
            if (ok) {
                toast.success(msg);
                setRefresh(!refresh);
                setDel({ id: '', title: '' })
            } else {
                toast.error(msg);
            }
        });
    }
    // 
    const [openTarget, setOpenTarget] = useState({ title: '', id: '' });
    return (
        <div className="flex items-center justify-start flex-col w-full">
            <h1 className="p-[10px_20px] border border-gray-500 border-t-0 rounded-b mb-[10px]">OQIMLAR</h1>
            {!isLoad &&
                <div className="flex items-center justify-center w-full h-[50vh]">
                    <Spinner />
                </div>
            }
            {isLoad && !flows[0] &&
                <div className="flex items-center justify-center w-full h-[50vh]">
                    <p>Sizda oqimlar mavjud emas!</p>
                </div>
            }
            {isLoad && flows[0] &&
                <div className="grid grid-cols-2 gap-[10px] md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {flows?.map((f, i) => {
                        return (
                            <div className="flex items-center justify-start flex-col border border-gray-400 rounded-[10px] p-[5px] w-[170px] sm:w-[250px] h-[390px] bg-white" key={i}>
                                <p className="mb-[5px] w-full text-[14px]">{f?.product}</p>
                                <div className="flex items-center justify-center w-full h-[200px] rounded-[10px] overflow-hidden mb-[5px]">
                                    <img src={f?.image} alt="i" />
                                </div>
                                {/*  */}
                                <p className="w-full text-[14px]">{f?.title}</p>
                                {/*  */}
                                <div className="flex items-center justify-center w-full h-[40px] rounded-[10px] bg-gray-100 border mb-[5px] border-gray-400">
                                    <p className="p-[0_5px] text-[14px]">https://sharqiy.uz/link/{f?.id}</p>
                                </div>
                                {/*  */}
                                <div className="flex items-center justify-between w-full">
                                    {/*  */}
                                    <div className="flex items-center justify-center w-[40px] cursor-pointer bg-gray-100 h-[40px] rounded-[6px] border border-gray-400 hover:bg-blue-gray-100 duration-300" onClick={() => { navigator.clipboard.writeText(`https://sharqiy.uz/link/${f?.id}`); toast.success("Nusxa olindi!", { autoClose: 1000 }) }}>
                                        <BiCopy className="text-[30px] text-blue-gray-500" />
                                    </div>
                                    {/*  */}
                                    <div className="flex items-center justify-center w-[40px] cursor-pointer bg-gray-100 h-[40px] rounded-[6px] border border-gray-400 hover:bg-blue-gray-100 duration-300" onClick={() => window.open(`https://sharqiy.uz/link/${f?.id}`)}>
                                        <FaEye className="text-[30px] text-green-500" />
                                    </div>
                                    {/*  */}
                                    <div className="flex items-center justify-center w-[40px] cursor-pointer bg-gray-100 h-[40px] rounded-[6px] border border-gray-400 hover:bg-blue-gray-100 duration-300" onClick={() => GetAds(f?._id)}>
                                        <BiNews className="text-[30px] text-blue-500" />
                                    </div>
                                    {/*  */}
                                    <div className="flex items-center justify-center w-[40px] cursor-pointer bg-gray-100 h-[40px] rounded-[6px] border border-gray-400 hover:bg-blue-gray-100 duration-300" onClick={() => setDel({ id: f?._id, title: f?.title })}>
                                        <BiTrash className="text-[30px] text-red-500" />
                                    </div>
                                </div>
                                <Button onClick={() => setOpenTarget({ id: f?.id, title: f?.title })} className="mt-[5px] rounded-[10px] w-full" color="red">TARGET</Button>
                            </div>
                        )
                    })}
                </div>
            }
            {/*  */}
            <Dialog open={del?.id !== ''}>
                <DialogHeader>
                    <p>{del?.title} - Oqim o'chirilsinmi?</p>
                </DialogHeader>
                <DialogBody className="border-y">
                    <p>Diqqat oqim o'chirilgach hech uni qayta tiklashning iloji bo'lmaydi!</p>
                </DialogBody>
                <DialogFooter className="flex items-center justify-between">
                    <Button className="rounded" color="orange" onClick={() => setDel({ id: '', title: '' })}>Ortga</Button>
                    {/*  */}
                    <Button className="rounded" color="red" onClick={DeleteFlow}>O'chrirish</Button>
                </DialogFooter>
            </Dialog>
            {/* TARGET */}
            <Dialog open={openTarget?.id !== ''}>
                <DialogHeader>
                    <p className="text-[14px]">{openTarget?.title} - Uchun target yoqish</p>
                </DialogHeader>
                <DialogBody className="border-y overflow-y-scroll h-[400px]">
                    <p className="text-[14px] font-light text-black border-b">Sozlash:</p>
                    <p className="text-[14px] font-light text-black border-b"><b className="text-[20px]">method: "POST"</b></p>
                    <p className="text-[14px] font-light text-black border-b"><b className="text-[20px]">Content-Type: "application/json"</b></p>

                    {/*  */}
                    <p className="text-[14px] font-light text-black border-b">BODY PARAMS:</p>
                    <p className="text-[14px] font-light text-black border-b"><b className="text-[20px]">1 - "name"</b> - ism</p>
                    <p className="text-[14px] font-light text-black border-b"><b className="text-[20px]">2 - "phone"</b> - telefon raqam</p>
                    <p className="text-[14px] font-light text-black border-b mb-[10px]"><b className="text-[20px]">3 - "flow_id"</b> - oqim ID si</p>
                    {/*  */}
                    <div className="flex items-center justify-between w-full h-[35px] rounded border-black border p-[5px] mb-[10px] bg-gray-100">
                        <p className="text-black">Oqim ID: <b className="text-[20px]">{openTarget?.id}</b></p>
                        <p onClick={() => { navigator.clipboard.writeText(openTarget?.id); toast.success("Oqim ID si nusxalandi!", { autoClose: 1000 }) }}><BiCopy className="text-[20px] cursor-pointer text-black" /></p>
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-between w-full h-[35px] rounded border-black border p-[5px] mb-[10px] bg-gray-100">
                        <p className="text-black">API: <b className="text-[16px]">https://k-ch.na4u.ru/target/v2</b></p>
                        <p onClick={() => { navigator.clipboard.writeText('https://k-ch.na4u.ru/target/v2'); toast.success("API nusxalandi!", { autoClose: 1000 }) }}><BiCopy className="text-[20px] cursor-pointer text-black" /></p>
                    </div>
                </DialogBody>
                <DialogFooter >
                    <Button className="rounded" color="orange" onClick={() => setOpenTarget({ id: '', title: '' })}>Ortga</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default GetFlows;