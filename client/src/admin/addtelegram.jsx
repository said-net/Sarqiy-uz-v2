import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { setRefreshAuth } from "../managers/authManager";
function AdminTelegram({ open, setOpen }) {
    const [state, setState] = useState('');
    const { telegram } = useSelector(e => e.auth);
    const dp = useDispatch()
    useEffect(() => {
        setTimeout(() => {
            setState(telegram)
        }, 1000);
    }, [open]);

    function Submit() {
        axios.post(`${API_LINK}/user/set-telegram`, { telegram: state }, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setOpen(false);
                dp(setRefreshAuth());
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }
    return (
        <Dialog open={open} size="xl" className="p-[0_10px]">
            <DialogHeader>
                <p className="text-[16px]">Telegramga bog'lash</p>
            </DialogHeader>
            <DialogBody className="border-y">
                <Input label="Telegram ID" value={state} onChange={e => setState(e.target.value)} />
            </DialogBody>
            <DialogFooter>
                <Button className="rounded mr-[10px]" color="orange" onClick={() => setOpen(false)}>Ortga</Button>
                <Button className="rounded" color="green" disabled={isNaN(state) || Number(state) === telegram} onClick={Submit}>Saqlash</Button>
            </DialogFooter>
        </Dialog>
    );
}

export default AdminTelegram;