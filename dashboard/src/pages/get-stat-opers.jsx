import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { Option, Select, Spinner } from "@material-tailwind/react";

function GetStatOpers() {
    const [users, setUsers] = useState({});
    const [isLoad, setIsLoad] = useState([]);
    const [date, setDate] = useState('today');
    const [status, setStatus] = useState('pending');
    useEffect(() => {
        setIsLoad(false)
        axios(`${API_LINK}/boss/get-stats-opers`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            setIsLoad(true)
            const { data, ok } = res.data;
            console.log(res.data);
            if (ok) {
                setUsers(data);
            }
        })
    }, []);
    return (
        <div className="flex items-start justify-start flex-col w-full overflow-x-scroll mt-[60px]">
            <div className="flex items-center justify-normal flex-col p-[5px] ">
                <div className="flex items-center justify-center w-full h-[140px] shadow-sm bg-white  border-b p-[0_10px] flex-col">
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Select label="Vaqt FILTER" onChange={e => setDate(e)} value={date} variant="standard">
                            <Option value="today">Bugun</Option>
                            <Option value="yesterday">Kecha</Option>
                            <Option value="weekly">Haftalik</Option>
                            <Option value="last_weekly">O'tgan haftalik</Option>
                            <Option value="monthly">Oylik</Option>
                            <Option value="last_monthly">O'tgan oylik</Option>
                        </Select>
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full mb-[10px]">
                        <Select label="Vaqt FILTER" onChange={e => setStatus(e)} value={status} variant="standard">
                            <Option value="copy">Kopiya</Option>
                            <Option value="archive">Arxiv</Option>
                            <Option value="pending">Yangi</Option>
                            <Option value="success">Dostavkaga tayyor</Option>
                            <Option value="sended">Yetkazilmoqda</Option>
                            <Option value="delivered">Yetkazildi</Option>
                        </Select>
                    </div>
                </div>
                <div className="flex items-center justify-between w-full h-[70px] shadow-sm bg-white  border-b p-[0_5px]">
                    <div className="flex items-center justify-between">
                        <p className="w-[50px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">ID</p>
                        <p className="w-[200px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">ISMI</p>
                        <p className="w-[200px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">RAQAMI</p>
                        <p className="w-[200px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">SOTUV</p>
                    </div>
                </div>
                {!isLoad &&
                    <div className="flex items-center justify-center w-full h-[80vh]">
                        <Spinner />
                    </div>
                }
                {isLoad && !users['delivered'] &&
                    <div className="flex items-center justify-center w-full h-[80vh]">
                        <h1>Foydalanuvchilar mavjud emas!</h1>
                    </div>
                }
                {isLoad && users['delivered'] &&
                    users[status][date]?.map((o, i) => {
                        return (
                            <div key={i} className="flex items-center justify-between w-full h-[70px] shadow-sm bg-white  border-b p-[0_5px]">
                                <div className="flex items-center justify-between">
                                    <p className="w-[50px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">
                                        {o?.id}
                                    </p>
                                    <p className="w-[200px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">
                                        {o?.name}
                                    </p>
                                    <p className="w-[200px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">
                                        {o?.phone}
                                    </p>
                                    <p className="w-[200px] text-center border-r h-[70px] flex items-center justify-center text-[13px]">
                                        {o[date][status]} ta
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default GetStatOpers;