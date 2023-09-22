import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { API_LINK } from "../config";
import { FaUsers, FaUserMinus, FaPhone, FaMoneyBill, FaMoneyCheck, FaShoppingCart, FaMoneyBillWave } from 'react-icons/fa'
function Dashboard() {
    const [state, setState] = useState({ users: 0, operators: 0, operator_balance: 0, admin_balance: 0, blocked_users: 0, shops: 0, admin_shops: 0, today_shops: 0, today_profit: 0, yesterday_shops: 0, yesterday_profit: 0, weekly_shops: 0, weekly_profit: 0, last_weekly_shops: 0, last_weekly_profit: 0, monthly_shops: 0, monthly_profit: 0, last_monthly_shops: 0, last_monthly_profit: 0, yearly_shops: 0, yearly_profit: 0, total_shops: 0, total_profit: 0 });
    const [isLoad, setIsLoad] = useState(false);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/boss/get-dashboard`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            setIsLoad(true);
            const { ok, data } = res.data;
            if (ok) {
                setState({ ...state, ...data })
            }
        });
    }, []);
    return (
        <div className="flex items-center justify-start flex-col w-full p-[50px_10px]">
            <div className="flex items-center justify-center w-full flex-wrap">
                {/* ADMINS */}
                <div className="flex items-center justify-between w-[300px] h-[70px] bg-white rounded-full shadow-sm p-[10px] m-[10px]">
                    <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-green-50">
                        <FaUsers className="text-[40px] text-green-500" />
                    </div>
                    <div className="flex items-end justify-start flex-col pr-[10px]">
                        <p className="text-[13px]">ADMINLAR</p>
                        <p className="text-[25px]">{state?.users} ta</p>
                    </div>
                </div>
                {/* BLOCKEDS */}
                <div className="flex items-center justify-between w-[300px] h-[70px] bg-white rounded-full shadow-sm p-[10px] m-[10px]">
                    <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-red-50">
                        <FaUserMinus className="text-[40px] text-red-500" />
                    </div>
                    <div className="flex items-end justify-start flex-col pr-[10px]">
                        <p className="text-[13px]">BLOKLANGANLAR</p>
                        <p className="text-[25px]">{state?.blocked_users} ta</p>
                    </div>
                </div>
                {/* OPERS */}
                <div className="flex items-center justify-between w-[300px] h-[70px] bg-white rounded-full shadow-sm p-[10px] m-[10px]">
                    <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-blue-50">
                        <FaPhone className="text-[40px] text-blue-500" />
                    </div>
                    <div className="flex items-end justify-start flex-col pr-[10px]">
                        <p className="text-[13px]">OPERATORLAR</p>
                        <p className="text-[25px]">{state?.operators} ta</p>
                    </div>
                </div>
                {/* ADMIN BALANCE */}
                <div className="flex items-center justify-between w-[300px] h-[70px] bg-white rounded-full shadow-sm p-[10px] m-[10px]">
                    <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-orange-50">
                        <FaMoneyBill className="text-[40px] text-orange-500" />
                    </div>
                    <div className="flex items-end justify-start flex-col pr-[10px]">
                        <p className="text-[13px]">ADMINLAR HISOBI</p>
                        <p className="text-[25px]">{Number(state?.admin_balance).toLocaleString()} so'm</p>
                    </div>
                </div>
                {/* OPER BALANCE */}
                <div className="flex items-center justify-between w-[300px] h-[70px] bg-white rounded-full shadow-sm p-[10px] m-[10px]">
                    <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-purple-50">
                        <FaMoneyCheck className="text-[40px] text-purple-500" />
                    </div>
                    <div className="flex items-end justify-start flex-col pr-[10px]">
                        <p className="text-[13px]">OPERATORLAR HISOBI</p>
                        <p className="text-[25px]">{Number(state?.operator_balance).toLocaleString()} so'm</p>
                    </div>
                </div>
                {/* DELIVEREDS */}
                <div className="flex items-center justify-between w-[300px] h-[70px] bg-white rounded-full shadow-sm p-[10px] m-[10px]">
                    <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-light-blue-50">
                        <FaShoppingCart className="text-[40px] text-light-blue-500" />
                    </div>
                    <div className="flex items-end justify-start flex-col pr-[10px]">
                        <p className="text-[13px]">SOTUVLAR</p>
                        <p className="text-[25px]">{Number(state?.shops).toLocaleString()} ta</p>
                    </div>
                </div>
                {/* ADMIN DELIVERED */}
                <div className="flex items-center justify-between w-[300px] h-[70px] bg-white rounded-full shadow-sm p-[10px] m-[10px]">
                    <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-deep-orange-50">
                        <FaShoppingCart className="text-[40px] text-deep-orange-500" />
                    </div>
                    <div className="flex items-end justify-start flex-col pr-[10px]">
                        <p className="text-[13px]">ADMINLAR SOTUVI</p>
                        <p className="text-[25px]">{Number(state?.admin_shops).toLocaleString()} ta</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center w-full mt-[50px] bg-white rounded-[20px] p-[10px]  flex-wrap shadow-md">
                {/*  */}
                <div className="flex items-center justify-center w-[350px] h-[50px] border border-l-[5px] border-red-300 rounded shadow-sm text-blue-gray-800 text-[13px] m-[5px]">
                    <FaMoneyBillWave className="mr-[10px] text-[16px]" />
                    <p>Bugun: {state?.today_shops} ta ({Number(state?.today_profit).toLocaleString()} so'm)</p>
                </div>
                {/*  */}
                <div className="flex items-center justify-center w-[350px] h-[50px] border border-l-[5px] border-purple-300 rounded shadow-sm text-blue-gray-800 text-[13px] m-[5px]">
                    <FaMoneyBillWave className="mr-[10px] text-[16px]" />
                    <p>Kecha: {state?.yesterday_shops} ta ({Number(state?.yesterday_profit).toLocaleString()} so'm)</p>
                </div>
                {/*  */}
                <div className="flex items-center justify-center w-[350px] h-[50px] border border-l-[5px] border-red-300 rounded shadow-sm text-blue-gray-800 text-[13px] m-[5px]">
                    <FaMoneyBillWave className="mr-[10px] text-[16px]" />
                    <p>Hafta: {state?.weekly_shops} ta ({Number(state?.weekly_profit).toLocaleString()} so'm)</p>
                </div>
                {/*  */}
                <div className="flex items-center justify-center w-[350px] h-[50px] border border-l-[5px] border-purple-300 rounded shadow-sm text-blue-gray-800 text-[13px] m-[5px]">
                    <FaMoneyBillWave className="mr-[10px] text-[16px]" />
                    <p>Otgan Hafta: {state?.last_weekly_shops} ta ({Number(state?.last_weekly_profit).toLocaleString()} so'm)</p>
                </div>
                {/*  */}
                <div className="flex items-center justify-center w-[350px] h-[50px] border border-l-[5px] border-red-300 rounded shadow-sm text-blue-gray-800 text-[13px] m-[5px]">
                    <FaMoneyBillWave className="mr-[10px] text-[16px]" />
                    <p>Oylik: {state?.monthly_shops} ta ({Number(state?.monthly_profit).toLocaleString()} so'm)</p>
                </div>
                {/*  */}
                <div className="flex items-center justify-center w-[350px] h-[50px] border border-l-[5px] border-purple-300 rounded shadow-sm text-blue-gray-800 text-[13px] m-[5px]">
                    <FaMoneyBillWave className="mr-[10px] text-[16px]" />
                    <p>Otgan Oylik: {state?.last_monthly_shops} ta ({Number(state?.last_monthly_profit).toLocaleString()} so'm)</p>
                </div>
                {/*  */}
                <div className="flex items-center justify-center w-[350px] h-[50px] border border-l-[5px] border-red-300 rounded shadow-sm text-blue-gray-800 text-[13px] m-[5px]">
                    <FaMoneyBillWave className="mr-[10px] text-[16px]" />
                    <p>Yillik: {state?.yearly_shops} ta ({Number(state?.yearly_profit).toLocaleString()} so'm)</p>
                </div>
                {/*  */}
                <div className="flex items-center justify-center w-[350px] h-[50px] border border-l-[5px] border-purple-300 rounded shadow-sm text-blue-gray-800 text-[13px] m-[5px]">
                    <FaMoneyBillWave className="mr-[10px] text-[16px]" />
                    <p>Umumiy: {state?.total_shops} ta ({Number(state?.total_profit).toLocaleString()} so'm)</p>
                </div>
                {/*  */}
            </div>
        </div>
    );
}

export default Dashboard;