import { useDispatch, useSelector } from "react-redux";
import NotAuth from "./notauth";
import { Button, Input, Option, Select } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { FaLock, FaPhone, FaTelegram, FaUser } from 'react-icons/fa6'
import axios from "axios";
import { API_LINK } from "../config";
import { setRefreshAuth } from "../managers/authManager";
import Regions from '../components/regions.json'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function Settings() {
    const { refresh, id } = useSelector(e => e.auth);
    const [state, setState] = useState({ id: '', name: '', password: '', telegram: '', phone: '', location: '', balance: '' });
    const dp = useDispatch();
    const [disabled, setDisabled] = useState(false);
    const nv = useNavigate()
    useEffect(() => {
        setDisabled(true)
        axios(`${API_LINK}/user/verify-auth`, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, data } = res.data;
            setDisabled(false);
            if (ok) {
                setState(data);
            }
        })
    }, [refresh]);

    function Submit() {
        const { name, password, telegram, phone, location } = state;
        axios.post(`${API_LINK}/user/edit-informations`, { name, password, telegram, phone, location }, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setTimeout(() => {
                    dp(setRefreshAuth());
                    nv('/profile')
                }, 1000)
            }
        })
    }
    return (
        <div className="flex items-center justify-start flex-col w-full p-[10px]">
            {!id && <NotAuth />}
            {id &&
                <div className="w-full p-[10px] bg-white rounded-[10px] shadow-sm">
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input variant="standard" disabled={disabled} value={state?.name} onChange={e => setState({ ...state, name: e.target.value })} label="Ismingiz" icon={<FaUser />} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input variant="standard" disabled={disabled} value={state?.phone} onChange={e => setState({ ...state, phone: e.target.value })} label="Raqamnigiz: +998..." icon={<FaPhone />} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Select variant="standard" onChange={e => setState({ ...state, location: e })} value={String(state.location)} label="Hududingiz!">
                            {Regions?.map((e, i) => {
                                return <Option key={i} value={`${e?.id}`}>{e?.name}</Option>
                            })}
                        </Select>
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input variant="standard" disabled={disabled} value={state?.telegram} onChange={e => setState({ ...state, telegram: e.target.value })} label="Telegram ID" icon={<FaTelegram />} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input variant="standard" disabled={disabled} value={state?.password} onChange={e => setState({ ...state, password: e.target.value })} label="Qo'shimcha parol" icon={<FaLock />} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Button onClick={Submit} className="w-full rounded bg-green-500">SAQLASH</Button>
                    </div>
                </div>
            }
        </div>
    );
}

export default Settings;