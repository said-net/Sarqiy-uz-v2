import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Menu, MenuHandler, MenuItem, MenuList, Spinner } from "@material-tailwind/react";
import { BiCreditCard, BiDotsVertical, BiEdit, BiImage, BiMoney, BiPlus, BiTag, BiTrash } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { setRefresh } from "../managers/refresh.manager";

function Races() {
    const [isLoad, setIsLoad] = useState(false);
    const [races, setRaces] = useState([]);
    const [state, setState] = useState({ title: '', image: '', old_price: '', price: '', open: false, });
    const [edit, setEdit] = useState({ id: '', title: '', image: '', old_price: '', price: '' });
    const [disabled, setDisabled] = useState(false);
    const dp = useDispatch();
    const { refresh } = useSelector(e => e.refresh);
    const [deleteId, setDeleteId] = useState('');
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/race/get-all`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, data } = res.data;
            setIsLoad(true);
            if (ok) {
                setRaces(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, [refresh]);
    function Create() {
        const { title, image, old_price, price } = state;
        if (!title || !image || !old_price || !price) {
            toast.warning("Qatorlarni to'ldiring!")
        } else {
            setDisabled(true);
            const form = new FormData();
            form.append('title', title);
            form.append('image', image);
            form.append('price', price);
            form.append('old_price', old_price);
            axios.post(`${API_LINK}/race/create`, form, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then((res) => {
                const { ok, msg } = res.data;
                setDisabled(false);
                if (ok) {
                    setState({ title: '', image: '', old_price: '', price: '' });
                    toast.success(msg);
                    dp(setRefresh());
                }
            }).catch(() => {
                toast.error("Aloqani tekshirib qayta urunib ko'ring!");
                setDisabled(false);
            })
        }
    }
    function EditImage(image) {
        setDisabled(true);
        const form = new FormData();
        form.append('image', image);
        axios.put(`${API_LINK}/race/edit-image/${edit?.id}`, form, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, msg } = res.data;
            setDisabled(false);
            if (ok) {
                toast.success(msg);
                dp(setRefresh());
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!");
            setDisabled(false);
        })
    }
    function EditBody() {
        const { title, old_price, price } = edit;
        if (!title || !old_price || !price) {
            toast.warning("Qatorlarni to'ldiring!")
        } else {
            setDisabled(true);
            const form = new FormData();
            form.append('title', title);
            form.append('price', price);
            form.append('old_price', old_price);
            axios.put(`${API_LINK}/race/edit-body/${edit?.id}`, form, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then((res) => {
                const { ok, msg } = res.data;
                setDisabled(false);
                if (ok) {
                    toast.success(msg);
                    dp(setRefresh());
                    setEdit({ id: '', title: '', image: '', old_price: '', price: '' })
                }
            }).catch(() => {
                toast.error("Aloqani tekshirib qayta urunib ko'ring!");
                setDisabled(false);
            })
        }
    }
    function Delete() {
        setDisabled(true);
        axios.delete(`${API_LINK}/race/delete/${deleteId}`, {
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
                <h1 className=" bg-white shadow-sm rounded-b-[10px] flex items-center justify-center p-[10px] h-[50px]">POYGALAR</h1>
            </div>
            <div className="flex items-start justify-start flex-col w-full">
                <div className="flex items-center justify-start h-[70px] border bg-white">
                    <p className="w-[70px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">ID</p>
                    <p className="w-[120px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">RASMI</p>
                    <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">NOMI</p>
                    <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">ESKI NARX</p>
                    <p className="w-[200px] text-center border-l h-[70px] flex items-center justify-center text-[12px]">HOZIRGI NARX</p>
                    <p className="w-[200px] text-center border-l h-[70px] flex items-center justify-center text-[12px]">SOTIB OLDI</p>
                    <p className="w-[70px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">MENU</p>
                    <p className="w-[70px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">
                        <IconButton onClick={() => setState({ ...state, open: true })} className="text-[30px] rounded-full" color="blue-gray">
                            <BiPlus />
                        </IconButton>
                    </p>
                </div>
            </div>
            {!isLoad && <Spinner />}
            {isLoad && !races[0] &&
                <p>Poygalar mavjud emas!</p>
            }
            {isLoad && races[0] &&
                races?.map((r, i) => {
                    return (
                        <div key={i} className="flex items-center justify-start h-[70px] border bg-white">
                            <p className="w-[70px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">
                                {r?.id}
                            </p>
                            <p className="w-[120px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">
                                <img src={r?.image} alt="i" className="w-[40px] rounded" />
                            </p>
                            <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">
                                {r?.title}
                            </p>
                            <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">
                                {r?.old_price} coin
                            </p>
                            <p className="w-[200px] text-center border-l h-[70px] flex items-center justify-center text-[12px]">
                                {r?.price} coin
                            </p>
                            <p className="w-[200px] text-center border-l h-[70px] flex items-center justify-center text-[12px] flex-col">
                                {r?.user &&
                                    <>
                                        <b className="font-normal">ID: {r?.user?.id}</b>
                                        <b className="font-normal">{r?.user?.name}</b>
                                        <b className="font-normal">{r?.user?.phone}</b>
                                    </>
                                }
                            </p>
                            <div className="w-[70px] text-center border-x h-[70px] flex items-center justify-center text-[20px] cursor-pointer">
                                <Menu>
                                    <MenuHandler>
                                        <IconButton className="shadow-none hover:shadow-none" color="white">
                                            <BiDotsVertical />
                                        </IconButton>
                                    </MenuHandler>
                                    <MenuList>
                                        <MenuItem onClick={() => setEdit({ ...edit, id: r?._id, title: r?.title, old_price: r?.old_price, price: r?.price })} className="flex items-center justify-start">
                                            <BiEdit className="mr-[10px]" />
                                            Taxrirlash
                                        </MenuItem>
                                        <MenuItem onClick={() => setDeleteId(r?._id)} className="flex items-center justify-start text-red-500">
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
            {/* CREATE */}
            <Dialog size="md" open={state.open}>
                <DialogHeader>
                    <p className="text-[20px]">Poyga qo'shish</p>
                </DialogHeader>
                <DialogBody className="border-y">
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} label="Poyga uchun nom(Iphone 14)" variant="standard" onChange={e => setState({ ...state, title: e.target.value })} value={state.title} icon={<BiTag />} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} type="file" accept="image/*" label="Poyga rasmi" variant="standard" onChange={e => setState({ ...state, image: e.target.files[0] })} icon={<BiImage />} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} type="number" label="Eski narxi(Coin)" variant="standard" onChange={e => setState({ ...state, old_price: e.target.value })} value={state.old_price} icon={<BiMoney />} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} type="number" label="Narxi(Coin)" variant="standard" onChange={e => setState({ ...state, price: e.target.value })} value={state.price} icon={<BiCreditCard />} />
                    </div>
                    {/*  */}
                </DialogBody>
                <DialogFooter className="flex items-center justify-between">
                    <Button disabled={disabled} className="rounded" color="orange" onClick={() => setState({ title: '', image: '', old_price: '', price: '' })}>Ortga</Button>
                    <Button disabled={disabled} color="green" className="rounded" onClick={Create}>Saqlash</Button>
                </DialogFooter>
            </Dialog>
            {/* EDIT */}
            <Dialog size="md" open={edit.id !== ''}>
                <DialogHeader>
                    <p className="text-[20px]">Poyga taxrirlash</p>
                </DialogHeader>
                <DialogBody className="border-y">
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} label="Poyga uchun nom(Iphone 14)" variant="standard" onChange={e => setEdit({ ...edit, title: e.target.value })} value={edit.title} icon={<BiTag />} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} type="file" accept="image/*" label="Poyga rasmi" variant="standard" onChange={e => EditImage(e.target.files[0])} icon={<BiImage />} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} type="number" label="Eski narxi(Coin)" variant="standard" onChange={e => setEdit({ ...edit, old_price: e.target.value })} value={edit.old_price} icon={<BiMoney />} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input disabled={disabled} type="number" label="Narxi(Coin)" variant="standard" onChange={e => setEdit({ ...edit, price: e.target.value })} value={edit.price} icon={<BiCreditCard />} />
                    </div>
                    {/*  */}
                </DialogBody>
                <DialogFooter className="flex items-center justify-between">
                    <Button disabled={disabled} className="rounded" color="orange" onClick={() => setEdit({ id: '', title: '', image: '', old_price: '', price: '' })}>Ortga</Button>
                    <Button disabled={disabled} color="green" className="rounded" onClick={EditBody}>Saqlash</Button>
                </DialogFooter>
            </Dialog>
            {/* DELETE */}
            <Dialog size="md" open={deleteId !== ''}>
                <DialogHeader>
                    <p className="text-[20px]">O'chirish</p>
                </DialogHeader>
                <DialogBody className="border-y">
                    <p>Poygani rostdan ham o'chirasizmi?</p>
                </DialogBody>
                <DialogFooter className="flex items-center justify-between">
                    <Button disabled={disabled} className="rounded" color="orange" onClick={() => setDeleteId('')}>Ortga</Button>
                    <Button disabled={disabled} color="red" className="rounded" onClick={Delete}>O'chirish</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default Races;