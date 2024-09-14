// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { selectcategoriesData, selectsubcategoriesData, getcategories, getsubcategories, addcategory, addsubcategory, removecategory, removesubcategory, editCategoryy, editSubCategory } from '../state/webSlice';
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from '@mui/icons-material/Delete';
// import { styled } from '@mui/material/styles';
// import AddIcon from '@mui/icons-material/Add';
// import { toast } from 'react-toastify';
// import IconButton from '@mui/material/IconButton';
// import {
//     Tooltip,
//     Button,
//     TextField,
//     MenuItem,
//     Select,
//     Typography,
//     Paper,
//     Divider,
//     Snackbar,
//     Alert,
//     Grid,
//     Box,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogContentText,
//     DialogTitle,
// } from "@mui/material";

// const StyledButton = styled(Button)({
//     marginRight: '10px',
//     borderRadius: '5px',
//     '&:hover': {
//         backgroundColor: '#1976D2',
//         color: 'white',
//     },
// });

// const capitalizeAndTrim = (str) => {
//     return str.trim().toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
// };

// export default function Categories() {

//     const [newSubcategory, setNewSubcategory] = useState('');
//     const [selectedCategory, setSelectedCategory] = useState('');
//     const categories = useSelector(selectcategoriesData);
//     const [selectedCat, setSelectedCat] = useState(categories[0]);
//     const [editIndex, setEditIndex] = useState(null);
//     const [newCategory, setNewCategory] = useState('');
//     const [addCategory, setAddCategory] = useState('');
//     const [filteredSubcategories, setFilteredSubcategories] = useState(null);
//     const subcategories = useSelector(selectsubcategoriesData);
//     const [oldCategory, setOldCategory] = useState('');
//     const [oldSubCategory, setOldSubCategory] = useState('');
//     const [newSubcategory2, setNewSubcategory2] = useState('');
//     const [msg, setMsg] = useState({ open: false, message: "", severity: "" });
//     const [addIcon, setAddIcon] = useState(false);
//     const [addIcon2, setAddIcon2] = useState(false);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [openDialog2, setOpenDialog2] = useState(false);
//     const [errorModalOpen, setErrorModalOpen] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [errorModalOpen2, setErrorModalOpen2] = useState(false);
//     const [errorMessage2, setErrorMessage2] = useState('');
//     const dispatch = useDispatch();

//     const handleAddCategory = () => {
//         if (addCategory) {
//             dispatch(addcategory({ category: addCategory }));
//             setAddCategory(''); // Clear the input after adding
//             handleClick("success", `New Category ${addCategory} added!`);
//             setAddIcon(false)
//         }
//     };

//     const handleRemoveCategory = async (category) => {
//         try {
//             const response = await dispatch(removecategory({ category }));
//             console.log(response.payload.message); // Log the message to console
//             if (response.payload.message === "Category removed successfully")
//                 handleClick("success", `New Category ${category} removed!`);
//             else {
//                 setErrorMessage(response.payload.message);
//                 setErrorModalOpen(true);
//             }
//         } catch (error) {
//             console.error('Error removing category:', error);
//             setErrorMessage('Failed to remove category');
//             setErrorModalOpen(true);
//         }
//     };

//     const handleAddSubcategory = () => {
//         if (selectedCategory && newSubcategory.trim()) {
//             dispatch(addsubcategory({ category: selectedCategory, subcategory: newSubcategory }));
//             setNewSubcategory(''); // Clear the input after adding
//             handleClick("success", `New Subcategory ${newSubcategory} added to ${selectedCategory}!`);
//             setAddIcon2(false)
//         }
//     };

//     const handleRemoveSubCategory = async (category, subcategory) => {
//         if (category && subcategory) {
//             const response = await dispatch(removesubcategory({ category, subcategory }));
//             console.log(response.payload.message); // Log the message to console
//             if (response.payload.message === "Subcategory removed successfully")
//                 handleClick("success", `SubCategory ${category} removed!`);
//             else {
//                 setErrorMessage2(response.payload.message);
//                 setErrorModalOpen2(true);
//             }
//         }
//     };

//     useEffect(() => {
//         dispatch(getcategories());
//         dispatch(getsubcategories());
//     }, []);
//     // }, [categories, subcategories]);

//     const handleClick = (severity, message) => { // Snackbar
//         setMsg({ open: true, severity, message });
//     };

//     const handleClickClose = (event, reason) => { // Snackbar
//         if (reason === "clickaway") {
//             return;
//         }
//         setMsg({ open: false, message: "", severity: "" });
//     };

//     const handleCategoryClick = (category) => {
//         setSelectedCat(category);
//     };

//     const handleEditClick = (index, category) => {
//         setEditIndex(index);
//         setNewCategory(category);
//         setOldCategory(category); // Save the old category
//         setOpenDialog(true);
//     };

//     const handleCategoryChange = () => {
//         console.log("old & new:", oldCategory, newCategory);
//         dispatch(editCategoryy({ oldCategory, newCategory })); // Pass the old and new category as an object
//         setEditIndex(null);
//         setOpenDialog(false);
//     };
//     const handleEditClick2 = (index, subcategory) => {
//         // setEditIndex(index);
//         console.log("subcategory:", subcategory)
//         setNewSubcategory2(subcategory);
//         setOldSubCategory(subcategory); // Save the old category
//         setOpenDialog2(true);
//     };

//     const handleSubCategoryChange = () => {
//         console.log("old & new:", selectedCat, oldSubCategory, newSubcategory2);
//         dispatch(editSubCategory({ selectedCat, oldSubCategory, newSubcategory2 })); // Pass the old and new category as an object
//         // setEditIndex(null);
//         setOpenDialog2(false);
//     };
//     useEffect(() => {
//         console.log("!!!:", subcategories)
//         if (selectedCat == null) {
//             setSelectedCat(categories[0]);
//         }
//         if (selectedCat) {
//             const foundSubcategories = subcategories.find(doc => capitalizeAndTrim(doc.id) === capitalizeAndTrim(selectedCat));
//             console.log("founded:", foundSubcategories)
//             setFilteredSubcategories(foundSubcategories);
//         } else {
//             setFilteredSubcategories(null); // Handle case where no category is selected
//         }
//     }, [selectedCat, subcategories]);

//     return (
//         <Grid container sx={{ margin: "3px 0px 0px 0px" }}>
//             {/* Categories Column */}
// <Grid item xs={12} md={6}>
//     <Paper elevation={3}>
//         <Box sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px' }}>
//                 <Typography variant="h6" >
//                     <span style={{ fontVariant: "small-caps", color: '#C26B64' }}>  Categories</span>
//                 </Typography>
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                     {addIcon ? (
//                         <>
//                             <TextField
//                                 id="outlined-basic"
//                                 label="Search Category"
//                                 variant="outlined"
//                                 size="small"
//                                 value={addCategory}
//                                 onChange={(e) => setAddCategory(e.target.value)}
//                                 style={{ marginRight: '10px', padding: "", width: '200px' }}
//                             />
//                             <StyledButton variant="outlined" color="primary" onClick={handleAddCategory} style={{ marginRight: '10px' }}>
//                                 Add
//                             </StyledButton>
//                         </>
//                     ) : (
//                         <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setAddIcon(true)}>
//                             <AddIcon sx={{ color: "#C26B64" }} />
//                             <Typography variant="body1" sx={{ marginLeft: '5px' }}>Add Category</Typography>
//                         </Box>
//                     )}
//                 </Box>
//             </Box>
//         </Box>
//         <Divider sx={{ height: '3px' }} />
//         <TableContainer sx={{ height: 'calc(85vh - 75px)', overflowY: 'auto', scrollbarWidth: "thin" }}>
//             <Table>
//                 <TableHead sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 2 }}>
//                     <TableRow sx={{}}>
//                         <TableCell width="5%" sx={{ fontWeight: "bold", textAlign: "center", padding: "8px 16px" }}>ID</TableCell>
//                         <TableCell width="75%" sx={{ fontWeight: "bold", textAlign: "left", padding: "8px 16px" }}>CATEGORY</TableCell>
//                         <TableCell width="10%" sx={{ fontWeight: "bold", textAlign: "center", padding: "8px 16px" }}></TableCell>
//                         <TableCell width="10%" sx={{ fontWeight: "bold", textAlign: "center", padding: "8px 16px" }}></TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
// {categories.map((category, index) => (
//     <TableRow key={index} sx={{ cursor: "pointer" }}
//     >
//         <TableCell sx={{
//             textAlign: "center",
//             padding: "8px 16px",
//             color: selectedCat === category ? '#C26B64' : 'black', // Conditional text color
//             fontVariant: selectedCat === category ? 'small-caps' : 'normal', // Conditional font variant
//         }}>{index + 1}</TableCell>
//         <TableCell style={{}} sx={{
//             color: selectedCat === category ? '#C26B64' : 'black', // Conditional text color
//             fontVariant: selectedCat === category ? 'small-caps' : 'normal', // Conditional font variant
//         }} onClick={() => handleCategoryClick(category)} >{category}</TableCell>
//         <TableCell cursor="pointer" sx={{ textAlign: "center", padding: "8px 16px" }}>
//             <Tooltip title="Edit">
//                 <IconButton size="small" onClick={() => handleEditClick(index, category)}>
//                     <EditIcon sx={{ height: '16px', width: '16px' }} />
//                 </IconButton>
//             </Tooltip>
//         </TableCell>
//         <TableCell sx={{ textAlign: "center", padding: "8px 16px" }}>
//             <Tooltip title="Delete">
//                 <DeleteIcon cursor="pointer" sx={{ height: '16px', width: '16px', color: '#EB3333', }} onClick={() => handleRemoveCategory(category)} />
//             </Tooltip></TableCell>

//     </TableRow>
// ))}
//                 </TableBody>
//             </Table>
//         </TableContainer>
//     </Paper>
// </Grid>

//             {/* Subcategories Column */}
//             <Grid item xs={12} md={6}>
//                 <Paper elevation={3} >
//                     <Box sx={{ position: "sticky", top: 0, backgroundColor: 'white', zIndex: 1 }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px' }}>
//                             <Typography variant="h6" >
//                                 <span style={{ fontVariant: "small-caps", color: '#C26B64' }}>  Sub Categories</span>
//                             </Typography>
//                             <Box>
//                                 {addIcon2 ? (
//                                     <>
//                                         <Select
//                                             value={selectedCategory}
//                                             onChange={(e) => setSelectedCategory(e.target.value)}
//                                             displayEmpty
//                                             variant="outlined"
//                                             size="small"
//                                             style={{ marginRight: '10px', width: '80px' }}
//                                         >
//                                             <MenuItem value="" disabled>
//                                                 Category
//                                             </MenuItem>
//                                             {categories.map((category, index) => (
//                                                 <MenuItem key={index} value={category}>
//                                                     {category}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                         <TextField
//                                             id="outlined-basic"
//                                             label="Search Subcategory"
//                                             variant="outlined"
//                                             size="small"
//                                             value={newSubcategory}
//                                             onChange={(e) => setNewSubcategory(e.target.value)}
//                                             style={{ marginRight: '10px', width: '130px' }}
//                                         />
//                                         <StyledButton variant="outlined" color="primary" onClick={handleAddSubcategory} style={{ marginRight: '10px' }}>
//                                             Add
//                                         </StyledButton>
//                                     </>
//                                 ) : (
//                                     <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setAddIcon2(true)}>
//                                         <AddIcon sx={{ color: "#C26B64" }} />
//                                         <Typography variant="body1" sx={{ marginLeft: '5px' }}>Add Sub Category</Typography>
//                                     </Box>
//                                 )}
//                             </Box>
//                         </Box>
//                         <Divider sx={{ height: '3px' }} />
//                     </Box>
//                     <TableContainer sx={{ height: 'calc(85vh - 75px)', overflowY: 'auto', scrollbarWidth: "thin" }}>
//                         <Table>
//                             <TableHead sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 2 }}>
//                                 <TableRow>
//                                     <TableCell width="5%" sx={{ fontWeight: "bold", textAlign: "center", padding: "8px 16px" }}>ID</TableCell>
//                                     <TableCell width="75%" sx={{ fontWeight: "bold", }}>SUBCATEGORY</TableCell>
//                                     <TableCell width="10%" sx={{ fontWeight: "bold", textAlign: "center", padding: "8px 16px" }}></TableCell>
//                                     <TableCell width="10%" sx={{ fontWeight: "bold", textAlign: "center", padding: "8px 16px" }}></TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {!filteredSubcategories || !filteredSubcategories.subcategories || filteredSubcategories.subcategories.length === 0 ? (
//                                     <TableRow>
//                                         <TableCell colSpan={4} sx={{ textAlign: "center", padding: "16px" }}>
//                                             <Typography variant="body1">
//                                                 No subcategories found for <span style={{ fontVariant: "small-caps", color: "#C26B64" }}>{selectedCat}</span>
//                                             </Typography>
//                                         </TableCell>
//                                     </TableRow>
//                                 ) : (
//                                     filteredSubcategories.subcategories.map((subcategory, subIndex) => (
//                                         <TableRow key={subIndex}>
//                                             <TableCell sx={{ textAlign: "center", padding: "8px 16px" }}>{subIndex + 1}</TableCell>
//                                             <TableCell>{subcategory}</TableCell>
//                                             <TableCell sx={{ textAlign: "center", padding: "8px 16px" }}>
//                                                 <Tooltip title="Edit">
//                                                     <IconButton size="small" onClick={() => handleEditClick2(subIndex, subcategory)}>
//                                                         <EditIcon sx={{ height: '16px', width: '16px' }} />
//                                                     </IconButton>
//                                                 </Tooltip>
//                                             </TableCell>
//                                             <TableCell sx={{ textAlign: "center", padding: "8px 16px" }}>
//                                                 <Tooltip title="Delete">
//                                                     <DeleteIcon sx={{ cursor: 'pointer', height: '16px', width: '16px', color: '#EB3333' }} onClick={() => handleRemoveSubCategory(selectedCat, subcategory)} />
//                                                 </Tooltip>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>
//                 </Paper>
//             </Grid>

//             {/* Edit Category Modal */}
//             <Dialog
//                 open={openDialog}
//                 onClose={() => setOpenDialog(false)}
//                 sx={{
//                     '& .MuiDialog-paper': {
//                         width: '100%',
//                         maxWidth: '300px', // Set your custom width
//                         margin: 'auto', // Center the dialog
//                     },
//                 }}
//             >
//                 <DialogTitle>
//                     <DialogContentText>Select the new category!</DialogContentText>
//                 </DialogTitle>
//                 <DialogContent>
//                     <Select
//                         value={newCategory}
//                         onChange={(e) => setNewCategory(e.target.value)}
//                         fullWidth
//                         size='small'
//                     >
//                         {categories.map((cat, idx) => (
//                             <MenuItem key={idx} value={cat}>{cat}</MenuItem>
//                         ))}
//                     </Select>
//                 </DialogContent>
//                 <DialogActions>
//                     <StyledButton onClick={handleCategoryChange} color="primary" size='small'>
//                         Save
//                     </StyledButton>
//                     <StyledButton onClick={() => setOpenDialog(false)} color="primary" size='small'>
//                         Cancel
//                     </StyledButton>
//                 </DialogActions>
//             </Dialog>

//             <Dialog open={openDialog2} onClose={() => setOpenDialog2(false)}
//                 sx={{
//                     '& .MuiDialog-paper': {
//                         width: '100%',
//                         maxWidth: '300px', // Set your custom width
//                         margin: 'auto', // Center the dialog
//                     },
//                 }}>
//                 <DialogTitle> <DialogContentText>Update the subcategory name. </DialogContentText></DialogTitle>
//                 <DialogContent>
//                     <Select
//                         value={newSubcategory2}
//                         onChange={(e) => setNewSubcategory2(e.target.value)}
//                         fullWidth
//                         size='small'
//                     >
//                         {filteredSubcategories?.subcategories?.map((subcategory, subIndex) => (
//                             <MenuItem key={subIndex} value={subcategory}>{subcategory}</MenuItem>
//                         ))}
//                     </Select>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenDialog2(false)} color="primary" size='small'>
//                         Cancel
//                     </Button>
//                     <Button onClick={handleSubCategoryChange} color="primary" size='small'>
//                         Save
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//             <Dialog open={errorModalOpen} onClose={() => setErrorModalOpen(false)}
//                 sx={{
//                     '& .MuiDialog-paper': {
//                         width: '100%',
//                         maxWidth: '500px',
//                         margin: 'auto',
//                     },
//                 }}>
//                 {/* <DialogTitle> <DialogContentText>Update the subcategory name. </DialogContentText></DialogTitle> */}
//                 <DialogContent>
//                     {errorMessage}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setErrorModalOpen(false)} color="primary" size='small'>
//                         Ok
//                     </Button>

//                 </DialogActions>
//             </Dialog>
//             <Dialog open={errorModalOpen2} onClose={() => setErrorModalOpen2(false)}
//                 sx={{
//                     '& .MuiDialog-paper': {
//                         width: '100%',
//                         maxWidth: '500px',
//                         margin: 'auto',
//                     },
//                 }}>
//                 {/* <DialogTitle> <DialogContentText>Update the subcategory name. </DialogContentText></DialogTitle> */}
//                 <DialogContent>
//                     {errorMessage2}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setErrorModalOpen2(false)} color="primary" size='small'>
//                         Ok
//                     </Button>

//                 </DialogActions>
//             </Dialog>
//             {/* Snackbar */}
//             <Snackbar
//                 open={msg.open}
//                 autoHideDuration={2000}
//                 onClose={handleClickClose}
//                 anchorOrigin={{ vertical: "top", horizontal: "right" }}
//             >
//                 <Alert
//                     onClose={handleClickClose}
//                     severity={msg.severity}
//                     variant="filled"
//                     sx={{ width: "100%" }}
//                 >
//                     {msg.message}
//                 </Alert>
//             </Snackbar>
//         </Grid >
//     );
// }
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   addsylviecategory,
//   removesylviecategory,
//   getsylviecategory,
//   updatesylviecategory,
//   selectcategoriesData,
// } from '../state/categorySlice';
// import {
//   Autocomplete,
//   Button,
//   TextField,
//   Typography,
//   Paper,
//   Snackbar,
//   Alert,
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   IconButton,
//   Grid,
//   Divider,
//   Tooltip,
//   CircularProgress // Import CircularProgress for loading spinner
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import AddIcon from '@mui/icons-material/Add';
// import Dashboard from './Dashboard';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const Categories = () => {
//   const [newCategory, setNewCategory] = useState('');
//   const [addCategory, setAddCategory] = useState('');
//   const [editIndex, setEditIndex] = useState(null);
//   const [oldCategory, setOldCategory] = useState('');
//   const [openDialog, setOpenDialog] = useState(false);
//   const [snackbarMsg, setSnackbarMsg] = useState({ open: false, message: '', severity: 'success' });
//   const [addIcon, setAddIcon] = useState(false);
//   const [deleteCategory, setDeleteCategory] = useState(false);
//   const [deleteItem, setDeleteItem] = useState('');
//   const [loading, setLoading] = useState(false); // Added loading state

//   const nav = useNavigate();
//   const categoriesData = useSelector(selectcategoriesData);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchCategories = async () => {
//       setLoading(true); // Start loading
//       try {
//         const result = await dispatch(getsylviecategory());
//         if (getsylviecategory.rejected.match(result)) {
//           console.log("Error occurred:", result.payload);
//           if (result.payload.message === 'Token expired') {
//             toast.error("Session Expired");
//             nav('/login');
//           } else {
//             toast.error(result.payload.message);
//           }
//         } else {
//           console.log("Fetch successful:", result.payload);
//         }
//       } finally {
//         setLoading(false); // End loading
//       }
//     };

//     fetchCategories();
//   }, [dispatch, nav]);

//   const handleAddCategory = () => {
//     if (addCategory) {
//       setLoading(true); // Start loading
//       dispatch(addsylviecategory({ category: addCategory })).then((result) => {
//         if (addsylviecategory.rejected.match(result)) {
//           console.log("Error occurred:", result.payload);
//           if (result.payload.message === 'Token expired') {
//             nav('/login');
//           } else {
//             toast.error(result.payload.message);
//           }
//         } else {
//           setAddCategory('');
//           setAddIcon(false);
//           dispatch(getsylviecategory());
//         }
//         setLoading(false); // End loading
//       });
//     }
//   };

//   const handleRemoveCategory = (category) => {
//     setDeleteItem(category);
//     setDeleteCategory(true);
//   };

//   const conformDelete = () => {
//     setLoading(true); // Start loading
//     dispatch(removesylviecategory({ deleteItem })).then((result) => {
//       if (removesylviecategory.rejected.match(result)) {
//         console.log("Error occurred:", result.payload);
//         if (result.payload.message === 'Token expired') {
//           nav('/login');
//         } else {
//           toast.error(result.payload.message);
//         }
//       } else {
//         setDeleteCategory(false);
//         dispatch(getsylviecategory());
//       }
//       setLoading(false); // End loading
//     });
//   };

//   const handleEditClick = (index, category) => {
//     setEditIndex(index);
//     setNewCategory(category.name);
//     setOldCategory(category.name);
//     setOpenDialog(true);
//   };

//   const handleCategoryChange = () => {
//     setLoading(true); // Start loading
//     dispatch(updatesylviecategory({ name: oldCategory, newName: newCategory })).then((result) => {
//       if (updatesylviecategory.rejected.match(result)) {
//         console.log("Error occurred:", result.payload);
//         if (result.payload.message === 'Token expired') {
//           nav('/login');
//         } else {
//           toast.error(result.payload.message);
//                 }
//       } else {
//         setEditIndex(null);
//         setOpenDialog(false);
//       }

//       dispatch(getsylviecategory());
//     });
//     setLoading(false); // End loading
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbarMsg({ ...snackbarMsg, open: false });
//   };

//   return (
//     <Dashboard>
//       <Box>
//         <Grid item xs={12} md={6}>
//           <Paper elevation={3}>
//             <Box sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px' }}>
//                 <Typography variant="h6">
//                   <span style={{ fontVariant: 'small-caps', color: '#C26B64' }}>Categories ({categoriesData ? categoriesData.length : 0})</span>
//                 </Typography>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
//                   {addIcon ? (
//                     <>
//                       <TextField
//                         label="Add New Category"
//                         variant="outlined"
//                         onChange={(event) => setAddCategory(event.target.value)}
//                         autoFocus
//                       />
//                       <Button
//                         size="medium"
//                         onClick={handleAddCategory}
//                         variant="contained"
//                       >
//                         Add
//                       </Button>
//                     </>
//                   ) : (
//                     <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setAddIcon(true)}>
//                       <AddIcon sx={{ color: '#C26B64' }} />
//                       <Typography variant="h6" sx={{ fontVariant: "small-caps", color: '#C26B64', marginLeft: '5px' }}>Add Category</Typography>
//                     </Box>
//                   )}
//                 </Box>
//               </Box>
//               <Divider />
//             </Box>
//             <Box>
//               {loading ? ( // Show loading spinner
//                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
//                   <CircularProgress />
//                 </Box>
//               ) : (
//                 <TableContainer sx={{ height: 'calc(85vh - 65px)', scrollbarWidth: "thin", overflowY: 'auto', margin: "0px" }}>
//                   <Table>
//                     <TableHead sx={{position:"sticky",top:0,zIndex:1, backgroundColor: "white"}}>
//                       <TableRow>
//                         <TableCell width="5%" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#154360' }}>ID</TableCell>
//                         <TableCell width="85%" sx={{ fontWeight: 'bold', color: '#154360' }}>Category</TableCell>
//                         <TableCell width="5%" sx={{ fontWeight: 'bold', color: '#154360' }}></TableCell>
//                         <TableCell width="5%" sx={{ fontWeight: 'bold', color: '#154360' }}></TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {categoriesData.map((category, index) => (
//                         <TableRow key={index} sx={{ cursor: "pointer" }}>
//                           <TableCell sx={{ textAlign: "center", padding: "8px 16px" }}>{index + 1}</TableCell>
//                           <TableCell onClick={() => handleEditClick(index, category)}>{category.name}</TableCell>
//                           <TableCell sx={{ textAlign: "center", padding: "8px 16px" }}>
//                             <Tooltip title="Edit">
//                               <IconButton onClick={() => handleEditClick(index, category)}>
//                                 <EditIcon sx={{ height: '16px', width: '16px' }} />
//                               </IconButton>
//                             </Tooltip>
//                           </TableCell>
//                           <TableCell sx={{ textAlign: "center", padding: "8px 16px" }}>
//                             <Tooltip title="Delete">
//                               <DeleteIcon cursor="pointer" sx={{ height: '16px', width: '16px', color: '#EB3333' }} onClick={() => handleRemoveCategory(category.name)} />
//                             </Tooltip>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               )}
//             </Box>
//           </Paper>
//           <Snackbar open={snackbarMsg.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
//             <Alert onClose={handleCloseSnackbar} severity={snackbarMsg.severity} sx={{ width: '100%' }}>
//               {snackbarMsg.message}
//             </Alert>
//           </Snackbar>
//         </Grid>
//         <Dialog open={openDialog} onClose={() => setOpenDialog(false)} aria-labelledby="form-dialog-title">
//           <DialogContent>
//             <DialogContentText>Edit Category here</DialogContentText>
//             <Autocomplete
//               id="category-autocomplete"
//               options={categoriesData.map((option) => option.name)}
//               freeSolo
//               value={newCategory}
//               onChange={(event, newValue) => setNewCategory(newValue)}
//               size="small"
//               sx={{ width: '300px', marginTop: "20px" }} // Adjusted width
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Add New Category"
//                   variant="outlined"
//                   onChange={(e) => setNewCategory(e.target.value)}
//                   autoFocus
//                 />
//               )}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenDialog(false)} style={{color:"#7C0A00"}}>
//               Cancel
//             </Button>
//             <Button onClick={handleCategoryChange} color="primary">
//               Save
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <Dialog open={deleteCategory} onClose={() => setDeleteCategory(false)}>
//           <DialogContent>
//             <DialogContentText>Are you sure you want to delete the category "{deleteItem}"?</DialogContentText>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setDeleteCategory(false)} color="primary">Cancel</Button>
//             <Button onClick={conformDelete} color="primary">Delete</Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </Dashboard>
//   );
// };

// export default Categories;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addsylviecategory,
  removesylviecategory,
  getsylviecategory,
  updatesylviecategory,
  selectcategoriesData,
} from '../state/categorySlice';
import {
  Autocomplete,
  CircularProgress,
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  InputAdornment,
  Alert,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Grid,
  Divider,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Dashboard from './Dashboard';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const Categories = () => {
  const [search, setSearch] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [addCategory, setAddCategory] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [oldCategory, setOldCategory] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState({ open: false, message: '', severity: 'success' });
  const [addIcon, setAddIcon] = useState(false);
  const nav = useNavigate();
  const [deleteCategory, setDeleteCategory] = useState(false);

  const [deleteItem, setDeleteItem] = useState('');
  const categoriesData = useSelector(selectcategoriesData);
  const dispatch = useDispatch();


  const handleSearch = (event) => {
    setSearch(event.target.value);
  };
  const filteredProducts = categoriesData.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );


  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const result = await dispatch(getsylviecategory());
      if (getsylviecategory.rejected.match(result)) {
        console.log("Error occurred:", result.payload);
        if (result.payload.message === 'Token expired') {
          toast.error("Session Expired");
          nav('/login');
        } else {
          setSnackbarMsg({ open: true, severity: 'error', message: result.payload.message });
        }
      } else {
        console.log("Fetch successful:", result.payload);
      }
      setLoading(false);
    };

    fetchCategories();
  }, [dispatch, nav]);

  const handleAddCategory = () => {
    if (addCategory) {
      dispatch(addsylviecategory({ category: addCategory })).then((result) => {
        if (addsylviecategory.rejected.match(result)) {
          console.log("Error occurred:", result.payload);
          if (result.payload.message === 'Token expired') {
            nav('/login');
          } else {
            setSnackbarMsg({ open: true, severity: 'error', message: result.payload.message });
          }
        } else {
          setAddCategory('');
          setAddIcon(false);
          dispatch(getsylviecategory());
          // setSnackbarMsg({ open: true, severity: 'success', message: `New Category ${addCategory} added!` });
        }
      });
    }
  };
  const handleRemoveCategory = (category) => {

    setDeleteItem(category);

    setDeleteCategory(true);

  };

  const conformDelete = () => {
    dispatch(removesylviecategory({ deleteItem })).then((result) => {
      if (removesylviecategory.rejected.match(result)) {
        console.log("Error occurred:", result.payload);
        if (result.payload.message === 'Token expired') {
          nav('/login');
        } else {
          setSnackbarMsg({ open: true, severity: 'error', message: result.payload.message });
        }
      } else {
        setDeleteCategory(false)
        dispatch(getsylviecategory());
        // setSnackbarMsg({ open: true, severity: 'success', message: `Category ${deleteItem} removed successfully!` });
      }
    });
  };

  const handleEditClick = (index, category) => {
    setEditIndex(index);
    setNewCategory(category.name);
    setOldCategory(category.name);
    setOpenDialog(true);
  };

  const handleCategoryChange = () => {
    dispatch(updatesylviecategory({ name: oldCategory, newName: newCategory })).then((result) => {
      if (updatesylviecategory.rejected.match(result)) {
        console.log("Error occurred:", result.payload);
        if (result.payload.message === 'Token expired') {
          nav('/login');
        } else {
          setSnackbarMsg({ open: true, severity: 'error', message: result.payload.message });
        }
      } else {
        setEditIndex(null);
        setOpenDialog(false);
        // setSnackbarMsg({ open: true, severity: 'success', message: `Category ${oldCategory} updated successfully!` });
      }
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarMsg({ ...snackbarMsg, open: false });
  };

  return (
    <Dashboard>
      <Box>
        <Grid item xs={12} md={6}>
          <Paper elevation={0}>
            <Box sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1, backgroundColor: "#F8F5ED" }}>
              <Typography variant="h6">
                <span style={{ fontVariant: 'small-caps', color: '#C26B64' }}>Categories ({filteredProducts ? filteredProducts.length : 0})</span>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: "0px", padding: '10px' }}>
                <Box>
                  <TextField
                    id="input-with-icon-textfield"
                    value={search}
                    placeholder='Search Category ...'
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {addIcon ? (
                    <>
                      <TextField
                        placeholder='Add Category...'
                        variant="outlined"
                        onChange={(event) => setAddCategory(event.target.value)}
                        autoFocus
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
                        }}
                      />
                      <Button
                        size="medium"
                        onClick={handleAddCategory}
                        variant="contained"
                        style={{ backgroundColor: "#C26B64" }}
                      >
                        Add
                      </Button>
                    </>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setAddIcon(true)}>
                      <AddIcon sx={{ color: '#C26B64' }} />
                      <Typography variant="h6" sx={{ fontVariant: "small-caps", color: '#C26B64', marginLeft: '5px' }}>Add Category</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
              <Divider />
            </Box>
            <Box>
              <TableContainer sx={{ height: 'calc(85vh - 70px)', scrollbarWidth: "thin", overflowY: 'auto', margin: "0px", backgroundColor: "#F8F5ED" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width="5%" style={{ color: "#7C0A00", textAlign: 'center', fontWeight: 'bold' }}>ID</TableCell>
                      <TableCell width="85%" style={{ color: "#7C0A00", fontWeight: 'bold' }}>Category</TableCell>
                      {/* <TableCell width="5%" style={{  color: "#7C0A00",fontWeight: 'bold' }}></TableCell> */}
                      <TableCell width="5%" style={{ color: "#7C0A00", fontWeight: 'bold' }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <CircularProgress sx={{ color: "#C26B64" }} />
                        </TableCell>
                      </TableRow>
                    ) : filteredProducts.length > 0 ? (
                      filteredProducts.sort((a, b) => a.name.localeCompare(b.name)).map((category, index) => (
                        <TableRow key={index} sx={{ cursor: "pointer" }}>
                          <TableCell sx={{ textAlign: "center", padding: "8px 16px" }}>{index + 1}</TableCell>
                          <TableCell onClick={() => handleEditClick(index, category)}>{category.name}</TableCell>
                          {/* <TableCell sx={{ textAlign: "center", padding: "8px 16px" }}>
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleEditClick(index, category)}>
                              <EditIcon sx={{ height: '16px', width: '16px',color:"#C26B64" }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell> */}
                          <TableCell sx={{ textAlign: "center", padding: "8px 16px" }}>
                            <Tooltip title="Delete">
                              <DeleteIcon cursor="pointer" sx={{ height: '16px', width: '16px', color: '#C26B64' }} onClick={() => handleRemoveCategory(category.name)} />
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography>No data to display</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
          <Snackbar open={snackbarMsg.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity={snackbarMsg.severity} sx={{ width: '100%' }}>
              {snackbarMsg.message}
            </Alert>
          </Snackbar>
        </Grid>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} aria-labelledby="form-dialog-title">
          <DialogContent>
            <DialogContentText>Edit Category here</DialogContentText>
            <Autocomplete

              id="category-autocomplete"

              options={categoriesData.map((option) => option.name)}

              freeSolo

              value={newCategory}

              onChange={(event, newValue) => setNewCategory(newValue)}

              size="small"

              sx={{ width: '300px', marginTop: "20px" }} // Adjusted width

              renderInput={(params) => (

                <TextField

                  {...params}

                  label="Add New Category"

                  variant="outlined"

                  onChange={(e) => setNewCategory(e.target.value)}

                  autoFocus

                />

              )}

            />


          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleCategoryChange} style={{ color: "#7C0A00" }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={deleteCategory} onClose={() => setDeleteCategory(false)}>

          <DialogContent>

            <DialogContentText>Are you sure you want to delete the category "?</DialogContentText>

          </DialogContent>

          <DialogActions>

            <Button onClick={() => setDeleteCategory(false)} sx={{ color: "#C26B64" }}>Cancel</Button>

            <Button onClick={conformDelete} sx={{ color: "#7C0A00" }}>Delete</Button>

          </DialogActions>

        </Dialog>
      </Box>
    </Dashboard>
  );
};

export default Categories;