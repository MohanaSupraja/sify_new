import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'react-toastify';

const initialState = {
    activityData: [],
    status: 'idle',
    error: null,
};

export const addActivity = createAsyncThunk('activity/addActivity', async ({ websiteName, websiteElementId }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3001/add-activity',
            { websiteName, websiteElementId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return { message: response.data.message, data: response.data.data }; // Assuming response.data.data is the newly added activity
    } catch (error) {
        console.log("Error occurred:", error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
});

export const getActivities = createAsyncThunk('activity/getActivities', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/get-activities', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("getactivities : ", response.data);
        return response.data;
    } catch (error) {
        console.log("Error occurred:", error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
});

export const updateActivities = createAsyncThunk('update-activities', async (values, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3001/update-activities',
            values,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return { message: response.data.message, data: response.data.data };
    } catch (error) {
        console.log("Error occurred:", error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
});

export const removeActivities = createAsyncThunk('remove-activities', async (values, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3001/remove-activities',
            values,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("res:", response.data);
        return response.data;
    } catch (error) {
        console.log("Error occurred:", error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
});


const activitySlice = createSlice({
    name: 'activity',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addActivity.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addActivity.fulfilled, (state, action) => {
                state.status = 'succeeded';

                toast.success('Activity added Successfully');

            })
            .addCase(addActivity.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.message : action.error.message;
                toast.error(`${state.error}`);
            })
            .addCase(getActivities.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getActivities.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.activityData = action.payload;
            })
            .addCase(getActivities.rejected, (state, action) => {
                state.status = 'failed';
                state.activityData = []
                toast.error("Session expired");
            })
            .addCase(removeActivities.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log(action.payload)
                toast.success("Removed Successfully");
            })
            .addCase(removeActivities.rejected, (state, action) => {
                state.status = 'failed';

            })
            .addCase(updateActivities.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateActivities.fulfilled, (state, action) => {
                state.status = 'succeeded';
                toast.success(action.payload.message); // Display success message
            })
            .addCase(updateActivities.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload.message : action.error.message;
                // toast.error("Session expired");
                // toast.error('Cannot update status. Another activity is already in active state.');
            });
    },
});

export default activitySlice.reducer;
export const selectActivityData = (state) => state.activity.activityData; // Selector function
