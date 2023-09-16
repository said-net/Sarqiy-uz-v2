import { Button, Input, Option, Select, Spinner, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiBox, BiCoin, BiImageAdd, BiMoney, BiPhone, BiUserCheck, BiVideo } from "react-icons/bi";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

function EditProduct() {
    const { id } = useParams();
    const [state, setState] = useState({ title: '', about: '', images: '', value: '', category: '', original_price: '', coin: '', video: '', price: '', for_admins: '', for_operators: '', });
    const [isLoad, setIsLoad] = useState(false);
    const [categories, setCategories] = useState([]);
    const [disable, setDisable] = useState(false);
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {
        setIsLoad(false)
        axios(`${API_LINK}/category/getall`).then((res) => {
            const { ok, data } = res.data;
            if (ok) {
                setCategories(data);
            }
        }).then(() => {
            axios(`${API_LINK}/product/getone-to-admin/${id}`, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then(res => {
                const { ok, data } = res.data;
                if (ok) {
                    setState(data);
                    setIsLoad(true);
                }
            })
        })
    }, [refresh]);
    function editVideo(video) {
        setDisable(true);
        axios.putForm(API_LINK + '/product/edit-video/' + id, { video }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            setDisable(false)
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
            }
        }).catch(() => {
            setDisable(false)
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }
    function editPhoto(photo, index) {
        setDisable(true);
        axios.putForm(API_LINK + '/product/edit-image/' + id + '/' + index, { image: photo }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            setDisable(false)
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setRefresh(!refresh);
            }
        }).catch(() => {
            setDisable(false)
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }
    function newImage(photo) {
        setDisable(true);
        axios.putForm(API_LINK + '/product/new-image/' + id, { image: photo }, {
            headers: {
                'x-auth-token': `Bearer ${localStorage.getItem('access')}`
            }
        }).then(res => {
            const { ok, msg } = res.data;
            setDisable(false)
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                setRefresh(!refresh);
            }
        }).catch(() => {
            setDisable(false)
            toast.error("Aloqani tekshirib qayta urunib ko'ring!")
        })
    }
    function Submit() {
        const { title, category, about, price, original_price, for_admins, for_operators, coin } = state;
        if (!title || !category || !about || !price || !original_price || !for_admins || !for_operators || !coin) {
            toast.error("Qatorlarni to'ldiring!")
        } else {
            setDisable(true);
            axios.put(API_LINK + '/product/edit/' + id, { title, category, about, price, original_price, for_admins, for_operators, coin }, {
                headers: {
                    'x-auth-token': `Bearer ${localStorage.getItem('access')}`
                }
            }).then(res => {
                const { ok, msg } = res.data;
                setDisable(false)
                if (!ok) {
                    toast.error(msg);
                } else {
                    toast.success(msg);
                }
            }).catch(() => {
                setDisable(false)
                toast.error("Aloqani tekshirib qayta urunib ko'ring!")
            })
        }
    }
    return (
        <div className="flex items-center justify-start w-full flex-col">
            <div className="flex items-center justify-center p-[10px_20px] rounded-b bg-white mb-[20px]">
                <h1 className="text-[20px]">MAXSULOT TAXRIRLASH</h1>
            </div>
            {!isLoad && <Spinner />}
            {isLoad &&
                <div className="flex items-center justify-start w-[90%] flex-wrap bg-white p-[10px]">
                    {/*  */}
                    <div className="flex items-center justify-center w-full lg:w-[300px] my-[10px] lg:m-[10px]">
                        <Input disabled={disable} color="red" variant="standard" label="Mahsulot nomi" required icon={<BiBox />} value={state.title} onChange={e => setState({ ...state, title: e.target.value })} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full lg:w-[300px] my-[10px] lg:m-[10px]">
                        <Input disabled={disable} color="red" variant="standard" type="number" label="Mahsulot asl narxi - so'm" required icon={<BiMoney />} value={state.original_price} onChange={e => setState({ ...state, original_price: e.target.value })} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full lg:w-[300px] my-[10px] lg:m-[10px]">
                        <Input disabled={disable} color="red" variant="standard" type="number" label="Mahsulot sotuv narxi - so'm" required icon={<BiMoney />} value={state.price} onChange={e => setState({ ...state, price: e.target.value })} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full lg:w-[300px] my-[10px] lg:m-[10px]">
                        <Input disabled={disable} color="red" variant="standard" type="number" label="Adminlar uchun - so'm" required icon={<BiUserCheck />} value={state.for_admins} onChange={e => setState({ ...state, for_admins: e.target.value })} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full lg:w-[300px] my-[10px] lg:m-[10px]">
                        <Input disabled={disable} color="red" variant="standard" type="number" label="Coin" required icon={<BiCoin />} value={state.coin} onChange={e => setState({ ...state, coin: e.target.value })} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full lg:w-[300px] my-[10px] lg:m-[10px]">
                        <Input disabled={disable} color="red" variant="standard" type="number" label="Operatorlar uchun - so'm" required icon={<BiPhone />} value={state.for_operators} onChange={e => setState({ ...state, for_operators: e.target.value })} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full lg:w-[300px] my-[10px] lg:m-[10px]">
                        <Input disabled={disable} color="red" variant="standard" type="file" accept="video/*" label="Video" required icon={<BiVideo />} onChange={e => editVideo(e.target.files[0])} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full lg:w-[300px] my-[10px] lg:m-[10px]">
                        <Select disabled={disable} label="Kategoriyani tanlang!" variant="standard" value={state?.category} onChange={e => setState({ ...state, category: e })} >
                            {categories?.map((c, i) => {
                                return (
                                    <Option key={i} value={`${c?.id}`}>
                                        {c?.title}
                                    </Option>
                                )
                            })}
                        </Select>
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full my-[10px]">
                        <Textarea disabled={disable} color="red" variant="standard" label="Batafsil ma'lumot" onChange={e => setState({ ...state, about: e.target.value })} value={state.about} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full my-[10px]">
                        <Button disabled={disable} onClick={Submit} color="red" className="rounded" fullWidth>
                            Saqlash
                        </Button>
                    </div>
                    {state?.images[0] &&
                        state?.images?.map((im, i) => {
                            return (
                                <div key={i} className="flex items-center justify-center w-[150px] h-[200px] overflow-hidden m-[10px] rounded-[20px] cursor-pointer duration-500 hover:shadow-md relative">
                                    <label className="absolute w-full h-[200px] top-0 left-0">
                                        <input type="file" className="hidden" accept="image/*" onChange={e => editPhoto(e.target.files[0], i)} />
                                    </label>
                                    <img src={im} alt={i} />
                                </div>
                            )
                        })
                    }
                    {state?.images[0] && state?.images?.length < 5 &&
                        <div className="flex items-center justify-center w-[150px] h-[150px] rounded-full bg-blue-gray-100 cursor-pointer hover:shadow-md duration-500 relative overflow-hidden">
                            <label className="w-[150px] h-[150px] absolute top-0 left-0">
                                <input type="file" className="hidden" accept="image/*" onChange={e => newImage(e.target.files[0])} />
                            </label>
                            <BiImageAdd className="text-[50px] text-white" />
                        </div>
                    }
                </div>
            }

        </div>
    );
}

export default EditProduct;