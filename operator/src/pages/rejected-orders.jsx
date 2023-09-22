import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Button, Checkbox, Dialog, DialogBody, DialogFooter, DialogHeader, Spinner, Textarea } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { setRefresh } from "../managers/refresh.manager";
function RejectedOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const dp = useDispatch();
    const { refresh } = useSelector(e => e.refresh)
    const [edit, setEdit] = useState({ _id: '', status: 'archive', about: '' });
    const [checked, setChecked] = useState(false);
    function Close() {
        setEdit({ _id: '', status: 'archive', about: '' })
    }
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
                setEdit({ _id: '', status: 'archive', about: '' });
                dp(setRefresh());
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
                            <p className="text-[15px]"><b>Izoh:</b> <span>{o?.about}</span></p>
                            <p className="text-[15px]"><b>Kuryer:</b> <span>{o?.courier_name} | {o?.courier_phone}</span></p>
                            {/*  */}
                            <p className="text-[15px]"><b>Kuryer izohi:</b> <span className="text-red-500">{o?.courier_comment}</span></p>
                            {/*  */}
                            <p className="text-[15px]"><b>Yangilanish:</b> <span >{o?.up_time}</span></p>
                            {/*  */}
                            <Button color="red" fullWidth className="rounded" onClick={() => setEdit({ ...edit, _id: o?._id })}>Taxrirlash</Button>
                        </div>
                    )
                })
            }
            <Dialog size="xxl" open={edit?._id !== ''} className="flex items-center justify-center flex-col bg-[#0b091c86] backdrop-blur-sm">
                <div className="flex items-center justify-start flex-col w-[90%] sm:w-[500px] bg-white p-[10px] rounded ">
                    <DialogHeader className="w-full">
                        Taxrirlash
                    </DialogHeader>
                    <DialogBody className="w-full overflow-y-scroll border-y ">
                        <div className="flex items-center justify-center w-full">
                            <Textarea variant="standard" label="Izoh" required onChange={e => setEdit({ ...edit, about: e.target.value })} value={edit?.about} />
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
        </div>
    );
}

export default RejectedOrders;