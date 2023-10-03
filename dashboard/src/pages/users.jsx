import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import axios from "axios";
import { toast } from "react-toastify";
import { BiDotsVertical, BiLock, BiLockOpen, BiMinusCircle, BiSearch, BiTargetLock } from "react-icons/bi";
import { Chip, IconButton, Input, Menu, MenuHandler, MenuItem, MenuList, Spinner } from "@material-tailwind/react";

function Users() {
    const [users, setUsers] = useState([]);
    const [isLoad, setIsLoad] = useState();
    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState('');
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/boss/get-all-users`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            setIsLoad(true);
            const { ok, data } = res.data;
            if (ok) {
                setUsers(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, [refresh]);
    function setTargetolog(id) {
        axios(`${API_LINK}/boss/set-targetolog/${id}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg } = res.data;
            if (ok) {
                setRefresh(!refresh);
                toast.success(msg);
            }
        });
    }
    function removeTargetolog(id) {
        axios(`${API_LINK}/boss/remove-targetolog/${id}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg } = res.data;
            if (ok) {
                setRefresh(!refresh);
                toast.success(msg);
            }
        });
    }
    function setBan(id) {
        axios(`${API_LINK}/boss/set-ban-user/${id}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg } = res.data;
            if (ok) {
                setRefresh(!refresh);
                toast.success(msg);
            }
        });
    }
    function removeBan(id) {
        axios(`${API_LINK}/boss/remove-ban-user/${id}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg } = res.data;
            if (ok) {
                setRefresh(!refresh);
                toast.success(msg);
            }
        });
    }
    return (
        <div className="flex items-start justify-start flex-col w-full overflow-x-scroll mt-[60px]">
            <div className="flex items-center justify-normal flex-col p-[5px] ">
                <div className="flex items-center justify-start w-full h-[70px] shadow-sm bg-white  border-b p-[0_10px] ">
                    <p className="mr-[20px]">FOYDALANUVCHI & ADMINLAR: {users?.length} ta</p>
                    <div className="flex items-center justify-center w-[250px]">
                        <Input label="Qidiruv: ID, Raqami, Hudud, Ismi" color="red" icon={<BiSearch />} value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="flex items-center justify-between w-full h-[70px] shadow-sm bg-white  border-b p-[0_5px]">
                    <div className="flex items-center justify-between">
                        <p className="w-[50px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">ID</p>
                        <p className="w-[200px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">ISMI</p>
                        <p className="w-[200px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">RAQAMI</p>
                        <p className="w-[200px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">SAYTDA</p>
                        <p className="w-[200px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">HUDUD</p>
                        <p className="w-[50px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">REF ID</p>
                        <p className="w-[150px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">TARGETOLOG</p>
                        <p className="w-[150px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">BAN</p>
                        <p className="w-[60px] text-center border-l h-[70px] flex items-center justify-center text-[13px]">MENU</p>
                    </div>
                </div>
                {!isLoad &&
                    <div className="flex items-center justify-center w-full h-[80vh]">
                        <Spinner />
                    </div>
                }
                {isLoad && !users[0] &&
                    <div className="flex items-center justify-center w-full h-[80vh]">
                        <h1>Foydalanuvchilar mavjud emas!</h1>
                    </div>
                }
                {isLoad && users[0] &&
                    users?.filter(u => !search ? u : u?.id === +search || u?.name?.toLowerCase()?.includes(search?.toLowerCase()) || u?.phone?.toLowerCase()?.includes(search?.toLowerCase()) || u?.location?.toLowerCase()?.includes(search?.toLowerCase()))?.map((u, i) => {
                        return (
                            <div key={i} className="flex items-center justify-between w-full h-[70px] shadow-sm bg-white  border-b p-[0_5px]">
                                <div className="flex items-center justify-between">
                                    <div className="w-[50px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">
                                        <Chip color="red" className="rounded" value={u?.id} />
                                    </div>
                                    <p className="w-[200px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">
                                        {u?.name}
                                    </p>
                                    <p className="w-[200px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">
                                        {u?.phone}
                                    </p>
                                    <p className="w-[200px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">
                                        {u?.created}
                                    </p>
                                    <p className="w-[200px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">
                                        {u?.location}
                                    </p>
                                    <p className="w-[50px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">
                                        {u?.ref_id}
                                    </p>
                                    <div className="w-[150px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">
                                        {u?.targetolog && <Chip value={'TARGETOLOG'} color="red" />}
                                    </div>
                                    <p className="w-[150px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">
                                        {u?.ban && <Chip value={'BLOKLANGAN'} color="red" />}
                                    </p>
                                    <div className="w-[60px] text-center border-l h-[70px] flex items-center justify-center text-[13px]">
                                        <Menu>
                                            <MenuHandler>
                                                <IconButton className="rounded-full" color="blue-gray">
                                                    <BiDotsVertical className="text-[20px]" />
                                                </IconButton>
                                            </MenuHandler>
                                            <MenuList>
                                                {u?.ban && <MenuItem onClick={() => removeBan(u?._id)} className="flex items-center justify-start">
                                                    <BiLockOpen className="mr-[10px]" />
                                                    Blokdan olish
                                                </MenuItem>
                                                }
                                                {!u?.ban && <MenuItem onClick={() => setBan(u?._id)} className="flex items-center justify-start text-red-500">
                                                    <BiLock className="mr-[10px]" />
                                                    Bloklash
                                                </MenuItem>
                                                }
                                                {u?.targetolog && <MenuItem onClick={() => removeTargetolog(u?._id)} className="flex items-center justify-start">
                                                    <BiMinusCircle className="mr-[10px]" />
                                                    Targetologdan olish
                                                </MenuItem>
                                                }
                                                {!u?.targetolog && <MenuItem onClick={() => setTargetolog(u?._id)} className="flex items-center justify-start text-green-500">
                                                    <BiTargetLock className="mr-[10px]" />
                                                    Trgatolog qilish
                                                </MenuItem>
                                                }
                                            </MenuList>
                                        </Menu>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default Users;