import React, { useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addUsers,selectAddUser } from '../state/userSlice';
import bcrypt from 'bcryptjs';
import Dashboard from './Dashboard';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
    const nav = useNavigate();
    const adduser = useSelector(selectAddUser);
    const dispatch = useDispatch();
    const addUserFunction = (firstname, lastname, email, password) => {
        dispatch(addUsers({ firstname, lastname, email, password }))
    }
    useEffect(() => {
        if (adduser) {
            nav('/users'); // Redirect to dashboard upon success
        }
    }, [adduser, nav]);
    const showusers=()=>{
        nav('/users')
    }

    return (
        <>
        <Dashboard>
        <Box sx={{ padding: "10px 40px 0px 0px", display: "flex", justifyContent: "flex-end" }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={showusers}>
                        {/* <AddIcon sx={{ color: '#C26B64' }} /> */}
                        <Typography variant="h6" sx={{ fontVariant: "small-caps", color: '#C26B64', marginLeft: '5px' }}>Show Users</Typography>
                    </Box>
                
            </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <Formik
                initialValues={{
                    firstname: '',
                    lastname: '',
                    email: '',
                    password: ''
                }}
                validationSchema={Yup.object().shape({
                    firstname: Yup.string().required('First name is required'),
                    lastname: Yup.string().required('Last name is required'),
                    email: Yup.string().email('Invalid email format').required('Email is required'),
                    password: Yup.string().required('Password is required')
                })}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    const hashedPassword = await bcrypt.hash(values.password, 10);
                    addUserFunction(values.firstname, values.lastname, values.email, hashedPassword);
                    setSubmitting(false);
                    resetForm();
                }}
            >
                {({ isSubmitting }) => (
                    <Form style={{ width: '400px', marginTop: "0px" }}>
                        <img style={{ width: "30%", height: "40%" }} src="logo.png" alt="Sylvie Logo" />
                        <Field
                            as={TextField}
                            name="firstname"
                            label="First Name"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            autoFocus
                            helperText={<ErrorMessage name="firstname" />}
                        />
                        <Field
                            as={TextField}
                            name="lastname"
                            label="Last Name"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            helperText={<ErrorMessage name="lastname" />}
                        />
                        <Field
                            as={TextField}
                            name="email"
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            helperText={<ErrorMessage name="email" />}
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
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            fullWidth
                            style={{ marginTop: '10px' }}
                        >
                            {isSubmitting ? 'Adding ...' : 'Add'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Box>
        </Dashboard>
        </>
    );
};

export default Signup;
