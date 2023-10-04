import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Button, Checkbox, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Option, Select, Spinner, Textarea } from "@material-tailwind/react";
import { BiBox, BiHistory, BiLocationPlus, BiMoney, BiPencil, BiQuestionMark, BiSearch, BiUser } from 'react-icons/bi';
import Regions from '../components/regions.json';
import { useDispatch, useSelector } from "react-redux";
import { setRefresh } from "../managers/refresh.manager";
function GetHistoryOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const dp = useDispatch();
    const { refresh } = useSelector(e => e.refresh)
    const [edit, setEdit] = useState({ _id: '', name: '', title: '', region: '', city: '', about: '', status: '', recontact: '', delivery_price: '', price: '', count: 1, current_price: '', });
    const [checked, setChecked] = useState(false);
    const [search, setSearch] = useState('');
    const [type, setType] = useState('id');
    function Close() {
        setEdit({ _id: '', title: '', region: '', city: '', about: '', status: '', recontact: '', delivery_price: '', price: '', count: 1, current_price: '', })
    }
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/operator/get-history-my-orders`, {
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
        axios.put(`${API_LINK}/operator/edit-order/${edit?._id}`, edit, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setEdit({ _id: '', name: '', title: '', region: '', city: '', about: '', status: '', recontact: '', delivery_price: '', price: '', count: 1, current_price: '', });
                dp(setRefresh());
            }
        })
    }
    return (
        <div className="flex items-start justify-center flex-wrap w-full">
            <div className="flex items-center justify-start flex-col w-full bg-white p-[10px]">
                <div className="flex items-center justify-center w-full mb-[10px]">
                    <Input label="ID, Raqam" variant="standard" onChange={e => setSearch(e?.target?.value)} value={search} icon={<BiSearch />} />
                </div>
                <div className="flex items-center justify-center w-full">
                    <Select label="Filter" variant="standard" onChange={(e) => setType(e)} value={type}>
                        <Option value="id">ID Orqali</Option>
                        <Option value="phone">Raqam Orqali</Option>
                    </Select>
                </div>
            </div>
            {!isLoad && <div className="flex items-center justify-center w-full h-[100vh]">
                <Spinner />
                <p>Kuting...</p>
            </div>}
            {isLoad && !orders[0] && <div className="flex items-center justify-center w-full h-[100vh]">
                <p>Buyurtmalar mavjud emas!</p>
            </div>}
            {isLoad && orders[0] &&
                orders?.filter(o => !search ? o : type === 'id' ? o?.id === +search : o?.phone?.includes(search))?.map((o, i) => {
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
                            <p className="text-[15px]"><b>Izoh:</b> <span className="p-[0_5px] text-red-500 rounded">{o?.about}</span></p>
                            {/*  */}
                            <p className="text-[15px]"><b>Kuryer izohi:</b> <span className="p-[0_5px] text-red-500 rounded">{o?.courier_comment}</span></p>
                            {/*  */}
                            <p className="text-[15px]"><b>Holat:</b> <span className={`${o?.status_color} p-[0_5px] rounded text-white`}>{o?.status_title}</span></p>
                            <div className="flex items-center justify-between w-full mt-[10px]">
                                <Button disabled={!o?.edit} color="red" className="rounded w-[200px]" onClick={() => o?.edit && setEdit({ ...edit, _id: o?._id, name: o?.name, title: o?.product, price: o?.price, region: o?.region, city: o?.city, delivery_price: o?.delivery_price, status: o?.status, about: o?.about })}>Taxrirlash</Button>
                            </div>
                        </div>
                    )
                })
            }
            {/* EDIT */}
            <Dialog size="xxl" open={edit?._id !== ''} className="flex items-center justify-center flex-col bg-[#0b091c86] backdrop-blur-sm">
                <div className="flex items-center justify-start flex-col w-[90%] sm:w-[500px] bg-white p-[10px] max-h-[600px] rounded ">
                    <DialogHeader className="w-full">
                        Taxrirlash
                    </DialogHeader>
                    <DialogBody className="w-full h-[450px] overflow-y-scroll border-y ">
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Select label="Buyurtma holatini tanlang!" variant="standard" onChange={(e) => setEdit({ ...edit, status: e })} value={edit?.status}>
                                <Option value="archive">Arxiv</Option>
                                <Option value="success">Dostavkaga</Option>
                                <Option value="wait">Qayta aloqa</Option>
                                <Option value="spam">Spam</Option>
                                <Option value="copy">Kopiya</Option>
                            </Select>
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input variant="standard" label="Mijoz" required onChange={e => setEdit({ ...edit, name: e.target.value })} value={edit?.name} icon={<BiUser />} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Textarea variant="standard" label="Izoh" required onChange={e => setEdit({ ...edit, about: e.target.value })} value={edit?.about} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input variant="standard" label="Maxsulot" required defaultValue={edit?.title} icon={<BiBox />} />
                        </div>
                        <div className="flex items-center justify-center w-full mb-[10px]">
                            <Input variant="standard" label="Maxsulot soni(Raqamda)" required type="number" onChange={e => setEdit({ ...edit, count: e.target.value })} value={edit?.count} icon={<BiQuestionMark />} />
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
                            <Select value={edit?.delivery_price} variant="standard" label="Dostavkaga" onChange={e => setEdit({ ...edit, delivery_price: e })}>
                                <Option value="0">0 so'm</Option>
                                <Option value="25000">25 000 so'm</Option>
                                <Option value="30000">30 000 so'm</Option>
                                <Option value="35000">35 000 so'm</Option>
                            </Select>
                        </div>
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
            {/* HISTORY */}
        </div>
    );
}

export default GetHistoryOrders;