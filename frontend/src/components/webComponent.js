import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWebsites, selectwebData, addWebsite, updateWebsite, removeWebsite } from '../state/webSlice';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button, TextField, Grid, Typography, Box, IconButton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, Dialog, DialogActions,
  DialogContent, DialogContentText, CircularProgress, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Dashboard from './Dashboard';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Container = styled('div')(({ theme, sidebarOpen }) => ({
  padding: theme.spacing(2),
  flexGrow: 1,
  marginLeft: sidebarOpen ? '240px' : '0px',
  transition: 'margin-left 0.3s',
}));

const ButtonContainer = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  width: '100%',
});

const TableWrapper = styled('div')({
  width: '100%',
  overflowY: 'auto', // Enable vertical scrolling
  flexGrow: 1,
});

const validationSchema = Yup.object({
  name: Yup.string().required('Competitor name is required'),
  url: Yup.string().url('Invalid URL format').required('Competitor URL is required'),
  elementId: Yup.string().required('Element ID is required'),
});

const WebComponent = ({ sidebarOpen }) => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const webData = useSelector(selectwebData);
  const [view, setView] = useState('table');
  const [editOpen, setEditOpen] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [websiteToDelete, setWebsiteToDelete] = useState(null);

  useEffect(() => {
    const loadWebsites = async () => {
      try {
        const result = await dispatch(fetchWebsites());
        if (fetchWebsites.fulfilled.match(result)) {
          console.log("Error occurred:", result.payload);
          if (result.payload.message === 'Token expired') {
            toast.error("Session Expired");
            nav('/login');
          } else {
            toast.error(result.payload.message);
          }
        } else {
          console.log("Fetch unsuccessful:", result.payload);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
    loadWebsites();
  }, [dispatch, nav]);

  const handleToggleView = () => {
    setView(view === 'table' ? 'form' : 'table');
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const result = await dispatch(addWebsite(values));
      if (addWebsite.rejected.match(result)) {
        console.log("Error occurred:", result.payload);
        if (result.payload.message === 'Token expired') {
          toast.error("Session expired");
          nav('/login');
        } else {
          toast.error(result.payload.message);
        }
      } else {
        resetForm();
        setView('table');
        toast.success("Added Successfully");
        dispatch(fetchWebsites());
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleEditClick = (website) => {
    setSelectedWebsite(website);
    setEditOpen(true);
  };

  const handleRemoveClick = (website) => {
    setWebsiteToDelete(website);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const result = await dispatch(removeWebsite(websiteToDelete));
      if (removeWebsite.rejected.match(result)) {
        console.log("Error occurred:", result.payload);
        if (result.payload.message === 'Token expired') {
          toast.error("Session expired");
          nav('/login');
        } else {
          toast.error(result.payload.message);
        }
      } else {
        setDeleteOpen(false);
        setWebsiteToDelete(null);
        toast.success("Removed Successfully");
        dispatch(fetchWebsites());
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      const result = await dispatch(updateWebsite(values));
      if (updateWebsite.rejected.match(result)) {
        console.log("Error occurred:", result.payload);
        if (result.payload.message === 'Token expired') {
          toast.error("Session expired");
          nav('/login');
        } else {
          toast.error(result.payload.message);
        }
      } else {
        setEditOpen(false);
        setSelectedWebsite(null);
        toast.success("Updated Successfully");
        dispatch(fetchWebsites());
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    }
  };
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };
  const filteredProducts = webData.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dashboard sidebarOpen={sidebarOpen}>
      <Container sidebarOpen={sidebarOpen} style={{ height: "88vh", backgroundColor: "#F8F5ED" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            {view === 'table' && (
              <TextField
                id="input-with-icon-textfield"
                placeholder='Search Competitor  ...'
                value={search}
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
            )}
          </Box>
          <ButtonContainer>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleToggleView}>
              <Typography variant="h6" sx={{ fontVariant: "small-caps", color: '#C26B64', marginLeft: '5px' }}>
                {view === 'table' ? (<><AddIcon sx={{ color: '#C26B64' }} /> Add Competitor</>) : 'Show Websites'}
              </Typography>
            </Box>
          </ButtonContainer>
        </Box>
        {view === 'form' ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: "40px", height: '77vh', marginTop: "0px", }}>
            <Formik
              initialValues={{ name: '', url: '', elementId: '' }}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
            >
              {({ isSubmitting }) => (
                <Form style={{ width: '400px', marginTop: "10px" }}>
                  <Field
                    as={TextField}
                    placeholder="Competitor Name"
                    name="name"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    helperText={<ErrorMessage name="name" />}
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
                  <Field
                    as={TextField}
                    placeholder="Competitor URL"
                    name="url"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    helperText={<ErrorMessage name="url" />}
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
                  <Field
                    as={TextField}
                    placeholder="Element ID"
                    name="elementId"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    helperText={<ErrorMessage name="elementId" />}
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
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    style={{ backgroundColor: "#7C0A00", marginTop: '10px' }}
                  >
                    {isSubmitting ? 'Adding...' : 'Add'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        ) : (
          <TableWrapper>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="10vh">
                <CircularProgress />
              </Box>
            ) : filteredProducts.length > 0 ? (
              <Grid container spacing={2} >
                <Grid item xs={12} >
                  <TableContainer component={Paper} sx={{ height: 'calc(85vh - 47px)', width: '100%', scrollbarWidth: "thin", overflowX: 'hidden', backgroundColor: "#F8F5ED" }}>
                    <Table sx={{ tableLayout: 'fixed' }}>
                      <TableHead sx={{ position: "sticky", top: 0, zIndex: 1, }}>
                        <TableRow>
                          <TableCell width="5%" style={{ color: "#7C0A00", fontWeight: "bold", textAlign: "center", whiteSpace: 'nowrap', overflow: "hidden", textOverflow: "ellipsis" }}>ID</TableCell>
                          <TableCell width="25%" style={{ color: "#7C0A00", fontWeight: "bold", textAlign: "left", whiteSpace: 'nowrap', overflow: "hidden", textOverflow: "ellipsis" }}>Competitor Name</TableCell>
                          <TableCell width="60%" style={{ color: "#7C0A00", fontWeight: "bold", textAlign: "left", whiteSpace: 'nowrap', overflow: "hidden", textOverflow: "ellipsis" }}>Competitor URL</TableCell>
                          <TableCell width="5%" style={{ color: "#7C0A00", fontWeight: "bold", textAlign: "center" }}></TableCell>
                          <TableCell width="5%" style={{ color: "#7C0A00", fontWeight: "bold", textAlign: "center" }}></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.from(filteredProducts).sort((a, b) => a.id - b.id).map((item, index) => (
                          <TableRow key={index}>
                            <TableCell width="5%" style={{ textAlign: "center", whiteSpace: 'nowrap', overflow: "hidden", textOverflow: "ellipsis" }}>{index + 1}</TableCell>
                            <TableCell width="30%" style={{ textAlign: "left", whiteSpace: 'nowrap', overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</TableCell>
                            <TableCell width="60%" style={{ textAlign: "left", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.url}</TableCell>
                            <TableCell width="2.5%" style={{ textAlign: "center" }}>
                              <Tooltip title="Edit">
                                <IconButton size="small" onClick={() => handleEditClick(item)}>
                                  <EditIcon sx={{ height: '16px', width: '16px', color: "#C26B64" }} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                            <TableCell width="2.5%">
                              <Tooltip title="Delete">
                                <IconButton size="small" onClick={() => handleRemoveClick(item)}>
                                  <DeleteIcon sx={{ height: '16px', width: '16px', color: '#C26B64' }} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="10vh">
                No data to display
              </Box>
            )}
          </TableWrapper>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
          <DialogContent sx={{ backgroundColor: "#F8F5ED", }}>
            <DialogContentText>
              Are you sure you want to delete the website "{websiteToDelete?.name}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: "#F8F5ED", }}>
            <Button onClick={() => setDeleteOpen(false)} sx={{ color: "#C26B64" }}>
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} sx={{ color: "#7C0A00" }}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        {selectedWebsite && (
          <Dialog open={editOpen} onClose={() => setEditOpen(false)} >
            <Formik
              initialValues={{ name: selectedWebsite.name, url: selectedWebsite.url, elementId: selectedWebsite.elementId }}
              validationSchema={validationSchema}
              onSubmit={handleEditSubmit}
            >
              {({ isSubmitting }) => (
                <Form >
                  <DialogContent sx={{ backgroundColor: "#F8F5ED", }}>
                    <DialogContentText mb={2}>
                      Edit the details of the website "{selectedWebsite.name}":
                    </DialogContentText>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Field
                          as={TextField}
                          label="Website URL"
                          name="url"
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          helperText={<ErrorMessage name="url" />}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          as={TextField}
                          label="Element ID"
                          name="elementId"
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          helperText={<ErrorMessage name="elementId" />}
                        />
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions sx={{ backgroundColor: "#F8F5ED", }}>
                    <Button onClick={() => setEditOpen(false)} sx={{ color: "#C26B64" }}>
                      Cancel
                    </Button>
                    <Button type="submit" color="primary" disabled={isSubmitting} sx={{ color: "#7C0A00" }}>
                      {isSubmitting ? 'Updating...' : 'Update'}
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          </Dialog>
        )}
      </Container>
    </Dashboard>
  );
};

export default WebComponent;
