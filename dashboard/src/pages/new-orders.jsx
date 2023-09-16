import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Spinner, Input, Chip, IconButton, Dialog, DialogHeader } from "@material-tailwind/react";
import { BiSearch, BiTransfer } from "react-icons/bi";

function NewOrders() {
    const [oerators, setOperators] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e.refresh);
    const [search, setSearch] = useState('');
    const [openTransfer, setOpenTransfer] = useState({id: '',});
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/shop/get-new-orders`, {
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
    return (
        <div className="flex items-start justify-start flex-col w-full overflow-x-scroll">
            <div className="flex items-center justify-center w-full h-[50px] mb-[20px]">
                <h1 className="flex items-center justify-center w-[150px] h-[50px] bg-white shadow-sm rounded-b-[10px]">BUYURTMALAR</h1>
            </div>
            <div className="flex items-center justify-normal flex-col p-[5px] ">
                <div className="flex items-center justify-start w-full h-[70px] shadow-sm bg-white  border-b p-[0_10px] ">
                    <div className="flex items-center justify-center w-full">
                        <Input label="Qidiruv: ID, Nomi, Narxi, Raqam" variant="standard" color="red" icon={<BiSearch />} value={search} onChange={e => setSearch(e.target.value)} />
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
                        <p className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">ADMIN ID</p>
                        <p className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">ADMIN ISMI</p>
                        <p className="w-[60px] text-center border-l h-[70px] flex items-center justify-center text-[13px]">MENU</p>
                    </div>
                </div>
                {!isLoad && <Spinner />}
                {isLoad && !orders[0] &&
                    <p>Buyurtmalar mavjud emas!</p>
                }
                {isLoad && orders[0] &&
                    orders?.map((o, i) => {
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
                                    <div className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {o?.admin_id && <Chip color="red" value={o?.admin_id} className="rounded" />}
                                    </div>
                                    <p className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {o?.admin}
                                    </p>
                                    <p className="w-[60px] text-center border-l h-[70px] flex items-center justify-center text-[13px]">
                                        <IconButton color="blue-gray" className="rounded-full w-[35px] h-[35px] text-[20px]">
                                            <BiTransfer />
                                        </IconButton>
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <Dialog size="xs" open={openTransfer?.id !==''}>
                <DialogHeader>

                </DialogHeader>
            </Dialog>
        </div>
    );
}

export default NewOrders;