import { Button, Input } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { FaLock, FaPhone } from 'react-icons/fa6'
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setRefreshAuth } from "../managers/auth.manager";
function Auth() {
    const dp = useDispatch()
    const [state, setState] = useState({ phone: '+998', password: '' });
    function Submit() {
        axios.post(`${API_LINK}/courier/sign-in`, state).then((res) => {
            const { ok, msg, token } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                localStorage.setItem('access', token);
                setTimeout(() => {
                    dp(setRefreshAuth());
                }, 1000)
            }
        })
    }
    return (<div className="flex items-center justify-center w-full h-[100vh]">
        <div className="flex items-center justify-start flex-col w-[90%] sm:w-[400px] p-[10px] rounded shadow-sm bg-white">
            <h1 className="text-black mb-[10px]">KURYER PANELIGA KIRISH</h1>
            <div className="flex items-center justify-center w-full mb-[10px]">
                <Input type="tel" label="Raqamingiz" variant="standard" required onChange={e => setState({ ...state, phone: e.target.value })} value={state.phone} icon={<FaPhone />} />
            </div>
            <div className="flex items-center justify-center w-full mb-[10px]">
                <Input type="password" label="Parolingiz" variant="standard" required onChange={e => setState({ ...state, password: e.target.value })} value={state.password} icon={<FaLock />} onKeyPress={e => e.key === 'Enter' && Submit()} />
            </div>
            <div className="flex items-center justify-center w-full mb-[10px]">
                <Button onClick={Submit} className="w-full rounded" color="red">Kirish</Button>
            </div>
        </div>
    </div>);
}

export default Auth;