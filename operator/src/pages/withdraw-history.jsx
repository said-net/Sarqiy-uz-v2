import axios from "axios";
import { useEffect, useState } from "react";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { IconButton, Popover, PopoverContent, PopoverHandler, Spinner } from "@material-tailwind/react";
import { BiQuestionMark } from "react-icons/bi";

function WithdrawHistory() {
    const [state, setState] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    useEffect(() => {
        setIsLoad(false);
        axios(`${API_LINK}/operator/get-pays`, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then((res) => {
            const { ok, data, msg } = res.data;
            setIsLoad(true);
            if (!ok) {
                toast.error(msg);
            } else {
                setState(data);
            }
        }).catch(() => {
            setIsLoad(true)
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        });
    }, []);
    return (
        <div className="flex items-center justify-start flex-col w-full">
            {!isLoad && <Spinner />}
            {isLoad && !state[0] && <p>Sizda tarix mavjud emas!</p>}
            {isLoad && state[0] &&
                state?.map((p, i) => {
                    return (
                        <div className="flex items-center justify-start flex-col w-full h-[80px] bg-white mb-[10px] rounded shadow-sm p-[5px]" key={i}>
                            <div className="flex items-center justify-between w-full h-[50px] border-b">
                                <p className="text-[12px]">No: {i + 1}</p>
                                <div className="flex items-center justify-center flex-col">
                                    <p className="text-[12px]">{Number(p?.count).toLocaleString()} so'm</p>
                                    <p className="text-[12px]">{p?.card}</p>
                                </div>
                                <Popover placement="bottom-end">
                                    <PopoverHandler >
                                        <IconButton className="rounded-full text-[20px] shadow-none hover:shadow-none" color="white">
                                            <BiQuestionMark />
                                        </IconButton>
                                    </PopoverHandler>
                                    <PopoverContent className="bg-blue-gray-500 text-white">
                                        {p?.comment}
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <p className="text-[13px] w-full">{p?.created}</p>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default WithdrawHistory;