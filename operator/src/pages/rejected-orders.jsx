import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Button, Checkbox, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Option, Select, Spinner, Textarea } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { setRefresh } from "../managers/refresh.manager";
import { BiNews, BiTransfer, BiUser } from "react-icons/bi";
function RejectedOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const dp = useDispatch();
    const { refresh } = useSelector(e => e.refresh)
    const [edit, setEdit] = useState({ _id: '', status: '', about: '', name: '', on_base: false, });
    const [checked, setChecked] = useState(false);

    function Close() {
        setEdit({ _id: '', status: '', about: '', on_base: false, })
    }
    // 
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/operator/get-rejected-orders`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            setIsLoad(true);
            const { data, ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                setOrders(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urinib ko'ring!")
        })
    }, [refresh]);
    // 
    function Submit() {
        axios.post(`${API_LINK}/operator/set-status/${edit?._id}`, edit, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setEdit({ _id: '', status: '', about: '', name: '', on_base: false });
                dp(setRefresh());
            }
        })
    }
    // 
    const [newId, setNewId] = useState({ orderId: '', newId: '' });
    // 
    function Transfer() {
        axios.post(`${API_LINK}/operator/set-new-order/`, newId, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setNewId({ orderId: '', newId: '' })
                dp(setRefresh());
            }
        });
    }
    return (
        <div className="flex items-start justify-center flex-wrap w-full">
            {!isLoad && <div className="flex items-center justify-center w-full h-[100vh]">
                <Spinner />
                <p>Kuting...</p>
            </div>}
            {isLoad && !orders[0] && <div className="flex items-center justify-center w-full h-[100vh]">
                <p>Buyurtmalar mavjud emas!</p>
            </div>}
            {isLoad && orders[0] &&
                orders?.map((o, i) => {
                    return (
                        <div key={i} className="flex items-start justify-start flex-col w-[90%] sm:w-[300px] m-[5px] overflow-hidden p-[10px] bg-white shadow-sm hover:shadow-md rounded">
                            <div className="flex items-center justify-between w-full">
                                <Button className="rounded p-[5px_10px]" color={o?.on_base ? 'red' : 'green'}>
                                    {o?.on_base ? "Bazada" : "Kuryerda"}
                                </Button>
                                {!o?.on_base && <IconButton onClick={() => setNewId({ newId: '', orderId: String(o?.id) })} className="w-[30px] h-[30px] rounded-full text-[18px]" color="red">
                                    <BiTransfer />
                                </IconButton>}
                            </div>
                            {/*  */}
                            <p className="text-[15px]"><b>#id:</b> {o?.id} /<b>Sana:</b>  {o?.created}</p>
                            {/*  */}
                            <p className="text-[15px]"><b>Mijoz:</b> {o?.name}</p>
                            {/*  */}
                            <p className="text-[15px]"><b>Raqami:</b> <a className="underline text-blue-500" href={`tel:${o?.phone}`}>{o?.phone}</a></p>
                            {/*  */}
                            <p className="text-[15px]"><b>Manzili:</b> {o?.location}</p>
                            {/*  */}
                            <p className="text-[15px]"><b>Maxsulot:</b> <a className="underline text-blue-500" href={`https://sharqiy.uz/product/${o?.product_id}`}>{o?.product}</a></p>
                            {/*  */}
                            <p className="text-[15px]"><b>Soni:</b> {o?.count}</p>
                            {/*  */}
                            <p className="text-[15px]"><b>Narxi:</b> {Number(o?.price)?.toLocaleString()} so'm</p>
                            {/*  */}
                            <p className="text-[15px]"><b>Operator:</b> <span>{o?.operator_name} | {o?.operator_phone}</span></p>
                            {/*  */}
                            <p className="text-[15px]"><b>Izoh:</b> <span className="text-green-500">{o?.about}</span></p>
                            <p className="text-[15px]"><b>Kuryer:</b> <span>{o?.courier_name} | {o?.courier_phone}</span></p>
                            {/*  */}
                            <p className="text-[15px]"><b>Kuryer izohi:</b> <span className="text-red-500">{o?.courier_comment}</span></p>
                            {/*  */}
                            <p className="text-[15px]"><b>Yangilanish:</b> <span >{o?.up_time}</span></p>
                            {/*  */}
                            <Button color="red" fullWidth className="rounded" onClick={() => setEdit({ ...edit, _id: o?._id, name: o?.name, on_base: o?.on_base })}>Taxrirlash</Button>
                        </div>
                    )
                })
            }
            {/*  */}
            <Dialog size="xxl" open={edit?._id !== ''} className="flex items-center justify-center flex-col bg-[#0b091c86] backdrop-blur-sm">
                <div className="flex items-center justify-start flex-col w-[90%] sm:w-[500px] bg-white p-[10px] rounded ">
                    <DialogHeader className="w-full">
                        Taxrirlash
                    </DialogHeader>
                    <DialogBody className="w-full overflow-y-scroll border-y ">
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Select label="Buyurtma holatini tanlang!" variant="standard" onChange={(e) => setEdit({ ...edit, status: e })} value={edit?.status}>
                                <Option value="archive">Arxiv</Option>
                                <Option value={`${edit?.on_base ? 'to_delivery' : 'sended'}`}>Dostavkaga</Option>
                            </Select>
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input variant="standard" label="Mijoz" required onChange={e => setEdit({ ...edit, name: e.target.value })} value={edit?.name} icon={<BiUser />} />
                        </div>
                        <div className="flex items-center justify-center w-full">
                            <Textarea variant="standard" label="Izoh" required onChange={e => setEdit({ ...edit, about: e.target.value })} value={edit?.about} />
                        </div>
                        <div className="flex items-center justify-start w-full mb-[10px]">
                            <Checkbox checked={checked} onChange={e => setChecked(e?.target?.checked)} label={"Harqanday holatda saqlash"} />
                        </div>
                    </DialogBody>
                    <DialogFooter className="flex items-center justify-between w-full">
                        <Button className="rounded" onClick={Close} color="red">Ortga</Button>
                        <Button className="rounded" disabled={!checked || !edit?.about} color="green" onClick={Submit}>Saqlash</Button>
                    </DialogFooter>
                </div>
            </Dialog>
            {/*  */}
            <Dialog size="md" open={newId?.orderId !== ''}>
                <DialogHeader>
                    <p className="text-[16px]">Yangi ID biriktirish</p>
                </DialogHeader>
                <DialogBody>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input label="Order ID" value={newId?.orderId} variant="standard" color="red" icon={<BiNews />} />
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Input label="Yangi ID" value={newId?.newId} variant="standard" color="red" type="number" onChange={(e => setNewId({ ...newId, newId: e?.target?.value?.trim() }))} icon={<BiNews />} />
                    </div>
                </DialogBody>
                <DialogFooter className="flex items-center justify-between">
                    {/*  */}
                    <Button className="rounded" color="orange" onClick={() => setNewId({ newId: '', orderId: '' })}>Ortga</Button>
                    {/*  */}
                    <Button className="rounded" color="green" disabled={!newId?.orderId || !newId?.newId} onClick={Transfer}>Saqlash</Button>
                    {/*  */}
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default RejectedOrders;