import { Button, Input } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { BiCreditCard, BiMoney } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { API_LINK } from "../config";
import { setRefreshAuth } from "../managers/auth.manager";

function Payment() {
    const { card, balance } = useSelector(e => e.auth);
    const [state, setState] = useState({ card: card || '', amount: '' });
    const dp = useDispatch();
    function Submit() {
        axios.post(`${API_LINK}/operator/create-pay`, state, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                dp(setRefreshAuth());
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!");
        });
    }
    return (
        <div className="flex items-center justify-start flex-col w-full bg-white shadow-sm rounded p-[10px]">
            <div className="flex items-center justify-start flex-col w-full">
                <div className="flex items-center justify-center">
                    <div className="flex items-center justify-center w-[80px] h-[80px] bg-green-100 rounded-full mr-[10px] md:w-[150px] md:h-[150px]">
                        <BiMoney className="text-[50px] md:text-[120px] text-green-500" />
                    </div>
                    <h1 className="text-[25px] md:text-[50px]">{Number(balance).toLocaleString()} <sub>so'm</sub></h1>
                </div>
                <div className="h-[2px] w-full bg-blue-gray-400 rounded my-[20px]"></div>
                <div className="flex items-center justify-start flex-col md:w-[500px] w-[100%]">
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input type="number" value={state?.card} onChange={e => setState({ ...state, card: e.target.value })} label="Karta raqamingiz" variant="standard" icon={<BiCreditCard />} />
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input type="number" value={state?.amount} onChange={e => setState({ ...state, amount: e.target.value })} label={`Summa: min. 1 000 max. ${Number(balance).toLocaleString()} so'm`} variant="standard" icon={<BiMoney />} />
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Button fullWidth color="red" disabled={state?.card?.length !== 16 || state?.amount < 1000 || state?.amount > balance} className="rounded" onClick={Submit}>TAYYOR</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;