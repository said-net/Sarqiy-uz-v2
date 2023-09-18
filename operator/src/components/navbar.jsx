import { FaUser } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { BiCreditCard, BiHistory, BiLogOut, BiMenu, BiPhoneCall, BiShoppingBag, BiSolidDashboard, BiX } from 'react-icons/bi'
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_LINK } from "../config";
import { IconButton } from "@material-tailwind/react";
import { setInfoAuth, setRefreshAuth } from "../managers/auth.manager";
function Navbar() {
    const { auth: { name, phone, balance }, refresh: { refresh } } = useSelector(e => e);
    const path = useLocation().pathname;
    const [stats, setStats] = useState({ new_orders: 0, re_contacts: 0 });
    const [open, setOpen] = useState(false);
    const dp = useDispatch();
    function LogOut() {
        localStorage.removeItem('access');
        setTimeout(() => {
            // dp(setRefreshAuth());
            dp(setInfoAuth({
                name: '', phone: '', id: '', balance: '', telegram: ''
            }))
        }, 1000);
    }
    useEffect(() => {
        axios(`${API_LINK}/operator/get-stats`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { data, ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                setStats(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urinib ko'ring!")
        });
    }, [refresh]);
    useEffect(() => {
        setOpen(false);
    }, [path]);
    return (
        <>
            <div className={`flex items-center justify-start flex-col w-[300px] rounded shadow-sm bg-white h-[100vh] duration-500 xl:relative fixed xl:top-auto top-0 xl:left-auto ${open ? 'left-0' : 'left-[-300px]'} z-[999] p-[10px]`}>
                <div className={`duration-500 fixed flex xl:hidden top-[10px] ${open ? 'left-[310px]' : 'left-[10px]'} z-[998] bg-red-500 rounded-full`}>
                    <IconButton onClick={() => setOpen(!open)} className="rounded-full text-[30px]" color="red">
                        {!open && <BiMenu />}
                        {open && <BiX />}
                    </IconButton>
                </div>
                <div className="flex items-center justify-center flex-col w-full h-[220px] bg-blue-gray-50 rounded mb-[10px]">
                    <FaUser className="text-[100px] text-white p-[10px] w-[120px] h-[120px] flex items-center justify-center bg-blue-gray-200 rounded-full" />
                    <p className="text-[16px]">{name}</p>
                    <p className="text-[16px] ">{phone}</p>
                    <p className="text-[16px] p-[5px] bg-white rounded shadow-sm">Hisob: {Number(balance)?.toLocaleString()} so'm</p>
                </div>
                {/*  */}
                <Link to='/' className={`flex items-center justify-start w-full text-[20px] rounded p-[5px] ${path === '/' ? 'bg-gradient-to-r from-red-400 to-orange-500 text-white' : 'text-blue-gray-400'} relative mb-[10px]`}>
                    <BiSolidDashboard className="mr-[10px]" />
                    Dashboard
                </Link>
                {/*  */}
                <Link to='/my-orders' className={`flex items-center justify-start w-full text-[20px] rounded p-[5px] ${path === '/my-orders' ? 'bg-gradient-to-r from-red-400 to-orange-500 text-white' : 'text-blue-gray-400'} relative mb-[10px]`}>
                    <BiShoppingBag className="mr-[10px]" />
                    Buyurtmalar
                    <div className="flex items-center justify-center w-[10px] h-[20px] absolute right-[20px] border-l-[2px] pl-[10px] text-[14px]">
                        {stats?.new_orders}
                    </div>
                </Link>
                {/*  */}
                <Link to='/re-connects' className={`flex items-center justify-start w-full text-[20px] rounded p-[5px] ${path === '/re-connects' ? 'bg-gradient-to-r from-red-400 to-orange-500 text-white' : 'text-blue-gray-400'} relative mb-[10px]`}>
                    <BiPhoneCall className="mr-[10px]" />
                    Qayta aloqa
                    <div className="flex items-center justify-center w-[10px] h-[20px] absolute right-[20px] border-l-[2px] pl-[10px] text-[14px]">
                        {stats?.re_contacts}
                    </div>
                </Link>
                {/*  */}
                <Link to='/withdraw' className={`flex items-center justify-start w-full text-[20px] rounded p-[5px] ${path === '/withdraw' ? 'bg-gradient-to-r from-red-400 to-orange-500 text-white' : 'text-blue-gray-400'} relative mb-[10px]`}>
                    <BiCreditCard className="mr-[10px]" />
                    Pul chiqarish
                </Link>
                {/*  */}
                <Link to='/withdraw-history' className={`flex items-center justify-start w-full text-[20px] rounded p-[5px] ${path === '/withdraw-history' ? 'bg-gradient-to-r from-red-400 to-orange-500 text-white' : 'text-blue-gray-400'} relative mb-[10px]`}>
                    <BiHistory className="mr-[10px]" />
                    Balans tarixi
                </Link>
                {/*  */}
                <div className="h-[1px] w-full bg-blue-gray-100 m-[5px_0]"></div>
                <p onClick={LogOut} className="w-full text-red-500 text-[20px] cursor-pointer flex items-center justify-start">
                    <BiLogOut className="mr-[10px]" />
                    Chiqish
                </p>

            </div>
            <div onClick={() => setOpen(false)} className={`fixed top-0 duration-500 left-0 ${open ? 'w-full' : 'w-0'} h-[100vh] bg-[#73737387] z-[997]`}></div>
        </>
    );
}

export default Navbar;