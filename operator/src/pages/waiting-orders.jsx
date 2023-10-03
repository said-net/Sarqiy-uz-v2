import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Spinner, Input, Chip, IconButton, Dialog, DialogHeader, DialogBody, Select, Option, DialogFooter, Button, Checkbox } from "@material-tailwind/react";
import { BiSearch, BiTransfer } from "react-icons/bi";
import { setRefresh } from "../managers/refresh.manager";

function WaitingOrders() {
    const [operators, setOperators] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e.refresh);
    const [search, setSearch] = useState('');
    const [openTransfer, setOpenTransfer] = useState({ id: '', _id: '', title: '', operator: '' });
    const [disable, setDisable] = useState(false);
    const dp = useDispatch();
    const [selecteds, setSelecteds] = useState([]);
    const [operator, setOperator] = useState('');
    const [checked, setChecked] = useState(false);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/shop/get-new-orders-operator`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            setIsLoad(true)
            const { data, ok, msg, operators } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                setOrders(data)
                setOperators(operators)
            }
        }).catch(() => {
            setIsLoad(true)
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, [refresh]);
    function SelectAllOrders(checked) {
        if (checked) {
            const arr = [];
            orders?.forEach(o => {
                arr.push(o?._id)
            })
            setSelecteds(arr);
        } else if (!checked) {
            setSelecteds([]);
        }
    }
    function SelectOrder(id, checked) {
        if (!checked && selecteds?.includes(id)) {
            setSelecteds([...selecteds?.map(s => {
                if (s !== id && s !== undefined) {
                    return s;
                }
            })])
        } else {
            setSelecteds([...selecteds, id]);
        }
    }

    function TransferOrder() {
        setDisable(true)
        axios.post(`${API_LINK}/shop/transfer-order-operator/${openTransfer?._id}/${openTransfer?.operator}`, {}, {
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

    function TransferSelecteds() {
        setDisable(true)
        axios.post(`${API_LINK}/shop/transfer-selected-orders-operator`, { list: selecteds, operator }, {
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
                setOpen(false);
                setSelecteds([]);
                setOperator('');
                setChecked(false);
            }
        }).catch(() => {
            setDisable(false)
            toast.error("Aloqani tekshirib qayta urunib ko'ring!");
        })
    }

    return (
        <div className="flex items-start justify-start flex-col w-full overflow-x-scroll">
            <div className="flex items-center justify-normal flex-col p-[5px] ">
                <div className="flex items-center justify-start w-full h-[70px] shadow-sm bg-white  border-b p-[0_10px] ">
                    <div className="flex items-center justify-center w-full">
                        <Input label="Qidiruv: ID, Nomi, Narxi, Raqam" variant="standard" color="red" icon={<BiSearch />} value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="flex items-center justify-between w-full h-[70px] shadow-sm bg-white  border-b p-[0_5px]">
                    <div className="flex items-center justify-between">
                        <div className="w-[50px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">
                            <Checkbox onChange={e => SelectAllOrders(e.target.checked)} />
                        </div>
                        <p className="w-[50px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">ID</p>
                        <p className="w-[140px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">RASMI</p>
                        <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">NOMI</p>
                        <p className="w-[150px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">NARXI</p>
                        <p className="w-[150px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">BUYURTMACHI</p>
                        <p className="w-[150px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">RAQAMI</p>
                        <p className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">ADMIN ID</p>
                        <p className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">ADMIN ISMI</p>
                        <div className="w-[60px] text-center border-l h-[70px] flex items-center justify-center text-[13px]">
                            <IconButton onClick={() => setOpen(true)} disabled={!selecteds?.filter(e => e !== undefined)[0]} className="rounded-full" color="red">
                                <BiTransfer />
                            </IconButton>
                        </div>
                    </div>
                </div>
                {!isLoad && <Spinner />}
                {isLoad && !orders[0] &&
                    <p>Buyurtmalar mavjud emas!</p>
                }
                {isLoad && orders[0] &&
                    orders?.filter(o => !search ? o : o?.id === +search || o?.title?.toLowerCase()?.includes(search?.toLowerCase()) || o?.name?.toLowerCase()?.includes(search?.toLowerCase()) || o?.admin?.toLowerCase()?.includes(search?.toLowerCase()) || o?.phone?.includes(search) || String(o?.price)?.includes(search)).map((o, i) => {
                        return (
                            <div key={i} className="flex items-center justify-between w-full h-[70px] shadow-sm bg-white  border-b p-[0_5px]">
                                <div className="flex items-center justify-between">
                                    <div className="w-[50px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">
                                        <Checkbox onChange={e => SelectOrder(o?._id, e.target.checked)} checked={selecteds?.includes(o?._id)} />
                                    </div>
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
                                    <div className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {o?.admin_id && <Chip color="red" value={o?.admin_id} className="rounded" />}
                                    </div>
                                    <p className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {o?.admin}
                                    </p>
                                    <p className="w-[60px] text-center border-l h-[70px] flex items-center justify-center text-[13px]">
                                        <IconButton onClick={() => setOpenTransfer({ _id: o?._id, id: o?.id, title: o?.title, operator: '' })} color="blue-gray" className="rounded-full w-[35px] h-[35px] text-[20px]">
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
                    <Select disabled={disable} label="Operator tanlang" variant="standard" value={openTransfer?.operator} onChange={e => setOpenTransfer({ ...openTransfer, operator: e })}>
                        {operators?.map((o, i) => {
                            return (
                                <Option value={o?.id} key={i}>{o?.name} | {o?.phone}</Option>
                            )
                        })}
                    </Select>
                </DialogBody>
                <DialogFooter className="flex items-center justify-between">
                    <Button color="red" className="rounded font-sans font-light" onClick={() => setOpenTransfer({ id: '', _id: '', title: '', operator: '' })}>Ortga</Button>
                    <Button disabled={disable} color="green" className="rounded font-sans font-light" onClick={TransferOrder}>Biriktirish</Button>
                </DialogFooter>
            </Dialog>

            <Dialog size="md" open={open}>
                <DialogHeader>
                    <p>Kuryerni tanlang!</p>
                </DialogHeader>
                <DialogBody>
                    <Select disabled={disable} label="Operator tanlang" variant="standard" value={operator} onChange={e => setOperator(e)}>
                        {operators?.map((o, i) => {
                            return (
                                <Option value={o?.id} key={i}>{o?.name} | {o?.phone}</Option>
                            )
                        })}
                    </Select>
                    <label className="flex items-center justify-start cursor-pointer">
                        <Checkbox checked={checked} onChange={e => setChecked(e.target.checked)} />
                        Qo'li qaltiroqlar uchun! Bosib qo'yingchi
                    </label>
                </DialogBody>
                <DialogFooter className="flex items-center justify-between">
                    <Button onClick={() => setOpen(false)} className="rounded" color="red">Ortga</Button>
                    <Button disabled={!checked || disable} onClick={TransferSelecteds} className="rounded" color="green">Yuborish</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default WaitingOrders;