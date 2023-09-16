import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { Spinner } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

function Categories() {
    const [isLoad, setIsLoad] = useState(false);
    const [categories, setCategories] = useState([]);
    const nv = useNavigate()
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/category/getall`).then(res => {
            setIsLoad(true);
            const { data, ok } = res.data;
            if (ok) {
                setCategories(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib koring!")
        });
    }, []);
    return (
        <div className="flex items-center justify-start flex-col w-full">
            {!isLoad &&
                <div className="mt-[20px]">
                    <Spinner />
                </div>
            }
            {isLoad && !categories[0] &&
                <div className="flex items-center justify-normal flex-col h-[400px]">
                    <h1>Kategoriyalar mavjud emas!</h1>
                </div>
            }
            {isLoad && categories[0] &&
                <div className="grid grid-cols-3 gap-[20px]">
                    {categories.map((c, i) => {
                        return (
                            <div onClick={() => nv('/get-by-category/' + c.id)} key={i} className="w-[110px] h-[170px] bg-white shadow-sm rounded-[10px] flex items-center justify-center flex-col">
                               <div className="flex items-center justify-center w-[50px] overflow-hidden">
                                <img src={c.image} alt="c" />
                               </div>
                               <p className="text-[12px] mt-[25px] font-bold">{c.title}</p>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    );
}

export default Categories;