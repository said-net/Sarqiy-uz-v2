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
import ArchivedOrders from "./pages/get-archived-orders";
import HistoryOrders from "./pages/get-history-orders";
import SearchHistoryOrders from "./pages/search-history-orders";
import EditCourier from "./pages/edit-courier";
import Races from "./pages/races";
import Owners from "./pages/owners";
import GetStatUsers from "./pages/get-stat-users";
import GetStatOpers from "./pages/get-stat-opers";
import MainMenu from "./pages/main";
function App() {
  const { refresh, phone, owner } = useSelector(e => e.auth);
  const dp = useDispatch();
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
            <Route path="/edit-courier/:id/:name/:phone/:region" element={<EditCourier />} />
            {/*  */}
            <Route path="/new-orders" element={<NewOrders />} />
            <Route path="/wait-orders" element={<WaitOrders />} />
            <Route path="/owned-orders" element={<OwnedOrders />} />
            <Route path="/print-cheques" element={<PrintCheques />} />
            <Route path="/wait-delivery" element={<GetWaitDeliveries />} />
            <Route path="/sended" element={<SendedOrders />} />
            <Route path="/archive" element={<ArchivedOrders />} />
            <Route path="/reject" element={<RejectedOrders />} />
            <Route path="/delivered" element={<DeliveredOrders />} />
            <Route path="/history" element={<HistoryOrders />} />
            <Route path="/search-history" element={<SearchHistoryOrders />} />
            {/*  */}
            <Route path="/pay-operators" element={<GetOperatorPays />} />
            {/*  */}
            <Route path="/users" element={<Users />} />
            <Route path="/stat-users" element={<GetStatUsers />} />
            <Route path="/stat-opers" element={<GetStatOpers />} />
            <Route path="/race" element={<Races />} />
            <Route path="/main" element={<MainMenu />} />
            {owner && <Route path="/owners" element={<Owners />} />}
          </Routes>
        </div>
        <ToastContainer position="top-center" autoClose={1000} closeButton={false} style={{ zIndex: '9999999999' }} />
      </div>
    );
  }
}

export default App;
