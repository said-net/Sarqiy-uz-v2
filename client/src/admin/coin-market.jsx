import { Button, IconButton, Popover, PopoverContent, PopoverHandler, Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiQuestionMark } from "react-icons/bi";
import { Link } from "react-router-dom";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { FaFaceSadTear } from "react-icons/fa6";
import { useSelector } from "react-redux";

function CoinMarket() {
    const [races, setRaces] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { coins } = useSelector(e => e.auth)
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/race/get-all-to-users`, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            setIsLoad(true);
            const { ok, data, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                setRaces(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, [])
    return (
        <div className="flex items-center justify-start flex-col w-full p-[10px]">
            <Link to={`/dashboard`} className="w-full underline ">Ortga</Link>
            <div className="flex items-center justify-center w-full bg-white h-[50px] rounded relative mb-[10px]">
                <h1>COIN MARKET</h1>
                <div className="absolute right-[10px]">
                    <Popover animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                    }} placement="bottom">
                        <PopoverHandler>
                            <IconButton className="rounded-full text-[20px]">
                                <BiQuestionMark />
                            </IconButton>
                        </PopoverHandler>
                        <PopoverContent>
                            Coin market orqali sotuvlar ortidan kelgan coinlar uchun qimmat baho sovrinlar sotib olishingiz mumkin!
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            {!isLoad && <Spinner />}
            {isLoad && !races[0] &&
                <div className="flex items-center justify-center flex-col w-full h-[50vh]">
                    <FaFaceSadTear className="text-[150px] text-gray-400" />
                    <p className="text-gray-600">Coin-Market hozircha bo'sh</p>
                </div>
            }
            {isLoad && races[0] &&
                <div className="grid grid-cols-2 gap-[20px]">
                    {races?.map((r, i) => {
                        return (
                            <div className="flex items-center justify-start flex-col w-[170px] h-[300px] bg-white shadow-sm rounded" key={i}>
                                <div className="flex items-center justify-center w-full h-[200px] rounded overflow-hidden">
                                    <img src={r?.image} alt="r" className="w-full rounded" />
                                </div>
                                <div className="flex items-start justify-start flex-col w-full p-[5px]">
                                    <p className="text-[13px]">{r?.title}</p>
                                    <p className="text-[13px] text-red-500">
                                        <s>{r?.old_price} Coin</s>
                                    </p>
                                    <p className="text-[15px]">{r?.price} Coin</p>
                                    {!coins < r?.price &&
                                        <Popover animate={{
                                            mount: { scale: 1, y: 0 },
                                            unmount: { scale: 0, y: 25 },
                                        }} placement="top">
                                            <PopoverHandler>
                                                <Button className="rounded w-full" color="red">Sotib olish</Button>
                                            </PopoverHandler>
                                            <PopoverContent>
                                                Sizda {r?.title} uchun yetarli coin mavjud emas!
                                            </PopoverContent>
                                        </Popover>
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    );
}

export default CoinMarket;