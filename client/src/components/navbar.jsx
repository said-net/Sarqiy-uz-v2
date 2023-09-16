import { Drawer, IconButton, ListItem, Menu, MenuHandler, MenuItem, MenuList, Spinner } from "@material-tailwind/react";
import { FaBars, FaSearch } from 'react-icons/fa'
import { useLocation, useNavigate } from "react-router-dom";
// import Logo from '../assets/logo.png';
import { GoHome, GoHomeFill } from 'react-icons/go'
import { BiCategory, BiSolidCategory, BiCommentDetail, BiUser, BiSolidUser } from 'react-icons/bi'
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
            <div className="flex items-center justify-center w-full h-[60px] fixed top-0 left-0 z-[2]">
                <nav className="bg-white w-full h-[60px] flex items-center justify-between p-[0_2%] rounded-[0_0_10px_10px] border-b max-w-lg">
                    <IconButton onClick={() => setOpenMenu(true)} color="red" className="rounded-full text-[20px]">
                        <FaBars />
                    </IconButton>
                    <div className="flex items-center justify-center w-[70%] relative">
                        <input value={search} type="text" className="border border-red-500 p-[0_30px_0_10px] h-[35px] rounded-full w-full" placeholder="Qidiruv..." onChange={e => setSearch(e.target.value)} onKeyPress={e => e.key === 'Enter' && nv(`/search/${search}`)} />
                        <button className="w-[30px] h-[30px]  absolute right-[5px] rounded-full text-[16px] text-black flex items-center justify-center" onClick={() => nv('/search/' + search)}>
                            <FaSearch />
                        </button>
                    </div>
                    <Menu>
                        <MenuHandler>
                            <IconButton className="rounded-full text-[20px]" color="red">
                                <BsFillGearFill />
                            </IconButton>
                        </MenuHandler>
                        {id &&
                            <MenuList>
                                <MenuItem onClick={() => nv('/profile')}>
                                    Profil
                                </MenuItem>
                                <MenuItem onClick={() => nv('/dashboard')}>
                                    Adminlar uchun
                                </MenuItem >
                                <MenuItem onClick={() => nv('/settings')}>
                                    Sozlamalar
                                </MenuItem>
                            </MenuList>
                        }{!id &&
                            <MenuList>
                                <MenuItem onClick={() => setOpenAuth(!openAuth)}>
                                    Kirish / Ro'yhatdan o'tish
                                </MenuItem>
                            </MenuList>
                        }
                    </Menu>
                    {/* <img src={Logo} alt="logo" className="w-[45px]" onClick={() => nv('/')} /> */}
                </nav>
            </div>
            <div className="flex items-center justify-center w-full h-[50px] fixed bottom-0 left-0 z-[2]">
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
            {/*  */}
            <Drawer onClose={() => setOpenMenu(false)} open={openMenu} className="bg-white z-[99999]">
                <div className="flex items-center justify-between w-full h-[70px] p-[10px] border-b">
                    <div className="flex items-center justify-center h-[50px] overflow-y-hidden w-[50%]">
                        <img src={Logo} alt="" />
                    </div>
                    <IconButton className="text-[20px] rounded-full " onClick={() => setOpenMenu(false)} color="blue-gray">
                        <MdClose />
                    </IconButton>
                </div>
                <div className="flex items-center justify-start flex-col h-[500px] overflow-y-scroll border-b p-[10px_0]">
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
            </Drawer>
            <Auth open={openAuth} setOpen={setOpenAuth} />
        </>
    );
}

export default Navbar;