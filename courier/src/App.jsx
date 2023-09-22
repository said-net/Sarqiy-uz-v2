import { useDispatch, useSelector } from "react-redux";
import Auth from "./components/auth";
import { useEffect } from "react";
import axios from "axios";
import { API_LINK } from "./config";
import { setInfoAuth } from "./managers/auth.manager";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/navbar";
import { Route, Routes } from "react-router-dom";
import GetMyOrders from "./pages/get-my-orders";
import GetWaitOrders from "./pages/get-wait-orders";
import GetRejectedOrders from "./pages/get-rejected-orders";
import GetDeliveredOrders from "./pages/get-delivered-orders";
import { setRefresh } from "./managers/refresh.manager";
function App() {
  const { id, refresh, name } = useSelector(e => e.auth);
  const dp = useDispatch();
  document.title = name ? `Kuryer: ${name}` : 'Kirish';
  setInterval(() => {
    const d = new Date().getTime();
    const last = localStorage.getItem('last_update');
    if (!last || Number(last) + 120 < d) {
      dp(setRefresh());
      localStorage.setItem('last_update', d)
    }
  }, 9000 * 12);
  useEffect(() => {
    axios(`${API_LINK}/courier/verify-session`, {
      headers: {
        'x-auth-token': `Bearer ${localStorage.getItem('access')}`
      }
    }).then(res => {
      const { ok, data } = res.data;
      if (ok) {
        dp(setInfoAuth(data));
      }
    })
  }, [refresh])
  if (!id) {
    return (
      <>
        <Auth />
        <ToastContainer autoClose={2000} closeButton={false} position="top-center" style={{ zIndex: '9999999' }} />
      </>
    );
  } else {
    return (
      <div className="flex items-center justify-between w-full h-[100vh]">
        <Navbar />
        <div className="flex items-center justify-start flex-col w-[100%] h-[100vh] overflow-y-scroll p-[70px_10px] ">
          <div className="w-full h-[60px] shadow-sm z-[995] bg-white fixed top-0 left-0"></div>
          <Routes>
            <Route path={'*'} element={<GetMyOrders />} />
            <Route path={'/re-connects'} element={<GetWaitOrders />} />
            <Route path={'/rejected-orders'} element={<GetRejectedOrders />} />
            <Route path={'/delivered-orders'} element={<GetDeliveredOrders />} />
          </Routes>
        </div>
        <ToastContainer autoClose={2000} closeButton={false} position="top-center" style={{ zIndex: '9999999' }} />
      </div>
    );
  }
}

export default App;