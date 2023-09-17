import { Link, useLocation } from "react-router-dom";
import { BiSolidDashboard, BiSolidBox, BiPlusCircle, BiListUl, BiListPlus, BiPhone, BiPhoneCall, BiUser, BiMoney, BiMoneyWithdraw, BiCar, BiSolidTruck, BiXCircle, BiArchive, BiCheckCircle, BiRefresh, BiPrinter, BiMenu, BiShoppingBag, BiPhoneIncoming } from 'react-icons/bi';
import { AiOutlineCaretLeft } from 'react-icons/ai'
import { useEffect, useState } from "react";
import axios from "axios";
import { API_LINK } from "../config";
import { Chip, IconButton } from "@material-tailwind/react";
import { useSelector } from "react-redux";
function Navbar() {
    const { pathname: path } = useLocation();
    const [stats, setStats] = useState({ products: 0, categories: 0, operators: 0, wait_delivery: 0, sended: 0, reject: 0, delivered: 0, archive: 0, wait: 0, neworders: 0, inoperator: 0 });
    const { refresh } = useSelector(e => e.refresh);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        axios(`${API_LINK}/boss/get-stats`, {
            headers: {
                'x-auth-token': 'Bearer ' + localStorage.getItem('access')
            }
        }).then((res) => {
            const { ok, data } = res.data;
            if (ok) {
                setStats(data);
            }
        })
    }, [refresh]);
    const classLink = "flex items-center w-full text-[15px] hover:pl-[20px] duration-500 text-blue-gray-700 relative mb-[20px]";

    return (
        <>
            <div className={`md:hidden duration-500 z-[9999] top-[15px] fixed ${open ? 'left-[235px]' : 'left-[10px]'}`}>
                <IconButton color="red" onClick={() => setOpen(!open)} className="text-[30px] rounded-full">
                    {open && <BiXCircle />}
                    {!open && <BiMenu />}
                </IconButton>
            </div>
            <div onClick={() => setOpen(false)} className={`fixed top-0 ${open ? 'w-full' : 'w-0'} ring-0 duration-500 bg-[#00000044] right-0 backdrop-blur-sm z-[997] h-[100vh]`}></div>
            <div className={`flex items-center justify-start flex-col w-[300px] h-[100vh] bg-white duration-500 shadow-md p-[10px] overflow-y-scroll fixed top-0 ${open ? 'left-0' : 'left-[-300px]'} md:relative md:top-auto md:left-auto z-[998]`}>
                <div className="flex items-center justify-between w-full rounded p-[10px] mb-[10px] border-b bg-blue-gray-50 relative">
                    <h1 className="text-black text-[20px]">ADMIN</h1>
                </div>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/' className={classLink}>
                    <BiSolidDashboard className="mr-[10px]" />
                    Dashboard
                    {/* <Chip value={stats?.products}/> */}
                    {path === '/' && <AiOutlineCaretLeft className="absolute right-[10px]" />}
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/products' className={classLink}>
                    <BiSolidBox className="mr-[10px]" />
                    Mahsulotlar
                    <Chip color="red" value={stats?.products} className="p-[3px] rounded ml-[10px]" />
                    {path === '/products' && <AiOutlineCaretLeft className="absolute right-[10px]" />}
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/add-product' className={classLink}>
                    <BiPlusCircle className="mr-[10px]" />
                    Mahsulot qo'shish
                    {path === '/add-product' && <AiOutlineCaretLeft className="absolute right-[10px]" />}
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/categories' className={classLink}>
                    <BiListUl className="mr-[10px]" />
                    Kategoriyalar
                    <Chip color="red" value={stats?.categories} className="p-[3px] rounded ml-[10px]" />
                    {path === '/categories' && <AiOutlineCaretLeft className="absolute right-[10px]" />}
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/add-category' className={classLink}>
                    <BiListPlus className="mr-[10px]" />
                    Kategoriya qo'shish
                    {path === '/add-category' && <AiOutlineCaretLeft className="absolute right-[10px]" />}
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/operators' className={classLink}>
                    <BiPhone className="mr-[10px]" />
                    Operatorlar
                    <Chip color="red" value={stats?.operators} className="p-[3px] rounded ml-[10px]" />
                    {path === '/operators' && <AiOutlineCaretLeft className="absolute right-[10px]" />}
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/add-operator' className={classLink}>
                    <BiPhoneCall className="mr-[10px]" />
                    Operator qo'shish
                    {path === '/add-operator' && <AiOutlineCaretLeft className="absolute right-[10px]" />}
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/pay-operators' className={classLink}>
                    <BiMoneyWithdraw className="mr-[10px]" />
                    Operatorlar to'lovi
                    {path === '/pay-operators' && <AiOutlineCaretLeft className="absolute right-[10px]" />}
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/users' className={classLink}>
                    <BiUser className="mr-[10px]" />
                    Admin & Foydalanuvchilar
                    {path === '/users' && <AiOutlineCaretLeft className="absolute right-[10px]" />}
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/admin-pays' className={classLink}>
                    <BiMoney className="mr-[10px]" />
                    Adminlar to'lovi
                    {path === '/admin-pays' && <AiOutlineCaretLeft className="absolute right-[10px]" />}
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/new-orders' className={classLink}>
                    <BiShoppingBag className="mr-[10px]" />
                    Yangi buyurtmalar
                    <Chip color="red" value={stats?.neworders} className="p-[3px] rounded ml-[10px]" />
                    {path === '/new-orders' && <AiOutlineCaretLeft className="absolute right-[10px]" />}
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/owned-orders' className={classLink}>
                    <BiPhoneIncoming className="mr-[10px]" />
                    Operatorda
                    <Chip color="red" value={stats?.inoperator} className="p-[3px] rounded ml-[10px]" />
                    {path === '/owned-orders' && <AiOutlineCaretLeft className="absolute right-[10px]" />}
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/print-cheques' className={classLink}>
                    <BiPrinter className="mr-[10px]" />
                    Pechat kuryerga
                    <Chip color="red" value={stats?.wait_delivery} className="p-[3px] rounded ml-[10px]" />
                    {path === '/print-cheques' && <AiOutlineCaretLeft className="absolute right-[10px]" />}
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/wait-delivery' className={classLink}>
                    <BiCar className="mr-[10px]" />
                    Dostavkaga tayyor
                    <Chip color="red" value={stats?.wait_delivery} className="p-[3px] rounded ml-[10px]" />
                    {path === '/wait-delivery' && <AiOutlineCaretLeft className="absolute right-[10px]" />}
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/sended' className={classLink}>
                    <BiSolidTruck className="mr-[10px]" />
                    Yuborilganlar
                    <Chip color="red" value={stats?.sended} className="p-[3px] rounded ml-[10px]" />
                    {path === '/sended' && <AiOutlineCaretLeft className="absolute right-[10px]" />}
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/reject' className={classLink}>
                    <BiXCircle className="mr-[10px]" />
                    Dostavkadan qaytgan
                    <Chip color="red" value={stats?.reject} className="p-[3px] rounded ml-[10px]" />
                    {path === '/reject' && <AiOutlineCaretLeft className="absolute right-[10px]" />}
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/archive' className={classLink}>
                    <BiArchive className="mr-[10px]" />
                    Arxivlangan
                    <Chip color="red" value={stats?.archive} className="p-[3px] rounded ml-[10px]" />
                    {path === '/archive' && <AiOutlineCaretLeft className="absolute right-[10px]" />}
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/delivered' className={classLink}>
                    <BiCheckCircle className="mr-[10px]" />
                    Yetkazilgan
                    <Chip color="red" value={stats?.delivered} className="p-[3px] rounded ml-[10px]" />
                    {path === '/delivered' && <AiOutlineCaretLeft className="absolute right-[10px]" />}
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/wait-orders' className={classLink}>
                    <BiRefresh className="mr-[10px]" />
                    Qayta aloqa
                    <Chip color="red" value={stats?.wait} className="p-[3px] rounded ml-[10px]" />
                    {path === '/wait-orders' && <AiOutlineCaretLeft className="absolute right-[10px]" />}
                </Link>
            </div>
        </>
    );
}

export default Navbar;