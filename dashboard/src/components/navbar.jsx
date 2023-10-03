import { Link, useLocation } from "react-router-dom";
import { BiSolidDashboard, BiSolidBox, BiPlusCircle, BiListUl, BiListPlus, BiPhone, BiPhoneCall, BiUser, BiMoneyWithdraw, BiCar, BiSolidTruck, BiXCircle, BiArchive, BiCheckCircle, BiRefresh, BiPrinter, BiMenu, BiShoppingBag, BiPhoneIncoming, BiUserPlus, BiFlag, BiHistory, BiSearch, BiCheckDouble, BiLogOut, BiStats } from 'react-icons/bi';
import { useEffect, useState } from "react";
import axios from "axios";
import { API_LINK } from "../config";
import { IconButton } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { setRefresh } from "../managers/refresh.manager";
import { setInfoAuth, setRefreshAuth } from "../managers/auth.manager";
function Navbar() {
    const { pathname: path } = useLocation();
    const [stats, setStats] = useState({ products: 0, categories: 0, operators: 0, wait_delivery: 0, sended: 0, reject: 0, delivered: 0, archive: 0, wait: 0, neworders: 0, inoperator: 0, users: 0, couriers: 0, oper_pays: 0, race: 0, history_orders: 0, owners: 0 });
    const { refresh: { refresh }, auth: { owner } } = useSelector(e => e);
    const [open, setOpen] = useState(false);
    const dp = useDispatch();
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
    function LogOut() {
        localStorage.removeItem('access');
        setTimeout(() => {
            dp(setInfoAuth({
                name: '',
                phone: '',
                image: '',
                owner: false,
                id: ''
            }))
            dp(setRefreshAuth());
        }, 1000);
    }
    const classLink = "flex items-center w-full text-[15px] hover:pl-[20px] duration-500 text-blue-gray-700 relative mb-[10px] p-[5px_10px] rounded bg-white border ";

    return (
        <>
            <div className={`md:hidden duration-500 z-[9999] top-[15px] fixed ${open ? 'left-[235px]' : 'left-[10px]'}`}>
                <IconButton color="red" onClick={() => setOpen(!open)} className="text-[30px] rounded-full">
                    {open && <BiXCircle />}
                    {!open && <BiMenu />}
                </IconButton>
            </div>
            <div onClick={() => setOpen(false)} className={`fixed top-0 ${open ? 'w-full' : 'w-0'} ring-0 duration-500 bg-[#00000044] right-0 backdrop-blur-sm z-[997] h-[100vh]`}></div>
            <div className={`flex items-center justify-start flex-col w-[300px] h-[100vh] bg-white duration-500 shadow-md p-[10px] overflow-y-scroll fixed top-0 ${open ? 'left-0' : 'left-[-300px]'} md:relative md:top-auto md:left-auto z-[998] ${path === '/print-cheques' || path === '/wait-delivery' ? 'hidden' : ''}`}>
                <div className="flex items-center justify-start w-full rounded p-[10px] mb-[10px] border-b bg-blue-gray-50 relative">
                    <h1 className="text-black text-[20px] mr-[20px]">ADMIN</h1>
                    <IconButton onClick={() => dp(setRefresh())} className="rounded-full text-[20px]">
                        <BiRefresh />
                    </IconButton>
                </div>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/' className={classLink + `${path === '/' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiSolidDashboard className="mr-[10px]" />
                    Dashboard
                </Link>
                {/*  */}
                {owner && <Link onClick={() => setOpen(false)} to='/owners' className={classLink + `${path === '/owners' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiCheckDouble className="mr-[10px]" />
                    Egalar
                    <span className="absolute right-[10px] rounded-full p-[5px] bg-[#fff0]">{stats?.owners}</span>
                </Link>}
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/race' className={classLink + `${path === '/race' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiFlag className="mr-[10px]" />
                    Poyga {new Date().getFullYear()}
                    <span className="absolute right-[10px] rounded-full p-[5px] bg-[#fff0]">{stats?.race}</span>
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/products' className={classLink + `${path === '/products' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiSolidBox className="mr-[10px]" />
                    Mahsulotlar
                    <span className="absolute right-[10px] rounded-full p-[5px] bg-[#fff0]">{stats?.products}</span>
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/add-product' className={classLink + `${path === '/add-product' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiPlusCircle className="mr-[10px]" />
                    Mahsulot qo'shish
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/categories' className={classLink + `${path === '/categories' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiListUl className="mr-[10px]" />
                    Kategoriyalar
                    <span className="absolute right-[10px] rounded-full p-[5px] bg-[#fff0]">{stats?.categories}</span>
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/add-category' className={classLink + `${path === '/add-category' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiListPlus className="mr-[10px]" />
                    Kategoriya qo'shish
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/operators' className={classLink + `${path === '/operators' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiPhone className="mr-[10px]" />
                    Operatorlar
                    <span className="absolute right-[10px] rounded-full p-[5px] bg-[#fff0]">{stats?.operators}</span>
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/add-operator' className={classLink + `${path === '/add-operator' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiPhoneCall className="mr-[10px]" />
                    Operator qo'shish
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/pay-operators' className={classLink + `${path === '/pay-operators' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiMoneyWithdraw className="mr-[10px]" />
                    Operatorlar to'lovi
                    <span className="absolute right-[10px] rounded-full p-[5px] bg-[#fff0]">{stats?.oper_pays}</span>
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/couriers' className={classLink + `${path === '/couriers' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiSolidTruck className="mr-[10px]" />
                    Kuryerlar
                    <span className="absolute right-[10px] rounded-full p-[5px] bg-[#fff0]">{stats?.couriers}</span>
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/add-courier' className={classLink + `${path === '/add-courier' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiUserPlus className="mr-[10px]" />
                    Kuryer qo'shish
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/users' className={classLink + `${path === '/users' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiUser className="mr-[10px]" />
                    Foydalanuvchilar
                    <span className="absolute right-[10px] rounded-full p-[5px] bg-[#fff0]">{stats?.users}</span>
                </Link>
                {/*  */}
                {/* <Link onClick={() => setOpen(false)} to='/admin-pays' className={classLink + `${path === '/admin-pays' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiMoney className="mr-[10px]" />
                    Adminlar to'lovi
                </Link> */}
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/new-orders' className={classLink + `${path === '/new-orders' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiShoppingBag className="mr-[10px]" />
                    Yangi buyurtmalar
                    <span className="absolute right-[10px] rounded-full p-[5px] bg-[#fff0]">{stats?.neworders}</span>
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/owned-orders' className={classLink + `${path === '/owned-orders' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiPhoneIncoming className="mr-[10px]" />
                    Operatorda
                    <span className="absolute right-[10px] rounded-full p-[5px] bg-[#fff0]">{stats?.inoperator}</span>
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/print-cheques' className={classLink + `${path === '/print-cheques' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiPrinter className="mr-[10px]" />
                    Cheklar
                    <span className="absolute right-[10px] rounded-full p-[5px] bg-[#fff0]">{stats?.wait_delivery}</span>
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/wait-delivery' className={classLink + `${path === '/wait-delivery' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiCar className="mr-[10px]" />
                    Dostavkaga tayyor
                    <span className="absolute right-[10px] rounded-full p-[5px] bg-[#fff0]">{stats?.wait_delivery}</span>
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/sended' className={classLink + `${path === '/sended' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiSolidTruck className="mr-[10px]" />
                    Yuborilganlar
                    <span className="absolute right-[10px] rounded-full p-[5px] bg-[#fff0]">{stats?.sended}</span>
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/reject' className={classLink + `${path === '/reject' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiXCircle className="mr-[10px]" />
                    Dostavkadan qaytgan
                    <span className="absolute right-[10px] rounded-full p-[5px] bg-[#fff0]">{stats?.reject}</span>
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/archive' className={classLink + `${path === '/archive' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiArchive className="mr-[10px]" />
                    Arxivlangan
                    <span className="absolute right-[10px] rounded-full p-[5px] bg-[#fff0]">{stats?.archive}</span>
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/delivered' className={classLink + `${path === '/delivered' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiCheckCircle className="mr-[10px]" />
                    Yetkazilgan
                    <span className="absolute right-[10px] rounded-full p-[5px] bg-[#fff0]">{stats?.delivered}</span>
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/wait-orders' className={classLink + `${path === '/wait-orders' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiRefresh className="mr-[10px]" />
                    Qayta aloqa
                    <span className="absolute right-[10px] rounded-full p-[5px] bg-[#fff0]">{stats?.wait}</span>
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/history' className={classLink + `${path === '/history' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiHistory className="mr-[10px]" />
                    Sotuvlar tarixi
                    <span className="absolute right-[10px] rounded-full p-[5px] bg-[#fff0]">{stats?.history_orders}</span>
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/search-history' className={classLink + `${path === '/search-history' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiSearch className="mr-[10px]" />
                    Qidiruv(Tarix)
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/stat-users' className={classLink + `${path === '/stat-users' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiStats className="mr-[10px]" />
                    Sotuvchilar reytingi
                </Link>
                {/*  */}
                <Link onClick={() => setOpen(false)} to='/stat-opers' className={classLink + `${path === '/stat-opers' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiStats className="mr-[10px]" />
                    Operatorlar reytingi
                </Link>
                {/*  */}
                <Link onClick={() => LogOut()} to='#' className={classLink + `${path === '#' && 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                    <BiLogOut className="mr-[10px]" />
                    Chiqish
                </Link>
                {/*  */}
            </div>
        </>
    );
}

export default Navbar;