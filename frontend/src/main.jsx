// external libraries
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// styles and assets
import "./assets/styles/bootstrap.custom.css";
// import 'bootstrap/dist/css/bootstrap.min.css'
import "./assets/styles/index.css";

//functions and data
import store from "../store.js";

// Components
import App from "./App.jsx";
import Home from "./screens/Home.jsx";
import ProductDetails from "./screens/ProductDetails.jsx";
import Cart from "./screens/Cart.jsx";
import Login from "./screens/Login.jsx";
import Register from "./screens/Register.jsx";
import Shipping from "./screens/Shipping.jsx";
import PrivateRoutes from "./components/PrivateRoutes.jsx";
import PlaceOrder from "./screens/PlaceOrder.jsx";
import Order from "./screens/Orders.jsx";
import Profile from "./screens/Profile.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import OrderList from "./screens/admin/OrderList.jsx";
import UsersList from "./screens/admin/UsersList.jsx";
import ProductsList from "./screens/admin/ProductsList.jsx";

// setup router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/*" element={<App />}>
      <Route index element={<Home />} />
      <Route path="page/:pageNumber" element={<Home />} />
      <Route path="search/:keyword" element={<Home />} />
      <Route path="search/:keyword/page/:pageNumber" element={<Home />} />
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="product/:id" element={<ProductDetails />} />
      <Route path="cart" element={<Cart />} />
      <Route path="" element={<PrivateRoutes />}>
        <Route path="shipping" element={<Shipping />} />
        <Route path="placeorder" element={<PlaceOrder />} />
        <Route path="order/:id" element={<Order />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="" element={<AdminRoute />}>
        <Route path="admin/userlist" element={<UsersList />} />
        <Route path="admin/productslist" element={<ProductsList />} />
        <Route
          path="admin/productlist/:pageNumber"
          element={<ProductsList />}
        />
        <Route path="admin/orderlist" element={<OrderList />} />
      </Route>
    </Route>,
  ),
);

// Render the application
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </StrictMode>,
);
