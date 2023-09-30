import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Dialog, DialogBody, DialogHeader, IconButton, Input, Option, Select, Spinner, Textarea } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { FaMicrophone, FaX } from "react-icons/fa6";
import { FaPhone, FaSearch, FaUser } from "react-icons/fa";
import { BiRefresh } from 'react-icons/bi'
function AdminRequests() {
    const [isLoad, setIsLoad] = useState(false);
    const [state, setState] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [select, setSelect] = useState({ open: false });
    const [type, setType] = useState('all');
    const [search, setSearch] = useState('');
    useEffect(() => {
        setIsLoad(false);
        axios.get(`${API_LINK}/user/get-requests`, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, data } = res.data;
            setIsLoad(true);
            if (ok) {
                setState(data);
            }
        }).catch(err => {
            console.log(err);
            toast.error("Aloqani tekshirib qayta urunib ko'ring!");
        })
    }, [refresh]);
    // function setStatus() {
    //     axios.post(`${API_LINK}/user/set-status-my-sales`, {}, {
    //         headers: {
    //             'x-user-token': `Bearer ${localStorage.getItem('access')}`
    //         }
    //     }).then((res) => {
    //         const { ok, msg } = res.data;
    //         if (!ok) {
    //             toast.error(msg);
    //         } else {
    //             toast.success(msg);
    //             setRefresh(!refresh);
    //         }
    //     })
    // }
    function setStatusOne(id) {
        axios.post(`${API_LINK}/user/set-status-my-sale/${id}`, {}, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setRefresh(!refresh);
            }
        })
    }
    return (

        <div className="flex items-center justify-start flex-col p-[10px]">
            <div className="flex items-center justify-between w-full mb-[10px]">
                <Link to={`/dashboard`} className="w-full underline">Ortga</Link>
                {/* <Button className="rounded" onClick={setStatus}>Yangilarga o'tkazish</Button> */}
                <Select onChange={e => setType(e)} value={type} label="Saralash">
                    <Option value={'all'}>Barchasi</Option>
                    <Option value={'pending'}>Yangi</Option>
                    <Option value={'reject'}>Rad etilgan</Option>
                    <Option value={'archive'}>Arxivlangan</Option>
                    <Option value={'wait'}>Qayta qo'ng'iroq</Option>
                    <Option value={'success'}>Dostavkaga tayyor</Option>
                    <Option value={'sended'}>Yetkazilmoqda</Option>
                    <Option value={'delivered'}>Yetkazilgan</Option>
                </Select>
            </div>
            <div className="flex items-center justify-center w-full my-[10px] bg-white h-[60px] rounded shadow p-[0_10px]">
                <Input variant="standard" label="Qidiruv: ID" icon={<FaSearch />} onChange={e => setSearch(e.target.value)} />
            </div>
            {!isLoad && <Spinner />}
            {isLoad && !state[0] && <p>So'rov mavjud emas!</p>}
            {isLoad && state[0] &&
                <>
                    <div className="flex items-center justify-between w-full h-[50px] mb-[10px] border-b-[2px]">
                        <p className="text-[12px] w-[24%] text-center">ID</p>
                        <p className="text-[12px] w-[24%] text-center">Maxsulot</p>
                        <p className="text-[12px] w-[24%] text-center">Mijoz</p>
                        <p className="text-[12px] w-[24%] text-center">Holat</p>
                    </div>
                    {state?.filter(e => type === 'all' ? e : e?.status === type)?.map((e, i) => {
                        return (
                            !search ?
                                <div key={i} className="flex items-center justify-between w-full h-[50px] mb-[10px] border-b-[2px]">
                                    <p onClick={() => setSelect({ open: true, ...e })} className="text-[12px]  w-[24%] text-center">ID: {e?.id}</p>
                                    <p onClick={() => setSelect({ open: true, ...e })} className="text-[12px]  w-[24%] text-center">{e?.title?.slice(0, 10)}...</p>
                                    <p onClick={() => setSelect({ open: true, ...e })} className="text-[12px]  w-[24%] text-center">{e?.name}</p>
                                    {e?.status === 'pending' && <p onClick={() => setSelect({ open: true, ...e })} className="text-[12px] text-orange-500  w-[24%] text-center">Yangi</p>}
                                    {/*  */}
                                    {e?.status === 'copy' && <p onClick={() => setSelect({ open: true, ...e })} className="text-[12px] text-red-500  w-[24%] text-center">Kopiya</p>}
                                    {/*  */}
                                    {e?.status === 'reject' && <p onClick={() => setSelect({ open: true, ...e })} className="text-[12px] text-red-500  w-[24%] text-center">Rad etilgan</p>}
                                    {/*  */}
                                    {e?.status === 'wait' && <p className="text-[12px] text-orange-500  w-[24%] text-center relative">
                                        Qayta qo'ng'iroq
                                        <BiRefresh onClick={() => setStatusOne(e?.id)} className="absolute top-[-15px] text-[20px] right-0" />
                                    </p>}
                                    {/*  */}
                                    {e?.status === 'success' && <p onClick={() => setSelect({ open: true, ...e })} className="text-[12px] text-blue-500  w-[24%] text-center">Tayyor</p>}
                                    {/*  */}
                                    {e?.status === 'archive' && <p onClick={() => setSelect({ open: true, ...e })} className="text-[12px] text-orange-500 w-[24%] text-center">Arxivlandi</p>}
                                    {/*  */}
                                    {e?.status === 'sended' && <p onClick={() => setSelect({ open: true, ...e })} className="text-[12px] text-purple-500  w-[24%] text-center">Yetkazilmoqda</p>}
                                    {/*  */}
                                    {e?.status === 'delivered' && <p onClick={() => setSelect({ open: true, ...e })} className="text-[12px] text-green-500  w-[24%] text-center">Yetkazilgan</p>}
                                </div>
                                :
                                Number(search) === Number(e?.id) && <div onClick={() => setSelect({ open: true, ...e })} key={i} className="flex items-center justify-between w-full h-[50px] mb-[10px] border-b-[2px]">
                                    <p className="text-[12px]  w-[24%] text-center">ID: {e?.id}</p>
                                    <p className="text-[12px]  w-[24%] text-center">{e?.title?.slice(0, 10)}...</p>
                                    <p className="text-[12px]  w-[24%] text-center">{e?.name}</p>
                                    {e?.status === 'pending' && <p className="text-[12px] text-orange-500  w-[24%] text-center">Yangi</p>}
                                    {/*  */}
                                    {e?.status === 'reject' && <p className="text-[12px] text-red-500  w-[24%] text-center">Rad etilgan</p>}
                                    {/*  */}
                                    {e?.status === 'wait' && <p className="text-[12px] text-orange-500  w-[24%] text-center relative">
                                        Qayta qo'ng'iroq
                                        <BiRefresh onClick={() => setStatusOne(e?.id)} className="absolute top-[-15px] text-[20px] right-0" />
                                    </p>}
                                    {/*  */}
                                    {e?.status === 'success' && <p className="text-[12px] text-blue-500  w-[24%] text-center">Tayyor</p>}
                                    {/*  */}
                                    {e?.status === 'archive' && <p className="text-[12px] text-orange-500 w-[24%] text-center">Arxivlandi</p>}
                                    {/*  */}
                                    {e?.status === 'sended' && <p className="text-[12px] text-purple-500  w-[24%] text-center">Yetkazilmoqda</p>}
                                    {/*  */}
                                    {e?.status === 'delivered' && <p className="text-[12px] text-green-500  w-[24%] text-center">Yetkazilgan</p>}
                                </div>
                        )
                    })}
                </>
            }
            <Dialog open={select?.open} className="p-[0_10px]">
                <DialogHeader className="w-full flex items-center justify-between relative">
                    <h1 className="text-[16px]">{select?.title}</h1>
                    <div className="absolute top-[-20px] right-[-20px]">
                        <IconButton className="rounded-full" color="blue-gray" onClick={() => setSelect({ open: false })}>
                            <FaX />
                        </IconButton>
                    </div>
                </DialogHeader>
                <DialogBody className="border-y flex items-center justify-start flex-col">
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input value={select?.name} label="Mijoz ismi" variant="standard" icon={<FaUser />} />
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input value={select?.phone} label="Mijoz raqami" variant="standard" icon={<FaPhone />} />
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Textarea value={select?.about} label="Izoh" variant="standard" />
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Textarea value={select?.courier_comment} label="Kuryer izohi" variant="standard" />
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input value={select?.operator_id} label="Operator" variant="standard" icon={<FaMicrophone />} />
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input value={select?.date} label="Operator" variant="standard" icon={<FaMicrophone />} />
                    </div>
                </DialogBody>
            </Dialog>
        </div>
    );
}

export default AdminRequests;