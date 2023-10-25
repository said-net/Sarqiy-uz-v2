import { Button, Input, Option, Select } from "@material-tailwind/react";
import { useState } from "react";
import { FaLock, FaPhone, FaTelegram, FaUser } from "react-icons/fa";
import { setRefresh } from "../managers/refresh.manager";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { API_LINK } from "../config";
import Regions from '../components/regions.json';
function AddCourier() {
    const [state, setState] = useState({ name: '', phone: '+998', password: '', region: '', telegram: '' });
    const dp = useDispatch();
    function Submit() {
        const { name, phone, password } = state
        if (!name || !phone || !password) {
            toast.error("Qatorlarni to'ldiring!")
        } else {
            axios.post(API_LINK + '/boss/create-courier', state, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then(res => {
                const { ok, msg } = res.data;
                if (ok) {
                    dp(setRefresh());
                    setState({ name: '', phone: '+998', password: '', telegram: '' });
                    toast.success(msg)
                } else {
                    toast.error(msg)
                }
            }).catch(() => {
                toast.error('Aloqani tekshirib qayta urinib ko\'ring\'')
            });
        }
    }
    return (
        <div className="flex items-center justify-start flex-col w-full">
            <div className="flex items-center justify-center w-[180px] h-[50px] bg-white shadow-sm rounded-b-[10px] mb-[15px]">
                <h1>KURYER QO'SHISH</h1>
            </div>
            <div className="flex items-start justify-start flex-col max-w-[450px] w-[90%] bg-white p-[10px] rounded">
                <div className="flex items-center justify-start w-full mb-[10px]">
                    <Input label="Ism kiriting!" variant="standard" onChange={e => setState({ ...state, name: e.target.value.trim() })} value={state.name} icon={<FaUser />} required />
                </div>
                <div className="flex items-center justify-start w-full mb-[10px]">
                    <Input label="Telfon raqam kiriting!" variant="standard" onChange={e => setState({ ...state, phone: e.target.value.trim() })} value={state.phone} required icon={<FaPhone />} />
                </div>
                <div className="flex items-center justify-start w-full mb-[10px]">
                    <Input label="Parol kiriting!" variant="standard" onChange={e => setState({ ...state, password: e.target.value.trim() })} value={state.password} icon={<FaLock />} required />
                </div>
                <div className="flex items-center justify-start w-full mb-[10px]">
                    <Input label="Telegram ID" variant="standard" onChange={e => setState({ ...state, telegram: e.target.value.trim() })} value={state.telegram} icon={<FaTelegram />} required />
                </div>
                <div className="flex items-center justify-start w-full mb-[10px]">
                    <Select label="Hududni tanlang" value={state?.region} variant="standard" onChange={e => setState({ ...state, region: e })}>
                        {Regions?.map((r, i) => {
                            return (
                                <Option key={i} value={`${r?.id}`}>{r?.name}</Option>
                            )
                        })}
                    </Select>
                </div>
                <div className="flex items-center justify-start w-full mb-[10px]">
                    <Button onClick={Submit} className="w-full rounded" color="red">SAQLASH</Button>
                </div>
            </div>
        </div>
    );
}

export default AddCourier;