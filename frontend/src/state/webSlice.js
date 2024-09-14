import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'react-toastify';


// Define the initial state
const initialState = {
  webData: [],
  categoriesData: [],
  subcategoriesData: [],
  masterData: [],
  prices: [],
  totalData: []

};
export const websiteLength = createAsyncThunk("website-length", async ({ sourceId }) => {
  const response = await axios.post("http://localhost:3001/website-length", { sourceId });
  console.log("length:", response.data);
  return response.data;
});

// export const fetchLastId = createAsyncThunk(
//     "fetch-lastid",
//     async ({ sourceId, currentPage, categorySearch = "", subcategorySearch = "" }) => {
//         const response = await axios.post("http://localhost:3001/fetch-lastid", {
//             sourceId,
//             currentPage,
//             categorySearch,
//             subcategorySearch
//         });
//         console.log("fetch lastid:", response.data);
//         return response.data;
//     }
// );
export const fetchLastId = createAsyncThunk(
  "fetch-lastid",
  async ({ tabIndex, label = "" }) => {
    try {
      console.log("label:", label)
      const token = localStorage.getItem('token');
      const response = await axios.post("http://localhost:3001/fetch-lastid", {
        tabIndex,
        label
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // localStorage.setItem(label, JSON.stringify(response.data))
      console.log("fetch lastidd:", response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.log("Error response data:", error.response.data);
        return error.response.data;
      }
    }
  }
);
export const fetchMore = createAsyncThunk("fetch-more", async ({ name, label }, { rejectWithValue }) => {
  try {
    console.log("name:", name, label)
    const token = localStorage.getItem('token');
    const response = await axios.post("http://localhost:3001/fetch-more", {
      name,
      label
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // localStorage.setItem(label, JSON.stringify(response.data))
    console.log("fetch more:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log("Error response data:", error.response.data);
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue({ message: "An unexpected error occurred" });
    }
  }
}
);

export const fetchLength = createAsyncThunk("fetch-length", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      "http://localhost:3001/fetch-length",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Fetched lengths:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log("Error response data:", error.response.data);
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue({ message: "An unexpected error occurred" });
    }
  }
});


export const comparePrice = createAsyncThunk(
  "compare-price",
  async ({ categoryFilter, labelValue }, { rejectWithValue }) => {
    try {
      console.log("in compare price", categoryFilter, labelValue);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/compare-price",
        { categoryFilter, labelValue }, // Include labelValue in the payload
        {
          headers: { Authorization: `Bearer ${token}` }, // headers object
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.log("Error response data:", error.response.data);
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: "An unexpected error occurred" });
      }
    }
  }
);




export const fetchWebsites = createAsyncThunk("fetch-Web", async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get("http://localhost:3001/fetch-web", {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log("Error response data:", error.response.data);
      return error.response.data;
    }
  }
});

export const addWebsite = createAsyncThunk(
  "add-Web",
  async ({ name, url, elementId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        "http://localhost:3001/add-Web",
        { name, url, elementId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("hii:", response.data);
      return response.data; // Fulfilled if no token expiration
    } catch (error) {
      if (error.response) {
        console.log("Error response data:", error.response.data);
        return rejectWithValue(error.response.data); // Reject with response data
      } else {
        return rejectWithValue({ message: 'An unexpected error occurred' });
      }
    }
  }
);


export const removeWebsite = createAsyncThunk("remove-Web", async (values, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    console.log("remove:", values);
    const response = await axios.post("http://localhost:3001/remove-Web",
      values,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log("Error response data:", error.response.data);
      return rejectWithValue(error.response.data); // Reject with response data
    } else {
      return rejectWithValue({ message: 'An unexpected error occurred' });
    }
  }
});

export const updateWebsite = createAsyncThunk('update-Web', async (values, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    console.log(values)
    const response = await axios.put('http://localhost:3001/update-Web',
      values,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Update website', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log("Error response data:", error.response.data);
      return rejectWithValue(error.response.data); // Reject with response data
    } else {
      return rejectWithValue({ message: 'An unexpected error occurred' });
    }
  }
});

export const updatecategory = createAsyncThunk("update-category", async ({ label, name, category }) => {
  try {
    console.log("update category& uid :", label, name, category);
    const token = localStorage.getItem('token');
    const response = await axios.put("http://localhost:3001/update-category", { label, name, category },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
  catch (error) {
    if (error.response) {
      console.log("Error response data:", error.response.data);
      return error.response.data;
    }
  }
});

export const addcategories = createAsyncThunk("add-categories", async () => {
  // console.log("webslice categoried :", categories);
  const response = await axios.post("http://localhost:3001/add-categories");
  console.log("response data:", response.data);
  return response.data;

});
export const addcategory = createAsyncThunk("add-category", async ({ category }) => {
  console.log("new category :", category);
  const response = await axios.post("http://localhost:3001/add-category", { category });
  console.log("response data:", response.data);
  return response.data;

});
export const addsubcategory = createAsyncThunk("add-subcategory", async ({ category, subcategory }) => {
  console.log("Adding new subcategory to category:", category, "subcategory:", subcategory);
  const response = await axios.post("http://localhost:3001/add-subcategory", { category, subcategory });
  console.log("Response data:", response.data);
  return response.data;
});
export const removecategory = createAsyncThunk('remove-category', async ({ category }) => {
  try {
    const response = await axios.post('http://localhost:3001/remove-category', { category });
    console.log("response.data", response.data)
    if (response.data.message === "Category removed successfully")
      toast.success("Category removed successfully");
    // else
    // toast.error(response.data.message);
    return response.data;
  } catch (error) {
    throw error; // Let Redux handle the error
  }
}
);
export const removesubcategory = createAsyncThunk("remove-subcategory", async ({ category, subcategory }) => {
  console.log("Adding new subcategory to category:", category, "subcategory:", subcategory);
  const response = await axios.post("http://localhost:3001/remove-subcategory", { category, subcategory });
  console.log("response data:", response.data);
  if (response.data.message === "Subcategory removed successfully")
    toast.success("Subcategory removed successfully");

  return response.data;

});


export const updatesubcategory = createAsyncThunk("update-subcategory", async ({ uid, subcategory }) => {
  console.log("update subcategory& uid :", uid, subcategory);
  const response = await axios.put("http://localhost:3001/update-subcategory", { uid, subcategory });
  console.log("response data:", response.data);
  return response.data;
});
export const getcategories = createAsyncThunk("get-categories", async () => {
  const response = await axios.get("http://localhost:3001/get-categories");
  console.log("response data:", response.data);
  return response.data;

});
export const addSubcategories = createAsyncThunk("add-subcategories", async () => {
  // console.log("webslice sub categoried :", subcategories);
  const response = await axios.post("http://localhost:3001/add-subcategories");
  console.log("response data:", response.data);
  return response.data;
});
export const getsubcategories = createAsyncThunk("get-subcategories", async () => {
  const response = await axios.get("http://localhost:3001/get-subcategories");
  console.log("response data sub cate:", response.data);
  return response.data;

});
export const editCategoryy = createAsyncThunk("edit-category", async ({ oldCategory, newCategory }) => {
  console.log("edit category:", oldCategory, newCategory);
  const response = await axios.put("http://localhost:3001/edit-category", { oldCategory, newCategory });
  console.log("response data:", response.data);
  return response.data;
});


export const editSubCategory = createAsyncThunk("edit-subcategory", async ({ selectedCat, oldSubCategory, newSubcategory2 }) => {
  console.log("edit sub category :", oldSubCategory, newSubcategory2);
  const response = await axios.put("http://localhost:3001/edit-subcategory", { selectedCat, oldSubCategory, newSubcategory2 });
  console.log("response data:", response.data);
  return response.data;
});

// Create a slice for products
const webSlice = createSlice({
  name: "websites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLastId.fulfilled, (state, action) => {
        state.masterData = action.payload;

      })
      .addCase(fetchLastId.rejected, (state, action) => {
        console.log("session ")
        // toast.error("Session Expired")
        state.masterData = [];
      })
      .addCase(fetchMore.fulfilled, (state, action) => {
        state.totalData = action.payload;

      })
      .addCase(fetchMore.rejected, (state, action) => {
        // toast.error("Session Expired")
        state.totalData = [];
      })
      .addCase(fetchWebsites.rejected, (state) => {
        state.webData = [];
      })
      .addCase(fetchWebsites.fulfilled, (state, action) => {
        console.log("state payload:", action.payload);
        state.webData = action.payload;
        // console.log(state.webData);
      })
      .addCase(addWebsite.rejected, (state) => {
        console.log("add website rejected ")

      })
      .addCase(addWebsite.fulfilled, (state, action) => {
        console.log("add website success ")

      })
      .addCase(removeWebsite.rejected, (state) => {
        console.log("remove website rejected ")
      })
      .addCase(comparePrice.fulfilled, (state, action) => {
        console.log("get prices success ")
        state.prices = action.payload;

      })
      .addCase(comparePrice.rejected, (state) => {
        console.log("get prices rejected ")
      })
      .addCase(removeWebsite.fulfilled, (state, action) => {

        //  toast.success("Removed Sucessfully")
      })
      .addCase(updateWebsite.rejected, (state) => {
        console.log("update website rejected ")
      })
      .addCase(updateWebsite.fulfilled, (state, action) => {

        //  toast.success("update Sucessfully")
      });


  },
});

// Export the reducer to be used in the store
export default webSlice.reducer;

// Export the selector function
export const selectwebData = (state) => state.websites.webData;
export const selectcategoriesData = (state) => state.websites.categoriesData;
export const selectsubcategoriesData = (state) => state.websites.subcategoriesData;
export const selectmasterData = (state) => state.websites.masterData;
export const selecttotalData = (state) => state.websites.totalData;
export const selectprices = (state) => state.websites.prices;