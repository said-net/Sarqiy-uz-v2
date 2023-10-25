import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { Carousel, IconButton, Spinner } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import Auth from "../user/auth";
import YoutubePlayer from "../components/videoplayer";
import ReactPlayer from "react-player";
import { FaPlay, FaShoppingCart } from "react-icons/fa";

function Home() {
    const [isLoad, setIsLoad] = useState(false);
    const [state, setState] = useState({ main: [], videos: [], products: [] });
    const { id } = useSelector(e => e.auth);
    const [refreshLikes, setRefreshLikes] = useState(false);
    const [likes, setLikes] = useState([]);
    const [openAuth, setOpenAuth] = useState(false);

    const nv = useNavigate();
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/main/get-for-client`).then(res => {
            const { ok, data } = res.data;
            setIsLoad(true);
            if (ok) {
                setState(data)
            }
        });
    }, []);

    setTimeout(() => {
        setRefreshLikes(!refreshLikes)
    }, 1200);

    useEffect(() => {
        if (id) {
            // setIsLoad(false)
            axios(`${API_LINK}/user/get-likes`, {
                headers: {
                    'x-user-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then((res) => {
                const { ok, data } = res.data;
                // setIsLoad(true)
                if (ok) {
                    setLikes(data);
                }
            });
        }
    }, [refreshLikes]);

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
    const [videoDetail, setVideoDetail] = useState({ id: '', title: '' });
    const [openVideo, setOpenVideo] = useState('');
    return (
        <div className="flex items-center justify-start flex-col w-full">
            {!isLoad && <Spinner />}
            {/*  */}
            {isLoad && state?.main[0] &&
                <div className="flex items-center justify-center w-full bg-white mb-[20px]">
                    <Carousel autoplay loop className="rounded-[20px] overflow-hidden">
                        {state?.main?.map((m, key) => {
                            return (
                                <div onClick={() => nv('/product/' + m.id)} key={key} className="flex items-center justify-center w-full h-[250px] md:h-[400px]">
                                    <img src={m?.image} alt={key} className="w-full" />
                                </div>
                            )
                        })}
                    </Carousel>
                </div>
            }
            {/*  */}
            {isLoad && state?.products[0] && <div className="flex items-center justify-start w-full flex-col p-[0_2%] mt-[30px]">
                <p className="text-[20px] font-bold w-full mb-[30px]">So'nggi mahsulotlar</p>
                <div className="grid grid-cols-2 gap-[10px] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {state?.products?.slice(0, 10)?.map((p, i) => {
                        return (
                            <div key={i} className="flex items-center justify-start flex-col sm:w-[200px] mb-[20px] mx-[5px] rounded-[10px] border shadow-md overflow-hidden relative h-[350px]">

                                {!likes?.includes(p?.id) && <FaRegHeart onClick={() => setLike(p?.id)} className={`absolute top-[5px] right-[5px] text-red-500`} />}

                                {likes?.includes(p?.id) && <FaHeart onClick={() => setLike(p?.id)} className={`absolute top-[5px] right-[5px] text-red-500`} />}

                                {p?.bonus && <span className="absolute top-[5px] left-[5px] bg-red-500 px-[5px] rounded text-[12px] text-white">{p?.bonus_about}</span>}
                                <div onClick={() => nv('/product/' + p?.pid)} className="flex items-start justify-center w-full overflow-hidden h-[250px] rounded-[10px]">
                                    <img src={p.image} alt="c" className="rounded-[10px]" />
                                </div>
                                <div className="flex items-start justify-start flex-col w-full" onClick={() => nv('/product/' + p?.pid)}>
                                    <p className="w-full p-[0_2%] my-[10px]">
                                        {p?.title?.slice(0, 15) + '...'}
                                    </p>
                                    {p?.old_price &&
                                        <p className="text-gray-700 text-[12px] font-normal w-full px-[2%]"><s>{Number(p?.old_price).toLocaleString()} so'm</s> -<span className="text-[red]">{String((p?.old_price - p?.price) / (p?.old_price) * 100).slice(0, 5)}%</span></p>
                                    }
                                    <div className="flex items-center justify-between w-full absolute bottom-[10px] p-[0_10px_0_2%]">
                                        <p className=" font-bold text-[16px] text-black">{Number(p.price).toLocaleString()} so'm</p>
                                        <IconButton color="red" className="rounded-full text-[20px]">
                                            <FaShoppingCart />
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {/* <div className="flex items-center justify-center w-[49%] flex-col">
                    {state?.products?.map((p, i) => {
                        return (
                            i === 1 && <div key={i} className="flex items-center justify-start flex-col w-[100%] mb-[20px]  rounded shadow-md overflow-hidden relative h-[350px]">
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
                </div> */}
            </div>
            }
            {/*  */}

            {/*  */}
            {isLoad && state?.main[0] &&
                <div className="flex items-center justify-center w-full bg-white mb-[20px]">
                    <Carousel autoplay loop className="rounded-[20px] overflow-hidden">
                        {state?.main?.reverse()?.map((m, key) => {
                            return (
                                <div onClick={() => nv('/product/' + m.id)} key={key} className="flex items-center justify-center w-full h-[250px] md:h-[400px]">
                                    <img src={m?.image} alt={key} className="w-full" />
                                </div>
                            )
                        })}
                    </Carousel>
                </div>
            }
            {/*  */}
            {isLoad && state?.products[0] && <div className="flex items-center justify-start w-full flex-col p-[0_2%] mt-[30px]">
                <p className="text-[20px] font-bold w-full mb-[30px]">Barcha mahsulotlar</p>
                <div className="grid grid-cols-2 gap-[10px] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {state?.products?.slice(10,)?.map((p, i) => {
                        return (
                            <div key={i} className="flex items-center justify-start flex-col sm:w-[200px] mb-[20px] mx-[5px] shadow-md overflow-hidden relative h-[350px] rounded-[10px] border">

                                {!likes?.includes(p?.id) && <FaRegHeart onClick={() => setLike(p?.id)} className={`absolute top-[5px] right-[5px] text-red-500`} />}

                                {likes?.includes(p?.id) && <FaHeart onClick={() => setLike(p?.id)} className={`absolute top-[5px] right-[5px] text-red-500`} />}

                                {p?.bonus && <span className="absolute top-[5px] left-[5px] bg-red-500 px-[5px] rounded text-[12px] text-white">{p?.bonus_about}</span>}
                                <div onClick={() => nv('/product/' + p?.pid)} className="flex items-start justify-center w-full overflow-hidden h-[250px] rounded-[10px]">
                                    <img src={p.image} alt="c" className="rounded-[10px]"/>
                                </div>
                                <div className="flex items-start justify-start flex-col w-full" onClick={() => nv('/product/' + p?.pid)}>
                                    <p className="w-full p-[0_2%] my-[10px]">
                                        {p?.title?.slice(0, 15) + '...'}
                                    </p>
                                    {p?.old_price &&
                                        <p className="text-gray-700 text-[12px] font-normal w-full px-[2%]"><s>{Number(p?.old_price).toLocaleString()} so'm</s> -<span className="text-[red]">{String((p?.old_price - p?.price) / (p?.old_price) * 100).slice(0, 5)}%</span></p>
                                    }
                                    <div className="flex items-center justify-between w-full absolute bottom-[10px] p-[0_10px_0_2%]">
                                        <p className=" font-bold text-[16px] text-black">{Number(p.price).toLocaleString()} so'm</p>
                                        <IconButton color="red" className="rounded-full text-[20px]">
                                            <FaShoppingCart />
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {/* <div className="flex items-center justify-center w-[49%] flex-col">
                    {state?.products?.map((p, i) => {
                        return (
                            i === 1 && <div key={i} className="flex items-center justify-start flex-col w-[100%] mb-[20px]  rounded shadow-md overflow-hidden relative h-[350px]">
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
                </div> */}
            </div>
            }
            <Auth open={openAuth} setOpen={setOpenAuth} />

            <YoutubePlayer open={openVideo} setOpen={setOpenVideo} title={videoDetail.title} id={videoDetail.id} />
        </div>
    );
}

export default Home;