import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { Chip, IconButton, Menu, MenuHandler, MenuItem, MenuList, Spinner } from "@material-tailwind/react";
import { BiDotsVertical, BiPencil } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const nv = useNavigate();
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/category/getall`).then((res) => {
            const { ok, data } = res.data;
            setIsLoad(true);
            if (ok) {
                setCategories(data);
            }
        })
    }, []);
    return (
        <div className="flex items-center justify-start flex-col w-full">
            <div className="flex items-center justify-center w-[150px] h-[50px] bg-white shadow-sm rounded-b-[10px] mb-[10px]">
                <h1>KATEGORIYALAR</h1>
            </div>
            <div className="flex items-start justify-start flex-col w-full overflow-x-scroll">
                <div className="flex items-center justify-start w-[1050px] h-[70px] border bg-white">
                    <p className="w-[10%] text-center border-x h-[70px] flex items-center justify-center text-[12px]">ID</p>
                    <p className="w-[25%] text-center border-x h-[70px] flex items-center justify-center text-[12px]">RASMI</p>
                    <p className="w-[30%] text-center border-x h-[70px] flex items-center justify-center text-[12px]">NOMI</p>
                    <p className="w-[20%] text-center border-x h-[70px] flex items-center justify-center text-[12px]">MAXSULOTLAR</p>
                    <p className="w-[10%] text-center border-l h-[70px] flex items-center justify-center text-[12px]">MENU</p>
                </div>
                {!isLoad && <Spinner />}
                {isLoad && !categories[0] && <p>Kategoriyalar mavjud emas!</p>}
                {isLoad && categories[0] &&
                    categories?.map((c, i) => {
                        return (
                            <div key={i} className="flex items-center justify-start w-[1050px] h-[70px] border bg-white">
                                <div className="w-[10%] border-x h-[70px] flex items-center justify-center text-[12px]">
                                    <Chip value={i + 1} color="red" />
                                </div>
                                <p className="w-[25%] text-center border-x h-[70px] flex items-center justify-center text-[12px]">
                                    <img src={c?.image} alt={i} className="w-[50px]" />
                                </p>
                                <p className="w-[30%] text-center border-x h-[70px] flex items-center justify-center text-[12px]">
                                    {c?.title}
                                </p>
                                <p className="w-[20%] text-center border-x h-[70px] flex items-center justify-center text-[12px]">
                                    {c?.products}
                                </p>
                                <div className="flex items-center justify-center w-[10%] border-l h-[70px]">
                                    <Menu>
                                        <MenuHandler>
                                            <IconButton className="rounded-full" color="blue-gray">
                                                <BiDotsVertical className="text-[20px]" />
                                            </IconButton>
                                        </MenuHandler>
                                        <MenuList>
                                            <MenuItem onClick={() => nv('/edit-category/' + c?.id)} className="flex items-center justify-start">
                                                <BiPencil className="mr-[10px]" />
                                                Taxrirlash
                                            </MenuItem>
                                            {/* <MenuItem className="flex items-center justify-start text-red-500">
                                                <BiTrash className="mr-[10px]" />
                                                O'chirish
                                            </MenuItem> */}
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

export default Categories;