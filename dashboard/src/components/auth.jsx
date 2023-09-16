import { Button, Input } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaLock, FaUser } from 'react-icons/fa'
import { API_LINK } from "../config";
import { useDispatch } from "react-redux";
import { setRefreshAuth } from "../managers/auth.manager";
function Auth() {
    const [state, setState] = useState({ phone: '+998', password: '' });
    const [disabled, setDisabled] = useState(false);
    const [msg, setMsg] = useState({ error: false, msg: '' });
    const dp = useDispatch();
    function Submit() {
        setDisabled(true);
        axios.post(`${API_LINK}/boss/signin`, state).then((res) => {
            setDisabled(false);
            const { ok, msg, access } = res.data;
            if (!ok) {
                setMsg({ error: true, msg });
            } else {
                setMsg({ error: false, msg });
                localStorage.setItem('access', access);
                setTimeout(() => {
                    dp(setRefreshAuth());
                }, 1000);
            }
        }).catch(() => {
            setMsg({ error: true, msg: "Aloqani tekshirib qayta urunib ko'ring!" });
            setDisabled(false);
        });
    }
    useEffect(() => {
        if (!state.phone || !state.password) {
            setMsg({ error: true, msg: "Qatorlarni to'ldiring!" });
        } else if (state.phone.length < 3) {
            setMsg({ error: true, msg: "Loginni to'g'ri kiriitng!" });
        } else if (state.password.length < 6) {
            setMsg({ error: true, msg: "Parolni to'g'ri kiriitng!" });
        } else {
            setMsg({ error: false, msg: "" });
        }
    }, [state]);
    return (
        <div className="flex items-center justify-center w-full h-[100vh]" onKeyPress={e => e.key === 'Enter' && Submit()}>
            <div className="flex items-center justify-start flex-col md:w-[700px] w-[90%] bg-[#fff] shadow-[0_10px_20px] shadow-[#01010136] p-[10px] rounded-[10px]">
                <h1 className="text-[23px] text-blue-gray-700 mb-[10px]">TIZIMGA KIRISH</h1>
                <p className={`mb-[10px] ${msg.error ? 'text-red-500' : 'text-green-500'}`}>{msg.msg}</p>
                {/*  */}
                <div className="flex items-center justify-center w-full mb-[10px]">
                    <Input disabled={disabled} label="Raqam" required variant="standard" onChange={e => { setState({ ...state, phone: e.target.value }) }} value={state.phone} icon={<FaUser />} />
                </div>
                {/*  */}
                <div className="flex items-center justify-center w-full mb-[10px]">
                    <Input disabled={disabled} type="Parol" label="Parol" required variant="standard" onChange={e => { setState({ ...state, password: e.target.value }) }} value={state.password} icon={<FaLock />} />
                </div>
                {/*  */}
                <div className="flex items-center justify-center w-full mb-[10px]">
                    <Button onClick={Submit} fullWidth disabled={state.phone.length < 9 || state.password.length < 6 || disabled} color="red">KIRISH</Button>
                </div>
            </div>
        </div>
    );
}

export default Auth;