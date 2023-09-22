import { useEffect } from "react";
import Auth from "./components/auth";
import axios from "axios";
import { API_LINK } from "./config";
import { useSelector, useDispatch } from "react-redux";
import { setInfoAuth } from "./managers/auth.manager";
import Navbar from "./components/navbar";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Products from "./pages/products";
import AddProduct from "./pages/add-product";
import EditProduct from "./pages/edit-product";
import Categories from "./pages/categories";
import AddCategory from "./pages/add-category";
import EditCategory from "./pages/edit-category";
import Operators from "./pages/operators";
import AddOperator from "./pages/add-operator";
import EditOperator from "./pages/edit-operator";
import NewOrders from "./pages/new-orders";
import OwnedOrders from "./pages/owned-orders";
import Users from "./pages/users";

import GetWaitDeliveries from "./pages/get-wait-deliveries";
import AddCourier from "./pages/add-courier";
import Couriers from "./pages/couriers";
import SendedOrders from "./pages/get-sended-orders";
import PrintCheques from "./pages/print-cheques";
import RejectedOrders from "./pages/get-rejected-orders";
import DeliveredOrders from "./pages/get-delivered-orders";
import GetOperatorPays from "./pages/get-operator-pays";
import Dashboard from "./pages/dashboard";
import WaitOrders from "./pages/get-wait-orders";
import { setRefresh } from "./managers/refresh.manager";
function App() {
  const { refresh, phone } = useSelector(e => e.auth);
  const dp = useDispatch();
  setInterval(() => {
    const d = new Date().getTime();
    const last = localStorage.getItem('last_update');
    if (!last || Number(last) + 120 < d) {
      dp(setRefresh());
      localStorage.setItem('last_update', d)
    }
  }, 9000 * 12);
  document.title = phone ? `Ega: ${phone}` : 'Kirish';
  useEffect(() => {
    axios(`${API_LINK}/boss/verify`, {
      headers: {
        'x-auth-token': `Bearer ${localStorage.getItem('access')}`
      }
    }).then((res) => {
      const { ok, data } = res.data;
      if (ok) {
        dp(setInfoAuth(data));
      }
    })
  }, [refresh]);
  if (!phone) {
    return (
      <>
        <Auth />
      </>
    );
  } else {
    return (
      <div className="flex items-center justify-between w-full h-[100vh]">
        <Navbar />
        <div className="flex items-center justify-start flex-col w-[100%] h-[100vh] overflow-y-scroll">
          <Routes>
            <Route path="*" element={<Dashboard />} />
            {/*  */}
            <Route path="/products" element={<Products />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            {/*  */}
            <Route path="/categories" element={<Categories />} />
            <Route path="/add-category" element={<AddCategory />} />
            <Route path="/edit-category/:id" element={<EditCategory />} />
            {/*  */}
            <Route path="/operators" element={<Operators />} />
            <Route path="/add-operator" element={<AddOperator />} />
            <Route path="/edit-operator/:id/:name/:phone" element={<EditOperator />} />
            {/*  */}
            <Route path="/couriers" element={<Couriers />} />
            <Route path="/add-courier" element={<AddCourier />} />
            {/*  */}
            <Route path="/new-orders" element={<NewOrders />} />
            <Route path="/wait-orders" element={<WaitOrders />} />
            <Route path="/owned-orders" element={<OwnedOrders />} />
            <Route path="/print-cheques" element={<PrintCheques />} />
            <Route path="/wait-delivery" element={<GetWaitDeliveries />} />
            <Route path="/sended" element={<SendedOrders />} />
            <Route path="/reject" element={<RejectedOrders />} />
            <Route path="/delivered" element={<DeliveredOrders />} />
            {/*  */}
            <Route path="/pay-operators" element={<GetOperatorPays />} />
            {/*  */}
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
        <ToastContainer position="top-center" autoClose={1000} closeButton={false} style={{ zIndex: '9999999999' }} />
      </div>
    );
  }
}

export default App;
