import { MenuItem } from "@material-tailwind/react";
import { FaGift, FaMoneyBill, FaShoppingCart, FaTelegram, FaUsers, FaBoxes, FaRobot } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ImStatsDots } from 'react-icons/im'
import { FaGear, FaMoneyBill1, FaMoneyBillTransfer } from "react-icons/fa6";
import { BiMailSend } from "react-icons/bi";
import { useState } from "react";
import AdminTelegram from "./addtelegram";
function AdminMain() {
    const { balance } = useSelector(e => e.auth);
    const nv = useNavigate();
    const [open, setOpen] = useState(false);
    return (
        <div className="flex items-center justify-start flex-col w-full p-[0_10px]">
            <div className="flex items-center justify-between w-full h-[100px] bg-white shadow-md rounded p-[10px] relative mb-[10px]">
                <p className="absolute top-[5px] right-[5px] text-[14px] text-blue-gray-500">Hisobingiz</p>
                <div className="flex items-center justify-center">
                    <div className="flex items-center justify-center bg-green-50 w-[80px] h-[80px] rounded-full mr-[20px]">
                        <FaMoneyBill className="text-[50px] text-green-700 " />
                    </div>
                    <h1 className="text-[30px]">{Number(balance).toLocaleString()}<sub className="text-blue-gray-500">so'm</sub></h1>
                </div>
            </div>
            <div className="flex items-center justify-normal flex-col w-full bg-white shadow-md p-[10px] rounded">
                <MenuItem className="border flex items-center justify-start h-[50px] mb-[10px]" onClick={() => nv('/dashboard/market')}>
                    <FaShoppingCart className="mr-[10px] text-[20px] text-blue-gray-500" />
                    Market
                </MenuItem>
                <MenuItem className="border flex items-center justify-start h-[50px] mb-[10px]" onClick={() => window.open('https://t.me/sharqiybot')}>
                    <FaRobot className="mr-[10px] text-[20px] text-blue-gray-500" />
                    Telegram bot
                </MenuItem>
                <MenuItem className="border flex items-center justify-start h-[50px] mb-[10px]" onClick={() => nv('/dashboard/stats')}>
                    <ImStatsDots className="mr-[10px] text-[20px] text-blue-gray-500" />
                    Statistika
                </MenuItem>
                <MenuItem className="border flex items-center justify-start h-[50px] mb-[10px]" onClick={() => nv('/dashboard/product-stats')}>
                    <FaBoxes className="mr-[10px] text-[20px] text-blue-gray-500" />
                    Mahsulotlar bo'yicha statistika
                </MenuItem>
                <MenuItem className="border flex items-center justify-start h-[50px] mb-[10px]" onClick={() => nv('/dashboard/requests')}>
                    <BiMailSend className="mr-[10px] text-[20px] text-blue-gray-500" />
                    So'rovlar
                </MenuItem>
                <MenuItem className="border flex items-center justify-start h-[50px] mb-[10px]" onClick={() => window.open('https://t.me/Sharqiybot?start=pay')}>
                    <FaMoneyBill1 className="mr-[10px] text-[20px] text-blue-gray-500" />
                    To'lov
                </MenuItem>
                <MenuItem className="border flex items-center justify-start h-[50px] mb-[10px]" onClick={() => window.open('https://t.me/Sharqiybot?start=pay_history')}>
                    <FaMoneyBillTransfer className="mr-[10px] text-[20px] text-blue-gray-500" />
                    To'lovlar tarixi
                </MenuItem>
                <MenuItem className="border flex items-center justify-start h-[50px] mb-[10px]" onClick={() => nv('/dashboard/refs')}>
                    <FaUsers className="mr-[10px] text-[20px] text-blue-gray-500" />
                    Referal
                </MenuItem>
                <MenuItem className="border flex items-center justify-start h-[50px] mb-[10px]" onClick={() => nv('/dashboard/comps')}>
                    <FaGift className="mr-[10px] text-[20px] text-blue-gray-500" />
                    Konkurs
                </MenuItem>
                <MenuItem className="border flex items-center justify-start h-[50px] mb-[10px]" onClick={() => setOpen(true)}>
                    <FaTelegram className="mr-[10px] text-[20px] text-blue-gray-500" />
                    Telegramga bog'lash
                </MenuItem>
            </div>
            <AdminTelegram open={open} setOpen={setOpen} />
        </div>
    );
}

export default AdminMain;