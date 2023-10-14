import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { FaCopy, FaKey, FaMoneyBill, FaNewspaper } from "react-icons/fa";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input } from "@material-tailwind/react";
import { FaT, FaX } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function AdminMarket() {
    const [state, setState] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [category, setCategory] = useState('all')
    const { uId } = useSelector(e => e.auth);
    const [openFlow, setOpenFlow] = useState({ id: '', title: '' });
    const [targetApi, setTargetApi] = useState('');
    const [createFlow, setCreateFlow] = useState({ id: '', title: '', product: '', price: '', sale: '', for_admin: '' });
    const [wait, setWait] = useState(false);
    const nv = useNavigate();
    function SubmitCreateFlow() {
        setWait(true)
        const { title, id, sale } = createFlow;
        axios.post(`${API_LINK}/flow/create`, { title, product: id, sale }, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg } = res.data;
            setWait(false);
            if (ok) {
                toast.success(msg);
                nv('/dashboard/flows');
            } else {
                toast.error(msg);
            }

        }).catch((err) => {
            console.log(err);
            setWait(false);
            toast.error("Aloqani tekshirib qayta urunib ko'ring!");
        })
    }
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
        });
    }

    return (
        <div className="flex items-center justify-start flex-col w-full p-[30px_10px] mt-[20px]">
            <div className="flex items-center justify-start w-full min-h-[50px] bg-white rounded border px-[10px] flex-wrap p-[5px]">
                <div onClick={() => setCategory('all')} className={`flex items-center justify-start flex-col p-[5px_10px] border rounded-[10px] mr-[10px] mb-[5px] cursor-pointer ${category === 'all' ? 'bg-gray-300' : 'bg-gray-50'}`}>
                    <p className="text-[16px]">Barchasi</p>
                </div>
                {isLoad && categories[0] &&
                    categories?.map((c, i) => {
                        return (
                            <div onClick={() => setCategory(c?.id)} key={i} className={`flex items-center justify-start p-[5px_10px] border rounded-[10px] mr-[10px] mb-[5px] cursor-pointer ${category === c?.id ? 'bg-gray-300' : 'bg-gray-50'}`}>
                                <div className="flex items-center justify-center w-[30px] h-[30px] rounded-full border overflow-hidden mr-[10px] bg-white">
                                    <img src={c?.image} alt="ci" className="w-[130%]" />
                                </div>
                                <p className="text-[16px] w-full ">{c?.title}</p>
                            </div>
                        )
                    })
                }
            </div>
            {/*  */}
            {isLoad && state[0] &&
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[10px] my-[10px]">
                    {state?.map((p, i) => {
                        return (
                            <div key={i} className="flex items-center justify-start flex-col w-[172px] h-[440px] p-[3px] bg-white shadow-md rounded-[10px] relative border">
                                {p?.bonus && <span className="absolute top-[5px] left-[5px] bg-red-500 px-[5px] rounded text-[12px] text-white">{p?.bonus_about}</span>}
                                <div className="flex items-center justify-center w-full overflow-hidden h-[190px] rounded-[10px]">
                                    <img src={p?.image} alt="r" className="roudned-[10px]" />
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
                                    <p className="text-[12px]">Coin: <span className="text-[15px]">{Number(p?.coin).toLocaleString()} ta</span></p>
                                    {/*  */}
                                    <Button onClick={() => setOpenFlow({ id: p?.pid, title: p?.title })} color="green" className="mb-[10px] rounded flex items-center justify-center" fullWidth>
                                        <FaKey />
                                        Avto oqim
                                    </Button>
                                    {/*  */}
                                    <Button onClick={() => getAds(p?.id)} color="red" className="mb-[10px] rounded flex items-center justify-center" fullWidth>
                                        <FaNewspaper />
                                        Reklama posti
                                    </Button>
                                    {/*  */}
                                    <Button onClick={() => setCreateFlow({ id: p?.id, title: '', for_admin: p?.for_admins, price: p?.price, product: p?.title, sale: '' })} color="blue" className="mb-[10px] rounded flex items-center justify-center" fullWidth>
                                        <FaNewspaper />
                                        Oqim ochish
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
            {/*  */}
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
            {/*  */}
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
            </Dialog>
            {/*  */}
            <Dialog open={createFlow?.id !== ''} size="md">
                <DialogHeader>
                    <p className="text-[16px]">{createFlow?.product} - uchun oqim ochish</p>
                </DialogHeader>
                <DialogBody className="border-y">
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={wait} label="Oqim nomi" onChange={e => setCreateFlow({ ...createFlow, title: e.target.value })} value={createFlow?.title} icon={<FaT />} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={wait} type="number" label="Chegirma(So'm)" onChange={e => setCreateFlow({ ...createFlow, sale: e.target.value })} value={createFlow?.sale} icon={<FaMoneyBill />} />
                    </div>
                    {/*  */}
                    <p className="text-[12px]">Chegirma admin uchun ajratilgan pul miqdoridan olinadi!</p>
                    <p className="text-green-500"><s className="text-red-500">{Number(createFlow?.price)?.toLocaleString()} so'm</s> - {Number(createFlow?.price - createFlow?.sale)?.toLocaleString()} so'm</p>
                    {/*  */}
                    <p>Chegirma: -{Number(createFlow?.sale)?.toLocaleString()} so'm</p>
                    {/*  */}
                    <p>Admin puli: {Number(createFlow?.for_admin - createFlow?.sale)?.toLocaleString()} so'm</p>
                    {/*  */}
                </DialogBody>
                <DialogFooter className="flex items-center justify-between">
                    {/*  */}
                    <Button disabled={wait} color="orange" className="rounded" onClick={() => setCreateFlow({ id: '', title: '', product: '', price: '', sale: '', for_admin: '' })}>Ortga</Button>
                    {/*  */}
                    <Button disabled={wait} color="green" className="rounded" onClick={SubmitCreateFlow}>Saqlash</Button>
                    {/*  */}
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default AdminMarket;