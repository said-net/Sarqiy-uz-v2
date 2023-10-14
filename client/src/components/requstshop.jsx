import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input } from "@material-tailwind/react";
import { FaPhone, FaUser } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_LINK } from "../config";
import { toast } from "react-toastify";

function RequestShop({ openShop, setOpenShop }) {
    const [disabled, setDisablet] = useState(false);
    // 
    useEffect(() => {
        const { name, phone } = openShop;
        if (!name || phone.length < 13 || !phone.startsWith('+998')) {
            setDisablet(true);
        } else {
            setDisablet(false);
        }
    }, [openShop]);
    // 
    function Submit() {
        setDisablet(true);
        const { name, phone, region, flow, flow_id } = openShop;
        axios.post(`${API_LINK}/shop/create`, { id: openShop.id, name, phone, flow: flow ? flow : '', flow_id }).then(res => {
            const { ok, msg } = res.data;
            setDisablet(false);
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setOpenShop({ id: '', title: '', count: 1, price: 0, bonus: false, bonus_given: 0, bonus_count: 0, name: '', phone: '+998', city: '', flow: '', flow_id:'' });
            }
        }).catch(() => {
            toast.warning("Aloqani tekshirib qayta urunib ko'ring!");
            setDisablet(false);
        })
    }
    // 
    return (
        <Dialog open={openShop?.id !== ''} size="xxl" className="flex items-center justify-center w-full h-[100vh] bg-[#000000ab] backdrop-blur-sm">
            <div className="flex items-center justify-start flex-col w-[90%] sm:w-[500px] rounded bg-white p-[5px]">
                <DialogHeader className="text-[15px] w-full relative">
                    Mahsulot: {openShop?.title}
                    <div className="absolute  top-[-20px] right-[-20px]">
                        <IconButton onClick={() => {
                            setOpenShop({ ...openShop, id: '' });
                        }} color="blue-gray" className="rounded-full text-[24px]">
                            <MdClose />
                        </IconButton>
                    </div>
                </DialogHeader>
                <DialogBody className="w-full border-y">
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input value={openShop.name} label="Ismingiz" onChange={e => setOpenShop({ ...openShop, name: e.target.value })} required icon={<FaUser />} />
                    </div>
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input value={openShop.phone} label="Raqamingiz" onChange={e => setOpenShop({ ...openShop, phone: e.target.value.trim() })} required icon={<FaPhone />} />
                    </div>
                    <div className="flex items-center justify-start w-full">
                        <p className="text-[14px]">Yetkazib berish hududga qarab 35 000 so'mgacha</p>
                    </div>
                    {/* <div className="flex items-center justify-center w-full mb-[10px]">
                        <Select label="Viloyat" onChange={e => setOpenShop({ ...openShop, region: e })} value={String(openShop.region)}>
                            {
                                Regions.map((e, key) => {
                                    return (
                                        <Option key={key} value={`${e.id}`}>{e.name}</Option>
                                    )
                                })
                            }
                        </Select>
                    </div> */}
                    {/* {
                        openShop.region ?
                            <div className="flex items-center justify-center w-full mb-[10px]">
                                <Select label="Tuman/Shaxar" onChange={e => setOpenShop({ ...openShop, city: e })} value={openShop.city}>
                                    {
                                        Cities?.filter(e => e.region_id === +openShop.region)?.map((e, key) => {
                                            return (
                                                <Option key={key} value={`${e.id}`}>{e.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            </div> : null
                    } */}
                    {/* <div className="flex items-center justify-center w-full mb-[10px]">
                        <Input value={openShop.count} label="Qancha mahsulot olasiz?" onChange={e => !isNaN(e.target.value.trim()) && setOpenShop({ ...openShop, count: Math.floor(e.target.value.trim()) })} required icon={<FaBoxes />} />
                    </div>
                    {openShop?.bonus &&
                        <p className="text-[20px] w-fullh-[30px] bg-red-50 flex items-center justify-center rounded text-black">Bonus sifatida: +<b>{Math.floor(openShop?.count / openShop.bonus_count * openShop?.bonus_given)}</b> ta</p>
                    } */}
                </DialogBody>
                <DialogFooter className="w-full">
                    <Button disabled={disabled} className="w-full rounded" color='red' onClick={Submit}>Sotib olish</Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

export default RequestShop;