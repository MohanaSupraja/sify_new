import React, { useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { loginUser, selectAddUserSuccess } from '../state/userSlice';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import { toast } from 'react-toastify';
const Login = () => {
    const dispatch = useDispatch();
    const nav = useNavigate();
    const addUserFunction = (email, password) => {
        console.log("hi")
        dispatch(loginUser({ email, password })).then((result) => {
            console.log("Error occurred:", result.payload);
            if (loginUser.fulfilled.match(result)) {

                if (result.payload.error === 'User not found') {
                    toast.error("User not found");
                } else if (result.payload.error === 'Invalid password') {
                    toast.error("Invalid password");
                }
                else {
                    nav('/dashboardview');
                    console.log("Login successful:", result.payload);
                }
            } else {
                toast.error(result.payload.error)
            }
        });
    }


    return (
        <Dashboard>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '88vh' }}>
                <Formik
                    initialValues={{
                        email: '',
                        password: ''
                    }}
                    validationSchema={Yup.object().shape({

                        email: Yup.string().email('Invalid email format').required('Email is required'),
                        password: Yup.string().required('Password is required')
                    })}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        // const hashedPassword = await bcrypt.hash(values.password, 10);
                        addUserFunction(values.email, values.password);
                        setSubmitting(false);



                    }}
                >
                    {({ isSubmitting }) => (
                        <Form style={{ width: '400px', marginTop: "10px" }}>
                            <img style={{ width: "25%", height: "25%" }} src="sylvie_logo2.jpg" alt="Sylvie Logo" />

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
                                    '& .MuiInputLabel-root': {
                                        color: '#C26B64', // Change this to your desired label color
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
                                    '& .MuiInputLabel-root': {
                                        color: '#C26B64', // Change this to your desired label color
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#C26B64', // Change this to your desired label color when focused
                                    },
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting}
                                fullWidth
                                style={{ backgroundColor: "#7C0A00", margin: '10px 0px 30px 0px' }}
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </Button>

                            {/* <span style={{display:"flex",justifyContent:"center"}}>No login found ? <h6 style={{padding:"2px 0px 0px 10px",cursor:"pointer",fontVariant: "small-caps", color: '#C26B64'}} onClick={handleSignUpNavigation}> Signup</h6></span> */}
                        </Form>
                    )}
                </Formik>
            </Box>
        </Dashboard>
    );
};

export default Login;
