import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Spinner } from "@material-tailwind/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import Auth from "../user/auth";
function Search() {
    const { search } = useParams();
    const [isLoad, setIsLoad] = useState(false);
    const nv = useNavigate()
    const [products, setProducts] = useState([]);
    const [openAuth, setOpenAuth] = useState(false);
    const [likes, setLikes] = useState([]);
    const [refreshLikes, setRefreshLikes] = useState(false);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/product/get-search/${search}`).then((res) => {
            const { data, msg, ok } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setProducts(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!");
        });
    }, [search]);

    const { id: userId } = useSelector(e => e.auth);

    function setLike(pid) {
        if (!userId) {
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
        if (userId) {
            axios(`${API_LINK}/user/get-likes`, {
                headers: {
                    'x-user-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then((res) => {
                const { ok, data } = res.data;
                if (ok) {
                    setLikes(data);
                }
            });
        }
    }, [refreshLikes]);

    return (
        <div className="flex items-center justify-start w-full m-[0px_0_60px_0]">
            {!isLoad && <Spinner />}
            {isLoad && !products[0] && <h1>Mahsulotlar vaqtinchalik mavjud emas!</h1>}
            {isLoad && products[0] &&
                <div className="flex items-center justify-start flex-col w-full">
                    {/* MAHSULOTLAR */}
                    <div className="flex items-start justify-between w-full p-[0_2%]">
                        <div className="flex items-center justify-center w-[49%] flex-col">
                            {products.map((p, i) => {
                                return (
                                    (i + 1) % 2 !== 0 && <div key={i} className="flex items-center justify-start flex-col w-[100%] mb-[20px]  rounded shadow-md overflow-hidden relative h-[350px]">

                                        {!likes?.includes(p?.id) && <FaRegHeart onClick={() => setLike(p?.id)} className={`absolute top-[5px] right-[5px] text-red-500`} />}

                                        {likes?.includes(p?.id) && <FaHeart onClick={() => setLike(p?.id)} className={`absolute top-[5px] right-[5px] text-red-500`} />}

                                        {p?.bonus && <span className="absolute top-[5px] left-[5px] bg-red-500 px-[5px] rounded text-[12px] text-white">{p?.bonus_about}</span>}
                                        <div onClick={() => nv('/product/' + p?.pid)} className="flex items-start justify-center w-full overflow-hidden h-[250px]">
                                            <img src={p.image} alt="c" />
                                        </div>
                                        <div className="flex items-start justify-start flex-col w-full" onClick={() => nv('/product/' + p?.pid)}>
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
                        <div className="flex items-center justify-center w-[49%] flex-col">
                            {products.map((p, i) => {
                                return (
                                    (i + 1) % 2 === 0 && <div key={i} className="flex items-center justify-start flex-col w-[100%] mb-[20px]  rounded shadow-md overflow-hidden relative h-[350px]">
                                        {!likes?.includes(p?.id) && <FaRegHeart onClick={() => setLike(p?.id)} className={`absolute top-[5px] right-[5px] text-red-500`} />}

                                        {likes?.includes(p?.id) && <FaHeart onClick={() => setLike(p?.id)} className={`absolute top-[5px] right-[5px] text-red-500`} />}

                                        {p?.bonus && <span className="absolute top-[5px] left-[5px] bg-red-500 px-[5px] rounded text-[12px] text-white">{p?.bonus_about}</span>}
                                        <div onClick={() => nv('/product/' + p?.pid)} className="flex items-start justify-center w-full overflow-hidden h-[250px]">
                                            <img src={p.image} alt="c" />
                                        </div>
                                        <div className="flex items-start justify-start flex-col w-full" onClick={() => nv('/product/' + p?.pid)}>
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
                </div>
            }
            <Auth open={openAuth} setOpen={setOpenAuth} />
        </div>
    );
}

export default Search;