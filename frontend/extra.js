import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getsylviecategory, selectcategoriesData } from '../state/categorySlice';
import {
    Grid,
    Box,
    Typography,
    CircularProgress,
    Paper,
    Modal,
    Autocomplete,
    DialogContentText,
    TextField,
    InputAdornment,
    Tab,
    Tabs,
    Pagination,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Stack,

} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditSharpIcon from "@mui/icons-material/EditSharp"; // Import the edit icon
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import InfoIcon from '@mui/icons-material/Info';
import CancelSharpIcon from "@mui/icons-material/CancelSharp";
import { comparePrice, selectprices, fetchWebsites, selectmasterData, selectwebData, updatecategory } from '../state/webSlice';
import { fetchLastId } from '../state/webSlice';
import Dashboard from './Dashboard';
import { toast } from 'react-toastify';
import { color, display, height, maxHeight } from '@mui/system';

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    overflowY: "auto",
    transform: "translate(-50%, -50%)",
    width: 700,
    maxHeight: 400,
    bgcolor: "#F8F5ED",
    boxShadow: 24,
    scrollbarWidth: "thin",
    padding: "0% 2% 2% 2%",

};
const style2 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    overflowY: "auto",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "#F8F5ED",
    boxShadow: 24,
    scrollbarWidth: "thin",
    padding: "2%",

};

export default function MasterData() {
    const nav = useNavigate();
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [Websites, setWebsites] = useState();
    const [editMode, setEditMode] = useState(true);
    const [masterData, setMasterData] = useState([]);
    const [activeTab, setActiveTab] = useState(1);
    const [currentItem, setCurrentItem] = useState(null); // more icon
    const [open, setOpen] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false); // for edit dialog
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null); // to store the selected category
    const [itemToEdit, setItemToEdit] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState(null);
    const dispatch = useDispatch();
    const pricearray = useSelector(selectprices);
    const [prices, setprices] = useState({});
    const displayData = useSelector(selectmasterData);
    const categoriesData = useSelector(selectcategoriesData);
    const webData = useSelector(selectwebData);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, settotalPages] = useState();
    const [length, setLength] = useState();
    const pageSize = 10;
    const [priceDialog, setPriceDialog] = useState(false);
    const startIndex = (currentPage - 1) * pageSize;
    const [count, setCount] = useState(0);
    useEffect(() => {
        dispatch(fetchWebsites());
        dispatch(getsylviecategory()).then((result) => {
            if (getsylviecategory.rejected.match(result)) {
                console.log("Error occurred:", result.payload);
                if (result.payload.message === 'Token expired') {
                    nav('/login');
                } else {
                    console.log(result.payload.message)
                }
            } else {

            }
        });
    }, [dispatch]);
    useEffect(() => {
        if (pricearray) {
            console.log("pricesarray:", pricearray)
            setprices(pricearray)
        }
    }, [pricearray])

    useEffect(() => {
        if (displayData && displayData.length > 0) {
            console.log("display:", displayData.length, displayData)
            // setMasterData(displayData);

        }
    }, [displayData]);
    useEffect(() => {
        console.log("hi:", webData)
        if (webData && webData.length > 0) {
            console.log("websitedata:", webData);
            setWebsites(webData);
        }
    }, [webData]);

    useEffect(() => {
        console.log("active tab:", activeTab)
        console.log("websites:", Websites)
        const label = Websites?.find((website) => website.id === activeTab)?.name;
        console.log("labelllll:", label) // Get the label of the active tab
        fetchData(activeTab, currentPage, categoryFilter, label, search);
    }, [activeTab, currentPage, categoryFilter, length, Websites, search]);

    const handleTabChange = (event, newValue) => {
        // Find the selected website by ID
        console.log("newvalue:", newValue)
        const selectedWebsite = Websites?.find((website) => website.id === newValue);

        if (selectedWebsite) {
            if (search) {
                console.log("selected web:", selectedWebsite)
                const label = selectedWebsite.name;
                console.log("labelllll2:", label);
                setActiveTab(newValue);
                setCurrentPage(1);
                fetchData(selectedWebsite.id, currentPage, categoryFilter, label, search);
            }
            else {
                console.log("selected web:", selectedWebsite)
                const label = selectedWebsite.name;
                console.log("labelllll2:", label);
                setActiveTab(newValue);
                setCurrentPage(1);
                fetchData(selectedWebsite.id, currentPage, categoryFilter, label); // Pass the label to fetchData
            }
        }
    };



    const toggleEditMode = () => {
        setEditMode(!editMode);
    };
    const handleCategoryChange = (event, newValue) => {
        const selectedCategory = newValue;
        if (selectedCategory) {
            setCategoryFilter(selectedCategory);
        } else {
            setCategoryFilter(null);
        }
    };
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const fetchData = async (tabIndex, currentPage, categorySearch = "", label = "", searchQuery = "") => {
        try {
            setLoading(true);
            console.log("in fetch data", label, "cat:", categorySearch, "search:", searchQuery);
            const response = await dispatch(fetchLastId({ tabIndex, currentPage, categorySearch, label, searchQuery })).unwrap();
            if (response.message) {
                console.log("Error occurred:", response.message);

                if (response.message === 'Token expired') {
                    setLoading(false);
                    toast.error("Session expired")
                    nav('/login');
                } else {
                    setLoading(false);
                    toast.error(response.message);
                }
            } else {
                console.log("In master data")
                console.log("master length:", response.length);
                setCount(response.length);
                settotalPages(Math.ceil(response.length / pageSize));
                setMasterData(response.documents);


                console.log("master data:", masterData);
                console.log("fetch successful:", response);
                console.log("loadinggg:", loading)
                setLoading(false);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            toast.error("An unexpected error occurred");
        }
    };



    const handleOpen = (item) => {
        setCurrentItem(item);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);
    const handleEditOpen = (item) => {
        console.log("item:", item.category)
        setItemToEdit(item);
        setOpenEditDialog(true);
        setSelectedCategory(item.category)
    };

    const handleEditClose = () => {
        setOpenEditDialog(false);
        setSelectedCategory(null);
    };

    const handleConfirmClose = () => {
        setOpenConfirmDialog(false);
    };

    const handleUpdateCategory = () => {
        // console.log(itemToEdit.name,selectedCategory)
        let result = dispatch(updatecategory({ name: itemToEdit.name, category: selectedCategory }));
        if (updatecategory.rejected.match(result)) {
            console.log("Error occurred:", result.payload);
            if (result.payload.message === 'Token expired') {
                nav('/login');
            } else {
                toast.error(result.payload.message);
            }
        } else {
            console.log(`Update category for item ${itemToEdit.id} to ${selectedCategory}`);
            fetchData(activeTab, currentPage, categoryFilter, itemToEdit.websiteName);
            setOpenConfirmDialog(false);
            setOpenEditDialog(false);
        }
    };

    const handleConfirmUpdate = () => {
        setOpenEditDialog(false);
        setOpenConfirmDialog(true);
    };
    const comparePrices = () => {
        setprices({})
        dispatch(comparePrice(categoryFilter ? categoryFilter : "")).then((result) => {
            if (comparePrice.rejected.match(result)) {
                console.log("Error occurred:", result.payload);
                if (result.payload.message === 'Token expired') {
                    toast.error("Session expired")
                    nav('/login');
                } else {

                    console.log(result.payload.message)
                }
            } else {
                setPriceDialog(true);
            }
        });
    }
    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    return (
        <Dashboard>
            <Box style={{ maxHeight: "80vh", height: "100%", backgroundColor: "#F8F5ED" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", }} margin="15px 15px 0px 0px">
                    <Box margin="7px 0px 0px 15px">
                        <TextField
                            id="input-with-icon-textfield"
                            value={search}
                            placeholder='Search Product Name '
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: "#C26B64" }} />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                            sx={{
                                '& .MuiInputBase-input': {
                                    color: '#3A0008 !important',  // Input text color
                                },
                                '& .MuiInput-underline:before': {
                                    borderBottomColor: '#F8F5ED !important',  // Bottom border color when unfocused
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottomColor: '#F8F5ED !important',  // Bottom border color when focused
                                },
                                '&:hover .MuiInput-underline:before': {
                                    borderBottomColor: '#F8F5ED !important',  // Bottom border color on hover
                                },
                            }}
                        />
                    </Box>
                    <Box display="flex" justifyContent="flex-end" alignItems="center" >
                        <Autocomplete
                            size="small"
                            id="categories-autocomplete"
                            options={categoriesData.map((option) => option.name)}
                            onChange={handleCategoryChange}
                            renderInput={(params) => <TextField {...params} label="Categories" variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#C26B64', // Change this to your desired border color
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#C26B64', // Change this to your desired border color on hover
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#C26B64', // Change this to your desired border color when focused
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#C26B64', // Change this to your desired label color
                                        fontSize: '0.9rem',
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#C26B64', // Change this to your desired label color when focused
                                    },
                                }}
                            />}
                            style={{ width: 180 }}
                            PaperComponent={({ children }) => (
                                <Paper sx={{
                                    backgroundColor: "#F8F5ED",

                                    '& .MuiAutocomplete-option': {
                                        fontSize: '1rem',
                                        '&.Mui-focused': {
                                            backgroundColor: '#D5A28F !important', // Color on focus/hover
                                            color: '#FFF !important', // Text color on hover
                                        },
                                        '&[aria-selected="true"]': {
                                            backgroundColor: '#C26B64 !important', // Background color for selected item
                                            color: '#FFF !important', // Text color for selected item
                                        },
                                        '&:hover': {
                                            backgroundColor: '#D5A28F !important', // Color on hover
                                            color: '#FFF !important', // Text color on hover
                                        },
                                    },
                                    '& ::-webkit-scrollbar': {
                                        width: '5px !important',
                                    },
                                    '& ::-webkit-scrollbar-thumb': {
                                        backgroundColor: '#C26B64 !important',
                                        borderRadius: '2px',
                                    },
                                    '& ::-webkit-scrollbar-thumb:hover': {
                                        cursor: "pointer"
                                    },

                                }}>
                                    {children}
                                </Paper>
                            )}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    fontSize: '0.8rem', // Reduce font size in the input
                                },
                            }}
                        />
                        <Box>
                            <Button size="small" variant="contained" style={{ backgroundColor: "#C26B64", margin: '0px 0px 0px 20px' }} onClick={comparePrices}>Compare Price </Button>
                        </Box>
                    </Box>
                </Box>




                <Box>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        aria-label="basic tabs example"
                        variant="standard"
                        sx={{
                            '& .MuiTabs-indicator': { backgroundColor: '#C26B64 !important' },
                            '& .MuiTab-root': { color: '#C26B64 !important' },
                            '& .Mui-selected': { color: '#C26B64 !important' },
                        }}
                    >
                        {Websites?.slice().sort((a, b) => {
                            // Ensure "Sylvie" is always first
                            if (a.name === 'Sylvie') return -1;
                            if (b.name === 'Sylvie') return 1;
                            // Sort by ID if neither is "Sylvie"
                            return a.id - b.id;
                        }).map((website) => (
                            <Tab key={website.id} label={website.name} value={website.id} />
                        ))}
                    </Tabs>
                </Box>


                <Box sx={{ height: "60vh", }}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                            <CircularProgress sx={{ color: "#C26B64" }} />
                        </Box>
                    ) : masterData && masterData.length > 0 ? (
                        <div
                            style={{
                                height: "60vh", overflowY: "auto", scrollbarWidth: "thin",
                            }}
                        >
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    tableLayout: "fixed",
                                    backgroundColor: "#F8F5ED",
                                }}
                            >
                                {/* Table Head */}
                                <thead
                                    style={{
                                        position: 'sticky',
                                        top: 0,
                                        color: '#7C0A00',
                                        backgroundColor: '#F8F5ED',
                                        zIndex: 1
                                    }}
                                >
                                    <tr style={{ borderBottom: "1px solid #ccc" }}>
                                        <th
                                            style={{
                                                padding: "5px 16px",
                                                textAlign: "center",
                                                fontFamily: "Arial, sans-serif",
                                                fontWeight: "bold",
                                                width: "7%",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            Id
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
                                            Image
                                        </th>
                                        <th
                                            style={{
                                                padding: "5px 0px",
                                                textAlign: "left",
                                                fontFamily: "Arial, sans-serif",
                                                fontWeight: "bold",
                                                width: "15%",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            <div style={{ display: "flex" }}>
                                                <div style={{ flex: 1 }}>
                                                    Category
                                                </div>
                                                <div style={{
                                                    flex: 1, display: "flex",
                                                    justifyContent: "flex-start", // Align the icon to the right
                                                    alignItems: "center",
                                                }}>
                                                    <ChecklistRtlIcon
                                                        onClick={toggleEditMode}
                                                        style={{
                                                            cursor: 'pointer',
                                                            fontSize: '1rem',
                                                            marginLeft: '5px'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th
                                            style={{
                                                padding: "5px 0px",
                                                textAlign: "left",
                                                fontFamily: "Arial, sans-serif",
                                                fontWeight: "bold",
                                                width: "22%",
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
                                                width: "40%",
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
                                                textAlign: "center",
                                                fontFamily: "Arial, sans-serif",
                                                fontWeight: "bold",
                                                width: "8%",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            Price $
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
                                            More
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {masterData.map((item, index) => (
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
                                                {startIndex + index + 1}

                                            </td>
                                            <td
                                                style={{
                                                    textAlign: "center",
                                                    fontFamily: "Arial, sans-serif",
                                                    width: "100px",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                <img
                                                    src={item.image}
                                                    alt=""
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
                                                <div style={{ display: "flex" }}>
                                                    <div
                                                        style={{
                                                            flex: 1,
                                                            textAlign: "left",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {item.category ? item.category : item.Category}
                                                    </div>
                                                    {editMode && (
                                                        <div
                                                            style={{
                                                                flex: 1,
                                                                display: "flex",
                                                                justifyContent: "center", // Align the icon to the right
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <EditSharpIcon
                                                                style={{ cursor: "pointer", fontSize: "1rem", color: "#C26B64" }}
                                                                onClick={() => handleEditOpen(item)}
                                                            />
                                                        </div>
                                                    )}
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
                                                {item.name ? item.name : item.Name}
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
                                                {item.description ? item.description : item.Description}
                                            </td>
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
                                                {/* <span> {item.currency}</span>  */}
                                                {item.price
                                                    ? item.price.toFixed(2)
                                                    : (item.Price
                                                        ? parseFloat(item.Price).toFixed(2)
                                                        : '0.00')
                                                }


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
                                                        color: "#C26B64",
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
                        </div>
                    ) : (
                        <div>
                            <Typography variant="body1">No data to display!</Typography>
                        </div>
                    )}
                </Box>

                <Box style={{ marginTop: "10px", padding: "10px 20px", position: "sticky", bottom: 0, right: 0, zIndex: 1, backgroundColor: "#F8F5ED", display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                    <div
                        style={{
                            padding: "0px",
                            fontWeight: "bold",
                            fontVariant: "small-caps",
                            color: "#7C0A00",
                        }}
                    >
                        Total Count: {count}
                    </div>
                    <Stack spacing={2}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            sx={{
                                '& .MuiPaginationItem-root': { color: '#7C0A00 !important' },
                                '& .Mui-selected': {
                                    color: '#fff !important',
                                    backgroundColor: '#7C0A00 !important'
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#7C0A00 !important'
                                },
                            }}
                        />
                    </Stack>
                </Box>
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper sx={style}>
                    <Box sx={{ padding: "10px 0px", display: "flex", justifyContent: "flex-end", position: "sticky", top: 0, zIndex: 1, backgroundColor: "#F8F5ED" }}>
                        <CancelSharpIcon
                            onClick={handleClose}
                            sx={{ color: "#C26B64", cursor: "pointer", }}
                        />
                    </Box>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {currentItem && (
                            <Grid container spacing={2}>
                                {/* Name */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        value={currentItem.name ? currentItem.name : currentItem.Name || 0}
                                        variant="outlined"

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Price"
                                        value={currentItem.price ? currentItem.price : currentItem.Price || 0}
                                        variant="outlined"

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Category"
                                        value={currentItem.category ? currentItem.category : currentItem.Category || 0}
                                        variant="outlined"

                                    />
                                </Grid>

                                {/* Description */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        value={currentItem.description ? currentItem.description : currentItem.Description || 0}
                                        variant="outlined"
                                        multiline
                                        rows={5}

                                    />
                                </Grid>

                                {/* MinHeight and MaxHeight */}
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Min Height"
                                        value={currentItem.minHeight ? currentItem.minHeight : currentItem.MinHeight || 0}
                                        variant="outlined"

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Max Height"
                                        value={currentItem.maxHeight ? currentItem.maxHeight : currentItem.MaxHeight || 0}
                                        variant="outlined"

                                    />
                                </Grid>

                                {/* MinWeight and MaxWeight */}
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Min Weight"
                                        value={currentItem.minWeight ? currentItem.minWeight : currentItem.MinWeight || 0}
                                        variant="outlined"

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Max Weight"
                                        value={currentItem.maxWeight ? currentItem.MaxWeight : currentItem.MaxWeight || 0}
                                        variant="outlined"

                                    />
                                </Grid>

                                {/* MinLength and MaxLength */}
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Min Length"
                                        value={currentItem.minLength ? currentItem.minLength : currentItem.MinLength || 0}
                                        variant="outlined"

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Max Length"
                                        value={currentItem.maxLength ? currentItem.maxLength : currentItem.MaxLength || 0}
                                        variant="outlined"

                                    />
                                </Grid>

                                {/* MinWidth and MaxWidth */}
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Min Width"
                                        value={currentItem.minWidth ? currentItem.minWidth : currentItem.MinWidth || 0}
                                        variant="outlined"

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Max Width"
                                        value={currentItem.maxWidth ? currentItem.maxWidth : currentItem.MaxWidth || 0}
                                        variant="outlined"

                                    />
                                </Grid>

                                {/* MinDepth and MaxDepth */}
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Min Depth"
                                        value={currentItem.minDepth ? currentItem.minDepth : currentItem.MinDepth || 0}
                                        variant="outlined"

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Max Depth"
                                        value={currentItem.maxDepth ? currentItem.maxDepth : currentItem.MaxDepth || 0}
                                        variant="outlined"

                                    />
                                </Grid>

                                {/* MinDiameter and MaxDiameter */}
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Min Diameter"
                                        value={currentItem.minDiameter ? currentItem.minDiameter : currentItem.MinDiameter || 0}
                                        variant="outlined"

                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Max Diameter"
                                        value={currentItem.maxDiameter ? currentItem.maxDiameter : currentItem.MaxDiameter || 0}
                                        variant="outlined"

                                    />
                                </Grid>
                            </Grid>
                        )}
                    </Typography>
                </Paper>
            </Modal>


            <Dialog open={openEditDialog} onClose={handleEditClose} >

                <DialogContent sx={{ backgroundColor: "#F8F5ED", }}>
                    <DialogContentText mb={2}>Edit Category for the selected item</DialogContentText>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={categoriesData.map((option) => option.name)}
                                value={selectedCategory}
                                onChange={(event, newValue) => setSelectedCategory(newValue)}
                                renderInput={(params) => <TextField {...params} label="Category" variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#C26B64', // Change this to your desired border color
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#C26B64', // Change this to your desired border color on hover
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#C26B64', // Change this to your desired border color when focused
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#C26B64', // Change this to your desired label color
                                            fontSize: '0.9rem',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#C26B64', // Change this to your desired label color when focused
                                        },
                                    }}
                                />}
                                PaperComponent={({ children }) => (
                                    <Paper sx={{
                                        backgroundColor: "#F8F5ED",

                                        '& .MuiAutocomplete-option': {
                                            fontSize: '1rem',
                                            '&.Mui-focused': {
                                                backgroundColor: '#D5A28F !important', // Color on focus/hover
                                                color: '#FFF !important', // Text color on hover
                                            },
                                            '&[aria-selected="true"]': {
                                                backgroundColor: '#C26B64 !important', // Background color for selected item
                                                color: '#FFF !important', // Text color for selected item
                                            },
                                            '&:hover': {
                                                backgroundColor: '#D5A28F !important', // Color on hover
                                                color: '#FFF !important', // Text color on hover
                                            },
                                        },
                                        '& ::-webkit-scrollbar': {
                                            width: '5px !important',
                                        },
                                        '& ::-webkit-scrollbar-thumb': {
                                            backgroundColor: '#C26B64 !important',
                                            borderRadius: '2px',
                                        },
                                        '& ::-webkit-scrollbar-thumb:hover': {
                                            cursor: "pointer"
                                        },

                                    }}>
                                        {children}
                                    </Paper>
                                )}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        fontSize: '0.8rem', // Reduce font size in the input
                                    },
                                }}
                                size='small'
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: "#F8F5ED", }}>
                    <Button onClick={handleEditClose} sx={{ color: "#C26B64" }}>Cancel</Button>
                    <Button onClick={handleConfirmUpdate} sx={{ color: "#7C0A00" }}>Ok</Button>

                </DialogActions>
            </Dialog>

            <Modal
                open={openConfirmDialog}
                onClose={handleConfirmClose}
                aria-labelledby="confirm-update-modal"
                aria-describedby="confirm-update-description"
            >
                <Box sx={style2} >
                    <Typography id="confirm-update-description" sx={{ mt: 2 }}>
                        Are you sure you want to update the category to {selectedCategory}
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" marginTop="16px">

                        <Button onClick={handleConfirmClose} sx={{ color: "#C26B64" }} style={{ marginLeft: '8px' }}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateCategory} sx={{ color: "#7C0A00" }}>
                            update
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Dialog
                open={priceDialog}
                onClose={() => setPriceDialog(false)}
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        width: '500px', // Customize the width as needed
                        maxWidth: '500px', // This ensures the width doesn't exceed 500px
                        // height: "40vh",
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                    },
                }}
            >
                <DialogContent sx={{ backgroundColor: "#F8F5ED" }}>
                    {categoryFilter ? (
                        prices.length === 0 ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100px" }}>
                                    <CircularProgress sx={{ color: "#C26B64" }} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box sx={{ backgroundColor: "#F8F5ED", display: "flex", justifyContent: "space-between", padding: "0px 5px 10px 5px" }}>
                                    <span style={{ color: "#C26B64", fontVariant: "small-caps" }}>
                                        Products Price Comparison by Category
                                    </span>
                                    <CancelSharpIcon sx={{ color: "#C26B64", cursor: "pointer" }} onClick={() => setPriceDialog(false)} />
                                </Box>
                                <DialogContentText mb={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
                                    <span style={{ color: "#C26B64", fontWeight: "bold" }}>
                                        Category: &nbsp;{categoryFilter}
                                    </span>
                                </DialogContentText>
                                <Grid container spacing={2} direction="row">
                                    <Grid item xs={12}>
                                        <Grid container direction="row" spacing={4}>
                                            <Grid item xs={6}>
                                                <DialogContentText sx={{ color: "#C26B64" }}>Competitor</DialogContentText>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <DialogContentText sx={{ color: "#C26B64", display: "flex", justifyContent: "flex-end" }}>Min Price $</DialogContentText>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <DialogContentText sx={{ color: "#C26B64", display: "flex", justifyContent: "flex-end" }}>Max Price $</DialogContentText>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {Object.entries(prices).map(([websiteName, [minPrice, maxPrice]]) => (
                                    <Grid container spacing={4} key={websiteName}>
                                        <Grid item xs={6}>
                                            <DialogContentText>{websiteName}</DialogContentText>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <DialogContentText sx={{ display: "flex", justifyContent: "flex-end" }}>
                                                {typeof minPrice === 'number' ? minPrice.toFixed(2) : minPrice}
                                            </DialogContentText>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <DialogContentText sx={{ display: "flex", justifyContent: "flex-end" }}>
                                                {typeof maxPrice === 'number' ? maxPrice.toFixed(2) : maxPrice}
                                            </DialogContentText>
                                        </Grid>
                                    </Grid>
                                ))}
                            </>
                        )
                    ) : (
                        <>
                            <DialogContentText sx={{ display: "flex" }}>Select any of the category to compare price!</DialogContentText>
                            <DialogActions sx={{ backgroundColor: "#F8F5ED" }}>
                                <Button onClick={() => { setPriceDialog(false); }} sx={{ color: "#7C0A00" }}>Ok</Button>
                            </DialogActions>
                        </>
                    )}
                </DialogContent>
            </Dialog>




        </Dashboard>
    )
}


export const fetchLastId = createAsyncThunk(
    "fetch-lastid",
    async ({ tabIndex, currentPage, categorySearch = "", label = "", searchQuery = "" }) => {
        try {
            console.log("label:", label, "search:", searchQuery)
            const token = localStorage.getItem('token');
            const response = await axios.post("http://localhost:3001/fetch-lastid", {
                tabIndex,
                currentPage,
                categorySearch,
                label,
                searchQuery
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
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