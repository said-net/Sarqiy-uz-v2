import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Spinner } from "@material-tailwind/react";
import { BiMenu, BiXCircle } from "react-icons/bi";
import { setRefresh } from "../managers/refresh.manager";

function GetOperatorPays() {
    const [pays, setPays] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e.refresh);
    const [select, setSelect] = useState({ id: '', status: '' });
    const dp = useDispatch();
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/boss/get-operator-pays`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            setIsLoad(true);
            const { ok, data, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                setPays(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, [refresh]);

    function setStatus(st) {
        if (st === 'reject') {
            axios.post(`${API_LINK}/boss/set-operator-pay-status`, { status: 'reject', id: select?.id }, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`,
                }
            }).then((res) => {
                const { ok, msg } = res.data;
                if (!ok) {
                    toast.error(msg)
                } else {
                    toast.success(msg);
                    dp(setRefresh())
                    setSelect({ id: '', status: '' });
                }
            }).catch(err => {
                toast.error("Aloqani tekshirib qayta urunib ko'ring!")
            });
        } else if (st === 'success') {
            axios.post(`${API_LINK}/boss/set-operator-pay-status`, { status: 'success', id: select?.id }, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`,
                }
            }).then((res) => {
                const { ok, msg } = res.data;
                if (!ok) {
                    toast.error(msg)
                } else {
                    toast.success(msg);
                    dp(setRefresh())
                    setSelect({ id: '', status: '' });
                }
            }).catch(err => {
                toast.error("Aloqani tekshirib qayta urunib ko'ring!")
            });
        }
    }

    return (
        <div className="flex items-start md:items-center justify-start flex-col w-full overflow-scroll">
            <div className="flex items-center justify-center w-full rounded-b-[10px] mb-[10px]">
                <h1 className="flex items-center justify-center w-[150px] h-[50px] bg-white shadow-sm rounded-b-[10px]">PUL CHIQARISH</h1>
            </div>
            <div className="flex items-center justify-normal flex-col p-[5px] ">
                <div className="flex items-center justify-between w-full h-[70px] shadow-sm bg-white  border-b p-[0_5px]">
                    <div className="flex items-center justify-between">
                        <p className="w-[50px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">ID</p>
                        <p className="w-[140px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">ISMI</p>
                        <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">RAQAMI</p>
                        <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">KARTA</p>
                        <p className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">MIQDOR</p>
                        <p className="w-[60px] text-center border-l h-[70px] flex items-center justify-center text-[13px]">MENU</p>
                    </div>
                </div>
                {!isLoad && <Spinner />}
                {isLoad && !pays[0] &&
                    <p>So'rovlar mavjud emas!</p>
                }
                {isLoad && pays[0] &&
                    pays?.map((p, i) => {
                        return (
                            <div key={i} className="flex items-center justify-between w-full h-[70px] shadow-sm bg-white  border-b p-[0_5px]">
                                <div className="flex items-center justify-between">
                                    <p className="w-[50px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">
                                        {p?.from?.id}
                                    </p>
                                    <p className="w-[140px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {p?.from?.name}
                                    </p>
                                    <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {p?.from?.phone}
                                    </p>
                                    <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {p?.card}
                                    </p>
                                    <p className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {Number(p?.count).toLocaleString()}
                                    </p>
                                    <p className="w-[60px] text-center border-l h-[70px] flex items-center justify-center text-[13px]">
                                        <IconButton onClick={() => setSelect({ id: p?._id, status: '', ...p })} className="rounded-full text-[20px]">
                                            <BiMenu />
                                        </IconButton>
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <Dialog open={select?.id !== ''} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
                <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                    <DialogHeader className="w-full relative flex items-center justify-between">
                        <p className="text-[20px]">Operator uchun to'lov</p>
                        <IconButton className="text-[20px] rounded-full" color="blue-gray" onClick={() => setSelect({ id: '', status: '' })}>
                            <BiXCircle />
                        </IconButton>
                    </DialogHeader>
                    <DialogBody className="w-full border-y">
                        <p className="text-black">Operator: {select?.from?.name}</p>
                        <p className="text-black">Raqami: {select?.from?.phone}</p>
                        <p className="text-black">Karta: {select?.card}</p>
                        <p className="text-black">Summa: {Number(select?.count).toLocaleString()} so'm</p>
                        <p className="text-[20px] text-black border-t">DIQQAT to'ov qilgach to'landi tugmasini, rad etilsa rad etildi tugmasini bosing!</p>
                    </DialogBody>
                    <DialogFooter className="flex items-center justify-between w-full">
                        <Button className="rounded" color="red" onClick={() => setStatus('reject')}>Rad etildi</Button>
                        <Button className="rounded" color="green" onClick={() => setStatus('success')}>To'landi</Button>
                    </DialogFooter>
                </div>
            </Dialog>
        </div>
    );
}

export default GetOperatorPays;