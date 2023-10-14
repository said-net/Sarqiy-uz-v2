import { Button, IconButton, ListItem, Popover, PopoverContent, PopoverHandler, Spinner } from "@material-tailwind/react";
import { FaBars, FaSearch } from 'react-icons/fa'
import { useLocation, useNavigate } from "react-router-dom";
// import Logo from '../assets/logo.png';
import { GoHome, GoHomeFill } from 'react-icons/go'
import { BiCategory, BiSolidCategory, BiCommentDetail, BiUser, BiSolidUser, BiHeart, BiShoppingBag } from 'react-icons/bi'
import { BsFillGearFill } from 'react-icons/bs'
import { MdClose, MdOutlineVideoLibrary, MdVideoLibrary } from 'react-icons/md'
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import Auth from "../user/auth";
import Logo from '../assets/logo.png';
function Navbar() {
    const { id } = useSelector(a => a.auth);
    const nv = useNavigate();
    const { pathname } = useLocation();
    const [openMenu, setOpenMenu] = useState(false);
    const [isLoad, setIsLoad] = useState(false);
    const [categories, setCategories] = useState([]);
    const [openAuth, setOpenAuth] = useState(false);
    const [search, setSearch] = useState('');

    const [openPopover, setOpenPopover] = useState(false);

    const triggers = {
        onMouseEnter: () => setOpenPopover(true),
        onMouseLeave: () => setOpenPopover(false),
    };
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/category/getall`).then(res => {
            setIsLoad(true);
            const { data, ok } = res.data;
            if (ok) {
                setCategories(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib koring!");
        });
    }, []);
    return (
        <>
            <div className="h-[70px] mb-[60px] md:mb-[0]"></div>
            <div className="flex items-center justify-start w-full h-[150px] md:h-[90px] fixed top-0 left-0 z-[2] flex-col">
                <div className="flex items-center justify-center w-full h-[30px] bg-gray-100"></div>
                {/* KOMP */}
                <nav className="bg-white w-full h-[60px] flex items-center justify-between p-[0_2%] rounded-[0_0_10px_10px] max-w-[1256px]">
                    {/* LOGO */}
                    <div className="flex items-center justify-center">
                        <div className="flex md:hidden items-center justify-center mr-[10px]">
                            <IconButton onClick={() => setOpenMenu(true)} color="white" className="rounded-full text-[20px] shadow-none">
                                <FaBars />
                            </IconButton>
                        </div>
                        <img onClick={() => nv('/')} src={Logo} alt="Logo" className="w-[100px] sm:w-[170px]" />
                    </div>
                    <div className="hidden md:flex items-center justify-center w-[55%]">
                        <Popover open={openPopover} handler={setOpenPopover}>
                            <PopoverHandler {...triggers}>
                                <p className="flex items-center justify-center h-[40px] w-[120px] bg-red-50 rounded cursor-pointer hover:bg-red-100 duration-200 text-red-700">
                                    <BiCategory />
                                    Katalog
                                </p>
                            </PopoverHandler>
                            <PopoverContent {...triggers} className="w-[500px] flex items-center justify-start flex-col bg-gray-200 z-[9999]">
                                {!isLoad && <Spinner />}
                                {isLoad &&
                                    <div className="grid grid-cols-3 gap-[10px]">
                                        {categories?.map((c, i) => {
                                            return (
                                                <div key={i} className="flex items-center justify-center flex-col w-[150px] h-[180px] shadow-sm bg-white rounded relative cursor-pointer" onClick={() => { nv('/get-by-category/' + c.id) }}>
                                                    <img src={c?.image} alt="ci" className="w-[70%]" />
                                                    <p className="text-center absolute bottom-[10px]">{c?.title}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </PopoverContent>
                        </Popover>
                        <div className="flex items-center justify-center relative w-full ">
                            <input value={search} type="text" className="border border-gray-300 p-[0_30px_0_10px] h-[40px] rounded mx-[10px] w-full" placeholder="Qidiruv..." onChange={e => setSearch(e.target.value)} onKeyPress={e => e.key === 'Enter' && nv(`/search/${search}`)} />
                            <button className="w-[60px] h-[38px] absolute right-[11px] rounded text-[16px] bg-gray-100 text-black flex items-center justify-center" onClick={() => nv('/search/' + search)}>
                                <FaSearch />
                            </button>
                        </div>
                    </div>
                    {/* SIGN */}
                    <div className="flex items-center justify-center">
                        {/* AUTH */}
                        {!id ?
                            <p className="hover:bg-gray-100 p-[10px] rounded items-center justify-center cursor-pointer text-[0] xl:text-[16px] flex" onClick={() => setOpenAuth(true)}>
                                <BiUser className="text-[20px] mr-[10px] " />
                                Kirish
                            </p>
                            :
                            <p className="hover:bg-gray-100 p-[10px] rounded items-center justify-center cursor-pointer text-[0] xl:text-[16px] flex" onClick={() => nv('/profile')}>
                                <BiUser className="text-[20px] mr-[10px] " />
                                Profil
                            </p>
                        }
                        {/* SAVED */}
                        {!id ?
                            <p className="hover:bg-gray-100 p-[10px] rounded items-center justify-center cursor-pointer text-[0] xl:text-[16px] flex" onClick={() => setOpenAuth(true)}>
                                <BiHeart className="text-[20px] mr-[10px] " />
                                Saqlanganlar
                            </p>
                            :
                            <p className="hover:bg-gray-100 p-[10px] rounded items-center justify-center cursor-pointer text-[0] xl:text-[16px] flex" onClick={() => nv('/profile?page=saved')}>
                                <BiHeart className="text-[20px] mr-[10px] " />
                                Saqlanganlar
                            </p>
                        }
                        {/* DASHBOARD */}
                        {!id ?
                            <p className="hover:bg-gray-100 p-[10px] rounded items-center justify-center cursor-pointer text-[0] xl:text-[16px] flex" onClick={() => setOpenAuth(true)}>
                                <BiShoppingBag className="text-[20px] mr-[10px] " />
                                Admin
                            </p>
                            :
                            <p className="hover:bg-gray-100 p-[10px] rounded items-center justify-center cursor-pointer text-[0] xl:text-[16px] flex" onClick={() => nv('/dashboard')}>
                                <BiShoppingBag className="text-[20px] mr-[10px] " />
                                Admin
                            </p>
                        }
                    </div>
                </nav>
                <div className="fixed top-[90px] left-[0] px-[10px] flex items-center justify-center w-full">
                    <div className="flex md:hidden items-center justify-center relative w-full">
                        <input value={search} type="text" className="placeholder:text-gray-800 p-[0_30px_0_10px] h-[30px] rounded-[7px] mx-[10px] w-full bg-gray-100" placeholder="Qidiruv..." onChange={e => setSearch(e.target.value)} onKeyPress={e => e.key === 'Enter' && nv(`/search/${search}`)} />
                        <button className="w-[60px] h-[28px] absolute right-[11px] rounded text-[16px] bg-gray-100 text-black flex items-center justify-center" onClick={() => nv('/search/' + search)}>
                            <FaSearch />
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex sm:hidden items-center justify-center w-full h-[50px] fixed bottom-0 left-0 z-[2]">
                <div className="bg-white w-full h-[50px] flex items-center justify-between p-[0_2%] rounded-[10px_10px_0_0] border-t max-w-lg">
                    <div className="flex items-center justify-center flex-col">
                        {pathname !== '/' && <GoHome className="text-[30px] cursor-pointer" onClick={() => nv('/')} />}
                        {pathname === '/' && <GoHomeFill className="text-[30px] cursor-pointer" onClick={() => nv('/')} />}
                        <p className="text-[12px]">Asosiy</p>
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center flex-col">
                        {pathname !== '/videos' && <MdOutlineVideoLibrary className="text-[30px] cursor-pointer" onClick={() => nv('/videos')} />}
                        {pathname === '/videos' && <MdVideoLibrary className="text-[30px] cursor-pointer" onClick={() => nv('/videos')} />}
                        <p className="text-[12px]">Video</p>
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center flex-col">
                        {pathname !== '/categories' && <BiCategory className="text-[30px] cursor-pointer" onClick={() => nv('/categories')} />}
                        {pathname === '/categories' && <BiSolidCategory className="text-[30px] cursor-pointer" onClick={() => nv('/categories')} />}
                        <p className="text-[12px]">Katalog</p>
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center flex-col">
                        <BiCommentDetail className="text-[30px] cursor-pointer" onClick={() => window.open('http://t.me/Sharqiyuz_Yordam_Bot')} />
                        <p className="text-[12px]">Aloqa</p>
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center flex-col">
                        {pathname !== '/profile' && <BiUser className="text-[30px] cursor-pointer" onClick={() => nv('/profile')} />}
                        {pathname === '/profile' && <BiSolidUser className="text-[30px] cursor-pointer" onClick={() => nv('/profile')} />}
                        <p className="text-[12px]">Profil</p>
                    </div>
                </div>
            </div>
            {/* MENU */}
            <div className={`flex items-center justify-start flex-col w-[300px] h-[100vh] fixed top-0 ${openMenu ? "left-0" : "left-[-300px]"} duration-300 z-[999] bg-white`}>
                <div className="flex items-center justify-between w-full h-[70px] p-[10px] border-b">
                    <div className="flex items-center justify-center h-[50px] overflow-y-hidden w-[50%]">
                        <img src={Logo} alt="" />
                    </div>
                    <IconButton className="text-[20px] rounded-full " onClick={() => setOpenMenu(false)} color="blue-gray">
                        <MdClose />
                    </IconButton>
                </div>
                <div className="flex items-center justify-start flex-col h-[500px] overflow-y-scroll border-b p-[10px_0] w-full">
                    {!isLoad && <Spinner />}
                    {isLoad && !categories[0] &&
                        <div className="flex">Kategoriyalar mavjud emas</div>
                    }
                    {isLoad && categories[0] &&
                        categories.map((c, i) => {
                            return (
                                <ListItem onClick={() => { nv('/get-by-category/' + c.id); setOpenMenu(false) }} key={i} className="mb-[5px]">
                                    <div className="flex items-center justify-center w-[35px] h-[35px] rounded-full outline-1 outline outline-blue-gray-500 overflow-hidden p-[3px] mr-[10px]">
                                        <img src={c?.image} alt="c" />
                                    </div>
                                    {c.title}
                                </ListItem>
                            )
                        })
                    }
                </div>
                <div className="flex items-center justify-center h-[30px]">
                    <p className="text-[14px] text-blue-gray-100">SHARQIY.UZ Barcha huquqlar himoyalangan</p>
                </div>
            </div>
            {/* MENU closer */}
            <div className={`fixed top-0 left-0 h-[100vh] ${openMenu ? 'w-full' : 'w-0'} duration-300 bg-[#00000064] backdrop-blur-sm z-[998]`} onClick={() => setOpenMenu(false)}></div>
            <Auth open={openAuth} setOpen={setOpenAuth} />
        </>
    );
}

export default Navbar;