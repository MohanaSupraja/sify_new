import React, { useState, useEffect } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Box,
  Tabs,
  Tab,
  Typography,
  Modal,
  Paper,
  CircularProgress,
  TextField,
  Button,
  Drawer,
  Snackbar,
  Alert,
} from "@mui/material";
import { tabsClasses } from "@mui/material/Tabs";
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import axios from "axios";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import "../App.css";
import { useSelector, useDispatch } from 'react-redux';
import { selectwebData, fetchWebsites, addcategories, addSubcategories, getcategories, selectcategoriesData, selectsubcategoriesData, getsubcategories, updatecategory, updatesubcategory, fetchLastId, websiteLength, addsubcategory } from '../state/webSlice';// Import your Redux slice and selector



const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  overflowY: "auto",
  transform: "translate(-50%, -50%)",
  width: 800,
  maxHeight: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "2%",
};
const style2 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  overflowY: "auto",
  transform: "translate(-50%, -50%)",
  width: 500,
  Height: 450,
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "2% 2% 6% 2%",

  display: "flex",
  flexDirection: "row",
  gap: "16px",

};
const style3 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  overflowY: "auto",
  transform: "translate(-50%, -50%)",
  width: 400,
  Height: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "2.5%",
};

export const Fetch = () => {
  const dispatch = useDispatch();
  const [filteredData, setFilteredData] = useState([]);

  const [value, setValue] = useState(0);
  const [jsonResult, setJsonResult] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); //more icon
  const [sourceId, setSourceId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false); //edit category
  const [isPopUpOpenSub, setIsPopUpOpenSub] = useState(false);//edit sub category
  const [selectedItem, setSelectedItem] = useState(null);//select category when edit
  const [selectedItemSub, setSelectedItemSub] = useState(null);//select sub category when edit
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [clickedImage, setClickedImage] = useState(null);
  const [categories, setCategories] = useState([]);  //when you add/remove categories
  const [subcategories, setSubcategories] = useState({}); //when you add/remove sub categories
  const [newCategory, setNewCategory] = useState(""); //temp value to store current changed category
  const [newSubcategory, setNewSubcategory] = useState("");//temp value to store current changed sub category
  const [selectedCategory, setSelectedCategory] = useState("all"); //retrieve json results based on selected category 
  const [selectedSubcategory, setSelectedSubcategory] = useState("");//retrieve json results based on selected sub category 
  const [availableSubcategories, setAvailableSubcategories] = useState([]);//categories update after edit category
  const [availableSubcategories2, setAvailableSubcategories2] = useState([]);//sub categories after category change
  const [categorySearch, setCategorySearch] = useState('');
  const [subcategorySearch, setSubcategorySearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);

  const itemsPerPage = 20;
  const [defcat, setDefCat] = useState("");//temp variable for category dropdown in drawer
  const [showAll, setShowAll] = useState(false);
  const [msg, setMsg] = useState({ open: false, message: "", severity: "" });
  const [selectedTab, setSelectedTab] = useState("Category");
  const websiteNames = useSelector(selectwebData);
  const categoriesNames = useSelector(selectcategoriesData);
  const subcategoriesData = useSelector(selectsubcategoriesData);
  const [length, setLength] = useState();
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [totalPages, settotalPages] = useState();
  useEffect(() => {
    const storedCategories =
      JSON.parse(localStorage.getItem("categories")) || [];
    const storedSubcategories =
      JSON.parse(localStorage.getItem("subcategories")) || {};

    if (storedCategories.length > 0) {
      setCategories(storedCategories);
    }
    if (Object.keys(storedSubcategories).length > 0) {
      setSubcategories(storedSubcategories);
    }

    console.log("Loaded categories from local storage:", storedCategories);
    console.log(
      "Loaded subcategories from local storage:",
      storedSubcategories
    );
    dispatch(fetchWebsites());

  }, []);

  useEffect(() => {
    dispatch(addcategories())
    dispatch(getcategories())
    dispatch(addSubcategories())
    dispatch(getsubcategories())
  }, []);


  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem("categories", JSON.stringify(categories));
      console.log("Categories updated:", categories);

      //  console.log("Categories updated:", categories);
    }
  }, [categories]);
  useEffect(() => {
    if (selectedItem) {
      console.log("updated item category:", selectedItem);
      handleUpdateCategory(selectedItem.uid, selectedItem.Category)
    }
    if (selectedItemSub) {
      console.log("updated item sub category :", selectedItemSub);
      handleUpdateSubCategory(selectedItemSub.uid, selectedItemSub.SubCategory)
    }
  }, [jsonResult]);

  useEffect(() => {
    if (Object.keys(subcategories).length > 0) {
      localStorage.setItem("subcategories", JSON.stringify(subcategories));
    }
    console.log("Subcategories updated:", subcategories);
  }, [subcategories]);
  useEffect(() => {
    console.log("Available Subcategories updated:", availableSubcategories);
  }, [availableSubcategories]);
  useEffect(() => {
    console.log("Available Subcategories2 updated:", availableSubcategories2);
  }, [availableSubcategories2]);




  const callCloudFunction = async (sourceId) => {
    try {
      let result;
      if (sourceId === 1) {
        result = await axios.post("https://us-central1-sylvie-dynamic-pricing.cloudfunctions.net/function-1", {});
      } else if (sourceId === 0) {
        result = await axios.post("https://us-central1-sylvie-dynamic-pricing.cloudfunctions.net/upload_jsonfile_to_firestore", {});
      }

      console.log("result:", result.data);
    } catch (error) {
      console.error('Error calling cloud function', error);
    }
  };




  const handleChangeTab = (event, newValue) => { // sylvie,terra,wellworn,olive tabs
    setValue(newValue);
    handleClickData(newValue);
  };
  const handleChange = (event, newValue) => {  //tabs in drawer (manage categories)
    setSelectedTab(newValue);
  };

  const handleClick = (severity, message) => { //snackbar
    setMsg({ open: true, severity, message });
  };

  const handleClickClose = (event, reason) => { //snackbar
    if (reason === "clickaway") {
      return;
    }
    setMsg({ open: false, message: "", severity: "" });
  };

  const handleAddCategory = () => {              // add category 
    setDefCat(newCategory);
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      console.log("categories:", categories);
      setNewCategory("");
      handleClick("success", `New Category ${newCategory} added!`);
    }
    else
      handleClick("warning", `Category ${newCategory} already exists!`);
  };

  const handleAddSubcategory = () => {               // add sub categories
    if (newSubcategory && defcat) {
      const existingSubcategories = subcategories[defcat] || [];
      if (existingSubcategories.includes(newSubcategory)) {
        handleClick("warning", `Subcategory ${newSubcategory} already exists!`);
      } else {
        setSubcategories({
          ...subcategories,
          [defcat]: [...existingSubcategories, newSubcategory],
        });
        setNewSubcategory("");
        setDefCat("");
        handleClick("success", `New Subcategory ${newSubcategory} added!`);
      }
    }
  };

  const handleRemoveCategory = (category) => {           //remove category
    if (categories.includes(category)) {
      const updatedCategories = categories.filter((cat) => cat !== category);
      const updatedSubcategories = { ...subcategories };
      delete updatedSubcategories[category];

      setCategories(updatedCategories);
      setSubcategories(updatedSubcategories);
      setNewCategory("");
      handleClick("success", `Category ${category} removed!`);
    } else {
      handleClick("warning", `Category ${category} not found!`);
    }
  };

  const handleRemoveSubcategory = (subcategory) => {       //remove sub category
    console.log("selected category:", defcat);
    if (defcat && subcategories[defcat]) {
      const subcategoryList = subcategories[defcat];
      if (subcategoryList.includes(subcategory)) {
        const updatedSubcategories = {
          ...subcategories,
          [defcat]: subcategoryList.filter((subcat) => subcat !== subcategory),
        };
        setSubcategories(updatedSubcategories);
        setNewSubcategory("");
        setDefCat("");
        handleClick("success", `Subcategory ${subcategory} removed!`);
      } else {
        handleClick("warning", `Subcategory ${subcategory} not found in category ${defcat}!`);
      }
    } else {
      handleClick("warning", `Category ${defcat} not found or has no subcategories!`);
    }
  };



  // const fetchData = async (parameterValue) => {
  //   try {

  //     setLoading(true);

  //     const url = `http://localhost:3001/fetch/${parameterValue}`;

  //     const response = await axios.get(url);
  //     console.log("json data:", response.data);

  //     // Extract categories and subcategories from the fetched data
  //     const categories = response.data.map(item => item.Category);
  //     const subcategories = response.data.reduce((acc, item) => {
  //       if (item.Category && item.SubCategory) {
  //         const formattedCategory = item.Category.trim().charAt(0).toUpperCase() + item.Category.trim().slice(1).toLowerCase();
  //         const formattedSubcategory = item.SubCategory.trim().charAt(0).toUpperCase() + item.SubCategory.trim().slice(1).toLowerCase();

  //         if (!acc[formattedCategory]) {
  //           acc[formattedCategory] = [];
  //         }
  //         if (!acc[formattedCategory].includes(formattedSubcategory)) {
  //           acc[formattedCategory].push(formattedSubcategory);
  //         }
  //       }
  //       return acc;
  //     }, {});

  //     console.log("Extracted categories:", categories);
  //     console.log("Extracted subcategories:", subcategories);

  //     // Trim, capitalize first letter, sort, and remove duplicates from categories
  //     const formattedCategories = categories.map(category => {
  //       const trimmedCategory = category.trim();
  //       return trimmedCategory.charAt(0).toUpperCase() + trimmedCategory.slice(1).toLowerCase();
  //     });
  //     const uniqueCategories = [...new Set(formattedCategories)].sort();
  //     console.log("Unique categories:", uniqueCategories);

  //     // Sort subcategories for each category
  //     for (const category in subcategories) {
  //       subcategories[category] = subcategories[category].sort((a, b) => a.localeCompare(b));
  //     }
  //     console.log("Sorted subcategories:", subcategories);

  //     // Dispatch the categories and subcategories to the Redux store
  //     dispatch(addSubcategories({ subcategories }));
  //     dispatch(addcategories({ categories: uniqueCategories }));
  //     dispatch(getcategories());
  //     dispatch(getsubcategories());
  //     setJsonResult(response.data);
  //     setLoading(false);

  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setLoading(false);
  //   }
  // };

  const pageSize = 20;

  const fetchData = async (sourceId, currentPage, categorySearch = "", subcategorySearch = "") => {
    try {
      console.log("in fetch data", categorySearch);

      setLoading(true);

      const response = await dispatch(fetchLastId({ sourceId, currentPage, categorySearch, subcategorySearch })).unwrap();
      console.log("json data:", response.documents);

      console.log("json length:", response.length);
      settotalPages(Math.ceil((response.length) / pageSize));
      setJsonResult(response.documents);
      setLoading(false);

    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };



  useEffect(() => {
    dispatch(getcategories())
    dispatch(getsubcategories())
  }, []);
  useEffect(() => {

    fetchData(sourceId, currentPage, categorySearch, subcategorySearch);
  }, [sourceId, currentPage, categorySearch, subcategorySearch, length]);


  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };



  const handleUpdateCategory = async (uid, newCategory) => {           //update category in db
    try {
      const response = await axios.put('http://localhost:3001/update-category', {
        uid,
        category: newCategory
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleUpdateSubCategory = async (uid, newSubCategory) => {           //update sub-category in db
    try {
      const response = await axios.put('http://localhost:3001/update-subcategory', {
        uid,
        subcategory: newSubCategory
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };


  const handleCategoryChange = (event) => {                         //filter results by change category
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);
    setSelectedSubcategory("");
    console.log("sub categories [new category]", subcategories[newCategory])
    if (subcategories[newCategory] && subcategories[newCategory].length > 0) {
      setAvailableSubcategories(subcategories[newCategory]);
    } else {
      setAvailableSubcategories([]);
    }
  };

  const handleSubcategoryChange = (event) => {
    console.log("Event:", event); // Check the event object
    console.log("Value:", event.target.value); // Check the value property
    setSelectedSubcategory(event.target.value);
  };



  const handlePopUp = (item) => {                                    // set category based on edit icon
    setSelectedItem(item);
    setIsPopUpOpen(!isPopUpOpen);
  };


  const handlePopUpSub = (item) => {                                   // set sub category based on edit icon
    setSelectedItemSub(item);
    setIsPopUpOpenSub(!isPopUpOpenSub);
    const subCategoryList = subcategories[item.Category];
    if (subCategoryList && subCategoryList.length > 0) {
      setAvailableSubcategories2(subCategoryList);
    } else {
      setAvailableSubcategories2([]);
    }
  }

  const handleEditCategoryChange = (event, item) => {                 // change category based on edit icon
    const newCategory = event.target.value;
    console.log("selected category", newCategory);
    setSelectedItem({ ...item, Category: newCategory });
    console.log("selected item:", selectedItem);
    const updatedJsonResult = jsonResult.map((i) =>
      i.id === item.id ? { ...i, Category: newCategory } : i
    );
    setJsonResult(updatedJsonResult);
    dispatch(updatecategory({ uid: item.uid, category: newCategory }));
    if (subcategories[newCategory] && subcategories[newCategory].length > 0) {
      setAvailableSubcategories2(subcategories[newCategory]);
    } else {
      setAvailableSubcategories2([]);
    }
    handleClick("success", `Category changed to ${newCategory}`);
  };

  const handleEditSubCategoryChange = (event, item) => {          // change sub category based on edit icon
    const newSubCategory = event.target.value;
    console.log("selected sub category", newSubCategory);
    setSelectedItemSub({ ...item, SubCategory: newSubCategory });
    console.log("selected item for sub category:", selectedItemSub);
    const updatedJsonResult = jsonResult.map((i) =>
      i.id === item.id ? { ...i, SubCategory: newSubCategory } : i
    );
    setJsonResult(updatedJsonResult);

    dispatch(updatesubcategory({ uid: item.uid, category: newSubCategory }))
    handleClick("success", `Category changed to ${newCategory}`);

  };


  const handleClickData = (index) => {
    setSourceId(index);
  };

  const handleOpen = (item) => {               // more icon
    setCurrentItem(item);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  useEffect(() => {
    console.log("category search:", categorySearch);
    const lowerCategorySearch = categorySearch ? categorySearch.toLowerCase() : null;
    console.log("category search (lowercase):", lowerCategorySearch);
    console.log("subcategory search:", subcategorySearch);
    const lowerSubcategorySearch = subcategorySearch ? subcategorySearch.toLowerCase() : null;
    console.log("subcategory search (lowercase):", lowerSubcategorySearch);

    const filtered = (lowerCategorySearch !== null || lowerSubcategorySearch !== null)
      ? jsonResult.filter(item => {
        const itemCategoryLower = item.Category.toLowerCase();
        const itemSubCategoryLower = item.SubCategory.toLowerCase();

        console.log(`Checking item: ${item.Category}, ${item.SubCategory}`);
        console.log(`Item Category Lower: ${itemCategoryLower}`);
        console.log(`Item SubCategory Lower: ${itemSubCategoryLower}`);

        const categoryMatch = lowerCategorySearch === null || itemCategoryLower.includes(lowerCategorySearch);
        const subCategoryMatch = lowerSubcategorySearch === null || itemSubCategoryLower.includes(lowerSubcategorySearch);

        console.log(`Category match: ${categoryMatch}`);
        console.log(`SubCategory match: ${subCategoryMatch}`);

        return categoryMatch && subCategoryMatch;
      }).sort((a, b) => a.id - b.id)
      : jsonResult;
    console.log("filtered:", filtered);
    setFilteredData(filtered);
    if (lowerCategorySearch === null) {
      setFilteredCategories([...new Set(categoriesNames)]);
    } else {
      const filteredCats = categoriesNames.filter(category =>
        category.toLowerCase().startsWith(lowerCategorySearch)
      );
      console.log("filtered categories:", filteredCats);
      setFilteredCategories([...new Set(filteredCats)]);
    }

    // Filter subcategories data in a case-insensitive manner
    if (lowerSubcategorySearch === null) {
      const allSubcategories = subcategoriesData.flatMap(doc => doc.subcategories);
      setFilteredSubcategories([...new Set(allSubcategories)]);
    } else {
      const filteredSubs = subcategoriesData.flatMap(doc =>
        doc.subcategories.filter(subcategory =>
          subcategory.toLowerCase().startsWith(lowerSubcategorySearch)
        )
      );
      console.log("filtered subcategories:", filteredSubs);
      setFilteredSubcategories([...new Set(filteredSubs)]);
    }
  }, [jsonResult, categorySearch, subcategorySearch, categoriesNames, subcategoriesData]);

  // useEffect(() => {
  //   console.log("filteredData:", filteredData);
  //   console.log("categoriesNames:", categoriesNames);
  //   console.log("filteredCategories:", filteredCategories);
  //   console.log("filteredSubcategories:", filteredSubcategories);
  // }, [filteredData, categoriesNames, filteredCategories, subcategoriesData, filteredSubcategories, categorySearch, subcategorySearch]);


  return (
    <>
      <div style={{ margin: "4px" }}>
        <div ><div style={{ marginBottom: "0px", display: "flex", alignItems: "center", justifyContent: "right" }}>
          {/* <TextField
            sx={{ marginTop: "12px", marginRight: "30px", minWidth: 150, maxWidth: 150 }}
            size="small"
            label="Search Categories"
            value={categorySearch}
            onChange={(e) => {
              setCategorySearch(e.target.value);
              fetchData(sourceId, currentPage, e.target.value, subcategorySearch);
            }}
          /> */}
          <Autocomplete
            disablePortal
            id="category-combo-box"
            options={filteredCategories}
            getOptionLabel={(option) => option}
            sx={{ marginTop: "12px", marginRight: "30px", minWidth: 150, maxWidth: 150 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                size="small"
              />
            )}
            value={categorySearch}
            onChange={(event, newValue) => {
              setCategorySearch(newValue);
              // fetchData(sourceId, currentPage, newValue, subcategorySearch);
            }}
          />

          {/* <TextField
            sx={{ marginTop: "12px", marginRight: "30px", minWidth: 150, maxWidth: 150 }}
            size="small"
            label="Search Subcategories"
            value={subcategorySearch}
            onChange={(e) => {
              setSubcategorySearch(e.target.value);
              fetchData(sourceId, currentPage, categorySearch, e.target.value);
            }}

          /> */}
          <Autocomplete
            disablePortal
            id="subcategory-combo-box"
            options={filteredSubcategories}
            getOptionLabel={(option) => option}
            sx={{ marginTop: "12px", marginRight: "30px", minWidth: 150, maxWidth: 150 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Subcategory"
                size="small"
              />
            )}
            value={subcategorySearch}
            onChange={(event, newValue) => {
              setSubcategorySearch(newValue);
              // fetchData(sourceId, currentPage, categorySearch, newValue);
            }}
          />

        </div>

          {/* <Button
            style={{ marginTop: "10px", color: "black", marginRight: "30px" }}
            onClick={toggleDrawer(true)}
          >
            Manage Categories
          </Button> */}

          <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
            <div
              style={{
                width: 450,
                padding: "20px",
                borderRadius: "20px",
                marginTop: "60px",
              }}
            >
              <div>
                <Tabs
                  value={selectedTab}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                >
                  <Tab label="Category" value="Category" />
                  <Tab label="Sub Category" value="SubCategory" />
                </Tabs>
                <div style={{ marginTop: "30px" }}>
                  {selectedTab === "Category" && (
                    <div style={{ marginBottom: "20px" }}>
                      <TextField
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Category"

                        defaultValue="Small"
                        size="small"
                        style={{ width: "100%", borderRadius: "10px" }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "right",
                          marginTop: "10px",
                        }}
                      >
                        <Button
                          onClick={handleAddCategory}
                          style={{ borderRadius: "10px" }}
                        >
                          Add
                        </Button>
                        <Button
                          onClick={() => handleRemoveCategory(newCategory)}
                          style={{ borderRadius: "10px" }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedTab === "SubCategory" && (
                    <div style={{ marginBottom: "20px" }}>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <FormControl
                            sx={{
                              minWidth: 120,
                              maxWidth: 120,
                              marginRight: "20px",
                            }}

                            defaultValue="Small"
                            size="small"
                          >
                            <InputLabel id="demo-select-small-label">
                              Category
                            </InputLabel>
                            <Select
                              labelId="demo-select-small-label"
                              id="demo-select-small"
                              value={defcat}
                              onChange={(e) => setDefCat(e.target.value)}
                              label={"Categories"}
                              style={{ borderRadius: "5px" }}
                            >
                              {categories.map((category, index) => (
                                <MenuItem key={index} value={category}>
                                  {category}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>

                        <TextField
                          type="text"
                          value={newSubcategory}
                          onChange={(e) => setNewSubcategory(e.target.value)}
                          placeholder="Subcategory"
                          defaultValue="Small"
                          size="small"
                          style={{
                            marginRight: "8px",
                            width: "100%",
                            borderRadius: "10px",
                            height: "100%",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "right",
                          marginTop: "10px",
                        }}
                      >
                        <Button
                          onClick={handleAddSubcategory}
                          style={{ borderRadius: "10px" }}
                        >
                          Add
                        </Button>
                        <Button
                          onClick={() => handleRemoveSubcategory(newSubcategory)}
                          style={{ borderRadius: "10px" }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* <div style={{display:"flex",flexDirection:"row",gap:"30px",justifyContent:"center"}}>
            <Button variant='outlined' onClick={clear}>Clear All</Button>
          <Button variant='outlined' onClick={handleShowAll}>Show All</Button>
    </div>
    {showAll && (
  <div style={{ marginTop: '10px' }}>
    <Typography variant="h6" style={{ marginBottom: '8px',fontFamily: 'Arial, sans-serif', fontSize: '0.9rem' }}>
      Categories and their Subcategories
    </Typography>
    {categories.map((category, index) => (
      <div key={index} style={{ marginBottom: '15px' }}>
        <Typography variant="body1" style={{ marginBottom: '4px', color: '#4CAF50' }}>
          {category}
        </Typography>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {(subcategories[category] || []).map((subcategory, subIndex) => (
            <li key={subIndex}>
              <Typography variant="body2" style={{ color: '#555' }}>
                {subcategory}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div> 
)}*/}

              <Snackbar
                open={msg.open}
                autoHideDuration={2000}
                onClose={handleClickClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Alert
                  onClose={handleClickClose}
                  severity={msg.severity}
                  variant="filled"
                  sx={{ width: "100%" }}
                >
                  {msg.message}
                </Alert>
              </Snackbar>
            </div>
          </Drawer>

          <div>
            <Box
              sx={{
                flexGrow: 1,
                width: "100%",
                bgcolor: "background.paper",
              }}
            >
              <Tabs
                onChange={handleChangeTab}
                variant="scrollable"
                // scrollButtons
                // allowScrollButtonsMobile
                // aria-label="scrollable force tabs example"
                value={value}

                sx={{
                  [`& .${tabsClasses.scrollButtons}`]: {
                    "&.Mui-disabled": { opacity: 0.6 },
                  },
                  [`& .MuiTabs-flexContainer`]: {
                    justifyContent: "flex-start",
                  },
                }}
              >
                {/* <Tab label="Sylvie" value={0} />
              <Tab label="TERRA COASTAL" value={1} />
              <Tab label="WELL WORN" value={2} />
              <Tab label="OLIVE" value={3} /> */}
                {websiteNames.map((website, index) => (
                  <Tab key={index} label={website.name} value={index} />
                ))}
              </Tabs>
            </Box>

          </div>
        </div>
        {loading ? (

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "90vh",
            }}
          >
            <CircularProgress />
          </div>
        ) : jsonResult && jsonResult.length > 0 ? (
          <>

            <div style={{ maxHeight: "360px", overflowY: "auto", marginTop: "5px", scrollbarWidth: "thin" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "white",
                    zIndex: 1,
                  }}
                >
                  <tr style={{ borderBottom: "1px solid #ccc" }}>
                    <th
                      style={{
                        padding: "5px 16px",
                        textAlign: "left",
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                        width: "5%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ID
                    </th>

                    <th
                      style={{
                        padding: "5px 16px",
                        textAlign: "center",
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                        width: "8%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Image
                    </th>

                    <th
                      style={{
                        padding: "5px 0px",
                        textAlign: "left",
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                        width: "10%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Category
                    </th>

                    <th
                      style={{
                        padding: "5px 0px",
                        textAlign: "left",
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                        width: "13%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Sub Category
                    </th>

                    <th
                      style={{
                        padding: "5px 0px",
                        textAlign: "left",
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                        width: "14%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Product Name
                    </th>

                    <th
                      style={{
                        padding: "5px 0px",
                        textAlign: "left",
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                        width: "42%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Product Description
                    </th>

                    <th
                      style={{
                        padding: "5px 0px",
                        textAlign: "right",
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                        width: "10%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Price
                    </th>
                    <th
                      style={{
                        padding: "5px 16px",
                        textAlign: "center",
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                        width: "10%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      More
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map((item, index) => (
                    <tr
                      key={index}
                      style={{ height: "40px", borderBottom: "1px solid #ccc" }}
                    >
                      <td
                        style={{
                          textAlign: "center",
                          fontFamily: "Arial, sans-serif",
                          width: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item["id"]}
                      </td>

                      <td
                        style={{
                          textAlign: "center",
                          fontFamily: "Arial, sans-serif",
                          width: "100px",
                          whiteSpace: "nowrap",
                        }}
                        onClick={() => setClickedImage(`data:image/png;base64,${item["image"]}`)}
                      >
                        <img
                          src={`data:image/png;base64,${item["image"]}`}
                          alt="Product Image"
                          style={{
                            width: "auto",
                            height: "auto",
                            maxWidth: "40px",
                            maxHeight: "40px",
                          }}
                        />
                      </td>

                      <td
                        style={{
                          textAlign: "left",
                          fontFamily: "Arial, sans-serif",
                          width: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div
                            style={{
                              flex: 2,
                              textAlign: "left",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item["Category"]}
                          </div>

                          <div style={{ flex: 1, textAlign: "center" }}>
                            <EditIcon
                              style={{ cursor: "pointer", fontSize: "1rem" }}
                              onClick={() => handlePopUp(item)}
                            />
                          </div>
                        </div>
                      </td>

                      <td
                        style={{
                          textAlign: "left",
                          fontFamily: "Arial, sans-serif",
                          width: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div
                            style={{
                              flex: 2,
                              textAlign: "left",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item["SubCategory"]}
                          </div>
                          <div style={{ flex: 1, textAlign: "center" }}>
                            <EditIcon
                              style={{ cursor: "pointer", fontSize: "1rem" }}
                              onClick={() => handlePopUpSub(item)}
                            />
                          </div>
                        </div>
                      </td>

                      <td
                        style={{
                          textAlign: "left",
                          fontFamily: "Arial, sans-serif",
                          width: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item["Name"]}
                      </td>
                      <td
                        style={{
                          textAlign: "left",
                          fontFamily: "Arial, sans-serif",
                          width: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item["Description"]}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontFamily: "Arial, sans-serif",
                          width: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item["Currency"]} {item["Price"]}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          width: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <InfoIcon
                          style={{
                            color: "#1976D2",
                            cursor: "pointer",
                            fontSize: "1.5rem",
                          }}
                          onClick={() => handleOpen(item)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>


              {/* <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <Button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Typography>
                Page {currentPage} of {totalPages}
              </Typography>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div> */}
            </div>

          </>
        ) : (
          <div>
            <Typography variant="body1">No data to display!</Typography>
          </div>
        )}

        {isPopUpOpen && selectedItem && (
          <Modal
            open={isPopUpOpen}
            onClose={() => setIsPopUpOpen(false)}
            aria-labelledby="edit-category-modal"
            aria-describedby="edit-category-modal-description"
          >
            <Paper style={style2}>
              <CancelSharpIcon
                onClick={() => setIsPopUpOpen(false)}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "15px",
                  cursor: "pointer",
                }}
              />

              <div style={{ flex: 1 }}>
                <Typography
                  // variant="h6"
                  sx={{
                    fontWeight: "bold",
                    marginBottom: "8px",
                    color: "#1976D2",
                  }}
                >
                  Selected Item
                </Typography>

                <div>

                  <span style={{ fontFamily: "Arial", color: "#FF5722", marginBottom: "8px" }}>

                    <img
                      src={`data:image/png;base64,${selectedItem["image"]}`}
                      // src={selectedItem["ImageUrl"]}
                      alt="Product Image"
                      style={{
                        marginBottom: "10px",
                        width: "auto",
                        height: "auto",
                        maxWidth: "80px",
                        maxHeight: "80px",
                      }}
                    />
                  </span>



                  <Typography variant="body1" sx={{ marginBottom: "4px" }}>
                    <span style={{ fontFamily: "Roboto", color: "#FF5722" }}>
                      Name:
                    </span>{" "}
                    {selectedItem.Name}
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: "4px" }}>
                    <span style={{ fontFamily: "Roboto", color: "#FF5722" }}>
                      Price:
                    </span>{" "}
                    {selectedItem.Price}
                  </Typography>
                </div>
              </div>

              <div style={{ flex: 1, marginTop: "10px" }}>
                <FormControl sx={{ minWidth: 160, maxWidth: 160 }} size="small">
                  <InputLabel id="demo-select-small-label">
                    Categories
                  </InputLabel>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={selectedItem.Category}
                      label="Categories"
                      onChange={(e) =>
                        handleEditCategoryChange(e, selectedItem)
                      }
                      style={{ flex: 1, maxWidth: 200, height: 40 }}
                    >
                      {categoriesNames.map((category, index) => (
                        <MenuItem key={index} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </FormControl>
                <Snackbar
                  open={msg.open}
                  autoHideDuration={2000}
                  onClose={handleClickClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                  <Alert
                    onClose={handleClickClose}
                    severity={msg.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                  >
                    {msg.message}
                  </Alert>
                </Snackbar>
              </div>
            </Paper>

          </Modal>
        )}



        {isPopUpOpenSub && selectedItemSub && (
          <Modal
            open={isPopUpOpenSub}
            onClose={() => setIsPopUpOpenSub(false)}
            aria-labelledby="edit-category-modal"
            aria-describedby="edit-category-modal-description"
          >
            <Paper style={style2}>
              <CancelSharpIcon
                onClick={() => setIsPopUpOpenSub(false)}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "15px",
                  cursor: "pointer",
                }}
              />

              <div style={{ flex: 1 }}>
                <Typography
                  // variant="h6"
                  sx={{
                    fontWeight: "bold",
                    marginBottom: "10px",
                    color: "#1976D2",

                  }}
                >
                  Selected Item
                </Typography>

                <div>
                  <span style={{ fontFamily: "Arial", color: "#FF5722", marginBottom: "8px" }}>

                    <img
                      src={`data:image/png;base64,${selectedItemSub["image"]}`}
                      // src={selectedItem["ImageUrl"]}
                      alt="Product Image"
                      style={{
                        marginBottom: "10px",
                        width: "auto",
                        height: "auto",
                        maxWidth: "80px",
                        maxHeight: "80px",
                      }}
                    />
                  </span>
                  <Typography variant="body1" sx={{ marginBottom: "4px" }}>
                    <span style={{ fontFamily: "Roboto", color: "#FF5722" }}>
                      Name:
                    </span>{" "}
                    {selectedItemSub.Name}
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: "4px" }}>
                    <span style={{ fontFamily: "Roboto", color: "#FF5722" }}>
                      Category:
                    </span>{" "}
                    {selectedItemSub.Category}
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: "4px" }}>
                    <span style={{ fontFamily: "Roboto", color: "#FF5722" }}>
                      Price:
                    </span>{" "}
                    {selectedItemSub.Price}
                  </Typography>
                </div>
              </div>

              <div style={{ flex: 1, marginTop: "10px" }}>
                <FormControl sx={{ minWidth: 180, maxWidth: 180 }} size="small">
                  <InputLabel id="demo-select-small-label">
                    Sub Categories
                  </InputLabel>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={selectedItemSub.SubCategory}
                      label="Categories"
                      onChange={(e) =>
                        handleEditSubCategoryChange(e, selectedItemSub)
                      }
                      style={{ flex: 1, maxWidth: 200, height: 40 }}
                    >
                      <MenuItem key={" "}></MenuItem>
                      {subcategoriesData
                        .filter(doc => {
                          const trimmedId = doc.id.trim();
                          const capitalizedId = trimmedId.charAt(0).toUpperCase() + trimmedId.slice(1);
                          return capitalizedId === selectedItemSub.Category;
                        })
                        .map((doc, index) => (
                          doc.subcategories.map((subcategory, subIndex) => (
                            <MenuItem key={`${index}-${subIndex}`} value={subcategory}>
                              {subcategory}
                            </MenuItem>
                          ))
                        ))}
                    </Select>

                  </div>
                </FormControl>
                <Snackbar
                  open={msg.open}
                  autoHideDuration={2000}
                  onClose={handleClickClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                  <Alert
                    onClose={handleClickClose}
                    severity={msg.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                  >
                    {msg.message}
                  </Alert>
                </Snackbar>
              </div>
            </Paper>

          </Modal>
        )}

        <Modal
          open={!!clickedImage}
          onClose={() => setClickedImage(null)}
          aria-labelledby="image-modal-title"
          aria-describedby="image-modal-description"
        >
          <Paper
            style={{
              ...style3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CancelSharpIcon
              onClick={() => setClickedImage(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "12px",
                cursor: "pointer",
              }}
            />
            <img
              src={`data:image/png;base64${clickedImage}`}
              alt="Clicked Image"
              style={{ maxWidth: "100%", maxHeight: "90%" }}
            />
          </Paper>
        </Modal>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Paper sx={style}>
            <CancelSharpIcon
              onClick={handleClose}
              sx={{
                position: "absolute",
                zIndex: 1300,
                top: "15px",
                right: "25px",
                cursor: "pointer",
              }}
            />
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {currentItem &&
                Object.keys(currentItem).map(
                  (key) =>
                  (key !== "image" &&
                    key !== "source_id" &&
                    key !== "uid" &&
                    key !== "2.0" ? (
                    <div key={key}>
                      <strong>{key}:</strong> {currentItem[key]}
                    </div>
                  ) : null)
                )}
            </Typography>
          </Paper>
        </Modal>
        <Stack
          spacing={2}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            padding: '10px 0',
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      </div >
    </>
  );
};
