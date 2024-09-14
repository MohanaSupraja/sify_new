import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Box, Typography, CircularProgress, Autocomplete, Tooltip, Dialog, DialogActions, DialogContentText, DialogTitle, Tabs, Tab, Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, Modal, DialogContent, TableRow, Paper, Divider
} from '@mui/material';
import productUrls from './product_urls.json'; // Adjust the path as necessary
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from '@mui/icons-material/Save';
import InfoIcon from '@mui/icons-material/Info';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { useSelector, useDispatch } from 'react-redux';
import { deletetempitem, editAll, extractProducts, extractedData, gettempProduct, removetempProduct, saveAll, storeProduct, tempData } from '../state/extractSlice';
import CancelSharpIcon from "@mui/icons-material/CancelSharp";
import { fetchWebsites, selectwebData } from '../state/webSlice';
import { getActivities, selectActivityData } from '../state/activitySlice';
import Dashboard from './Dashboard';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { bgcolor, padding } from '@mui/system';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  overflowY: "auto",
  transform: "translate(-50%, -50%)",
  width: 700,
  maxHeight: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  scrollbarWidth: "thin",
  padding: "0% 2%",
  bgcolor: "#F8F5ED"
};
export default function Extract() {
  const nav = useNavigate();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [mismatches, setMismatches] = useState([]);
  const [editMode, setEditMode] = useState(false); // State for edit mode
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [openDialog3, setOpenDialog3] = useState(false);
  const [openSave, setOpenSave] = useState(false);
  const [tempResult, setTempResult] = useState(''); // Temporary storage for edited result
  const [activeTab, setActiveTab] = useState(0); // State for active tab
  const dispatch = useDispatch();
  const [displayedProducts, setDisplayedProducts] = useState([]); // New state variable
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null); // State to hold the id of the product to be deleted
  const [activities2, SetActivities2] = useState();
  const [info, setinfo] = useState(false);
  const [currentItem, setCurrentItem] = useState();
  const [editItemDialog, setEditItemDialog] = useState(false);
  const [editItem, setEditItem] = useState();
  const data = useSelector(extractedData);
  const websites = useSelector(selectwebData);
  const activities = useSelector(selectActivityData);
  const tempProducts = useSelector(tempData);
  const [editprev, seteditprev] = useState();

  const expectedKeys = [
    'id', 'url', 'name', 'keywords', 'origin', 'currency', 'price',
    'description', 'category', 'maxHeight', 'minHeight', 'maxWidth',
    'minWidth', 'maxDepth', 'minDepth', 'maxWeight', 'minWeight'
  ];
  useEffect(() => {
    setLoading2(false)
    console.log('Current Displayed Products:', displayedProducts); // Debug output
  }, [displayedProducts]);





  const handleFetch = () => {
    if (selectedOption) {
      setEditMode(false);
      setLoading(true);
      setDataReady(false);
      dispatch(extractProducts({ url, elementId: selectedOption.websiteElementId })).then((result) => {
        if (extractProducts.rejected.match(result)) {
          console.log("Error occurred:", result.payload.error.error);
          if (result.payload.message === 'Token expired') {
            // toast.error('Session expired')
            nav('/login');
          } else {
            console.log("erorrrrrrr", result.payload)

            toast.error(result.payload.message)
          }
        } else {

          console.log("Fetch successful:", result.payload);
        }
      });
    }
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };
  const handleSaveAll = async () => {

    setOpenSave(true);
  };
  const handleConfirmSaveAll = async () => {

    if (displayedProducts) {
      dispatch(saveAll({ data: displayedProducts })).then((result) => {
        if (saveAll.rejected.match(result)) {
          console.log("Error occurred:", result.payload);
          if (result.payload.message === 'Token expired') {
            nav('/login');
          } else {
            console.log(result.payload.message)
            toast.error(result.payload.message)
            //   setSnackbarMsg({ open: true, severity: 'error', message: result.payload.message });
          }
        } else {
          setOpenSave(false)
          dispatch(removetempProduct()).then(() => dispatch(gettempProduct()))
          console.log("Fetch successful:", result.payload);
        }
      });
    }
  };

  const storeData = () => {
    setEditMode(false);
    setOpenDialog2(false);
    console.log("Data before dispatching storeProduct:", JSON.stringify(data, null, 2)); // Log data before dispatching
    dispatch(storeProduct({ data: result, websiteName: selectedOption.websiteName, activityId: selectedOption.id })).then((result) => {
      if (storeProduct.rejected.match(result)) {
        console.log("Error occurred:", result.payload);
        if (result.payload.message === 'Token expired') {
          nav('/login');
        } else {
          console.log(result.payload.message)
          toast.error(result.payload.message)
        }
      } else {
        toast.success("Saved successfully")
        dispatch(gettempProduct())
        console.log("Fetch successful:", result.payload);
      }
    });

  };
  const handleDelete = (id) => {
    setSelectedProductId(id); // Set the selected product id
    setOpenDialog3(true);
  };

  const handleConfirmDelete = () => {

    dispatch(deletetempitem({ name: selectedProductId })).then((result) => {
      if (deletetempitem.rejected.match(result)) {
        console.log("Error occurred:", result.payload);
        if (result.payload.message === 'Token expired') {
          nav('/login');
        } else {
          console.log(result.payload.message)
          toast.error(result.payload.message)
        }
      } else {
        setOpenDialog3(false);
        toast.success("Deleted successfully")
        dispatch(gettempProduct())
        console.log("Fetch successful:", result.payload);
      }
    });

  };

  useEffect(() => {
    if (tempProducts && tempProducts.length > 0) {
      setLoading2(true)
      setDisplayedProducts(tempProducts); // Initialize displayed products only if tempProducts is available
    }
  }, [tempProducts]);


  const handleEdit = () => {

    setTempResult(result); // Store the current result in temporary storage
    setEditMode(true); // Enable edit mode
  };
  const handleEdit2 = (product) => {
    console.log("hi")
    setEditItem(product);
    seteditprev(product.name);
    setEditItemDialog(true);

  }
  const handleEditSubmit = () => {
    console.log("clicked", editprev, editItem);
    dispatch(editAll({ editprev, editItem })).then((result) => {
      if (editAll.rejected.match(result)) {
        console.log("Error occurred:", result.payload);
        if (result.payload.message === 'Token expired') {
          nav('/login');
        } else {
          console.log(result.payload.message)
          toast.error(result.payload.message)
        }
      } else {

        setEditItemDialog(false)
        toast.success("Updated successfully")
        dispatch(gettempProduct())
        console.log("Fetch successful:", result.payload);
      }
    });
  }
  const handleUpdate = () => {
    setResult(tempResult);
    setOpenDialog(false);
    setEditMode(false);
  };

  const handleDialogClose = () => {
    setTempResult(result); // Reset tempResult to the original result if the dialog is closed without updating
    setOpenDialog(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleinfo = (item) => {
    setCurrentItem(item);
    setinfo(true);
  };
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setLoading(false);
      setDataReady(true);
      setResult(JSON.stringify(data, null, 2)); // Update result state with data received
      const fetchedKeys = Object.keys(data).map(key => key.toLowerCase());
      const originalKeys = Object.keys(data);
      const mismatches = [];

      expectedKeys.forEach(expectedKey => {
        const lowerCaseExpectedKey = expectedKey.toLowerCase();
        const matchingKey = originalKeys.find(key => key.toLowerCase() === lowerCaseExpectedKey);

        if (!matchingKey) {
          mismatches.push(`${expectedKey} field is missing`);
        } else if (matchingKey !== expectedKey) {
          mismatches.push(`${matchingKey} key is in incorrect format`);
        } else if (data[matchingKey] === null || data[matchingKey] === undefined || data[matchingKey] === '') {
          mismatches.push(`Value for ${expectedKey} is missing`);
        }
      });

      setMismatches(mismatches);
    } else {
      setLoading(false);
    }
  }, [data]);



  useEffect(() => {
    dispatch(fetchWebsites());
  }, [dispatch]);


  useEffect(() => {
    const fetchTempProducts = async () => {
      const result = await dispatch(gettempProduct());
      if (gettempProduct.rejected.match(result)) {
        console.log("Error occurred:", result.payload);
        if (result.payload.message === 'Token expired') {
          nav('/login');
        } else {
          console.log(result.payload.message)
          toast.error(result.payload.message)
        }
      } else {
        console.log("Fetch successful:", result.payload);
      }
    };

    fetchTempProducts();
  }, [dispatch, nav]);




  useEffect(() => {
    dispatch(getActivities());
  }, [dispatch]);

  // Handle changes to activities
  useEffect(() => {
    if (activities) {

      SetActivities2(activities);
    }
  }, [activities]);

  // Handle activities2 changes
  useEffect(() => {
    if (activities2) {
      // const flattenedActivities = activities2.flatMap(site =>
      //   site.activities.map(activity => ({
      //     ...activity,
      //   }))
      // );
      const activeActivity = activities2.find(activity => activity.status === 'Active');
      if (activeActivity) {
        setSelectedOption(activeActivity);
      }
    }
  }, [activities2]);


  return (
    <Dashboard>
      <Box style={{ maxWidth: '98%', height: '88vh', margin: '0 auto', padding: '10px', boxSizing: 'border-box' }}>
        <Box style={{ padding: '0px 0px 10px 0px' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="basic tabs example"
            variant=""
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: '#C26B64 !important' },
              '& .MuiTab-root': { color: '#C26B64 !important' },
              '& .Mui-selected': { color: '#C26B64 !important' },
            }}

          >
            <Tab label="Fetch" />
            <Tab label="Saved Products" />
          </Tabs>
        </Box>
        {activeTab === 0 && (
          <Box>
            <Box display="flex" alignItems="space-between" justifyContent="center" marginTop={1} marginBottom={1}>
              <TextField
                label="Active ID"
                variant="outlined"
                value={selectedOption ? selectedOption.activityName : ''}
                size="small"
                style={{ width: '30%', marginRight: '10px' }}
                disabled
              />
              <Autocomplete
                options={productUrls}
                value={url}
                sx={{ width: '20%', marginRight: '10px' }}
                onChange={(event, newValue) => setUrl(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Enter URL"
                    variant="outlined"
                    size='small'
                    style={{}}
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
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#C26B64', // Change this to your desired label color when focused
                      },
                    }}
                    fullWidth
                  />

                )}

              />
              <TextField
                label="Enter URL"
                variant="outlined"
                value={url}
                size='small'
                onChange={(e) => setUrl(e.target.value)}
                fullWidth
                style={{ maxWidth: '40%', marginRight: '10px' }}
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
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#C26B64', // Change this to your desired label color when focused
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleFetch}
                size='small'
                style={{ fontSize: "13px", backgroundColor: "#C26B64", padding: "8px 25px" }}
              >
                FETCH
              </Button>
            </Box>
            {loading && (
              <Box display="flex" justifyContent="center" marginTop={2}>
                <CircularProgress sx={{ color: "#C26B64" }} />
              </Box>
            )}
            {dataReady && (
              <Box display="flex" flexDirection="column" alignItems="center" style={{ height: 'calc(100% - 80px)', gap: '16px' }}>
                {/* Typography Boxes */}
                <Box display="flex" justifyContent="space-around" style={{ width: '100%' }}>
                  {/* Data Typography */}
                  <Box style={{ width: '62%', display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" style={{ fontVariant: "small-caps", color: '#C26B64' }}>
                      Data
                    </Typography>
                    {!editMode && (
                      <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
                        <Tooltip title="Edit">
                          <EditIcon style={{ paddingTop: "6px", fontSize: "25px", cursor: "pointer", color: '#C26B64' }} onClick={handleEdit} />
                        </Tooltip>
                        <Tooltip title="Save">
                          <SaveIcon style={{ paddingTop: "6px", fontSize: "25px", cursor: "pointer", color: '#C26B64' }} onClick={() => setOpenDialog2(true)} />
                        </Tooltip>
                      </div>
                    )}
                    {editMode && (
                      <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
                        <Tooltip title="update">
                          <CheckIcon style={{ paddingTop: "6px", fontSize: "25px", cursor: "pointer", color: '#C26B64' }} onClick={() => setOpenDialog(true)} />
                        </Tooltip>
                        <Tooltip title="cancel">
                          <ClearIcon style={{ paddingTop: "6px", fontSize: "25px", cursor: "pointer", color: '#C26B64' }} onClick={() => setEditMode(false)} />
                        </Tooltip>
                        <Tooltip title="Save">
                          <SaveIcon style={{ paddingTop: "6px", fontSize: "25px", cursor: "pointer", color: '#C26B64' }} onClick={() => setOpenDialog2(true)} />
                        </Tooltip>
                      </div>
                    )}
                  </Box>
                  {/* Mismatches Typography */}
                  <Box style={{ width: '38%' }}>
                    <Typography variant="h6" style={{ fontVariant: "small-caps", color: '#C26B64', marginLeft: "50px" }}>
                      Mismatches
                    </Typography>
                  </Box>
                </Box>

                {/* Content Boxes */}
                <Box display="flex" justifyContent="space-around" style={{ width: '100%' }}>
                  {/* Data Content */}
                  <Box flex={2} style={{ width: '70%', overflow: 'auto', maxHeight: '60vh', scrollbarWidth: "thin" }}>
                    {editMode ? (
                      <TextField
                        multiline
                        fullWidth
                        variant="outlined"
                        value={tempResult}
                        onChange={(e) => setTempResult(e.target.value)}
                      />
                    ) : (
                      <pre style={{ margin: 0 }}>{result}</pre>
                    )}
                  </Box>

                  {/* Mismatches Content */}
                  <Box padding={2} style={{ display: "flex", flexDirection: "column", width: '35%', overflow: 'auto', maxHeight: '50vh', scrollbarWidth: "thin" }}>

                    <Box style={{ flex: 1 }}>
                      {mismatches.length > 0 && <pre style={{ margin: 0 }}>{JSON.stringify(mismatches, null, 2)}</pre>}
                    </Box>
                    <Box style={{ flex: 1 }}>
                      <Typography variant="h6" style={{ fontVariant: "small-caps", color: '#C26B64', marginLeft: "10px" }}>
                        Upload
                      </Typography>

                      <input
                        type="file"
                        accept="image/*"
                        style={{ marginLeft: "10px", marginTop: "10px" }}
                        onChange={handleImageUpload}
                      />
                      {selectedImage ? (
                        <Box mt={2} display="flex" justifyContent="center">
                          <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%', maxHeight: '150px' }} />
                        </Box>
                      ) : ("")}
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            <Dialog
              open={openDialog}
              onClose={handleDialogClose}
              sx={{
                '& .MuiDialog-paper': {
                  width: '100%',
                  maxWidth: '350px',
                  margin: 'auto',
                },
              }}
            >
              <DialogTitle>
                <DialogContentText>Do you want to update the Data !</DialogContentText>
              </DialogTitle>
              <DialogActions>
                <Button onClick={handleDialogClose} sx={{ color: "#C26B64" }} size='small'>
                  Cancel
                </Button>
                <Button onClick={handleUpdate} sx={{ color: "#7C0A00" }} size='small'>
                  Update
                </Button>

              </DialogActions>
            </Dialog>
            <Dialog
              open={openDialog2}
              onClose={() => { setOpenDialog2(false) }}
              sx={{
                '& .MuiDialog-paper': {
                  width: '100%',
                  maxWidth: '350px',
                  margin: 'auto',
                },
              }}
            >
              <DialogTitle>
                <DialogContentText>Do you want to Save the Data !</DialogContentText>
              </DialogTitle>
              <DialogActions>

                <Button onClick={() => { setOpenDialog2(false) }} sx={{ color: "#C26B64" }} size='small'>
                  Cancel
                </Button>
                <Button onClick={storeData} sx={{ color: "#7C0A00" }} size='small'>
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
        {activeTab === 1 && (
          <Box>
            {/* Save All Button */}
            <Box>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Typography
                  style={{ fontVariant: "small-caps", color: '#7C0A00', paddingRight: "30px", cursor: "pointer" }}
                  onClick={handleSaveAll}
                >
                  <SaveIcon style={{ fontSize: '19px', paddingBottom: "2.5px" }} /> Save All
                </Typography>
              </div>
            </Box>

            {/* Main Content */}
            <Box display="flex" alignItems="center" justifyContent="center" marginTop={0} marginBottom={0}>
              {loading2 ? (
                <Box display="flex" justifyContent="center" marginTop={2}>
                  <CircularProgress sx={{ color: "#C26B64" }} />
                </Box>
              ) : (
                <Box sx={{ overflow: 'auto', maxHeight: '85vh', scrollbarWidth: 'thin' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto', scrollbarWidth: 'thin', maxHeight: '400px', backgroundColor: "#F8F5ED" }}>
                        <Table sx={{ minWidth: 650, tableLayout: 'fixed' }}>
                          {displayedProducts && displayedProducts.length > 0 ? (
                            <>
                              <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: "#F8F5ED" }}>
                                <TableRow>
                                  <TableCell width="5%" style={{ color: "#7C0A00", fontWeight: 'bold', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>id</TableCell>
                                  <TableCell width="10%" style={{ color: "#7C0A00", fontWeight: 'bold', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Category</TableCell>
                                  <TableCell width="30%" style={{ color: "#7C0A00", fontWeight: 'bold', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Product Name</TableCell>
                                  <TableCell width="30%" style={{ color: "#7C0A00", fontWeight: 'bold', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Description</TableCell>
                                  <TableCell width="10%" style={{ color: "#7C0A00", fontWeight: 'bold', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Price $</TableCell>
                                  <TableCell width="5%" style={{ color: "#7C0A00", fontWeight: 'bold', textAlign: 'center', whiteSpace: 'nowrap' }}></TableCell>
                                  <TableCell width="5%" style={{ color: "#7C0A00", fontWeight: 'bold', textAlign: 'center', whiteSpace: 'nowrap' }}></TableCell>
                                  <TableCell width="5%" style={{ color: "#7C0A00", fontWeight: 'bold', textAlign: 'center', whiteSpace: 'nowrap' }}></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {displayedProducts.map((product, index) => (
                                  <TableRow key={index}>
                                    <TableCell style={{ textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{index + 1}</TableCell>
                                    <TableCell style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.category}</TableCell>
                                    <TableCell style={{ textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</TableCell>
                                    <TableCell style={{ textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.description}</TableCell>
                                    <TableCell style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {typeof product.price === 'number' ? product.price.toFixed(2) : 0.00}
                                    </TableCell>

                                    <TableCell style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                      <Tooltip title="Info">
                                        <InfoIcon
                                          style={{ color: '#C26B64', fontSize: '19px', cursor: 'pointer' }}
                                          onClick={() => handleinfo(product)}
                                        />
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                      <Tooltip title="Edit">
                                        <EditIcon
                                          style={{ color: '#C26B64', fontSize: '19px', cursor: 'pointer' }}
                                          onClick={() => handleEdit2(product)}
                                        />
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                      <Tooltip title="Delete">
                                        <DeleteIcon
                                          style={{ color: '#C26B64', fontSize: '19px', cursor: 'pointer' }}
                                          onClick={() => handleDelete(product.name)}
                                        />
                                      </Tooltip>
                                    </TableCell>

                                  </TableRow>
                                ))}
                              </TableBody>
                            </>
                          ) : (
                            <TableBody>
                              <TableRow>
                                <TableCell colSpan={8} style={{ textAlign: 'center' }}>
                                  <Typography>No data to display</Typography>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          )}
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>


            {/* Info Modal */}
            <Modal
              open={info}
              onClose={() => { setinfo(false); }}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Paper sx={style}>
                <Box sx={{ padding: "10px 10px", display: "flex", justifyContent: "flex-end", position: "sticky", top: 0, zIndex: 1, backgroundColor: "#F8F5ED" }}>
                  <CancelSharpIcon
                    onClick={() => { setinfo(false); }}
                    sx={{ color: "#C26B64", cursor: "pointer", }}
                  />
                </Box>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  {currentItem && (
                    <Grid container spacing={2}>
                      {Object.keys(currentItem).map((key) => (
                        <Grid item xs={12} key={key}>
                          <TextField
                            fullWidth
                            label={key}
                            value={currentItem[key] || 0}
                            variant="outlined"

                            sx={{ mb: 2 }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Typography>
              </Paper>
            </Modal>


            {/* Edit Item Dialog */}
            {editItem && (
              <Dialog
                open={editItemDialog}
                onClose={() => setEditItemDialog(false)}
                fullWidth={true}
                maxWidth={false}
                sx={{
                  width: '750px',
                  margin: 'auto',
                  paddingTop: "10px",
                  '& .MuiDialogContent-root': {
                    maxHeight: '500px', // adjust as needed for your content
                    overflowY: 'auto',
                    scrollbarWidth: 'thin', // Firefox
                    backgroundColor: "#F8F5ED"
                  }
                }}
              >
                <DialogContent>
                  <Box sx={{ backgroundColor: "#F8F5ED", display: "flex", justifyContent: "space-between", backgroundColor: "#F8F5ED", position: "sticky", top: 0, zIndex: 1 }}>
                    <span style={{ color: "#C26B64", fontVariant: "small-caps", fontWeight: "500" }}>
                      Edit the Product Details here
                    </span>
                  </Box>
                  <Divider sx={{ borderColor: "#C26B64", margin: "10px 0" }} />
                  <Grid container spacing={2} marginTop={1}>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Url"
                        value={editItem.url}
                        onChange={(event) => setEditItem({ ...editItem, url: event.target.value })}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Name"
                        value={editItem.name}
                        onChange={(event) => setEditItem({ ...editItem, name: event.target.value })}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Keywords"
                        value={editItem.keywords}
                        onChange={(event) => setEditItem({ ...editItem, keywords: event.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Origin"
                        value={editItem.origin}
                        onChange={(event) => setEditItem({ ...editItem, origin: event.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Category"
                        value={editItem.category}
                        onChange={(event) => setEditItem({ ...editItem, category: event.target.value })}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Currency"
                        value={editItem.currency}
                        onChange={(event) => setEditItem({ ...editItem, currency: event.target.value })}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Price"
                        value={editItem.price}
                        onChange={(event) => setEditItem({ ...editItem, price: event.target.value })}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Min Height"
                        value={editItem.minHeight}
                        onChange={(event) => setEditItem({ ...editItem, minHeight: event.target.value })}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Max Height"
                        value={editItem.maxHeight}
                        onChange={(event) => setEditItem({ ...editItem, maxHeight: event.target.value })}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Min Weight"
                        value={editItem.minWeight}
                        onChange={(event) => setEditItem({ ...editItem, minWeight: event.target.value })}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Max Weight"
                        value={editItem.maxWeight}
                        onChange={(event) => setEditItem({ ...editItem, maxWeight: event.target.value })}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Min Length"
                        value={editItem.minLength}
                        onChange={(event) => setEditItem({ ...editItem, minLength: event.target.value })}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Max Length"
                        value={editItem.maxLength}
                        onChange={(event) => setEditItem({ ...editItem, maxLength: event.target.value })}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Min Depth"
                        value={editItem.minDepth}
                        onChange={(event) => setEditItem({ ...editItem, minDepth: event.target.value })}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Max Depth"
                        value={editItem.maxDepth}
                        onChange={(event) => setEditItem({ ...editItem, maxDepth: event.target.value })}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Min Width"
                        value={editItem.minWidth}
                        onChange={(event) => setEditItem({ ...editItem, minWidth: event.target.value })}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Max Width"
                        value={editItem.maxWidth}
                        onChange={(event) => setEditItem({ ...editItem, maxWidth: event.target.value })}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Min Diameter"
                        value={editItem.minDiameter}
                        onChange={(event) => setEditItem({ ...editItem, minDiameter: event.target.value })}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Max Diameter"
                        value={editItem.maxDiameter}
                        onChange={(event) => setEditItem({ ...editItem, maxDiameter: event.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Activity ID"
                        value={editItem.activityId}
                        onChange={(event) => setEditItem({ ...editItem, activityId: event.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Competitor Name"
                        value={editItem.websiteName}
                        onChange={(event) => setEditItem({ ...editItem, websiteName: event.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Date"
                        value={editItem.date}
                        onChange={(event) => setEditItem({ ...editItem, date: event.target.value })}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: "#F8F5ED" }}>
                  <Button onClick={() => setEditItemDialog(false)} sx={{ color: "#C26B64" }}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditSubmit} sx={{ color: "#7C0A00" }}>
                    Update
                  </Button>
                </DialogActions>
              </Dialog>
            )}

            <Dialog open={openSave} onClose={() => setOpenSave(false)} >
              <DialogContent sx={{ backgroundColor: "#F8F5ED" }}>
                <DialogContentText>Are you sure you want to save the data ?</DialogContentText>
              </DialogContent>
              <DialogActions sx={{ backgroundColor: "#F8F5ED" }}>
                <Button onClick={() => setOpenSave(false)} sx={{ color: "#C26B64" }}>Cancel</Button>
                <Button onClick={handleConfirmSaveAll} style={{ color: "#7C0A00" }} >Save</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openDialog3} onClose={() => setOpenDialog3(false)}>
              <DialogContent sx={{ backgroundColor: "#F8F5ED" }}>
                <DialogContentText>Are you sure you want to delete the record ?</DialogContentText>
              </DialogContent>
              <DialogActions sx={{ backgroundColor: "#F8F5ED" }}>
                <Button onClick={() => setOpenDialog3(false)} sx={{ color: "#C26B64" }}>Cancel</Button>
                <Button onClick={handleConfirmDelete} sx={{ color: "#7C0A00" }} >Delete</Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}

      </Box>
    </Dashboard>
  );
}
