import { Button, Dialog, IconButton } from "@material-tailwind/react";
import { FaPlay } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
function YoutubePlayer({ open, setOpen, title='', id='' }) {
    const nv = useNavigate()
    return (
        <Dialog open={open !== ''} size="xxl" className="flex items-center justify-center w-full h-[100vh] bg-[#000000ab] backdrop-blur-sm">
            <div className="flex items-center justify-start flex-col w-[90%] rounded bg-white p-[5px] relative">
                <div className="absolute  top-[-20px] right-[-20px]">
                    <IconButton onClick={() => {
                        setOpen('')
                    }} color="blue-gray" className="rounded-full text-[24px]">
                        <MdClose />
                    </IconButton>
                </div>
                <ReactPlayer playIcon={<FaPlay />} url={open} controls width={'100%'} height={550} />
                {title && <p className="mb-[10px]">{title}</p>}
                {id && 
                <Button className="rounded w-full" onClick={()=>nv('/product/'+id)} color="red">Mahsulotga o'tish</Button>
                }
            </div>
        </Dialog>
    );
}

export default YoutubePlayer;