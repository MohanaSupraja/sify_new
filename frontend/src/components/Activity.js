import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Tooltip, Dialog, DialogActions, Autocomplete,
    DialogContent, DialogContentText, CircularProgress, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { getActivities, selectActivityData, addActivity, updateActivities, removeActivities } from '../state/activitySlice'; // Adjust the import path as necessary
import { fetchWebsites, selectwebData } from '../state/webSlice';
import Dashboard from './Dashboard';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
export default function Activity() {
    const dispatch = useDispatch();
    const nav = useNavigate();
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const activities = useSelector(selectActivityData);
    const [addIcon, setAddIcon] = useState(false);
    const [activityName, setActivityName] = useState('');
    const [websiteName, setWebsiteName] = useState('');
    const [websiteElementId, setWebsiteElementId] = useState('');
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [activityToDelete, setActivityToDelete] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const websites = useSelector(selectwebData);
    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    useEffect(() => {
        console.log("act:", activities)
    }, [activities])

    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);  // Set loading to true before fetching
            const result = await dispatch(getActivities());
            if (getActivities.rejected.match(result)) {
                console.log("Error occurred:", result.payload);
                if (result.payload.message === 'Token expired') {
                    nav('/login');
                } else {
                    console.log(result.payload.message);
                    toast.error(result.payload.message);
                }
            } else {
                dispatch(fetchWebsites());
                console.log("Fetch successful:", result.payload);
            }
            setLoading(false);  // Set loading to false after fetching is complete
        };

        fetchActivities();
    }, [dispatch, nav]);

    const handleAddActivity = () => {
        dispatch(addActivity({ websiteName, websiteElementId })).then((result) => {
            if (addActivity.rejected.match(result)) {
                console.log("Error occurred:", result.payload);
                if (result.payload.message === 'Token expired') {
                    nav('/login');
                } else {
                    console.log(result.payload.message)
                    toast.error(result.payload.message)
                    //   setSnackbarMsg({ open: true, severity: 'error', message: result.payload.message });
                }
            } else {
                dispatch(getActivities());
                setWebsiteName('');
                setWebsiteElementId('');
                setAddIcon(false);
                setSelectedOption('');
                console.log("Fetch successful:", result.payload);
            }
        })
    };

    const handleEditClick = (activity) => {
        setSelectedActivity(activity);
        setEditOpen(true);
    };

    const handleDeleteClick = (activity) => {
        setActivityToDelete(activity);
        setDeleteOpen(true);
    };

    const handleEditSubmit = () => {
        console.log(selectedActivity)
        dispatch(updateActivities(selectedActivity)).then((result) => {
            if (updateActivities.rejected.match(result)) {
                console.log("Error occurred:", result.payload);
                if (result.payload.message === 'Token expired') {
                    setEditOpen(false);
                    toast.error("Session expired")
                    nav('/login');
                } else {
                    setEditOpen(false);
                    console.log(result.payload.message)
                    toast.error(result.payload.message)
                    //   setSnackbarMsg({ open: true, severity: 'error', message: result.payload.message });
                }
            } else {
                setEditOpen(false);
                dispatch(getActivities());

                setSelectedActivity(null);
                console.log("Fetch successful:", result.payload);
            }
        })

    };

    const handleDeleteConfirm = () => {
        dispatch(removeActivities(activityToDelete)).then((result) => {
            if (removeActivities.rejected.match(result)) {
                console.log("Error occurred:", result.payload);
                if (result.payload.message === 'Token expired') {
                    toast.error("Session expired")
                    nav('/login');
                } else {
                    setDeleteOpen(false);
                    console.log(result.payload.message)
                    toast.error(result.payload.message)
                    //   setSnackbarMsg({ open: true, severity: 'error', message: result.payload.message });
                }
            } else {
                dispatch(getActivities());
                setDeleteOpen(false);
                setActivityToDelete(null);
                console.log("Remove successful:", result.payload);
            }
        })

    };

    const flattenActivities = (activities) => {
        const flattened = [];

        if (Array.isArray(activities)) {
            activities.forEach((activityGroup) => {
                if (Array.isArray(activityGroup.activities)) {
                    activityGroup.activities.forEach((activity) => {
                        flattened.push({
                            ...activity,
                            groupId: activityGroup.id, // Adding groupId for reference if needed
                        });
                    });
                }
            });
        } else {
            console.log("Error: activities is not an array", activities);
        }

        return flattened;
    };

    const getActivityStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return '#36BA98'; // Green
            case 'Active':
                return '#478CCF'; // blue
            case 'Inactive':
                return '#EF9C66'; // Orange
            case 'Close':
                return '#C80036'; // Red
            default:
                return '#000000'; // Default color (black)
        }
    };
    const flattenedActivities = flattenActivities(activities);
    const filteredActivities = activities
        .filter(activity =>
            activity.activityName.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date));



    return (
        <Dashboard>

            <Box style={{ height: "88vh", backgroundColor: "#F8F5ED" }}>
                {/* First Box: Add Activity */}
                <Box sx={{ padding: "20px 40px 0px 0px", display: "flex", justifyContent: "space-between" }}>
                    <Box>
                        <TextField
                            id="input-with-icon-textfield"
                            placeholder='Search Activity  ...'
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
                    </Box>
                    {addIcon ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Autocomplete
                                options={websites}
                                getOptionLabel={(option) => option.name || ''}
                                value={selectedOption}
                                onChange={(event, newValue) => {
                                    setSelectedOption(newValue);
                                    setWebsiteName(newValue ? newValue.name : '');
                                    setWebsiteElementId(newValue ? newValue.elementId : '');
                                }}
                                size="small"
                                style={{ width: '60%', marginRight: '10px', backgroundColor: "#F8F5ED" }}
                                renderInput={(params) => <TextField {...params} label="Select Website" variant="outlined"
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
                                />}
                                PaperComponent={({ children }) => (
                                    <Paper sx={{
                                        backgroundColor: "#F8F5ED",
                                        '& .MuiAutocomplete-option': {
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
                                            width: '10px !important',
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
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddActivity}
                                style={{ backgroundColor: "#C26B64" }}
                            >
                                Add
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setAddIcon(true)}>
                            <AddIcon sx={{ color: '#C26B64' }} />
                            <Typography variant="h6" sx={{ fontVariant: "small-caps", color: '#C26B64', marginLeft: '5px' }}>Add Activity</Typography>
                        </Box>
                    )}
                </Box>

                {/* Second Box: Grid for Activities */}
                <Box mt={1} >
                    {/* <Typography variant="h6" style={{ fontVariant: "small-caps", color: '#C26B64' }}>Activities Listed</Typography> */}
                    <Grid container spacing={2} >
                        <Grid item xs={12}>
                            <TableContainer>
                                {loading ? (
                                    <div
                                        style={{
                                            backgroundColor: "#F8F5ED",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: "10vh",
                                        }}
                                    >
                                        <CircularProgress sx={{ color: "#C26B64" }} />
                                    </div>
                                ) : activities && activities.length > 0 ? (
                                    <Table style={{ backgroundColor: "#F8F5ED", }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width="10%" style={{ color: "#7C0A00", fontWeight: "bold", textAlign: "center" }}>ID</TableCell>
                                                <TableCell width="20%" style={{ color: "#7C0A00", fontWeight: "bold", textAlign: "left" }}>Activity Name</TableCell>
                                                <TableCell width="15%" style={{ color: "#7C0A00", fontWeight: "bold", textAlign: "center" }}>Activity ID</TableCell>
                                                <TableCell width="15%" style={{ color: "#7C0A00", fontWeight: "bold", textAlign: "center" }}>Date</TableCell>
                                                <TableCell width="10%" style={{ color: "#7C0A00", fontWeight: "bold", textAlign: "center" }}>Status</TableCell>
                                                <TableCell width="5%" style={{ color: "#7C0A00", fontWeight: "bold", textAlign: "center" }}></TableCell>
                                                <TableCell width="5%" style={{ color: "#7C0A00", fontWeight: "bold", textAlign: "center" }}></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredActivities
                                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                                .map((activity, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell style={{ textAlign: "center" }}>{index + 1}</TableCell>
                                                        <TableCell style={{ textAlign: "left" }}>{activity.activityName}</TableCell>
                                                        <TableCell style={{ textAlign: "center" }}>{activity.activityId ? activity.activityId : activity.id}</TableCell>
                                                        <TableCell style={{ textAlign: "center" }}>{activity.date}</TableCell>
                                                        <TableCell style={{ textAlign: "center", fontVariant: "small-caps", fontWeight: "bold", color: getActivityStatusColor(activity.status) }}>{activity.status}</TableCell>
                                                        <TableCell style={{ textAlign: "center" }}>
                                                            <Tooltip title="Edit">
                                                                <IconButton size="small" onClick={() => handleEditClick(activity)}>
                                                                    <EditIcon sx={{ height: '16px', width: '16px', color: "#C26B64" }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell style={{ textAlign: "center" }}>
                                                            <Tooltip title="Delete">
                                                                <IconButton size="small" onClick={() => handleDeleteClick(activity)}>
                                                                    <DeleteIcon sx={{ height: '16px', width: '16px', color: 'red' }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div style={{ padding: '20px', textAlign: 'center' }}>No data to display!</div>
                                )}
                            </TableContainer>

                        </Grid>
                    </Grid>
                </Box>




                {/* Edit Activity Dialog */}
                {selectedActivity && (
                    <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                        <DialogContent>
                            <DialogContentText mb={2}>Edit the details of the activity:</DialogContentText>
                            <Grid container spacing={2}>

                                {/* <Grid item xs={4}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Activity ID"
                            type="text"
                            fullWidth
                            value={selectedActivity.id}
                            onChange={(e) => setSelectedActivity({ ...selectedActivity, id: e.target.value })}
                        />
                        </Grid> */}
                                {/* <Grid item xs={6}>
                        <TextField
                            margin="dense"
                            label="Date"
                            type="date"
                            fullWidth
                            value={selectedActivity.date}
                            onChange={(e) => setSelectedActivity({ ...selectedActivity, date: e.target.value })}
                            style={{cursor:"pointer"}}
                        />
                        </Grid> */}
                                <Grid item xs={12}>
                                    <Autocomplete
                                        options={['Active', 'Close', 'Completed', 'Inactive']}
                                        getOptionLabel={(option) => option}
                                        value={selectedActivity.status}
                                        onChange={(event, newValue) => {
                                            setSelectedActivity({ ...selectedActivity, status: newValue });
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Status" margin="dense" fullWidth />}
                                        size='small'
                                    />
                                </Grid>

                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditOpen(false)} sx={{ color: "#C26B64" }}>Cancel</Button>
                            <Button onClick={handleEditSubmit} sx={{ color: "#7C0A00" }}>Update</Button>
                        </DialogActions>
                    </Dialog>
                )}

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                    <DialogContent>
                        <DialogContentText>Are you sure you want to delete the activity?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteOpen(false)} sx={{ color: "#C26B64" }}>Cancel</Button>
                        <Button onClick={handleDeleteConfirm} sx={{ color: "#7C0A00" }}>Delete</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Dashboard>
    );
}
