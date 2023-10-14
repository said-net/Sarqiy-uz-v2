import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Spinner, Input, Chip, IconButton, Dialog, DialogHeader, DialogBody, Select, Option, DialogFooter, Button } from "@material-tailwind/react";
import { BiSearch, BiTransfer } from "react-icons/bi";
import { setRefresh } from "../managers/refresh.manager";

function SendedOrders() {
    const [couriers, setCouriers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e.refresh);
    const [search, setSearch] = useState('');
    const [openTransfer, setOpenTransfer] = useState({ id: '', _id: '', title: '', courier: '' });
    const [disable, setDisable] = useState(false);
    const [filterCourier, setFIlterCourier] = useState('');
    const dp = useDispatch();
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/boss/get-sended-orders`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            setIsLoad(true)
            const { data, ok, msg, couriers } = res.data;
            console.log(data);
            if (!ok) {
                toast.error(msg);
            } else {
                setOrders(data)
                setCouriers(couriers)
            }
        }).catch(() => {
            setIsLoad(true)
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, [refresh]);
    
    function TransferOrder() {
        setDisable(true)
        axios.post(`${API_LINK}/shop/transfer-courier/${openTransfer?._id}/${openTransfer?.courier}`, {}, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            setDisable(false)
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                dp(setRefresh());
                setOpenTransfer({ id: '', _id: '', title: '', operator: '' });
            }
        }).catch(() => {
            setDisable(false)
            toast.error("Aloqani tekshirib qayta urunib ko'ring!");
        })
    }
    return (
        <div className="flex items-start justify-start flex-col w-full overflow-x-scroll">
            <div className="flex items-center justify-center w-full h-[50px] mb-[20px]">
                <h1 className="flex items-center justify-center w-[150px] h-[50px] bg-white shadow-sm rounded-b-[10px]">YUBORILGANLAR</h1>
            </div>
            <div className="flex items-center justify-normal flex-col p-[5px] min-h-[80vh]">
                <div className="flex items-center justify-center w-full flex-col h-[140px] shadow-sm bg-white  border-b p-[0_10px] ">
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input label="Qidiruv: ID, Nomi, Narxi, Raqam" variant="standard" color="red" icon={<BiSearch />} value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="flex items-center justify-center w-full">
                        {isLoad && <Select label="Kuryer tanlang" variant="standard" value={filterCourier} onChange={e => setFIlterCourier(e)}>
                            {couriers?.map((o, i) => {
                                return (
                                    <Option value={o?._id} key={i}>{o?.name} | {o?.phone}</Option>
                                )
                            })}
                        </Select>}
                    </div>
                </div>
                <div className="flex items-center justify-between w-full h-[70px] shadow-sm bg-white  border-b p-[0_5px]">
                    <div className="flex items-center justify-between">
                        <p className="w-[50px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">ID</p>
                        <p className="w-[140px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">RASMI</p>
                        <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">NOMI</p>
                        <p className="w-[150px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">NARXI</p>
                        <p className="w-[150px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">BUYURTMACHI</p>
                        <p className="w-[150px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">RAQAMI</p>
                        <p className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">KURYER</p>
                        <p className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">KURYER RAQAMI</p>
                        <p className="w-[60px] text-center border-l h-[70px] flex items-center justify-center text-[13px]">MENU</p>
                    </div>
                </div>
                {!isLoad && <Spinner />}
                {isLoad && !orders[0] &&
                    <p>Buyurtmalar mavjud emas!</p>
                }
                {isLoad && orders[0] &&
                    orders?.filter(o => !filterCourier ? o : filterCourier === o?.courier_id)?.filter(o => !search ? o : o?.id === +search || o?.title?.toLowerCase()?.includes(search?.toLowerCase()) || o?.name?.toLowerCase()?.includes(search?.toLowerCase()) || o?.admin?.toLowerCase()?.includes(search?.toLowerCase()) || o?.phone?.includes(search) || String(o?.price)?.includes(search)).map((o, i) => {
                        return (
                            <div key={i} className="flex items-center justify-between w-full h-[70px] shadow-sm bg-white  border-b p-[0_5px]">
                                <div className="flex items-center justify-between">
                                    <div className="w-[50px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">
                                        <Chip color="red" value={o?.id} className="rounded" />
                                    </div>
                                    <div className="w-[140px] text-center border-x h-[50px] flex items-center justify-center text-[13px] overflow-hidden ">
                                        <img src={o?.image} alt={i} className="h-[50px] rounded-[10px]" />
                                    </div>
                                    <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {o?.title}
                                    </p>
                                    <p className="w-[150px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {Number(o?.price)?.toLocaleString()}
                                    </p>
                                    <p className="w-[150px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {o?.name}
                                    </p>
                                    <p className="w-[150px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {o?.phone}
                                    </p>
                                    <p className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {o?.courier}
                                    </p>
                                    <p className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {o?.courier_phone}
                                    </p>
                                    <p className="w-[60px] text-center border-l h-[70px] flex items-center justify-center text-[13px]">
                                        <IconButton onClick={() => setOpenTransfer({ _id: o?._id, id: o?.id, title: o?.title, courier: '' })} color="blue-gray" className="rounded-full w-[35px] h-[35px] text-[20px]">
                                            <BiTransfer />
                                        </IconButton>
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <Dialog size="xs" open={openTransfer?._id !== ''}>
                <DialogHeader>
                    <p className="text-[16px]">#{openTransfer?.id} - {openTransfer?.title}</p>
                </DialogHeader>
                <DialogBody>
                    <Select disabled={disable} label="Kuryer tanlang" variant="standard" value={openTransfer?.courier} onChange={e => setOpenTransfer({ ...openTransfer, courier: e })}>
                        {couriers?.map((o, i) => {
                            return (
                                <Option value={o?._id} key={i}>{o?.name} | {o?.phone}</Option>
                            )
                        })}
                    </Select>
                </DialogBody>
                <DialogFooter className="flex items-center justify-between">
                    <Button color="red" className="rounded font-sans font-light" onClick={() => setOpenTransfer({ id: '', _id: '', title: '', courier: '' })}>Ortga</Button>
                    <Button disabled={disable} color="green" className="rounded font-sans font-light" onClick={TransferOrder}>Biriktirish</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default SendedOrders;