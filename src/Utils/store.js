import { configureStore } from "@reduxjs/toolkit"
import cartSlice from "./cartSlice.js";
import orderSlice from "./orderSlice.js";

const store = configureStore({
    reducer: {
        cart: cartSlice,
        orderHistory: orderSlice,
    }
});


export default store;