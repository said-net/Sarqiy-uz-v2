import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Spinner, Textarea } from "@material-tailwind/react";
import { FaCalendar, FaEye, FaImage, FaNewspaper } from 'react-icons/fa6'
import { setRefresh } from "../managers/refresh.manager";
import { useNavigate } from "react-router-dom";
function Competitions() {
    const [state, setState] = useState([]);
    const { refresh } = useSelector(e => e?.refresh);
    const [isLoad, setIsLoad] = useState(false);
    const [open, setOpen] = useState({ open: false, title: '', about: '', image: '', duration: '', start: '' });
    const nv = useNavigate();
    // 
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/competition/get-all`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg, data } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setState(data)
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, [refresh]);
    // 
    const dp = useDispatch();
    function Submit() {
        const form = new FormData();
        form.append('title', open.title);
        form.append('image', open.image);
        form.append('about', open.about);
        form.append('duration', open.duration);
        form.append('start', open.start);
        axios.post(`${API_LINK}/competition/create`, form, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setOpen({ open: false, title: '', about: '', image: '', duration: '', start: '' });
                dp(setRefresh())
            }
        })
    }
    return (
        <div className="flex items-start justify-start flex-col w-full">
            <div className="flex items-center justify-center w-full">
                <p className="p-[5px_10px] bg-white rounded-b-[10px] mb-[10px] shadow-sm">KONKURS</p>
            </div>
            <div className="flex items-start justify-start flex-col overflow-x-scroll">
                <div className="flex items-center justify-start bg-white border border-gray-500">
                    <p className="flex items-center justify-center border-r border-gray-500 h-[50px] w-[50px] text-[12px]">ID</p>
                    <p className="flex items-center justify-center border-r border-gray-500 h-[50px] w-[150px] text-[12px]">RASMI</p>
                    <p className="flex items-center justify-center border-r border-gray-500 h-[50px] w-[150px] text-[12px]">NOMI</p>
                    <p className="flex items-center justify-center border-r border-gray-500 h-[50px] w-[150px] text-[12px]">DAN</p>
                    <p className="flex items-center justify-center border-r border-gray-500 h-[50px] w-[150px] text-[12px]">GACHA</p>
                    <p className="flex items-center justify-center border-r border-gray-500 h-[50px] w-[150px] text-[12px]">XOLAT</p>
                    <div className="flex items-center justify-center h-[50px] w-[50px]">
                        <IconButton onClick={() => setOpen({ ...open, open: true })} className="rounded-full text-[30px]" color="red">
                            +
                        </IconButton>
                    </div>
                </div>
                {!isLoad &&
                    <div className="flex items-center justify-center w-full h-[50vh]">
                        <Spinner color="red" />
                    </div>
                }
                {isLoad && !state[0] &&
                    <div className="flex items-center justify-center w-full h-[50vh]">
                        KONKURSLAR MAVJUD EMAS
                    </div>
                }
                {isLoad && state[0] &&
                    state?.map((c, i) => {
                        return (
                            <div key={i} className="flex items-center justify-start bg-white border border-gray-500 border-t-0">
                                <p className="flex items-center justify-center border-r border-gray-500 h-[80px] w-[50px] text-[12px]">
                                    {i + 1}
                                </p>
                                <div className="flex items-center justify-center border-r border-gray-500 h-[80px] w-[150px]">
                                    <img src={c?.image} alt="i" className="w-[40px] rounded-[10px]" />
                                </div>
                                <p className="flex items-center justify-center border-r border-gray-500 h-[80px] w-[150px] text-center text-[12px]">
                                    {c?.title}
                                </p>
                                <p className="flex items-center justify-center border-r border-gray-500 h-[80px] w-[150px] text-[12px]">
                                    {c?.start}
                                </p>
                                <p className="flex items-center justify-center border-r border-gray-500 h-[80px] w-[150px] text-[12px]">
                                    {c?.end}
                                </p>
                                <div className="flex items-center justify-center border-r border-gray-500 h-[80px] w-[150px] text-[12px]">
                                    {c?.ended ? <p className="text-red-500">YAKUNLANGAN</p> : <p className="text-green-500">JARAYONDA</p>}
                                </div>
                                <div className="flex items-center justify-center h-[50px] w-[50px] cursor-pointer" onClick={() => nv('/get-comp-one/' + c?.id)}>
                                    <FaEye />
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            {/*  */}
            <Dialog open={open?.open} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
                <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                    <DialogHeader className="w-full">
                        <p className="text-[20px]">Konkurs hosil qilish va eskisini yakunlash</p>
                    </DialogHeader>
                    <DialogBody className="w-full border-y">
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input label="Konkurs nomi" variant="standard" required onChange={e => setOpen({ ...open, title: e.target.value })} icon={<FaNewspaper />} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input type="file" accept="image/*" variant="standard" label="Konkurs rasmi" required onChange={e => setOpen({ ...open, image: e.target.files[0] })} icon={<FaImage />} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Textarea label="Konkurs haqida batafsil" variant="standard" required onChange={e => setOpen({ ...open, about: e.target.value })} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input type="number" label="Necha kundan so'ng boshlanadi(Kun)" variant="standard" required onChange={e => setOpen({ ...open, start: e.target.value })} icon={<FaCalendar />} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input type="number" label="Konkurs davomiyligi(Kun)" variant="standard" required onChange={e => setOpen({ ...open, duration: e.target.value })} icon={<FaCalendar />} />
                        </div>
                    </DialogBody>
                    <DialogFooter className="w-full">
                        <Button onClick={() => setOpen({ open: false, title: '', about: '', image: '', duration: '', start: '' })} className="rounded mr-[10px]" color="orange">Bekor qilish</Button>
                        <Button onClick={Submit} className="rounded" disabled={!open.image || isNaN(open.duration) || !open.image || !open.about || open.duration < 1} color="green">Saqlash</Button>
                    </DialogFooter>
                </div>
            </Dialog>
        </div>
    );
}

export default Competitions;