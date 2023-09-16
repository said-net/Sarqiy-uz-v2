import { IconButton, Input } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaTelegram } from 'react-icons/fa6'
import { useDispatch, useSelector } from "react-redux";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { setRefreshChat } from "../managers/chatManager";
import NotAuth from "../user/notauth";
function Chat() {
    const [msg, setMsg] = useState('');
    const { chat, auth } = useSelector(e => e);
    const [messages, setMessages] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const dp = useDispatch()
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/chat/get-my-messages`, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, data, msg } = res.data;
            setIsLoad(true)
            if (ok) {
                setMessages(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }, [chat.refresh]);

    function SendMessage() {
        axios.post(`${API_LINK}/chat/new-user-message`, { message: msg }, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                dp(setRefreshChat());
                setMsg('');
            }
        })
    }
    return (
        <div className="flex items-center justify-start flex-col-reverse w-full h-[70vh] overflow-y-scroll p-[10px]">
            {!auth?.id && <NotAuth />}
            {auth?.id &&
                <>
                    {!isLoad && <p>Kuting...</p>}
                    {isLoad && !messages[0] && <p>Sizda habarlar mavjud emas!</p>}
                    {isLoad && messages[0] &&
                        messages?.map((m, i) => {
                            return (
                                m?.from === 'user' ? <div className="flex w-full mb-[3px] items-center justify-end" key={i}>
                                    <p className={`p-[10px] ${m?.from === 'user' ? 'bg-blue-gray-500' : 'bg-blue-gray-300'} rounded-[10px_10px_0_10px] text-white`} key={i}>{m?.message}</p>
                                </div>
                                    : <div className="flex w-full mb-[3px] items-center justify-e" key={i}>
                                        <p className={`p-[10px] ${m?.from === 'user' ? 'bg-blue-gray-500' : 'bg-blue-gray-200'} rounded-[10px_10px_10px_0px] text-white`} key={i}>{m?.message}</p>
                                    </div>
                            )
                        })
                    }
                    <div className="flex items-center justify-center w-full h-[50px] fixed bottom-[49px] left-0 bg-white">
                        <div className="flex items-center justify-center w-[80%]">
                            <Input label="Habaringiz" variant="standard" value={msg} onChange={e => setMsg(e.target.value)} />
                        </div>
                        <IconButton color="blue-gray" className="rounded-full text-[20px]" disabled={!msg} onClick={SendMessage}>
                            <FaTelegram />
                        </IconButton>
                    </div>
                </>
            }
        </div>
    );
}

export default Chat;