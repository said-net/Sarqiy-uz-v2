import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Menu, MenuHandler, MenuItem, MenuList, Spinner } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { BiDotsVertical, BiEdit, BiLock, BiPhone, BiPlus, BiTrash, BiUser } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { API_LINK } from "../config";
import axios from "axios";
import { toast } from "react-toastify";
import { setRefresh } from "../managers/refresh.manager";

function Owners() {
    const [state, setState] = useState({ open: false, name: '', phone: '+998', password: '' });
    const [owners, setOwners] = useState([])
    const [isLoad, setIsLoad] = useState(false);
    const [edit, setEdit] = useState({ id: '', name: '', phone: '+998', password: '' });
    const [disabled, setDisabled] = useState(false);
    const dp = useDispatch();
    const { refresh } = useSelector(e => e.refresh);
    const [deleteId, setDeleteId] = useState('');

    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/boss/get-all-owners`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, data } = res.data;
            setIsLoad(true);
            if (ok) {
                setOwners(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, [refresh]);

    function Create() {
        const { name, phone, password } = state;
        if (!name || !phone || !password) {
            toast.warning("Qatorlarni to'ldiring!")
        } else {
            setDisabled(true);
            axios.post(`${API_LINK}/boss/create-owner`, { name, phone, password }, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then((res) => {
                const { ok, msg } = res.data;
                setDisabled(false);
                if (ok) {
                    setState({ open: false, name: '', phone: '', password: '' });
                    toast.success(msg);
                    dp(setRefresh());
                } else {
                    toast.error(msg);
                }
            }).catch(() => {
                toast.error("Aloqani tekshirib qayta urunib ko'ring!");
                setDisabled(false);
            })
        }
    }
    function Edit() {
        const { name, phone, password } = edit;
        if (!name || !phone) {
            toast.warning("Qatorlarni to'ldiring!")
        } else {
            setDisabled(true);
            axios.put(`${API_LINK}/boss/edit-owner/${edit?.id}`, { name, phone, password }, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then((res) => {
                const { ok, msg } = res.data;
                setDisabled(false);
                if (ok) {
                    toast.success(msg);
                    dp(setRefresh());
                    setEdit({ id: '', name: '', phone: '', password: '' })
                } else {
                    toast.error(msg);
                }
            }).catch(() => {
                toast.error("Aloqani tekshirib qayta urunib ko'ring!");
                setDisabled(false);
            })
        }
    }
    function Delete() {
        setDisabled(true);
        axios.delete(`${API_LINK}/boss/delete-owner/${deleteId}`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg } = res.data;
            setDisabled(false);
            if (ok) {
                toast.success(msg);
                dp(setRefresh());
                setDeleteId('')
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!");
            setDisabled(false);
        })
    }

    return (
        <div className="flex items-start justify-start flex-col w-full">
            <div className="flex items-center justify-center w-full h-[50px] mb-[10px]">
                <h1 className=" bg-white shadow-sm rounded-b-[10px] flex items-center justify-center p-[10px] h-[50px]">EGALAR</h1>
            </div>
            <div className="flex items-start justify-start flex-col w-full overflow">
                <div className="flex items-center justify-start h-[70px] border bg-white">
                    <p className="w-[70px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">ID</p>
                    <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">ISMI</p>
                    <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">RAQAMI</p>
                    <p className="w-[200px] text-center border-l h-[70px] flex items-center justify-center text-[12px]">TOIFA</p>
                    <p className="w-[70px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">MENU</p>
                    <p className="w-[70px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">
                        <IconButton onClick={() => setState({ ...state, open: true })} className="text-[30px] rounded-full" color="blue-gray">
                            <BiPlus />
                        </IconButton>
                    </p>
                </div>
                {!isLoad && <Spinner />}
                {isLoad && !owners[0] &&
                    <p>Poygalar mavjud emas!</p>
                }
                {isLoad && owners[0] &&
                    owners?.map((o, i) => {
                        return (
                            <div key={i} className="flex items-center justify-start h-[70px] border bg-white">
                                <p className="w-[70px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">
                                    {o?.id}
                                </p>
                                <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">
                                    {o?.name}
                                </p>
                                <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">
                                    {o?.phone}
                                </p>
                                <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">
                                    {o?.owner && "SUPER EGA"}
                                    {!o?.owner && "YORDAMCHI"}
                                </p>
                                <div className="w-[70px] text-center border-x h-[70px] flex items-center justify-center text-[20px] cursor-pointer">
                                    <Menu>
                                        <MenuHandler>
                                            <IconButton className="shadow-none hover:shadow-none" color="white">
                                                <BiDotsVertical />
                                            </IconButton>
                                        </MenuHandler>
                                        <MenuList>
                                            <MenuItem onClick={() => setEdit({ ...edit, id: o?._id, name: o?.name, phone: o?.phone })} className="flex items-center justify-start">
                                                <BiEdit className="mr-[10px]" />
                                                Taxrirlash
                                            </MenuItem>
                                            <MenuItem onClick={() => setDeleteId(o?._id)} className="flex items-center justify-start text-red-500">
                                                <BiTrash className="mr-[10px]" />
                                                O'chirish
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {/* CREATE */}
            <Dialog size="md" open={state.open}>
                <DialogHeader>
                    <p className="text-[20px]">Ega qo'shish</p>
                </DialogHeader>
                <DialogBody className="border-y">
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} label="Ega ismi" variant="standard" onChange={e => setState({ ...state, name: e.target.value })} value={state.name} icon={<BiUser />} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} type="tel" label="Ega raqami" variant="standard" onChange={e => setState({ ...state, phone: e.target.value })} value={state.phone} icon={<BiPhone />} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} type="text" label="Parol" variant="standard" onChange={e => setState({ ...state, password: e.target.value })} value={state.password} icon={<BiLock />} />
                    </div>
                    {/*  */}
                </DialogBody>
                <DialogFooter className="flex items-center justify-between">
                    <Button disabled={disabled} className="rounded" color="orange" onClick={() => setState({ open: false, name: '', phone: '', password: '' })}>Ortga</Button>
                    <Button disabled={disabled} color="green" className="rounded" onClick={Create}>Saqlash</Button>
                </DialogFooter>
            </Dialog>
            {/* EDIT */}
            <Dialog size="md" open={edit.id !== ''}>
                <DialogHeader>
                    <p className="text-[20px]">Taxrirlash</p>
                </DialogHeader>
                <DialogBody className="border-y">
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} label="Ega ismi" variant="standard" onChange={e => setEdit({ ...edit, name: e.target.value })} value={edit.name} icon={<BiUser />} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} type="tel" label="Ega raqami" variant="standard" onChange={e => setEdit({ ...edit, phone: e.target.value })} value={edit.phone} icon={<BiPhone />} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} type="text" label="Parol" variant="standard" onChange={e => setEdit({ ...edit, password: e.target.value })} value={edit.password} icon={<BiLock />} />
                    </div>
                    {/*  */}
                </DialogBody>
                <DialogFooter className="flex items-center justify-between">
                    <Button disabled={disabled} className="rounded" color="orange" onClick={() => setEdit({ id: '', name: '', phone: '+998', password: '' })}>Ortga</Button>
                    <Button disabled={disabled} color="green" className="rounded" onClick={Edit}>Saqlash</Button>
                </DialogFooter>
            </Dialog>
            {/* DELETE */}
            <Dialog size="md" open={deleteId !== ''}>
                <DialogHeader>
                    <p className="text-[20px]">O'chirish</p>
                </DialogHeader>
                <DialogBody className="border-y">
                    <p>Egani rostdan ham o'chirasizmi?</p>
                </DialogBody>
                <DialogFooter className="flex items-center justify-between">
                    <Button disabled={disabled} className="rounded" color="orange" onClick={() => setDeleteId('')}>Ortga</Button>
                    <Button disabled={disabled} color="red" className="rounded" onClick={Delete}>O'chirish</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );


}

export default Owners;