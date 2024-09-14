import React, { useEffect, useState } from 'react';
import {
    Grid,
    Box,
    Paper,
    TextField,
    InputAdornment,
    Typography,
    TableContainer,
    TableCell,
    TableRow,
    TableBody,
    TableHead,
    Table,
    Radio,
    RadioGroup,
    FormControlLabel,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Tooltip
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, removeUsers, selectusers, updateUsers } from '../state/userSlice';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import Dashboard from './Dashboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import { addUsers, selectAddUser } from '../state/userSlice';
import { toast } from 'react-toastify';

export default function Users() {
    const nav = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const addUserSuccess = useSelector(selectAddUser);
    const [addIcon, setAddIcon] = useState(true);
    const dispatch = useDispatch();
    const userData = useSelector(selectusers);
    const [editUserId, setEditUserId] = useState(null);
    const [editUserRole, setEditUserRole] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [dialogRemove, setDialogRemove] = useState(false);
    const [emailToRemove, setEmailToRemove] = useState('');
    const [email, setEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    const addUserFunction = (firstname, lastname, email, password, role) => {
        dispatch(addUsers({ firstname, lastname, email, password, role })).then((result) => {
            if (addUsers.rejected.match(result)) {
                console.log("Error occurred:", result.payload);
                if (result.payload.message === 'Token expired') {
                    nav('/login');
                } else {
                    console.log(result.payload.message)
                    toast.error(result.payload.message)
                    //   setSnackbarMsg({ open: true, severity: 'error', message: result.payload.message });
                }
            } else {
                dispatch(getUsers())
                console.log("Fetch successful:", result.payload);
            }
        })

    };

    useEffect(() => {
        const fetchUsers = async () => {
            const result = await dispatch(getUsers());
            if (getUsers.rejected.match(result)) {
                console.log("Error occurred:", result.payload);
                if (result.payload.message === 'Token expired') {
                    nav('/login');
                } else {
                    console.log(result.payload.message)
                    toast.error(result.payload.message)
                    //   setSnackbarMsg({ open: true, severity: 'error', message: result.payload.message });
                }
            } else {
                console.log("Fetch successful:", result.payload);
            }
        };

        fetchUsers();
    }, [dispatch, nav]);



    useEffect(() => {
        console.log("users:", userData);
    }, [userData]);


    const handleRoleChange = (user) => {
        setSelectedRole(user.role)
        setEditUserRole(user.role);
        setEmail(user.email);
        setShowDialog(true);
    };

    const handleConformEditRole = () => {
        dispatch(updateUsers({ email: email, role: selectedRole })).then((result) => {
            if (updateUsers.rejected.match(result)) {
                console.log("Error occurred:", result.payload);
                if (result.payload.message === 'Token expired') {
                    nav('/login');
                } else {
                    console.log(result.payload.message)
                    toast.error(result.payload.message)
                    //   setSnackbarMsg({ open: true, severity: 'error', message: result.payload.message });
                }
            } else {
                toast.success('Updated successfully')
                setShowDialog(false);
                dispatch(getUsers())
                console.log("Fetch successful:", result.payload);
            }
        })

    };

    const handleDialogClose = (confirm) => {
        setShowDialog(false);
        if (confirm) {
            console.log(`Role updated to ${editUserRole}`);
        } else {
            setEditUserRole('');
            setEditUserId(null);
        }
    };

    const handleDeleteClick = (email) => {
        setEmailToRemove(email);
        setDialogRemove(true);
    };

    const handleRemoveConfirm = () => {
        removeuser(emailToRemove);
        setDialogRemove(false);
    };
    const removeuser = (email) => {
        dispatch(removeUsers({ email })).then((result) => {
            if (removeUsers.rejected.match(result)) {
                console.log("Error occurred:", result.payload);
                if (result.payload.message === 'Token expired') {
                    nav('/login');
                } else {
                    console.log(result.payload.message)
                    toast.error(result.payload.message)
                    //   setSnackbarMsg({ open: true, severity: 'error', message: result.payload.message });
                }
            } else {

                dispatch(getUsers())
                console.log("Fetch successful:", result.payload);
            }
        })
    };
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Filter users based on search query
    const filteredUsers = userData.filter(user =>
        user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <Dashboard>
            {addIcon ? (
                <>
                    <Box sx={{ padding: "20px 40px 0px 20px", display: "flex", justifyContent: "space-between" }}>
                        <Box>

                            <TextField
                                id="input-with-icon-textfield"
                                placeholder='Search User...'
                                value={searchQuery}
                                onChange={handleSearchChange}
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
                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => { setAddIcon(false) }}>
                            <PersonAddIcon sx={{ color: '#C26B64', fontSize: "20px" }} />
                            <Typography variant="h6" sx={{ fontVariant: "small-caps", color: '#C26B64', marginLeft: '10px', }}>Add User</Typography>
                        </Box>
                    </Box>


                    <Grid item xs={12} spacing={3}>
                        <Box sx={{ width: '100%', marginTop: "10px" }}>
                            <TableContainer sx={{ height: 'calc(85vh - 75px)', overflowY: 'auto', margin: "0px", backgroundColor: "#F8F5ED" }}>
                                <Table>
                                    <TableHead sx={{ position: 'sticky', top: 0, backgroundColor: "#F8F5ED", zIndex: 1, }}>
                                        <TableRow>
                                            <TableCell width="5%" sx={{ color: "#7C0A00", fontWeight: "bold", textAlign: "center", padding: "8px 16px" }}>ID</TableCell>
                                            <TableCell width="20%" sx={{ color: "#7C0A00", fontWeight: "bold", textAlign: "left", padding: "8px 16px" }}>FIRST NAME</TableCell>
                                            <TableCell width="20%" sx={{ color: "#7C0A00", fontWeight: "bold", textAlign: "left", padding: "8px 16px" }}>LAST NAME</TableCell>
                                            <TableCell width="30%" sx={{ color: "#7C0A00", fontWeight: "bold", textAlign: "left", padding: "8px 16px" }}>EMAIL</TableCell>
                                            <TableCell width="15%" sx={{ color: "#7C0A00", fontWeight: "bold", textAlign: "center", padding: "8px 16px" }}>ROLE</TableCell>
                                            <TableCell width="5%" sx={{ color: "#7C0A00", fontWeight: "bold", textAlign: "center", padding: "8px 16px" }}></TableCell>
                                            <TableCell width="5%" sx={{ color: "#7C0A00", fontWeight: "bold", textAlign: "center", padding: "8px 16px" }}></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredUsers && filteredUsers.length > 0 ? (
                                            filteredUsers.map((user, index) => (
                                                <TableRow key={index}>
                                                    <TableCell sx={{ textAlign: "center", padding: "8px 16px" }}>{index + 1}</TableCell>
                                                    <TableCell sx={{ padding: "8px 16px" }}>{user.firstname}</TableCell>
                                                    <TableCell sx={{ textAlign: "left", padding: "8px 16px" }}>{user.lastname}</TableCell>
                                                    <TableCell sx={{ textAlign: "left", padding: "8px 16px" }}>{user.email}</TableCell>
                                                    <TableCell sx={{ textAlign: "center", padding: "8px 16px" }}>{user.role}</TableCell>

                                                    <TableCell sx={{ textAlign: "center", padding: "8px 16px" }}>
                                                        <Tooltip title="edit">
                                                            <EditIcon sx={{ height: '14px', width: '14px', cursor: "pointer", color: '#C26B64' }} onClick={() => handleRoleChange(user)} />
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell sx={{ textAlign: "center", padding: "8px 16px" }}>
                                                        <Tooltip title="delete">
                                                            <DeleteIcon sx={{ height: '14px', width: '14px', color: '#C26B64', cursor: "pointer" }} onClick={() => handleDeleteClick(user.email)} />
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} sx={{ textAlign: 'center' }}>No data to display!</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Grid>

                    <Dialog open={showDialog} onClose={() => handleDialogClose(false)}>
                        <DialogContent>
                            <DialogContentText mb={2}>
                                Do you want to edit the role "{editUserRole}":
                            </DialogContentText>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <RadioGroup row value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                                        <FormControlLabel value="Admin" control={<Radio size='small' sx={{ color: '#C26B64', '&.Mui-checked': { color: '#C26B64' }, }} />} label="Admin" />
                                        <FormControlLabel value="User" control={<Radio size='small' sx={{ color: '#C26B64', '&.Mui-checked': { color: '#C26B64' }, }} />} label="User" />
                                        <FormControlLabel value="Developer" control={<Radio size='small' sx={{ color: '#C26B64', '&.Mui-checked': { color: '#C26B64' }, }} />} label="Developer" />
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleDialogClose(false)} sx={{ color: "#C26B64" }}>Cancel</Button>
                            <Button
                                onClick={() => {
                                    handleConformEditRole();
                                    handleDialogClose(true);
                                }}
                                style={{ color: "#7C0A00" }}
                            >
                                Update
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={dialogRemove} onClose={() => { setDialogRemove(false) }}>
                        <DialogContent>Do you want to remove user?</DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDialogRemove(false)} sx={{ color: "#C26B64" }}>Cancel</Button>
                            <Button onClick={handleRemoveConfirm} style={{ color: "#7C0A00" }} >Delete</Button>
                        </DialogActions>
                    </Dialog>
                </>
            ) : (
                <>
                    <Box sx={{ padding: "10px 40px 0px 0px", display: "flex", justifyContent: "flex-end" }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => { setAddIcon(true) }}>
                            <Typography variant="h6" sx={{ fontVariant: "small-caps", color: '#C26B64', marginLeft: '5px' }}>Show Users</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', }}>
                        <Formik
                            initialValues={{
                                firstname: '',
                                lastname: '',
                                email: '',
                                password: '',
                                role: ''  // Default role value
                            }}
                            validationSchema={Yup.object().shape({
                                firstname: Yup.string().required('First name is required'),
                                lastname: Yup.string().required('Last name is required'),
                                email: Yup.string().email('Invalid email format').required('Email is required'),
                                password: Yup.string().required('Password is required'),
                                role: Yup.string().required('Role is required')
                            })}
                            onSubmit={async (values, { setSubmitting, resetForm }) => {
                                const hashedPassword = await bcrypt.hash(values.password, 10);
                                addUserFunction(values.firstname, values.lastname, values.email, hashedPassword, values.role);
                                setSubmitting(false);
                                resetForm();
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form style={{ width: '500px', marginTop: "0px" }}>
                                    <img style={{ width: "15%", height: "15%" }} src="sylvie_logo2.jpg" alt="Sylvie Logo" />
                                    <Field
                                        as={TextField}
                                        name="firstname"
                                        label="First Name"
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        autoFocus
                                        helperText={<ErrorMessage name="firstname" />}
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

                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#C26B64', // Change this to your desired label color when focused
                                            },
                                        }}

                                    />
                                    <Field
                                        as={TextField}
                                        name="lastname"
                                        label="Last Name"
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        helperText={<ErrorMessage name="lastname" />}
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

                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#C26B64', // Change this to your desired label color when focused
                                            },
                                        }}
                                    />
                                    <Field
                                        as={TextField}
                                        name="email"
                                        label="Email"
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        helperText={<ErrorMessage name="email" />}
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

                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#C26B64', // Change this to your desired label color when focused
                                            },
                                        }}
                                    />
                                    <Field
                                        as={TextField}
                                        type="password"
                                        name="password"
                                        label="Password"
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        helperText={<ErrorMessage name="password" />}
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

                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#C26B64', // Change this to your desired label color when focused
                                            },
                                        }}
                                    />
                                    <Field name="role">
                                        {({ field }) => (
                                            <RadioGroup
                                                {...field}
                                                row
                                                aria-labelledby="role-group"
                                                name="role"
                                            >
                                                <FormControlLabel
                                                    value="Admin"
                                                    control={<Radio size="small" sx={{ color: '#C26B64', '&.Mui-checked': { color: '#C26B64' } }} />}
                                                    label="Admin"
                                                />
                                                <FormControlLabel
                                                    value="User"
                                                    control={<Radio size="small" sx={{ color: '#C26B64', '&.Mui-checked': { color: '#C26B64' } }} />}
                                                    label="User"
                                                />
                                                <FormControlLabel
                                                    value="Developer"
                                                    control={<Radio size="small" sx={{ color: '#C26B64', '&.Mui-checked': { color: '#C26B64' } }} />}
                                                    label="Developer"
                                                />
                                            </RadioGroup>
                                        )}
                                    </Field>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={isSubmitting}
                                        fullWidth
                                        style={{ backgroundColor: "#7C0A00", marginTop: '10px' }}
                                    >
                                        {isSubmitting ? 'Adding ...' : 'Add'}
                                    </Button>
                                </Form>
                            )}
                        </Formik>

                    </Box>
                </>
            )}
        </Dashboard>
    );
}
