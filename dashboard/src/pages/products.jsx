import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Button, Chip, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Menu, MenuHandler, MenuItem, MenuList, Spinner } from "@material-tailwind/react";
import { BiDotsVertical, BiMoney, BiPencil, BiSearch, BiTrash } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { setRefresh } from "../managers/refresh.manager";
import { useNavigate } from "react-router-dom";

function Products() {
    const [products, setProducts] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e.refresh);
    const [search, setSearch] = useState('');
    const dp = useDispatch();
    const nv = useNavigate();
    const [openPrice, setOpenPrice] = useState({ id: '', price: '', new_price:'' });
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/boss/get-all-products`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            setIsLoad(true);
            const { ok, data } = res.data;
            if (ok) {
                setProducts(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, [refresh]);
    function Delete(id, title) {
        if (window.confirm(`${title} - Mahsuloti rostanham o'chirilsinmi?`) === true) {
            axios.delete(API_LINK + "/product/delete/" + id, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then(res => {
                const { ok, msg } = res.data;
                if (!ok) {
                    toast.error(msg);
                } else {
                    toast.success(msg);
                    dp(setRefresh())
                }
            }).catch(() => {
                toast.error("Aloqani tekshirib qayta urunib ko'ring!")
            })
        }
    }
    function EditPrice() {
        axios.post(`${API_LINK}/product/set-new-prices/${openPrice?.id}`, { price: openPrice?.price, new_price: openPrice?.new_price }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                dp(setRefresh());
                setOpenPrice({ id: '', price: '', new_price: '' });
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urinib ko'ring!")
        })
    }
    return (
        <div className="flex items-start justify-start flex-col w-full overflow-x-scroll mt-[60px]">
            {!isLoad &&
                <div className="flex items-center justify-center w-full h-[80vh]">
                    <Spinner />
                </div>
            }
            {isLoad && !products[0] &&
                <div className="flex items-center justify-center w-full h-[80vh]">
                    <h1>Mahsulotlar mavjud emas!</h1>
                </div>
            }
            <div className="flex items-center justify-normal flex-col p-[5px] ">
                <div className="flex items-center justify-start w-full h-[70px] shadow-sm bg-white  border-b p-[0_10px] ">
                    <p className="mr-[20px]">MAXSULOTLAR: {products?.length} ta</p>
                    <div className="flex items-center justify-center w-[250px]">
                        <Input label="Qidiruv: ID, Nomi" color="red" icon={<BiSearch />} value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="flex items-center justify-between w-full h-[70px] shadow-sm bg-white  border-b p-[0_5px]">
                    <div className="flex items-center justify-between">
                        <p className="w-[50px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">ID</p>
                        <p className="w-[140px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">RASMI</p>
                        <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">NOMI</p>
                        <p className="w-[150px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">NARXI</p>
                        <p className="w-[50px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">COIN</p>
                        <p className="w-[140px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">ADMIN PULI</p>
                        <p className="w-[150px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">KATEGORIYA</p>
                        <p className="w-[80px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">KO'RISHLAR</p>
                        <p className="w-[80px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">SOTUVLAR</p>
                        <p className="w-[80px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">STATUS</p>
                        <p className="w-[60px] text-center border-l h-[70px] flex items-center justify-center text-[13px]">MENU</p>
                    </div>
                </div>
                {products?.filter(p => !search ? p : p?.title?.toLowerCase()?.includes(search?.toLowerCase()) || p?.id === +search)?.map((p, i) => {
                    return (
                        <div key={i} className="flex items-center justify-between w-full h-[70px] shadow-sm bg-white  border-b p-[0_5px]">
                            <div className="flex items-center justify-between">
                                <div className="w-[50px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">
                                    <Chip value={p?.id} color="red" className="w-[40px] rounded" />
                                </div>
                                <div className="w-[140px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                    <img src={p?.image} alt={i} className="w-[50px]" />
                                </div>
                                <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">{p?.title}</p>
                                <p className="w-[150px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">{Number(p?.price)?.toLocaleString()}</p>
                                <p className="w-[50px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">{p?.coin}</p>
                                <p className="w-[140px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">{Number(p?.for_admins)?.toLocaleString()}</p>
                                <p className="w-[150px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">{p?.category}</p>
                                <p className="w-[80px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">{p?.views}</p>
                                <p className="w-[80px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">{p?.shops}</p>
                                <p className="w-[80px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">Aktiv</p>
                                <div className="w-[60px] text-center border-l h-[70px] flex items-center justify-center text-[13px]">
                                    <Menu>
                                        <MenuHandler>
                                            <IconButton className="rounded-full" color="blue-gray">
                                                <BiDotsVertical className="text-[20px]" />
                                            </IconButton>
                                        </MenuHandler>
                                        <MenuList>
                                            <MenuItem onClick={() => nv('/edit-product/' + p?._id)} className="flex items-center justify-start">
                                                <BiPencil className="mr-[10px]" />
                                                Taxrirlash
                                            </MenuItem>
                                            <MenuItem onClick={() => setOpenPrice({id: p?._id, price: p?.price})} className="flex items-center justify-start">
                                                <BiMoney className="mr-[10px]" />
                                                Yangi narx
                                            </MenuItem>
                                            <MenuItem onClick={() => window.open('https://sharqiy.uz/product/' + p?.id)} className="flex items-center justify-start">
                                                <FaEye className="mr-[10px]" />
                                                Ko'rish
                                            </MenuItem>
                                            <MenuItem onClick={() => Delete(p?._id, p?.title)} className="flex items-center justify-start text-red-500">
                                                <BiTrash className="mr-[10px]" />
                                                O'chirish
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </div>
                            </div>

                        </div>
                    )
                })}
            </div>

            <Dialog open={openPrice?.id !== ''} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
                <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                    <DialogHeader className="w-full">
                        <h1 className="text-[20px]">Narxni o'zgartirish</h1>
                    </DialogHeader>
                    <DialogBody className="w-full border-y">
                        <Input value={openPrice?.price} label="Eski narxi" onChange={e => setOpenPrice({ ...openPrice, price: e.target.value })} type="number" required />
                        <div className="my-[10px]"></div>
                        <Input value={openPrice?.new_price} label="Yangi narxi" onChange={e => setOpenPrice({ ...openPrice, new_price: e.target.value })} type="number" required />
                    </DialogBody>
                    <DialogFooter className="w-full">
                        <Button onClick={() => setOpenPrice({ id: '', price: '', new_price: '' })} className="rounded ml-[10px]" color="orange">Bekor qilish</Button>
                        <Button disabled={openPrice?.new_price < 10 || !openPrice?.price} className="rounded ml-[10px]" color="green" onClick={EditPrice}>Saqlash</Button>
                    </DialogFooter>
                </div>
            </Dialog>
        </div>
    );
}

export default Products;