import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { API_LINK } from "../config";

function GetFlowsStat() {
    const [flows, setFlows] = useState([]);
    useEffect(() => {
        axios(`${API_LINK}/flow/get-my-flows`, {
            headers: {
                'x-user-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, data } = res.data;
            if (ok) {
                setFlows(data);
            }
        })
    }, []);
    return (
        <div className="flex items-start justify-start flex-col w-full overflow-scroll p-[50px_10px]">
            {/*  */}
            <div className="flex items-center justify-center border border-gray-500">
                <p className="w-[50px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">ID</p>
                <p className="w-[80px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">RASMI</p>
                <p className="w-[110px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">MAHSULOT</p>
                <p className="w-[110px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">NOMI</p>
                <p className="w-[110px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">TASHRIF</p>
                <p className="w-[110px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">YANGI BUYURTMA</p>
                <p className="w-[110px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">ARXIVLANGAN</p>
                <p className="w-[110px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">RAD ETILGAN</p>
                <p className="w-[110px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">KOPIYA</p>
                <p className="w-[110px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">UPAKOVKADA</p>
                <p className="w-[150px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">YETKAZILMOQDA YO'LDA</p>
                <p className="w-[150px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">YETKAZILGAN</p>
                <p className="w-[150px] h-[50px] flex items-center justify-center text-center text-[11px]">FOYDA(SO'M)</p>
            </div>
            {/*  */}
            {flows[0] && flows?.map((f, i) => {
                return (
                    <div key={i} className="flex items-center justify-center border border-gray-500 border-t-0">
                        <p className="w-[50px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                            {f?.id}
                        </p>
                        <div className="w-[80px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                            <img src={f?.image} alt="i" className="w-[30px] rounded-[10px]" />
                        </div>
                        <p className="w-[110px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                            {f?.product}
                        </p>
                        <p className="w-[110px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                            {f?.title}
                        </p>
                        <p className="w-[110px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                            {f?.views}
                        </p>
                        <p className="w-[110px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                            {f?.new_orders}
                        </p>
                        <p className="w-[110px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                            {f?.archived_orders}
                        </p>
                        <p className="w-[110px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                            {f?.rejected_orders}
                        </p>
                        <p className="w-[110px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                            {f?.copy_orders}
                        </p>
                        <p className="w-[110px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                            {f?.success_orders}
                        </p>
                        <p className="w-[150px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                            {f?.sended_orders}
                        </p>
                        <p className="w-[150px] h-[50px] flex items-center justify-center border-r border-gray-500 text-center text-[11px]">
                            {f?.delivered_orders}
                        </p>
                        <p className="w-[150px] h-[50px] flex items-center justify-center text-center text-[11px]">
                            {Number(f?.profit)?.toLocaleString()} So'm
                        </p>
                    </div>
                )
            })}
        </div>
    );
}

export default GetFlowsStat;