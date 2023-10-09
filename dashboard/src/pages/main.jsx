import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Option, Select, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { API_LINK } from "../config";
import { BiImageAdd, BiPlus, BiTrash } from "react-icons/bi";
import { setRefresh } from "../managers/refresh.manager";
function MainMenu() {
    const [state, setState] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e.refresh);
    const [openAdd, setOpenAdd] = useState({ open: false, product: '', image: '' });
    const [products, setProducts] = useState([]);
    const [openDel, setOpenDel] = useState({ product: '', id: '' });
    const dp = useDispatch()
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/main/get-all`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg, data, products } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setState(data);
                setProducts(products)
            }
        }).catch(() => {
            setIsLoad(false);
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        });
    }, [refresh]);
    // 
    function Submit() {
        if (!openAdd?.product || !openAdd?.image) {
            toast.error("Qatorlarni to'ldiring!")
        } else {
            const form = new FormData();
            form.append('product', openAdd.product);
            form.append('image', openAdd.image);
            axios.post(`${API_LINK}/main/create-post`, form, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then(res => {
                const { ok, msg } = res.data
                if (ok) {
                    dp(setRefresh());
                    setOpenAdd({ open: false, product: '', image: '' })
                    toast.success(msg)
                } else {
                    toast.error(msg)
                }
            }).catch(() => {
                toast.error("Aloqani tekshirib qayta urunib ko'ring!")
            })
        }
    }
    // 
    function Delete() {
        axios.delete(`${API_LINK}/main/delete-post/${openDel?.id}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data
            if (ok) {
                dp(setRefresh());
                toast.success(msg);
                setOpenDel({ product: '', id: '' })
            } else {
                toast.error(msg)
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }
    return (
        <div className="flex items-center justify-start flex-col w-full">
            <div className="flex items-center justify-center w-full h-[50px] mb-[10px]">
                <h1 className=" bg-white shadow-sm rounded-b-[10px] flex items-center justify-center p-[10px] h-[50px]">REKLAMALAR</h1>
            </div>
            <div className="flex items-center justify-start flex-col w-full">
                <div className="flex items-center justify-start h-[70px] border bg-white">
                    <p className="w-[70px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">ID</p>
                    <p className="w-[160px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">RASMI</p>
                    <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">MAHSULOT</p>
                    <p className="w-[70px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">MENU</p>
                    <p className="w-[70px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">
                        <IconButton onClick={() => setOpenAdd({ ...openAdd, open: true })} className="text-[30px] rounded-full" color="blue-gray">
                            <BiPlus />
                        </IconButton>
                    </p>
                </div>
            </div>
            {!isLoad && <Spinner />}
            {isLoad && !state[0] && <p>Reklama postlari mavjud emas!</p>}
            {isLoad && state[0] &&
                state?.map((m, i) => {
                    return (
                        <div key={i} className="flex items-center justify-start h-[90px] border bg-white">
                            <p className="w-[70px] text-center border-x h-[90px] flex items-center justify-center text-[12px]">
                                {i + 1}
                            </p>
                            <div className="w-[160px] text-center border-x h-[90px] flex items-center justify-center text-[12px] rounded-[10px] overflow-hidden">
                                <img src={m?.image} alt="i" />
                            </div>
                            <p className="w-[200px] text-center border-x h-[90px] flex items-center justify-center text-[12px]">
                                {m?.product}
                            </p>
                            <p className="w-[70px] text-center border-x h-[90px] flex items-center justify-center text-[20px] cursor-pointer text-red-500" onClick={() => setOpenDel({ id: m?.id, product: m?.product })}>
                                <BiTrash />
                            </p>
                            <div className="w-[70px] text-center border-x h-[90px] flex items-center justify-center text-[12px]"></div>
                        </div>
                    )
                })
            }
            {/* ADD */}
            <Dialog open={openAdd?.open} size="md">
                <DialogHeader>
                    <p className="text-[16px]">Reklama qo'shish</p>
                </DialogHeader>
                <DialogBody className="border-y">
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Select label="Mahsulot" variant="standard" onChange={e => setOpenAdd({ ...openAdd, product: e })}>
                            {products?.map((p, i) => {
                                return (
                                    <Option key={i} value={p?.id}>{p?.title}</Option>
                                );
                            })}
                        </Select>
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full">
                        <Input label="Reklama rasmi (16x9)" type="file" accept="image/*" variant="standard" onChange={e => setOpenAdd({ ...openAdd, image: e?.target?.files[0] })} icon={<BiImageAdd />} />
                    </div>
                </DialogBody>
                <DialogFooter className="flex items-center justify-between">
                    {/*  */}
                    <Button color="orange" className="rounded" onClick={() => setOpenAdd({ open: false, product: '', image: '' })}>Ortga</Button>
                    {/*  */}
                    <Button color="green" className="rounded" onClick={() => Submit()}>Saqlash</Button>
                </DialogFooter>
            </Dialog>
            {/* DELETE */}
            <Dialog open={openDel?.id !== ''} size="md">
                <DialogHeader>
                    <p className="text-[16px]">{openDel?.product} uchun reklamani o'chirasizmi?</p>
                </DialogHeader>
                <DialogBody className="border-y">
                    <p>Diqqat o'chirilgan reklama qayta tiklanmaydi!</p>
                </DialogBody>
                <DialogFooter className="flex items-center justify-between">
                    {/*  */}
                    <Button color="orange" className="rounded" onClick={() => setOpenDel({ product: '', id: '' })}>Ortga</Button>
                    {/*  */}
                    <Button color="red" className="rounded" onClick={() => Delete()}>O'chirish</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default MainMenu;