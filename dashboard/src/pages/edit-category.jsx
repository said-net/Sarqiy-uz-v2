import { Button, Input } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiListCheck } from "react-icons/bi";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

function EditCategory() {
    const { id } = useParams();
    const [state, setState] = useState({ image: '', title: '' });
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {
        axios(`${API_LINK}/category/getone/${id}`).then(res => {
            const { ok, data, msg } = res.data;
            if (!ok) {
                toast.error(msg)
            } else {
                setState(data);
            }
        }).catch(() => {
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        });
    }, [refresh]);
    const [disable, setDisable] = useState(false)
    function Submit(type, image) {
        if (type === 'image') {
            setDisable(true)
            axios.putForm(`${API_LINK}/category/edit/${id}/image`, { image }, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then((res) => {
                const { ok, msg } = res.data;
                setDisable(false)
                if (ok) {
                    toast.success(msg);
                    setRefresh(!refresh)
                } else {
                    toast.error(msg)
                }
            }).catch(() => {
                setDisable(false)
                toast.error("Aloqani tekshirisb qayta urunib ko'ring!")
            });
        } else {
            setDisable(true)
            axios.put(`${API_LINK}/category/edit/${id}/title`, { title: state.title }, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then((res) => {
                const { ok, msg } = res.data;
                setDisable(false)
                if (ok) {
                    toast.success(msg);
                    // setRefresh(!refresh)
                } else {
                    toast.error(msg)
                }
            }).catch(() => {
                setDisable(false)
                toast.error("Aloqani tekshirisb qayta urunib ko'ring!")
            });
        }
    }
    return (
        <div className="flex items-center justify-start flex-col w-full">
            <div className="flex items-center justify-center w-[250px] h-[50px] bg-white shadow-sm rounded-b-[10px] mb-[20px]">
                <h1 className="text-[20px]">KATEGORIYA QO'SHISH</h1>
            </div>
            <div className="flex items-start justify-start rounded flex-col bg-white p-[10px]">
                <div className="flex items-center justify-center  mb-[10px]">
                    <div className="flex items-center justify-center w-[150px] h-[150px] bg-blue-gray-50 rounded-full overflow-hidden mr-[10px]">
                        <img src={state?.image} className="w-[100px]" alt="rasm" />
                    </div>
                    <label className="p-[10px_20px] bg-red-500 text-white rounded shadow-sm cursor-pointer">
                        RASM TANLASH
                        <input disabled={disable} type="file" accept="image/*" className="hidden" onChange={e => Submit('image', e.target.files[0])} />
                    </label>
                </div>
                <div className="flex items-center justify-center w-[300px] mb-[10px]">
                    <Input disabled={disable} label="Kategoriya nomi" variant="standard" value={state.title} onChange={e => setState({ ...state, title: e.target.value })} icon={<BiListCheck />} />
                </div>
                <div className="flex items-center justify-center w-[300px]">
                    <Button disabled={disable} onClick={Submit} color="red" className="rounded w-full">Saqlash</Button>
                </div>
            </div>
        </div>
    );
}

export default EditCategory;