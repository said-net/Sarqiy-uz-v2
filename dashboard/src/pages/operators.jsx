import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_LINK } from "../config";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Chip, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Menu, MenuHandler, MenuItem, MenuList, Spinner } from "@material-tailwind/react";
import { BiDotsVertical, BiPencil, BiStar, BiTrash, BiUser } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { setRefresh } from "../managers/refresh.manager";
import { FaQuestion } from "react-icons/fa";

function Operators() {
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e.refresh)
    const [operators, setOperators] = useState([]);
    const nv = useNavigate();
    const [delId, setDelId] = useState({ id: '', name: '' });
    const dp = useDispatch();
    useEffect(() => {
        setIsLoad(false)
        axios(API_LINK + '/operator/getall', {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            setIsLoad(true)
            const { ok, data } = res.data
            if (ok) {
                setOperators(data)
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urinib ko'ring!")
        })
    }, [refresh]);
    function DeleteOperator() {
        axios.delete(API_LINK + '/operator/delete/' + delId?.id, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data
            if (ok) {
                dp(setRefresh());
                setDelId({ id: '', name: '' });
                toast.success("O'chirildi!")
            } else {
                toast.error(msg)
            }
        }).catch(() => {
            toast.error("Aloqani tekshirisb qayta urunib ko'ring!")
        });
    }
    function SetSuper(id) {
        axios.post(API_LINK + '/operator/set-super/' + id,{} ,{
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data
            if (ok) {
                dp(setRefresh());
                toast.success(msg)
            } else {
                toast.error(msg)
            }
        }).catch(() => {
            toast.error("Aloqani tekshirisb qayta urunib ko'ring!")
        });
    }
    return (
        <div className="flex items-start md:items-center justify-start flex-col w-full overflow-scroll">
            <div className="flex items-center justify-center w-full rounded-b-[10px] mb-[10px]">
                <h1 className="flex items-center justify-center w-[150px] h-[50px] bg-white shadow-sm rounded-b-[10px]">OPERATORLAR</h1>
            </div>
            <div className="flex items-center justify-normal flex-col p-[5px] ">
                <div className="flex items-center justify-between w-full h-[70px] shadow-sm bg-white  border-b p-[0_5px]">
                    <div className="flex items-center justify-between">
                        <p className="w-[50px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">ID</p>
                        <p className="w-[140px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">ISMI</p>
                        <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">RAQAMI</p>
                        <p className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">SUPER</p>
                        <p className="w-[60px] text-center border-l h-[70px] flex items-center justify-center text-[13px]">MENU</p>
                    </div>
                </div>
                <div className="flex items-center justify-between w-full shadow-sm bg-white p-[0_5px] flex-col">
                    {!isLoad && <Spinner />}
                    {isLoad && !operators[0] && <p>Operatorlar mavjud emas!</p>}
                    {isLoad && operators[0] &&
                        operators?.map((o, i) => {
                            return (
                                <div key={i} className="flex items-center justify-between h-[70px] border-b">
                                    <p className="w-[50px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">{o?.id}</p>
                                    <p className="w-[140px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">{o?.name}</p>
                                    <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">{o?.phone}</p>
                                    <div className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[13px]">
                                        {o?.super && <Chip color="red" value={'super'} />}
                                    </div>
                                    <p className="w-[60px] text-center border-l h-[70px] flex items-center justify-center text-[13px]">
                                        <Menu>
                                            <MenuHandler>
                                                <IconButton className="rounded-full" color="blue-gray">
                                                    <BiDotsVertical className="text-[20px]" />
                                                </IconButton>
                                            </MenuHandler>
                                            <MenuList>
                                                <MenuItem onClick={() => nv(`/edit-operator/${o?._id}/${o?.name}/${o?.phone}`)} className="flex items-center justify-start">
                                                    <BiPencil className="mr-[10px]" />
                                                    Taxrirlash
                                                </MenuItem>
                                                {!o?.super ?
                                                    <MenuItem onClick={() => SetSuper(o?._id)} className="flex items-center justify-start">
                                                        <BiStar className="mr-[10px]" />
                                                        Super qilish
                                                    </MenuItem>
                                                    :
                                                    <MenuItem onClick={() => SetSuper(o?._id)} className="flex items-center justify-start">
                                                        <BiUser className="mr-[10px]" />
                                                        Oddiy qilish
                                                    </MenuItem>
                                                }
                                                <MenuItem onClick={() => setDelId({ id: o?._id, name: o?.name })} className="flex items-center justify-start text-red-500">
                                                    <BiTrash className="mr-[10px]" />
                                                    O'chirish
                                                </MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <Dialog open={delId?.id !== ''} size="xxl" className="flex items-center justify-center bg-[#1b424a80] backdrop-blur-md">
                <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] p-[10px] bg-white shadow-lg rounded-md">
                    <DialogHeader className="w-full">
                        <h1 className="text-[20px]">Operator o'chirilsinmi - {delId?.name}</h1>
                    </DialogHeader>
                    <DialogBody className="w-full border-y">
                        <p className="flex items-center"><FaQuestion />
                            Diqqat operator o'chirilgach uni qayta tiklashning iloji bo'lmaydi!
                        </p>
                    </DialogBody>
                    <DialogFooter className="w-full">
                        <Button onClick={() => setDelId({ id: '', name: '' })} className="rounded ml-[10px]" color="orange">Bekor qilish</Button>
                        <Button className="rounded ml-[10px]" color="red" onClick={DeleteOperator}
                        >O'chirish</Button>
                    </DialogFooter>
                </div>
            </Dialog>
        </div>
    );
}

export default Operators;