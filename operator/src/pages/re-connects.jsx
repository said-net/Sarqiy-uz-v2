import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Button, Checkbox, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Option, Select, Spinner } from "@material-tailwind/react";
import { BiBox, BiLocationPlus, BiMoney, BiPencil, BiQuestionMark, BiSolidTruck } from 'react-icons/bi';
import Regions from '../components/regions.json';
import { useDispatch, useSelector } from "react-redux";
import { setRefresh } from "../managers/refresh.manager";
function ReConnects() {
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const dp = useDispatch();
    const { refresh } = useSelector(e => e.refresh)
    const [edit, setEdit] = useState({ _id: '', title: '', region: '', city: '', about: '', status: '', recontact: '', delivery: '', price: '', count: 1, current_price: '', bonus_count: 0, bonus_given: 0, bonus_gived: 0, bonus: false });
    const [checked, setChecked] = useState(false);
    function Close() {
        setEdit({ _id: '', title: '', region: '', city: '', about: '', status: '', recontact: '', delivery: '', price: '', count: 1, current_price: '', bonus_count: 0, bonus_given: 0, bonus_gived: 0, bonus: false })
    }
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/operator/get-wait-orders`, {
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
                setEdit({ _id: '', title: '', region: '', city: '', about: '', status: '', recontact: '', delivery: '', price: '', count: 1, current_price: '', bonus_count: 0, bonus_given: 0, bonus_gived: 0, bonus: false });
                dp(setRefresh())
            }
        })
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
                            <p className="text-[15px]"><b>Izoh:</b> <span className="p-[0_5px] bg-red-500 text-white rounded">{o?.about}</span></p>
                            {/*  */}
                            <p className="text-[15px]"><b>Qayta aloqa:</b> {o?.recontact}</p>
                            <Button color="red" fullWidth className="rounded" onClick={() => setEdit({ ...edit, _id: o?._id, title: o?.product, price: o?.price, current_price: o?.price, bonus: o?.bonus, bonus_count: o?.bonus_count, bonus_given: o?.bonus_given, recontact: o?.recontact })}>Taxrirlash</Button>
                        </div>
                    )
                })
            }
            <Dialog size="xxl" open={edit?._id !== ''} className="flex items-center justify-center flex-col bg-[#0b091c86] backdrop-blur-sm">
                <div className="flex items-center justify-start flex-col w-[90%] sm:w-[500px] bg-white p-[10px] max-h-[600px] rounded ">
                    <DialogHeader className="w-full">
                        Taxrirlash
                    </DialogHeader>
                    <DialogBody className="w-full h-[450px] overflow-y-scroll border-y ">
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Select label="Buyurtma holatini tanlang!" variant="standard" onChange={(e) => setEdit({ ...edit, status: e })} value={edit?.status}>
                                <Option value="archive">Rad etildi</Option>
                                <Option value="success">Dostavkaga</Option>
                                <Option value="wait">Qayta aloqa</Option>
                                <Option value="spam">Spam</Option>
                            </Select>
                        </div>
                        {edit?.status === "archive" &&
                            <>
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input variant="standard" label="Izoh" required onChange={e => setEdit({ ...edit, about: e.target.value })} value={edit?.about} icon={<BiPencil />} />
                                </div>
                            </>
                        }
                        {edit?.status === "wait" &&
                            <>
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input variant="standard" label="Izoh" required onChange={e => setEdit({ ...edit, about: e.target.value })} value={edit?.about} icon={<BiPencil />} />
                                </div>
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input type="date" variant="standard" label="Eslatma sanasi" required onChange={e => { setEdit({ ...edit, recontact: e.target.value }) }} value={edit?.recontact} />
                                </div>
                            </>
                        }
                        {edit?.status === "success" &&
                            <>
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Textarea variant="standard" label="Izoh" required onChange={e => setEdit({ ...edit, about: e.target.value })} value={edit?.about} />
                                </div>
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input variant="standard" label="Maxsulot" required defaultValue={edit?.title} icon={<BiBox />} />
                                </div>
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input variant="standard" label="Maxsulot soni(Raqamda)" required type="number" onChange={e => setEdit({ ...edit, count: e.target.value, price: e.target.value * edit?.current_price, bonus_gived: edit?.bonus ? Math.floor(+e.target.value / edit?.bonus_count * edit?.bonus_given) : 0 })} value={edit?.count} icon={<BiQuestionMark />} />
                                </div>
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input variant="standard" label="Maxsulot narxi(Raqamda)" required type="number" onChange={e => setEdit({ ...edit, price: e.target.value })} value={edit?.price} icon={<BiMoney />} />
                                </div>
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Select value={edit?.region} variant="standard" label="Viloyatni tanlang" onChange={e => setEdit({ ...edit, region: e })}>
                                        {Regions?.map((e, i) => {
                                            return (
                                                <Option key={i} value={`${e?.id}`}>{e?.name}</Option>
                                            )
                                        })}
                                    </Select>
                                </div>
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input variant="standard" label="Tuman(Shaxar) haqida batafsil" required type="text" onChange={e => setEdit({ ...edit, city: e.target.value })} value={edit?.city} icon={<BiLocationPlus />} />
                                </div>
                                <div className="flex items-center justify-center w-full mb-[10px]">
                                    <Input variant="standard" label="Dostavka narxi(Raqamda)" required type="number" onChange={e => setEdit({ ...edit, delivery: e.target.value })} value={edit?.delivery} icon={<BiSolidTruck />} />
                                </div>
                            </>
                        }
                        <div className="flex items-center justify-start w-full mb-[10px]">
                            <Checkbox checked={checked} onChange={e => setChecked(e?.target?.checked)} label={"Harqanday holatda saqlash"} />
                        </div>
                    </DialogBody>
                    <DialogFooter className="flex items-center justify-between w-full">
                        <Button className="rounded" onClick={Close} color="red">Ortga</Button>
                        <Button className="rounded" disabled={!checked} color="green" onClick={Submit}>Saqlash</Button>
                    </DialogFooter>
                </div>
            </Dialog>
        </div>
    );
}

export default ReConnects;