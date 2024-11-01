import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Spinner, Input, Chip, IconButton, Dialog, DialogHeader, DialogBody, Select, Option, DialogFooter, Button, Checkbox } from "@material-tailwind/react";
import { BiSearch, BiTransfer } from "react-icons/bi";
import { setRefresh } from "../managers/refresh.manager";
import Regions from '../components/regions.json'
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
function HistoryOrders() {
    const [operators, setOperators] = useState([]);
    const [operator, setOperator] = useState('');
    const [couriers, setCouriers] = useState([]);
    const [courier, setCourier] = useState('');
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e.refresh);
    const [search, setSearch] = useState('');
    const [openTransfer, setOpenTransfer] = useState({ id: '', _id: '', title: '', operator: '', courier: '' });
    const [disable, setDisable] = useState(false);
    const dp = useDispatch();
    const [selecteds, setSelecteds] = useState([]);
    const [checked, setChecked] = useState(false);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [type, setType] = useState('id');

    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/boss/get-history-orders/${page}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            setIsLoad(true)
            const { data, ok, msg, operators, couriers } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                setOrders(data)
                setOperators(operators)
                setCouriers(couriers)
            }
        }).catch(() => {
            setIsLoad(true)
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, [refresh] && [page]);

    useEffect(() => {
        setSelecteds([]);
    }, [courier]);

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
        axios.post(`${API_LINK}/shop/transfer-history-order/${openTransfer?._id}/${openTransfer?.operator}/${openTransfer?.courier}`, {}, {
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
                setOpenTransfer({ id: '', _id: '', title: '', operator: '', courier: '' });
            }
        }).catch(() => {
            setDisable(false)
            toast.error("Aloqani tekshirib qayta urunib ko'ring!");
        })
    }

    function TransferSelecteds() {
        setDisable(true)
        axios.post(`${API_LINK}/shop/transfer-history-selected-orders`, { list: selecteds, operator, courier }, {
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
            <div className="flex items-center justify-center w-full h-[50px] mb-[20px]">
                <h1 className="flex items-center justify-center w-[170px] h-[50px] bg-white shadow-sm rounded-b-[10px]">SOTUVLAR TARIXI</h1>
            </div>
            <div className="flex items-center justify-normal flex-col">
                <div className="flex items-center justify-start w-full h-[140px]  shadow-sm bg-white  border-b p-[10px] flex-col">
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input label="Qidiruv: ID, Nomi, Narxi, Raqam" variant="standard" color="red" icon={<BiSearch />} value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Select label="Filterlash" variant="standard" onChange={e => setType(e)} value={type}>
                            <Option value="id">ID orqali</Option>
                            <Option value="phone">Raqam orqali</Option>
                        </Select>
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
                        <p className="w-[150px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">STATUS</p>
                        <p className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">ADMIN ID</p>
                        <p className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">ADMIN ISMI</p>
                        <p className="w-[120px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">OPERATOR</p>
                        <p className="w-[120px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">OPER RAQAMI</p>
                        <p className="w-[120px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">KURYER</p>
                        <p className="w-[120px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">KURYER RAQAMI</p>

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
                    orders?.filter(o => !search ? o : type === 'id' ? o?.id === +search : o?.phone?.includes(search)).map((o, i) => {
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
                                    <p className="w-[150px] text-center border-x h-[70px] flex items-center justify-center text-[13px]" >
                                        <span className={"p-[5px_10px] text-white rounded w-[120px] "+o?.status_color}>
                                            {o?.status_title}
                                        </span>
                                    </p>
                                    <div className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {o?.admin_id && <Chip color="red" value={o?.admin_id} className="rounded" />}
                                    </div>
                                    <p className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {o?.admin}
                                    </p>
                                    <p className="w-[120px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {o?.operator}
                                    </p>
                                    <p className="w-[120px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {o?.operator_phone}
                                    </p>
                                    <p className="w-[120px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {o?.courier}
                                    </p>
                                    <p className="w-[120px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {o?.courier_phone}
                                    </p>
                                    <p className="w-[60px] text-center border-l h-[70px] flex items-center justify-center text-[13px]">
                                        <IconButton onClick={() => setOpenTransfer({ _id: o?._id, id: o?.id, title: o?.title, operator: o?.operator_id, courier: o?.courier_id })} color="blue-gray" className="rounded-full w-[35px] h-[35px] text-[20px]">
                                            <BiTransfer />
                                        </IconButton>
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }
                <div className="flex items-center w-full justify-start mt-[10px] p-[10px]">
                    <IconButton onClick={() => setPage(page - 1)} className="rounded-full" disabled={page < 2}>
                        <FaArrowLeft />
                    </IconButton>
                    <IconButton className="rounded-full mx-[10px]">
                        {page}
                    </IconButton>
                    <IconButton onClick={() => setPage(page + 1)} className="rounded-full" disabled={orders?.length !== 50}>
                        <FaArrowRight />
                    </IconButton>
                </div>
            </div>
            <Dialog size="xs" open={openTransfer?._id !== ''}>
                <DialogHeader>
                    <p className="text-[16px]">#{openTransfer?.id} - {openTransfer?.title}</p>
                </DialogHeader>
                <DialogBody>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Select disabled={disable} label="Operator tanlang" variant="standard" value={openTransfer?.operator} onChange={e => setOpenTransfer({ ...openTransfer, operator: e })}>
                            {operators?.map((o, i) => {
                                return (
                                    <Option value={o?.id} key={i}>{o?.name} | {o?.phone}</Option>
                                )
                            })}
                        </Select>
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Select disabled={disable} label="Kuryer tanlang" variant="standard" value={openTransfer?.courier} onChange={e => setOpenTransfer({ ...openTransfer, courier: e })}>
                            {couriers?.map((o, i) => {
                                return (
                                    <Option value={o?.id} key={i}>{o?.name} | {o?.phone} | {Regions?.find(r => r?.id === o?.region).name}</Option>
                                )
                            })}
                        </Select>
                    </div>
                </DialogBody>
                <DialogFooter className="flex items-center justify-between">
                    <Button color="red" className="rounded font-sans font-light" onClick={() => setOpenTransfer({ id: '', _id: '', title: '', operator: '', courier: '' })}>Ortga</Button>
                    <Button disabled={disable} color="green" className="rounded font-sans font-light" onClick={TransferOrder}>Biriktirish</Button>
                </DialogFooter>
            </Dialog>
            {/*  */}
            <Dialog size="md" open={open}>
                <DialogHeader>
                    <p>Kuryer va Operator tanlang!</p>
                </DialogHeader>
                <DialogBody>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Select disabled={disable} label="Operator tanlang" variant="standard" value={operator} onChange={e => setOperator(e)}>
                            {operators?.map((o, i) => {
                                return (
                                    <Option value={o?.id} key={i}>{o?.name} | {o?.phone}</Option>
                                )
                            })}
                        </Select>
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Select disabled={disable} label="Kuryer tanlang" variant="standard" value={courier} onChange={e => setCourier(e)}>
                            {couriers?.map((o, i) => {
                                return (
                                    <Option value={o?.id} key={i}>{o?.name} | {o?.phone} | {Regions?.find(r => r?.id === o?.region).name}</Option>
                                )
                            })}
                        </Select>
                    </div>
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

export default HistoryOrders;