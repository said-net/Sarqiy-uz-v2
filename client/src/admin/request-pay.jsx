import { Button, Input } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { BiCreditCard, BiMoney } from "react-icons/bi";
import { API_LINK } from "../config";
import { toast } from "react-toastify";

function RequestPay() {
    const [form, setForm] = useState({ card: '', count: '' });
    const [disable, setDisable] = useState(false);
    function Submit() {
        setDisable(true);
        axios.post(`${API_LINK}/user/request-pay`, form, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            setDisable(false);
            if (ok) {
                toast.success(msg);
                setForm({ card: '', count: '' })
            } else {
                toast.error(msg);
            }
        })
    }
    return (
        <div className="flex items-center justify-center flex-col w-full min-h-[80vh]">
            <div className="flex items-center justify-start flex-col w-[90%] md:w-[600px]">
                <h1 className="text-[20px] sm:text-[30px]">PUL CHIQARISH</h1>
                <p className="text-[14px] mb-[10px] text-gray-500">Quyidagi qatorlarni to'ldiring!</p>
                <div className="flex items-center justify-center w-full mb-[10px]">
                    <Input disabled={disable} type="number" label="Karta raqam 9860****" color="red" onChange={e => setForm({ ...form, card: e.target.value?.trim() })} value={form?.card} icon={<BiCreditCard />} />
                </div>
                <div className="flex items-center justify-center w-full mb-[10px]">
                    <Input disabled={disable} type="number" label="Summa(min: 1 000 so'm)" color="red" onChange={e => setForm({ ...form, count: e.target.value?.trim() })} value={form?.count} icon={<BiMoney />} />
                </div>
                <Button onClick={Submit} disabled={form?.card?.length !== 16 || +form?.count < 1000 || disable} className="rounded-full" color="red" fullWidth>Qabul qilish</Button>
            </div>
        </div>
    );
}

export default RequestPay;