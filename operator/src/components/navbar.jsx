import { Button, Chip, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { FaClock, FaCreditCard, FaList, FaListCheck, FaMoneyBillTransfer } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { setRefreshOrders } from "../managers/order.manager";
import { BiSearch } from "react-icons/bi";
import { FaUsers } from 'react-icons/fa'
function Navbar() {
    const { name, balance } = useSelector(e => e.auth);
    const nv = useNavigate();
    const { pathname } = useLocation();
    const [openPay, setOpenPay] = useState(false);
    const dp = useDispatch();
    const card = localStorage.getItem('card');
    const [payment, setPayment] = useState({ card: card ? card : '', amount: '' });
    function Submit() {
        axios.post(`${API_LINK}/operator/create-pay`, payment, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                localStorage.setItem('card', payment.card);
                toast.success(msg);
                setOpenPay(false);
                dp(setRefreshOrders());
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!");
        });
    }
    return (
        <>
            <div className="w-full h-[80px]">
                <div className="flex items-center justify-between w-full fixed top-0 left-0 bg-white shadow-sm h-[80px] p-[0_2%] z-[999]">
                    <div className="flex items-start justify-start flex-col">
                        <h1 className="uppercase text-[23px]">{name}</h1>
                        <Chip className="rounded tracking-widest" value={`Hisob: ${Number(balance).toLocaleString()} so'm`} />
                    </div>
                    <div className="flex items-center justify-between sm:w-[380px]">
                        <div className="sm:flex items-center justify-center flex-col hidden">
                            <IconButton onClick={() => nv('/new-orders')} color="green" className="rounded-full text-[20px]">
                                <FaList />
                            </IconButton>
                            <p className="text-[12px]">Yangilar</p>
                        </div>
                        <div className="sm:flex items-center justify-center flex-col hidden">
                            <IconButton onClick={() => nv('/my-orders')} color="blue-gray" className="rounded-full text-[20px]">
                                <FaListCheck />
                            </IconButton>
                            <p className="text-[12px]">Egallangan</p>
                        </div>
                        <div className="sm:flex items-center justify-center flex-col hidden">
                            <IconButton onClick={() => nv('/wait-orders')} color="light-blue" className="rounded-full text-[20px]">
                                <FaClock />
                            </IconButton>
                            <p className="text-[12px]">Eslatma</p>
                        </div>
                        <div className="sm:flex items-center justify-center flex-col hidden">
                            <IconButton onClick={() => nv('/search')} color="blue-gray" className="rounded-full text-[20px]">
                                <BiSearch />
                            </IconButton>
                            <p className="text-[12px]">Qidiruv</p>
                        </div>
                        <div className="sm:flex items-center justify-center flex-col hidden">
                            <IconButton onClick={() => nv('/targetologs')} color="orange" className="rounded-full text-[20px]">
                                <FaUsers />
                            </IconButton>
                            <p className="text-[12px]">Target</p>
                        </div>
                        <div className="flex items-center justify-center flex-col mr-[20px] sm:mr-0">
                            <IconButton onClick={() => nv('/history-pay')} color="indigo" className="rounded-full text-[20px]">
                                <FaMoneyBillTransfer />
                            </IconButton>
                            <p className="text-[12px]">Tarix</p>
                        </div>
                        <div className="flex items-center justify-center flex-col">
                            <IconButton onClick={() => setOpenPay(true)} color="indigo" className="rounded-full text-[20px]">
                                <FaCreditCard />
                            </IconButton>
                            <p className="text-[12px]">To'lov</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex sm:hidden items-center justify-around w-full fixed bottom-0 left-0 bg-white shadow-[0_-1px_3px] shadow-[#00000012] h-[50px] p-[0_2%] z-[999]">
                <div className={`flex items-center justify-center flex-col ${pathname === '/new-orders' ? 'text-black' : 'text-gray-500'}`} onClick={() => nv('/new-orders')}>
                    <FaList className="text-[25px]" />
                    <p className="text-[12px]">Yangilar</p>
                </div>
                <div className={`flex items-center justify-center flex-col ${pathname === '/my-orders' ? 'text-black' : 'text-gray-500'}`} onClick={() => nv('/my-orders')}>
                    <FaListCheck className="text-[25px]" />
                    <p className="text-[12px]">Egallangan</p>
                </div>
                <div className={`flex items-center justify-center flex-col ${pathname === '/wait-orders' ? 'text-black' : 'text-gray-500'}`} onClick={() => nv('/wait-orders')}>
                    <FaClock className="text-[25px]" />
                    <p className="text-[12px]">Eslatma</p>
                </div>
                <div className={`flex items-center justify-center flex-col ${pathname === '/search' ? 'text-black' : 'text-gray-500'}`} onClick={() => nv('/search')}>
                    <BiSearch className="text-[25px]" />
                    <p className="text-[12px]">Qidiruv</p>
                </div>
                <div className={`flex items-center justify-center flex-col ${pathname === '/targetologs' ? 'text-black' : 'text-gray-500'}`} onClick={() => nv('/targetologs')}>
                    <FaUsers className="text-[25px]" />
                    <p className="text-[12px]">Target</p>
                </div>
            </div>
            <Dialog open={openPay} size="xxl" className="flex items-center justify-center bg-[#0000005b] backdrop-blur-sm">
                <div className="flex items-center justify-center sm:w-[500px] w-[97%] bg-white shadow-sm  rounded flex-col p-[5px]">
                    <DialogHeader className="w-full">
                        <p className="text-[20px]">Pul chiqarish</p>
                    </DialogHeader>
                    <DialogBody className="border-y w-full">
                        <div className="flex items-center justify-center mb-[10px]">
                            <Input label="Karta raqamingiz" variant="standard" required onChange={e => setPayment({ ...payment, card: e.target.value })} />
                        </div>
                        <div className="flex items-center justify-center mb-[10px]">
                            <Input label={`Summa: min. 1 000 max. ${Number(balance).toLocaleString()}`} variant="standard" required onChange={e => setPayment({ ...payment, amount: e.target.value })} />
                        </div>
                    </DialogBody>
                    <DialogFooter className="w-full">
                        <Button className="rounded mr-[10px]" color="red" onClick={() => setOpenPay(false)}>Bekor qilish</Button>
                        <Button disabled={payment?.card?.length < 16 || Number(payment?.amount) < 1000 || Number(payment?.amount) > balance} className="rounded" color="green" onClick={() => Submit()}>Yuborish</Button>
                    </DialogFooter>
                </div>
            </Dialog>
        </>
    );
}

export default Navbar;