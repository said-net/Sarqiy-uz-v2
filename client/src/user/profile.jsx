import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotAuth from "./notauth";
import { FaCalendar, FaCartShopping, FaGear, FaHeart, FaLocationDot, FaPhone, FaTelegram, FaUser } from 'react-icons/fa6'
import { BiLogOut } from 'react-icons/bi'
import { setInformations, setRefreshAuth } from "../managers/authManager";
import Regions from '../components/regions.json'
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Chip, Spinner } from "@material-tailwind/react";
import { MdRemoveShoppingCart } from 'react-icons/md'
import Loading from "../components/loading";
function Profile() {
    const { search } = useLocation();
    const { id, name, phone, telegram, location, created } = useSelector(e => e.auth);
    const [type, setType] = useState(search?.replace('?page=', '') || 'profile');
    const [isLoad, setIsLoad] = useState(false);
    const [history, setHistory] = useState([]);
    const [products, setProducts] = useState([]);
    const [refreshLikes, setRefreshLikes] = useState(false);
    const [loadLikes, setLoadLikes] = useState(false);

    const dp = useDispatch();
    const nv = useNavigate();
    function LogOut() {
        if (window.confirm('Profildan chiqishni hohlaysizmi?')) {
            localStorage.removeItem('access');
            setTimeout(() => {
                dp(setInformations({
                    name: '',
                    phone: '',
                    id: '',
                    role: '',
                    created: '',
                    balance: 0,
                    telegram: 0,
                    location: ''
                }))
                dp(setRefreshAuth());
            }, 1000);
        }
    }

    useEffect(() => {
        setIsLoad(false);
        if (type === 'history') {
            axios(`${API_LINK}/user/get-shop-history`, {
                headers: {
                    'x-user-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then(res => {
                const { ok, data, msg } = res.data;
                setIsLoad(true);
                if (!ok) {
                    toast.error(msg);
                } else {
                    setHistory(data);
                }
            }).catch(() => {
                toast.error("Aloqani tekshirib qayta urunib ko'ring!")
            })
        }
    }, [type]);

    function setLike(pid) {
        if (!id) {
            setOpenAuth(true);
        } else {
            axios(`${API_LINK}/user/set-like/${pid}`, {
                headers: {
                    'x-user-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then((res) => {
                const { ok } = res.data;
                if (ok) {
                    setRefreshLikes(!refreshLikes);
                }
            });
        }
    }

    useEffect(() => {
        setLoadLikes(false);
        axios(`${API_LINK}/user/get-my-likes`, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, data } = res.data;
            setLoadLikes(true);
            if (ok) {
                setProducts(data);
            }
        });
    }, [refreshLikes]);

    const [load, setLoad] = useState(false);
    setTimeout(() => {
        setLoad(true);
    }, 1000)


    return (
        <div className="flex items-center justify-start flex-col w-full p-[10px] mt-[40px]">
            {!load && <Loading />}
            {load &&
                <>
                    {!id &&
                        <NotAuth />
                    }
                    {
                        id && <>
                            {/* NAV */}
                            <div className="flex items-center justify-around w-full bg-white h-[60px] rounded mb-[20px] border">
                                {/*  */}
                                <p onClick={() => setType('profile')} className={`text-[12px] flex items-center justify-center flex-col ${type === 'profile' ? 'text-black underline' : 'text-gray-500'}`}><FaUser className="text-[16px]" />Profilim</p>
                                {/*  */}
                                <p onClick={() => setType('history')} className={`text-[12px] flex items-center justify-center flex-col ${type === 'history' ? 'text-black underline' : 'text-gray-500'}`}><FaCartShopping className="text-[16px]" />Tarix</p>
                                {/*  */}
                                <p onClick={() => setType('saved')} className={`text-[12px] flex items-center justify-center flex-col ${type === 'saved' ? 'text-black underline' : 'text-gray-500'}`}><FaHeart className="text-[16px]" />Saqlangan</p>
                                {/*  */}
                                <p onClick={() => LogOut()} className={`text-[12px] flex items-center justify-center flex-col ${type === 'exit' ? 'text-black underline' : 'text-gray-500'}`}><BiLogOut className="text-[20px]" />Chiqish</p>
                            </div>
                            {/* PROFILE */}
                            {type === 'profile' &&
                                <div className="flex items-start justify-start flex-col w-full bg-white shadow-sm p-[10px] rounded border">
                                    {/*  */}
                                    <h1 className="text-[25px] font-bold mb-[10px]">Salom {name}!</h1>
                                    {/*  */}
                                    <p className=" mb-[10px] flex items-center"><FaUser className="mr-[5px]" />Ismingiz: <span className="text-cyan-800 ml-[5px]">{name}</span></p>
                                    {/*  */}
                                    <p className=" mb-[10px] flex items-center"><FaPhone className="mr-[5px]" />Raqamingiz: <span className="text-cyan-800 ml-[5px]">{phone}</span></p>
                                    {/*  */}
                                    <p className=" mb-[10px] flex items-center"><FaTelegram className="mr-[5px]" />Telegram: <span className="text-cyan-800 ml-[5px]">{telegram ? telegram : 'Kiritilmagan!'}</span></p>
                                    {/*  */}
                                    <p className=" mb-[10px] flex items-center"><FaLocationDot className="mr-[5px]" />Hududingiz: <span className="text-cyan-800 ml-[5px]">{Regions.find(e => e.id === location)?.name}</span></p>
                                    {/*  */}
                                    <p className=" mb-[10px] flex items-center"><FaCalendar className="mr-[5px]" />Saytda: <span className="text-cyan-800 ml-[5px]">{created}</span></p>
                                    {/*  */}
                                    <p className=" mb-[10px] flex items-center"><FaGear className="mr-[5px]" /><Link to='/settings' className="underline text-cyan-500 mr-[5px]">Sozlamalar</Link> orqali o'zgartirish mumkin!</p>
                                </div>
                            }
                            {/* HISTORY */}
                            {type === 'history' &&
                                <div className="flex items-center justify-start flex-col w-full">
                                    {!isLoad && <Spinner />}
                                    {isLoad && !history[0] &&
                                        <div className="flex items-center justify-center w-full min-h-[300px] flex-col">
                                            <MdRemoveShoppingCart className="text-[100px] text-gray-500" />
                                            <p className="text-gray-500">Sizda buyurtmalar mavjud emas!</p>
                                        </div>
                                    }
                                    {isLoad && history[0] &&
                                        <>
                                            {history?.map((e, i) => {
                                                return (
                                                    <div key={i} className={`flex items-center justify-between  w-full h-[50px] border ${(i + 1) % 2 == 0 ? 'bg-white' : 'bg-gray-200'}`}>
                                                        <div className="flex items-center justify-start w-[30%]">
                                                            <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full border overflow-hidden">
                                                                <img src={e?.image} alt="rasm" />
                                                            </div>
                                                            <p>{e?.product?.title?.slice(0, 12)}...</p>
                                                        </div>
                                                        <p className="w-[15%] flex items-center justify-start">{e?.count ? e?.count : 0} ta</p>
                                                        {e?.status === 'reject' && <Chip className="font-light text-[11px] rounded" color="red" value={'Rad etildi'} />}

                                                        {e?.status === 'copy' && <Chip className="font-light text-[11px] rounded" color="deep-orange" value={'Rad etildi'} />}

                                                        {e?.status === 'archive' && <Chip className="font-light text-[11px] rounded" color="deep-orange" value={'Arxivlandi'} />}

                                                        {(e?.status === 'pending') && <Chip className="font-light text-[11px] rounded" color="blue" value={'Kutulmoqda'} />}

                                                        {e?.status === 'wait' && <Chip className="font-light text-[11px] rounded" color="orange" value={'Qayta aloqa'} />}

                                                        {e?.status === 'success' && <Chip className="font-light text-[11px] rounded" color="cyan" value={'Tekshiruvda'} />}

                                                        {e?.status === 'sended' && <Chip className="font-light text-[11px] rounded" color="indigo" value={'Yuborildi'} />}

                                                        {e?.status === 'delivered' && <Chip className="font-light text-[11px] rounded" color="green" value={'Yetkazildi'} />}
                                                    </div>
                                                )
                                            })}
                                        </>
                                    }
                                </div>
                            }
                            {/* LIKES */}
                            {type === 'saved' &&
                                <>
                                    {!loadLikes && <Spinner />}
                                    {loadLikes && !products[0] && <h1>Saqlangan mahsulotlar mavjud emas</h1>}
                                    {loadLikes && products[0] &&
                                        <div className="flex items-start justify-start w-full flex-col p-[0_2%]">
                                            <div className="grid grid-cols-2 gap-[10px] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                                {products.map((p, i) => {
                                                    return (
                                                        <div key={i} className="flex items-center justify-start flex-col w-[100%] mb-[20px]  rounded shadow-md overflow-hidden relative h-[350px]">
                                                            <FaHeart onClick={() => setLike(p?.id)} className={`absolute top-[5px] right-[5px] text-red-500`} />

                                                            {p?.bonus && <span className="absolute top-[5px] left-[5px] bg-red-500 px-[5px] rounded text-[12px] text-white">{p?.bonus_about}</span>}
                                                            <div onClick={() => nv('/product/' + p.pid)} className="flex items-start justify-center w-full overflow-hidden h-[250px]">
                                                                <img src={p.image} alt="c" />
                                                            </div>
                                                            <div className="flex items-start justify-start flex-col w-full" onClick={() => nv('/product/' + p.pid)}>
                                                                <p className="w-full p-[0_2%] my-[10px]">
                                                                    {p?.title?.slice(0, 15) + '...'}

                                                                </p>
                                                                {p?.old_price &&
                                                                    <p className="text-gray-700 text-[12px] font-normal w-full px-[2%]"><s>{Number(p?.old_price).toLocaleString()} so'm</s> -<span className="text-[red]">{String((p?.old_price - p?.price) / (p?.old_price) * 100).slice(0, 5)}%</span></p>
                                                                }
                                                                <p className=" absolute bottom-[10px] w-full p-[0_2%] font-bold text-[16px] text-black">{Number(p.price).toLocaleString()} so'm</p>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                        </div>
                                    }
                                </>
                            }
                        </>
                    }
                </>
            }
        </div>
    );
}

export default Profile;