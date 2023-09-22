import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Button, Input, Option, Select, Spinner } from "@material-tailwind/react";
import { BiSearch } from "react-icons/bi";
function SearchOrder() {
    const [orders, setOrders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    // const [refresh, setRefresh] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('id');
    const [searched, setSearched] = useState(false);
    useEffect(() => {
        if (search !== '') {
            setIsLoad(false);
            setSearched(true);
            axios(`${API_LINK}/operator/search-base/${search}`, {
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
                setSearched(true);
                toast.error("Aloqani tekshirib qayta urinib ko'ring!")
            })
        } else {
            setSearched(false)
        }
    }, [refresh]);

    useEffect(() => {
        if (!search) {
            setSearched(false)
        }
    }, [search])
    return (
        <div className="flex items-start justify-center flex-wrap w-full">
            <div className="flex items-center justify-center w-full mb-[10px]">
                <div className="flex items-center justify-center w-full bg-white p-[5px_10px] rounded shadow-sm flex-col">
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input label="Qidiruv: ID, Raqam" variant="standard" onChange={e => setSearch(e.target.value)} value={search} icon={<BiSearch />} />
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Select label="Filterlash" variant="standard" onChange={e => setFilter(e)} value={filter}>
                            <Option value="id">ID orqali</Option>
                            <Option value="phone">Raqam orqali</Option>
                        </Select>
                    </div>
                    <Button className="w-full rounded" color="red" disabled={!search} onClick={() => setRefresh(!refresh)}>Qidirish</Button>
                </div>
            </div>
            {!isLoad && search && searched && <div className="flex items-center justify-center w-full h-[100vh]">
                <Spinner />
                <p>Kuting...</p>
            </div>}
            {isLoad && search && searched && !orders[0] && <div className="flex items-center justify-center w-full h-[100vh]">
                <p>Buyurtmalar mavjud emas!</p>
            </div>}
            {isLoad && search && searched && orders[0] &&
                orders?.filter(o => filter === 'id' ? +search === o?.id : o?.phone?.includes(search))?.map((o, i) => {
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
                            <p className="text-[15px]"><b>Operator:</b> {o?.operator}</p>
                            {/*  */}
                            <p className="text-[15px]"><b>Izoh:</b> <span className="p-[0_5px] bg-red-500 text-white rounded">{o?.about}</span></p>
                            {/*  */}
                            <p className="text-[15px]"><b>Kuryer:</b> {o?.courier}</p>
                            {/*  */}
                            <p className="text-[15px]"><b>Kuryer izohi:</b> {o?.courier_comment}</p>
                            {/*  */}
                            <p className="text-[15px]"><b>Qayta aloqa:</b> {o?.recontact}</p>
                            {/*  */}
                            <p className="text-[15px]"><b>Holat:</b> {o?.status}</p>
                            {/*  */}
                            {/* <p className="text-[15px]"><b>Qayta aloqa:</b> {o?.recontact}</p> */}
                        </div>
                    )
                })
            }
        </div>
    );
}

export default SearchOrder;