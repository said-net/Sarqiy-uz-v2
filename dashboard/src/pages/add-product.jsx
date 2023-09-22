import { Button, Input, Option, Select, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiBox, BiCoin, BiImage, BiMoney, BiPhone, BiUserCheck, BiVideo } from "react-icons/bi";
import { API_LINK } from "../config";
import { toast } from "react-toastify";
import { setRefresh } from "../managers/refresh.manager";
import { useDispatch } from "react-redux";

function AddProduct() {
    const [state, setState] = useState({ title: '', about: '', images: '', value: '', category: '', original_price: '', coin: '', video: '', price: '', for_admins: '', for_operators: '' });
    const [categories, setCategories] = useState([]);
    const [disable, setDisable] = useState(false);
    const dp = useDispatch();
    useEffect(() => {
        axios(`${API_LINK}/category/getall`).then((res) => {
            const { ok, data } = res.data;
            if (ok) {
                setCategories(data);
            }
        })
    }, []);
    function Submit() {
        const { title, category, images, about, price, original_price, value, video, for_admins, for_operators, coin } = state;
        if (!title || !category || ![...images][0] || !about || !price || !original_price || !value || !video || !for_admins || !for_operators || !coin) {
            toast.error("Qatorlarni to'ldiring!")
        } else {
            setDisable(true);

            const form = new FormData();
            form.append('title', title);
            form.append('about', about);
            form.append('category', category);
            form.append('price', price);
            form.append('original_price', original_price);
            form.append('value', value);
            form.append('video', video);
            form.append('coin', coin);
            form.append('for_admins', for_admins);
            form.append('for_operators', for_operators);

            [...images].forEach(image => {
                form.append('images', image)
            });

            axios.post(API_LINK + '/product/create', form, {
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
                    dp(setRefresh());
                    setState({ title: '', about: '', images: '', video: '', price: 0, original_price: 0, category: '', value: '', for_admins: '', for_operators: '', coin: '' });
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
                <h1 className="text-[20px]">MAXSULOT QO'SHISH</h1>
            </div>
            {!categories[0] && <p>Avval kategoriya hosil qilish zarur</p>}
            {categories[0] &&
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
                        <Input disabled={disable} color="red" variant="standard" type="number" label="Qancha mahsulot mavjud" required icon={<BiBox />} value={state.value} onChange={e => setState({ ...state, value: e.target.value })} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full lg:w-[300px] my-[10px] lg:m-[10px]">
                        <Input disabled={disable} color="red" variant="standard" type="number" label="Operatorlar uchun - so'm" required icon={<BiPhone />} value={state.for_operators} onChange={e => setState({ ...state, for_operators: e.target.value })} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full lg:w-[300px] my-[10px] lg:m-[10px]">
                        <Input disabled={disable} color="red" variant="standard" type="file" accept="video/*" label="Video" required icon={<BiVideo />} onChange={e => setState({ ...state, video: e.target.files[0] })} />
                    </div>
                    {/*  */}
                    <div className="flex items-center justify-center w-full lg:w-[300px] my-[10px] lg:m-[10px]">
                        <Input disabled={disable} color="red" variant="standard" type="file" accept="image/*" label="Rasmlar" multiple required icon={<BiImage />} onChange={e => setState({ ...state, images: e.target.files })} />
                    </div>
                    <div className="flex items-center justify-center w-full lg:w-[300px] my-[10px] lg:m-[10px]">
                        <Select disabled={disable} label="Kategoriyani tanlang!" variant="standard" onChange={e => setState({ ...state, category: e })} value={state.category}>
                            {categories?.map((c, i) => {
                                return (
                                    <Option key={i} value={c?.id} className="flex items-center">
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
                </div>
            }
        </div>
    );
}

export default AddProduct;