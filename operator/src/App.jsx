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
import MyOrders from "./pages/my-orders";
import ReConnects from "./pages/re-connects";
import RejectedOrders from "./pages/rejected-orders";
import Payment from "./pages/payment";
import SearchOrder from "./pages/search";
import { IconButton } from "@material-tailwind/react";
import { BiRefresh } from "react-icons/bi";
import { setRefresh } from "./managers/refresh.manager";
import WithdrawHistory from "./pages/withdraw-history";
import WaitingOrders from "./pages/waiting-orders";
function App() {
  const { id, refresh, name, sp } = useSelector(e => e.auth);
  const dp = useDispatch();
  document.title = name ? `Operator: ${name}` : 'Kirish';
  useEffect(() => {
    console.log('keldi');
    axios(`${API_LINK}/operator/verify-session`, {
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
          <div className="w-full h-[60px] shadow-sm z-[995] bg-white fixed top-0 left-0 flex items-center justify-end p-[0_10px]">
            <IconButton className="text-[30px] rounded-full" color="blue-gray" onClick={(() => dp(setRefresh()))}>
              <BiRefresh />
            </IconButton>
          </div>
          <Routes>
            <Route path="/*" element={<MyOrders />} />
            <Route path="/re-connects" element={<ReConnects />} />
            <Route path="/rejecteds" element={<RejectedOrders />} />
            <Route path="/withdraw" element={<Payment />} />
            <Route path="/search-order" element={<SearchOrder />} />
            <Route path="/withdraw-history" element={<WithdrawHistory />} />
            {sp && <Route path="/waiting-orders" element={<WaitingOrders />} />}
          </Routes>
        </div>
        <ToastContainer autoClose={2000} closeButton={false} position="top-center" style={{ zIndex: '9999999' }} />
      </div>
    );
  }
}

export default App;