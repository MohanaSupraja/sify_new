import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'react-toastify';

const initialState = {
    extractedData: [],
    savedData: [],
    tempData:[],
    getAll:[]
};

export const extractProducts = createAsyncThunk("extract-products", async ({ url, elementId }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post("http://localhost:3001/extract-products", 
            { url, elementId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data.message, response.data.data);
        return response.data.data;
    } catch (error) {
        console.log("Error occurred:", error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
});

export const saveAll = createAsyncThunk("save-all", async ({ data }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        console.log("data:", data);
        const response = await axios.post("http://localhost:3001/save-all", 
            { data },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data.message, response.data.count);
        return { data: response.data.data, count: response.data.count };
    } catch (error) {
        console.log("Error occurred:", error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
});

export const editAll = createAsyncThunk("edit-all", async ({editprev,editItem}, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        console.log("Edit-data:", editprev,editItem);
        const response = await axios.put("http://localhost:3001/edit-all", 
            {editprev,editItem},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data.message);
        return { data: response.data.data };
    } catch (error) {
        console.log("Error occurred:", error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
});

export const getAllProducts = createAsyncThunk("get-all", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:3001/get-all", {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("data:", response.data);
        return { data: response.data };
    } catch (error) {
        console.log("Error occurred:", error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
});

export const storeProduct = createAsyncThunk("store-products", async ({ data, websiteName, activityId }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        console.log("Sending data to server:", data, websiteName, activityId);
        const response = await axios.post("http://localhost:3001/store-products", 
            { data, websiteName, activityId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data.message, response.data.data);
        return response.data.data;
    } catch (error) {
        console.log("Error occurred:", error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
});

export const gettempProduct = createAsyncThunk("gettemp-products", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:3001/gettemp-products", {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data.message, response.data.data);
        return response.data.data;
    } catch (error) {
        console.log("Error occurred:", error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
});

export const removetempProduct = createAsyncThunk("removetemp-products", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post("http://localhost:3001/removetemp-products", null, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data.message, response.data.count);
        return response.data.count;
    } catch (error) {
        console.log("Error occurred:", error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
});

export const deletetempitem = createAsyncThunk("deletetempitem", async ({ name }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        console.log("name:", name);
        const response = await axios.post("http://localhost:3001/deletetempitem", 
            { name },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data.message, response.data.count);
        return response.data.count;
    } catch (error) {
        console.log("Error occurred:", error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
});

const extractSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(extractProducts.rejected, (state) => {
                toast.error("Session Expired");
            })
            .addCase(extractProducts.fulfilled, (state, action) => {
                state.extractedData = action.payload;
            })
            .addCase(gettempProduct.fulfilled, (state, action) => {
                state.tempData = action.payload; 
            })
            .addCase(gettempProduct.rejected, (state, action) => {
                toast.error("Session Expired");
            })
            .addCase(saveAll.rejected, (state) => {
                toast.error("Session Expired");
            })
            .addCase(saveAll.fulfilled, (state, action) => {
                state.savedData = action.payload;
                toast.success(`${action.payload.count} Saved Successfully`);
            })
            .addCase(editAll.rejected, (state) => {
                toast.error("Session Expired");
            })
            .addCase(storeProduct.rejected, (state, action) => {
                toast.error("Session Expired");
            })
            .addCase(getAllProducts.rejected, (state) => {
                toast.error("Session Expired");
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                console.log(action.payload.data)
                state.getAll = action.payload.data;
                // toast.success(`${action.payload.count} Saved Successfully`);
            })
            .addCase(removetempProduct.rejected, (state, action) => {
                toast.error("Session Expired");
            })
           
            .addCase(deletetempitem.rejected,(state,action)=>{
                toast.error("Session Expired");
            });
            
    },
});
 
export default extractSlice.reducer;
export const extractedData = (state) => state.products.extractedData;
export const savedData = (state) => state.products.savedData;
export const tempData = (state) => state.products.tempData;
export const data = (state)=>state.products.getAll;