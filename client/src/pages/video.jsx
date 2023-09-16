import axios from "axios";
import { useEffect, useState } from "react";
import ReactPlayer from 'react-player'
import { API_LINK } from "../config";
import { Spinner } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { FaPlay } from 'react-icons/fa'
function VideoPlayers() {
    const [videos, setVideos] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [play, setPlay] = useState('');
    const nv = useNavigate();
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/product/get-videos`).then(res => {
            const { ok, data } = res.data;
            console.log(res.data.data[0]?.video);
            setIsLoad(true);
            if (ok) {
                setVideos(data);
                setPlay(data[0]?.id)
            }
        })
    }, [])
    return (
        <div className="flex items-center justify-start flex-col w-full p-[10px]">
            {!isLoad && <Spinner />}
            {isLoad && videos[0] &&
                videos?.map((v, i) => {
                    return (
                        <div key={i} className="flex items-center justify-start flex-col w-[375px] overflow-hidden bg-white min-h-[500px] mb-[30px] shadow-sm rounded overflow-[hidden] relative">
                            <div className="flex absolute top-0 left-0 w-full h-[500px] z-[99]" onClick={() => play === v?.id ? setPlay('') : setPlay(v?.id)}></div>
                            <ReactPlayer playing={play === v.id} playIcon={<FaPlay />} url={v?.video} controls width={'100%'} height={650} />
                            <div className="flex items-start justify-start flex-col w-[376px] h-[110px] backdrop-blur-sm bg-[#000000a3] p-[5px]">
                                <button className="text-white rounded bg-[#e0e0e0a6] w-full h-[40px]" onClick={() => nv('/product/' + v.id)}>MAHSULOTGA O'TISH</button>
                                <h1 className="text-white text-start mt-[15px]">{v?.title}</h1>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default VideoPlayers;