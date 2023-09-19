import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Button, Checkbox, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Option, Select, Spinner } from "@material-tailwind/react";
import Regions from '../components/regions.json'
import { BiSearch } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { setRefresh } from "../managers/refresh.manager";

function GetWaitDeliveries() {
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [region, setRegion] = useState('');
    const [couriers, setCouriers] = useState([]);
    const [search, setSearch] = useState('');
    const [type, setType] = useState('id')
    const [selecteds, setSelecteds] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalDeliveryPrice, setTotalDeliveryPrice] = useState(0);
    const [open, setOpen] = useState(false);
    const [courier, setCourier] = useState('');
    const [checked, setChecked] = useState(false);
    const [disable, setDisable] = useState(false);
    const dp = useDispatch();
    const { refresh } = useSelector(e => e.refresh)
    useEffect(() => {
        let p = 0;
        let dp = 0;
        orders?.filter(e => e?.region === +region)?.forEach((o) => {
            p += o?.price
            dp += o?.delivery_price
        });
        setTotalPrice(p);
        setTotalDeliveryPrice(dp);
    }, [region]);

    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/boss/get-wait-delivery`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            setIsLoad(true)
            const { data, ok, msg, couriers } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                setOrders(data);
                setCouriers(couriers);
            }
        }).catch(() => {
            setIsLoad(true)
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, [refresh]);

    function SelectAllOrders(checked) {
        if (checked && region) {
            const arr = [];
            orders?.filter(e => e.region === +region)?.forEach(o => {
                arr.push(o?._id)
            })
            setSelecteds(arr);
        } else if (!checked && region) {
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
    function Submit() {
        setDisable(true)
        axios.post(`${API_LINK}/boss/set-courier`, { list: selecteds, courier }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            setDisable(false);
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                dp(setRefresh());
                setOpen(false);
            }
        }).catch(() => {
            setDisable(false);
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }
    return (
        <div className="flex items-start justify-start w-full mt-[50px] md:mt-0">
            {!isLoad && <Spinner />}
            {isLoad && !orders[0] && <p>Buyurtmalar mavjud emas</p>}
            {isLoad && orders[0] &&
                <div className="flex items-center justify-start flex-col w-[29cm] p-[10px] bg-white rounded mt-[10px] shadow-sm">
                    <div className="flex items-center justify-between w-full border-b pb-[10px]">
                        <div className="flex items-center justify-center w-[250px]">
                            <Select label="Hududni tanlang" variant="standard" onChange={e => setRegion(e)} value={region}>
                                {Regions?.map((r, i) => {
                                    return (
                                        <Option key={i} value={`${r?.id}`}>{r?.name}</Option>
                                    )
                                })}
                            </Select>
                        </div>
                        {/*  */}
                        <div className="flex items-center justify-center w-[250px]">
                            <Input label="Qidiruv: ID, Raqam" onChange={e => setSearch(e.target.value)} value={search} variant="standard" icon={<BiSearch />} />
                        </div>
                        <div className="flex items-center justify-center w-[250px]">
                            <Select value={type} variant="standard" onChange={e => setType(e)} label="Filter">
                                <Option key={1} value="id">ID Orqali</Option>
                                <Option key={2} value="phone">Raqam Orqali</Option>
                            </Select>
                        </div>
                        {/*  */}
                        <div className="flex items-center justify-center w-[250px]">
                            <Button onClick={() => setOpen(true)} disabled={!selecteds?.filter(e => e !== undefined)[0]} className="rounded" color="red">DOSTAVKAGA</Button>
                        </div>
                    </div>
                    <div className="flex items-start justify-start w-full h-[50px] border border-black ">
                        <div className="w-[50px] h-[50px] flex items-center justify-center ">
                            <Checkbox disabled={!region} onChange={e => SelectAllOrders(e.target.checked)} />
                        </div>
                        <p className="text-[12px] w-[80px] h-[50px] flex items-center justify-center border-x border-black">
                            ID
                        </p>
                        <p className="text-[12px] w-[150px] h-[50px] flex items-center justify-center border-r border-black">
                            YUBORUVCHI
                        </p>
                        <p className="text-[12px] w-[150px] h-[50px] flex items-center justify-center border-r border-black">
                            MIJOZ
                        </p>
                        <p className="text-[12px] w-[150px] h-[50px] flex items-center justify-center border-r border-black">
                            MANZIL
                        </p>
                        <p className="text-[12px] w-[180px] h-[50px] flex items-center justify-center border-r border-black">
                            MAXSULOT
                        </p>
                        <p className="text-[12px] w-[180px] h-[50px] flex items-center justify-center border-r border-black">
                            IZOH
                        </p>
                        <p className="text-[12px] w-[200px] h-[50px] flex items-center justify-center ">
                            SUMMA
                        </p>
                    </div>
                    {orders?.filter(e => !region ? e : e?.region === +region).filter(e => !search ? e : type === 'id' ? e?.id === +search : e?.phone?.includes(search))?.map((c, i) => {
                        return (
                            <div key={i} className="flex items-start justify-start w-full h-[100px] border-b border-l border-r border-black ">
                                <div className="w-[50px] h-[100px] flex items-center justify-center ">
                                    <Checkbox onChange={e => SelectOrder(c?._id, e.target.checked)} checked={selecteds?.includes(c?._id)} />
                                </div>
                                <p className="text-[12px] w-[80px] h-[100px] flex items-center justify-center border-x border-black">
                                    {c?.id}
                                </p>
                                <p className="text-[12px] w-[150px] h-[100px] flex items-center justify-center border-r border-black flex-col">
                                    Sharqiy.uz
                                    <span>+998938003800</span>
                                </p>
                                <div className="text-[12px] w-[150px] h-[100px] flex items-center justify-center border-r border-black flex-col">
                                    <p>{c?.name}</p>
                                    <p>{c?.phone}</p>
                                </div>
                                <p className="text-[12px] w-[150px] h-[100px] flex items-center justify-center border-r text-center border-black ">
                                    {c?.location}
                                </p>
                                <p className="text-[12px] w-[180px] h-[100px] flex items-center justify-center border-r border-black  text-center flex-col">
                                    {c?.title}
                                    <span>Soni: {c?.count} ta</span>
                                </p>
                                <p className="text-[12px] w-[180px] h-[100px] flex items-center justify-center border-r border-black  text-center">
                                    {c?.about}
                                </p>
                                <div className="text-[12px] w-[200px] h-[100px] flex items-center justify-center flex-col  text-center">
                                    <p>Maxsulotga: {Number(c?.price).toLocaleString()} so'm</p>
                                    <p>Dostavkaga: {Number(c?.delivery_price).toLocaleString()} so'm</p>
                                    <p>Umumiy qiymat: {Number(c?.delivery_price + c?.price).toLocaleString()} so'm</p>
                                </div>
                            </div>
                        )
                    })}
                    <div className="flex items-start justify-center w-full flex-col h-[50px] bg-white p-[10px] rounded-b">
                        <p className="text-[12px]">Dostavka uchun umumiy: {Number(totalDeliveryPrice).toLocaleString()} so'm</p>
                        <p className="text-[12px]">Umumiy narx: {Number(totalPrice).toLocaleString()} so'm</p>
                    </div>
                </div>
            }
            <Dialog size="md" open={open}>
                <DialogHeader>
                    <p>Kuryerni tanlang!</p>
                </DialogHeader>
                <DialogBody>
                    <Select variant="standard" onChange={e => setCourier(e)} label="Kuryerni tanlang" value={courier}>
                        {couriers?.map((c, i) => {
                            return (
                                <Option key={i} value={`${c?._id}`} >{c?.name} | {Regions?.find(e => e?.id === c?.region).name}</Option>
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
                    <Button disabled={!checked || disable} onClick={Submit} className="rounded" color="green">Yuborish</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default GetWaitDeliveries;