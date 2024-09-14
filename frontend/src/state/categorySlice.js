import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialState = {
  categoriesData: [],
};

export const addsylviecategory = createAsyncThunk('add-sylviecategory', async ({ category }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:3001/add-sylviecategory', 
      { category }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success('Category added successfully!');
    return response.data;
  } catch (error) {
    if(error.response && error.response.data.message == "Token expired"){
      toast.error('Session Expired');
    return rejectWithValue(error.response ? error.response.data : error.message);
    }
    else{

    toast.error('Failed to add category!');
    return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
});

export const getsylviecategory = createAsyncThunk('get-sylviecategory', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3001/get-sylviecategory', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error occurred:", error.response ? error.response.data : error.message);
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

export const removesylviecategory = createAsyncThunk('remove-sylviecategory', async ({ deleteItem }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:3001/remove-sylviecategory', 
      { deleteItem },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

export const updatesylviecategory = createAsyncThunk('update-sylviecategory', async ({ name, newName }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put('http://localhost:3001/update-sylviecategory', 
      { name, newName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success('Category updated successfully!');
    return response.data;
  } catch (error) {
    toast.error('Failed to update category!');
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addsylviecategory.fulfilled, (state, action) => {
        // Handle successful addition here
      })
      .addCase(addsylviecategory.rejected, (state, action) => {
        // Handle addition failure here
      })
      .addCase(getsylviecategory.fulfilled, (state, action) => {
        state.categoriesData = action.payload;
      })
      .addCase(getsylviecategory.rejected, (state, action) => {
       console.log("getcat session expired")
      })
      .addCase(removesylviecategory.fulfilled, (state, action) => {
        // Handle successful removal here
      })
      .addCase(removesylviecategory.rejected, (state, action) => {
        toast.error("Session Expired");
      })
      .addCase(updatesylviecategory.fulfilled, (state, action) => {
        // Handle successful update here
      })
      .addCase(updatesylviecategory.rejected, (state, action) => {
        toast.error("Session Expired");
            });
  },
});

export default categorySlice.reducer;

export const selectcategoriesData = (state) => state.categories.categoriesData;
