import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { Chip, IconButton, Menu, MenuHandler, MenuItem, MenuList, Spinner } from "@material-tailwind/react";
import { BiDotsVertical, BiPencil } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Region from '../components/regions.json'
function Couriers() {
    const [couriers, setCouriers] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const nv = useNavigate();
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/boss/get-all-couriers`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, data } = res.data;
            setIsLoad(true);
            if (ok) {
                setCouriers(data);
            }
        })
    }, []);
    return (
        <div className="flex items-center justify-start flex-col">
            <div className="flex items-center justify-center w-[150px] h-[50px] bg-white shadow-sm rounded-b-[10px] mb-[10px]">
                <h1>KURYERLAR</h1>
            </div>
            <div className="flex items-start justify-start flex-col overflow-x-scroll">
                <div className="flex items-center justify-start w-[900px] h-[70px] border bg-white">
                    <p className="w-[100px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">ID</p>
                    <p className="w-[250px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">ISMI</p>
                    <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">RAQAMI</p>
                    <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">HUDUDI</p>
                    <p className="w-[100px] text-center border-l h-[70px] flex items-center justify-center text-[12px]">MENU</p>
                </div>
                {!isLoad && <Spinner />}
                {isLoad && !couriers[0] && <p>Kuryerlar mavjud emas!</p>}
                {isLoad && couriers[0] &&
                    couriers?.map((c, i) => {
                        return (
                            <div key={i} className="flex items-center justify-start w-[900px] h-[70px] border bg-white">
                                <div className="w-[100px] border-x h-[70px] flex items-center justify-center text-[12px]">
                                    <Chip value={i + 1} color="red" />
                                </div>
                                <p className="w-[250px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">
                                    {c?.name}
                                </p>
                                <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">
                                    {c?.phone}
                                </p>
                                <p className="w-[200px] text-center border-x h-[70px] flex items-center justify-center text-[12px]">
                                    {Region?.find(r=>r?.id === c?.region).name}
                                </p>
                                <div className="flex items-center justify-center w-[100px] border-l h-[70px]">
                                    <Menu>
                                        <MenuHandler>
                                            <IconButton className="rounded-full" color="blue-gray">
                                                <BiDotsVertical className="text-[20px]" />
                                            </IconButton>
                                        </MenuHandler>
                                        <MenuList>
                                            <MenuItem onClick={() => nv(`/edit-courier/${c?.id}/${c?.name}/${c?.phone}/${c?.region}`)} className="flex items-center justify-start">
                                                <BiPencil className="mr-[10px]" />
                                                Taxrirlash
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default Couriers;