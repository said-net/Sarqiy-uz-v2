import { IconButton, } from "@material-tailwind/react";
import { FaMoneyBill, FaShoppingCart, FaTelegram, FaUsers, FaBoxes, FaRobot, FaCoins, FaLink, FaGift, FaBackspace } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ImStatsDots } from 'react-icons/im'
import { FaMoneyBill1, FaMoneyBillTransfer } from "react-icons/fa6";
import { BiMailSend, BiMenu, BiStats, BiX } from "react-icons/bi";
import { useEffect, useState } from "react";
import AdminTelegram from "./addtelegram";
function AdminMain() {
    const { balance, hold_balance, coins } = useSelector(e => e.auth);
    const nv = useNavigate();
    const [open, setOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const { pathname: p } = useLocation();
    useEffect(() => {
        setOpenMenu(false);
    }, [p])
    const linkClass = "w-full flex items-center justify-start p-[5px] rounded border duration-300 hover:pl-[20px] mb-[10px]";
    const linkActive = "bg-gradient-to-r from-red-500 to-orange-500 text-white"
    return (
        <>
            {/* CLOSER */}
            <div className={`fixed top-0 left-0 h-[100vh] bg-[#364fc08d] backdrop-blur-sm ${openMenu ? 'w-full' : 'w-0'} duration-500 z-[998]`} onClick={() => setOpenMenu(false)}></div>
            <div className={`flex items-center justify-start flex-col w-[350px] ${openMenu ? "left-0 " : "left-[-350px]"} fixed top-[0] p-[10px] bg-white z-[9999] overflow-y-scroll h-[100vh] duration-500 no-scrollbar`}>
                <div className={`duration-500 fixed top-[5px] ${openMenu ? 'left-[300px]' : 'left-[20px]'}`}>
                    <IconButton onClick={() => setOpenMenu(!openMenu)} className="rounded-full text-[30px]" color="red">
                        {openMenu ? <BiX /> : <BiMenu />}
                    </IconButton>
                </div>
                <div className="flex items-center justify-between w-full h-[100px] bg-white rounded p-[10px] relative mb-[10px] border mt-[40px]">
                    <p className="absolute top-[5px] right-[5px] text-[14px] text-blue-gray-500">Hisobingiz</p>
                    <div className="flex items-center justify-center">
                        <div className="flex items-center justify-center bg-green-50 w-[80px] h-[80px] rounded-full mr-[20px]">
                            <FaMoneyBill className="text-[50px] text-green-700 " />
                        </div>
                        <h1 className="text-[30px]">{Number(balance).toLocaleString()}<sub className="text-blue-gray-500">so'm</sub></h1>
                    </div>
                </div>
                <div className="flex items-center justify-between w-full h-[100px] bg-white rounded p-[10px] relative mb-[10px] border">
                    <p className="absolute top-[5px] right-[5px] text-[14px] text-blue-gray-500">Coinlar</p>
                    <div className="flex items-center justify-center">
                        <div className="flex items-center justify-center bg-orange-50 w-[80px] h-[80px] rounded-full mr-[20px]">
                            <FaCoins className="text-[50px] text-orange-700 " />
                        </div>
                        <h1 className="text-[30px]">{Number(coins).toLocaleString()}<sub className="text-blue-gray-500">ta</sub></h1>
                    </div>
                </div>
                {/*  */}
                <div className="flex items-center justify-normal flex-col w-full border-t p-[10px] rounded">
                    {/*  */}
                    <Link to='/dashboard/market' className={`${linkClass} ${p === '/dashboard/market' && linkActive}`}>
                        <FaShoppingCart className="mr-[10px]" />
                        Market
                    </Link>
                    {/*  */}
                    <Link to='/dashboard/flows' className={`${linkClass} ${p === '/dashboard/flows' && linkActive}`}>
                        <FaLink className="mr-[10px]" />
                        Oqimlar
                    </Link>
                    {/*  */}
                    <Link to='/dashboard/flows-stat' className={`${linkClass} ${p === '/dashboard/flows-stat' && linkActive}`}>
                        <BiStats className="mr-[10px]" />
                        Oqim boyicha statistika
                    </Link>
                    {/*  */}
                    <Link to='/dashboard/product-stats' className={`${linkClass} ${p === '/dashboard/product-stats' && linkActive}`}>
                        <FaBoxes className="mr-[10px]" />
                        Avto oqim statistikasi
                    </Link>
                    {/*  */}
                    <Link to='/dashboard/stats' className={`${linkClass} ${p === '/dashboard/stats' && linkActive}`}>
                        <ImStatsDots className="mr-[10px]" />
                        Umumiy statistika
                    </Link>
                    {/*  */}
                    <Link to='/dashboard/requests' className={`${linkClass} ${p === '/dashboard/requests' && linkActive}`}>
                        <BiMailSend className="mr-[10px]" />
                        So'rovlar
                    </Link>
                    {/*  */}
                    <Link to='/dashboard/request-pay' className={`${linkClass} ${p === '/dashboard/request-pay' && linkActive}`}>
                        <FaMoneyBill1 className="mr-[10px]" />
                        To'lov
                    </Link>
                    {/*  */}
                    <Link onClick={() => window.open('https://t.me/Sharqiybot?start=pay_history')} className={`${linkClass}`}>
                        <FaMoneyBillTransfer className="mr-[10px]" />
                        To'lovlar tarixi
                    </Link>
                    {/*  */}
                    <Link to='/dashboard/refs' className={`${linkClass} ${p === '/dashboard/refs' && linkActive}`}>
                        <FaUsers className="mr-[10px]" />
                        Referal
                    </Link>
                    {/*  */}
                    <Link to='/dashboard/coin-market' className={`${linkClass} ${p === '/dashboard/coin-market' && linkActive}`}>
                        <FaCoins className="mr-[10px]" />
                        Coin market
                    </Link>
                    {/*  */}
                    <Link to='/dashboard/comps' className={`${linkClass} ${p === '/dashboard/comps' && linkActive}`}>
                        <FaGift className="mr-[10px]" />
                        Konkurs
                    </Link>
                    {/*  */}
                    <Link onClick={() => window.open('https://t.me/sharqiybot')} className={`${linkClass}`}>
                        <FaRobot className="mr-[10px]" />
                        Telegram bot
                    </Link>
                    {/*  */}
                    <Link onClick={() => setOpen(true)} className={`${linkClass}`}>
                        <FaTelegram className="mr-[10px]" />
                        Telegramga bog'lash
                    </Link>
                    {/*  */}
                    <Link to='/' className={`${linkClass} ${p === '/' && linkActive}`}>
                        <FaBackspace className="mr-[10px]" />
                        Ortga
                    </Link>
                    {/* 
                    {/* <MenuItem className="border flex items-center justify-start h-[50px] mb-[10px]" onClick={() => nv('/dashboard/comps')}>
                    <FaGift className="mr-[10px] text-[20px] text-blue-gray-500" />
                    Konkurs
                </MenuItem> */}
                </div>
                <AdminTelegram open={open} setOpen={setOpen} />
            </div>
        </>
    );
}

export default AdminMain;