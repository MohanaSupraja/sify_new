import { configureStore } from '@reduxjs/toolkit';
import webReducer from './webSlice';
import userSlice from './userSlice';
import extractSlice from './extractSlice';
import activitySlice from './activitySlice';
import categorySlice from './categorySlice';
import webSlice from './webSlice';

const store = configureStore({
    reducer: {
        websites: webSlice,
        user: userSlice,
        products: extractSlice,
        activity: activitySlice,
        categories: categorySlice,
    },
});

export default store;
