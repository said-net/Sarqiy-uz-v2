import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Option, Select, Spinner, Textarea } from "@material-tailwind/react";
import { BiSearch } from "react-icons/bi";
import { setRefresh } from "../managers/refresh.manager";

function GetRejectedOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [search, setSearch] = useState('');
    const { refresh } = useSelector(e => e.refresh);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState({ id: '', _id: '', product: '', courier_comment: '', status: '', recontact: '' });
    const dp = useDispatch()
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/courier/get-rejected-orders`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, data } = res.data;
            setIsLoad(true);
            if (ok) {
                setOrders(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, [refresh]);
    function setStatus() {
        axios.post(`${API_LINK}/courier/set-status-order/${selected?._id}`, selected, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg)
            } else {
                toast.success(msg);
                setOpen(false);
                setSelected({ id: '', _id: '', product: '', courier_comment: '', status: '', recontact: '' })
                dp(setRefresh());
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }
    return (
        <div className="flex items-center justify-center w-full flex-col">
            {!isLoad &&
                <div className="flex items-center justify-center w-full h-[80vh]">
                    <Spinner />
                    <p>Kuting...</p>
                </div>
            }
            {isLoad && !orders[0] &&
                <div className="flex items-center justify-center w-full h-[80vh]">
                    <p>Pochtalar mavjud emas!</p>
                </div>
            }
            {isLoad && orders[0] &&
                <>
                    <div className="flex items-center justify-center w-full p-[10px] rounded bg-white shadow-sm">
                        <Input label="Qidiruv: ID, Raqam" variant="standard" onChange={e => setSearch(e.target.value)} value={search} icon={<BiSearch />} />
                    </div>
                    <div className="flex items-center justify-center flex-wrap w-full">
                        {
                            orders?.filter(o => !search ? o : o?.id === +search || o?.phone?.includes(search))?.map((o, i) => {
                                return (
                                    <div key={i} className="flex items-start justify-start flex-col w-[100%] sm:w-[300px] bg-white shadow-sm p-[10px] rounded m-[5px] relative">
                                        <p className="text-[14px]"><b>ID:</b> {o?.id} / <b>Sana:</b> {o?.created}</p>
                                        <p className="text-[14px]"><b>Mijoz:</b> {o?.name} | {o?.phone}</p>
                                        <p className="text-[14px]"><b>Manzili:</b> {o?.location}</p>
                                        <p className="text-[14px]"><b>Maxsulot:</b> {o?.product} | <b>{o?.count} ta</b></p>
                                        <p className="text-[14px]"><b>Izoh:</b> {o?.about}</p>
                                        <p className="text-[14px]"><b>Narxi:</b> {Number(o?.price)?.toLocaleString()} so'm</p>
                                        <p className="text-[14px]"><b>Kuryer puli:</b> {Number(o?.delivery_price)?.toLocaleString()} so'm</p>
                                        <p className="text-[14px]"><b>Operator:</b> {o?.operator_name} | {o?.operator_phone}</p>
                                        <p className="text-[14px]"><b>Kuryer izohi:</b> {o?.courier_comment}</p>
                                        <div className="flex mt-[20px] items-center justify-center bottom-[10px] w-full left-[0]">
                                            <Button onClick={() => setSelected({ id: o?.id, _id: o?._id, product: o?.product, courier_comment: o?.courier_comment, status: '', recontact: '' })} color="red" className="rounded w-[100%]">Taxrirlash</Button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </>
            }
            <Dialog open={selected?._id !== ''} size="md">
                <DialogHeader>
                    <p className="text-[15px]">#{selected?.id} / {selected?.product}</p>
                </DialogHeader>
                <DialogBody>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Select variant="standard" label="Statusni tanlang!" onChange={e => setSelected({ ...selected, status: e })} value={selected?.status}>
                            <Option value="reject">Bekor qilindi</Option>
                            <Option value="delivered">Yetkazildi</Option>
                            <Option value="wait">Keyin oladi</Option>
                        </Select>
                    </div>
                    {selected?.status === 'reject' &&
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Textarea variant="standard" label="Bekor qilish sababi(Izoh)" onChange={e => setSelected({ ...selected, courier_comment: e?.target?.value })} value={selected?.courier_comment} />
                        </div>
                    }
                    {selected?.status === 'wait' &&
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input label="Qayta aloqa sanasi" variant="standard" type="date" onChange={e => setSelected({ ...selected, recontact: e?.target?.value })} value={selected?.recontact} />
                        </div>
                    }
                </DialogBody>
                <DialogFooter className="flex items-center justify-between w-full">
                    <Button onClick={() => setSelected({ id: '', _id: '', product: '', courier_comment: '', status: '', recontact: '' })} className="rounded" color="red">Ortga</Button>
                    <Button className="rounded" color="green" disabled={!selected?.status} onClick={() => setOpen(true)}>Saqlash</Button>
                </DialogFooter>
            </Dialog>
            {/*  */}
            <Dialog open={open} size="md">
                <DialogHeader>
                    <p>DIQQAT</p>
                </DialogHeader>
                <DialogBody>
                    <p className="font-bold">#{selected?.id} / {selected?.product} - buyurtma uchun o'zgarish saqlansinmi?</p>
                </DialogBody>
                <DialogFooter className="flex items-center justify-between w-full">
                    <Button onClick={() => setOpen(false)} className="rounded" color="red">Ortga</Button>
                    <Button className="rounded" color="green" disabled={!selected?.status} onClick={setStatus}>Saqlash</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default GetRejectedOrders;