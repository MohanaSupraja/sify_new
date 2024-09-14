import React, { useEffect, useState } from 'react';
import { Box, Button, Drawer, List, ListItem, ListItemText, ListItemIcon, Tooltip, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Login as LoginIcon, Logout as LogoutIcon, Dashboard as DashboardIcon, BarChart, Category, PeopleAlt } from '@mui/icons-material';
import StorageIcon from '@mui/icons-material/Storage';
import CodeIcon from '@mui/icons-material/Code';
import CollectionsBookmarkSharpIcon from '@mui/icons-material/CollectionsBookmarkSharp';
import PlayArrowSharpIcon from '@mui/icons-material/PlayArrowSharp';
import { useSelector, useDispatch } from 'react-redux';
import { logedinuser } from '../state/userSlice';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
const sidebarWidth = 280;

const buttonStyle = {
    textTransform: 'none',
    justifyContent: 'center',
    fontWeight: "bold",
    borderRadius: 0,
};

const iconStyle = {
    color: '#7C0A00',
    fontSize: "20px",
};
const activeIconStyle = {
    color: 'white',
};

const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '0px 20px 6px 20px',

    boxShadow: '0px 2px 4px rgba(124, 10, 0, 0.1)',
    position: 'fixed',
    backgroundColor: "#F8F5ED",
    width: '100%',
    zIndex: 1201,
};

const contentStyle = (open, isLogin) => ({
    transition: 'margin-left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', // Longer duration with a smoother easing
    marginLeft: open && !isLogin ? `${sidebarWidth}px` : '0',
    padding: '5px',
});


const Dashboard = ({ children }) => {
    const Loggedin = localStorage.getItem("userData");
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('/dashboardView');
    const [open, setOpen] = useState(true);
    const [expandedItems, setExpandedItems] = useState({});
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
    const userLoggedin = useSelector(logedinuser);
    const [user, setUser] = useState();
    const navigate = useNavigate();
    const location = useLocation();

    const toggleDrawer = () => setOpen(!open);

    const handleTabClick = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
            navigate(tab);
        }
        if (tab === "/logout") {
            navigate('/login');
        }
    };

    const toggleExpand = (id) => {
        setExpandedItems((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };
    useEffect(() => {
        if (Loggedin) {
            // const parsedUser = (Loggedin);
            const parsedUser = JSON.parse(Loggedin);
            console.log("userLoggedin:", parsedUser);
            setUser(parsedUser);
        }
    }, [Loggedin]);

    useEffect(() => {
        const checkIfParentShouldBeExpanded = (path) => {
            for (const item of MenuItems) {
                if (item.subItems) {
                    for (const subItem of item.subItems) {
                        if (subItem.id === path) {
                            setExpandedItems((prevState) => ({
                                ...prevState,
                                [item.id]: true,
                            }));
                            return;
                        }
                    }
                }
            }
        };

        if (location.pathname === '/users' || location.pathname === '/signup') {
            setActiveTab('/users');
        } else {
            const initialTab = location.pathname || '/dashboardView';
            setActiveTab(initialTab);
            checkIfParentShouldBeExpanded(initialTab);
        }
    }, [location.pathname]);






    const MenuItems = [
        { label: 'Dashboard View', icon: <DashboardIcon />, id: '/dashboardView', roles: ['Admin', 'User', 'Developer'] },
        { label: 'Competitors', icon: <BarChart />, id: '/competitors', roles: ['Admin', 'Developer'] },
        { label: 'Products', icon: <StorageIcon />, id: '/products', roles: ['Admin', 'User', 'Developer'] },
        { label: 'Categories', icon: <Category />, id: '/categories', roles: ['Admin', 'Developer'] },
        { label: 'Users', icon: <PeopleAlt />, id: '/users', roles: ['Admin'] },
        {
            label: 'Data Extraction',
            id: '/dataextraction',
            icon: <CollectionsBookmarkSharpIcon />,
            roles: ['Developer'],
            subItems: [
                { label: 'Web Scraping', icon: <CodeIcon />, id: '/webscraping', roles: ['Admin', 'Developer'] },
                { label: 'Activity', icon: <PlayArrowSharpIcon />, id: '/activity', roles: ['Admin', 'Developer'] }
            ]
        }
    ];

    const isLogin = location.pathname === '/login';

    const renderMenuItems = (items) => {
        return items.map(({ label, icon, id, roles = [], subItems }) => {
            if (!roles.includes(userRole)) return null;
            const isExpanded = expandedItems[id] || false;

            return (
                <React.Fragment key={id}>
                    <ListItem
                        button
                        onClick={() => {
                            if (subItems) {
                                toggleExpand(id);
                            } else {
                                handleTabClick(id);
                            }
                        }}
                        sx={{
                            backgroundColor: activeTab === id ? '#C26B64' : '',
                            '&:hover': {
                                backgroundColor: '#D5A28F',
                                color: 'white'
                            },
                            '&:active': {
                                backgroundColor: '#D5A28F',
                            },
                            cursor: 'pointer',
                        }}
                    >
                        <ListItemIcon sx={activeTab === id ? activeIconStyle : iconStyle}>{icon}</ListItemIcon>
                        <ListItemText primary={label} sx={{ color: activeTab === id ? 'white' : '#616161', cursor: 'pointer' }} />
                    </ListItem>
                    {subItems && isExpanded && (
                        <List sx={{ pl: 3 }}>
                            {renderMenuItems(subItems)}
                        </List>
                    )}
                </React.Fragment>
            );
        });
    };

    return (
        <>
            <Box sx={navbarStyle} display="flex" justifyContent="space-between" alignItems="center">
                {/* Left section with MenuIcon and image */}
                <Box display="flex" flexDirection="row" alignItems="center">
                    {!isLogin && (
                        <Button onClick={toggleDrawer} variant="" color="primary">
                            <MenuIcon sx={{ color: '#7C0A00', fontSize: '28px', marginTop: "13px" }} />
                        </Button>
                    )}
                    <img style={{ width: "12%", marginLeft: "10px" }} src='abilis.png' alt="logo" />
                </Box>

                {/* Right section with user details and logout button */}
                <Box display="flex" flexDirection="row" alignItems="center">
                    {!isLogin && (
                        <>
                            <Box display="flex" alignItems="center" marginRight={2}>
                                <AccountCircleIcon sx={{ color: "#7C0A00", fontSize: '22px', margin: "5px 5px 0px 0px" }} />
                                <Typography style={{ fontFamily: 'cursive', fontWeight: 'bold', fontSize: "15px", color: "#7C0A00", marginTop: "6px" }}>Hello,{user ? user.name : ''}...</Typography>
                            </Box>
                            <Box>
                                <Tooltip title="Logout">
                                    <Button
                                        onClick={() => handleTabClick('/logout')}
                                        sx={{ color: activeTab === '/logout' ? '#7C0A00' : '#7C0A00', ...buttonStyle }}
                                    >
                                        <LogoutIcon sx={{ fontSize: '20px', marginRight: '8px', marginTop: "8px" }} />
                                    </Button>
                                </Tooltip>
                            </Box>
                        </>
                    )}
                </Box>
            </Box>

            <Box height={{ height: "100vh", backgroundColor: "#F8F5ED" }}>

                {!isLogin && (
                    <Drawer
                        anchor="left"
                        variant="persistent"
                        open={open}
                        onClose={toggleDrawer}
                        sx={{
                            width: sidebarWidth,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                width: sidebarWidth,
                                boxSizing: 'border-box',
                                zIndex: 1200,
                                position: 'fixed',
                                marginTop: '0px',
                                boxShadow: '0px 2px 4px rgba(124, 10, 0, 0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%',
                                overflowX: "hidden",
                                maxHeight: '100vh',
                                backgroundColor: "#F8F5ED"
                            },
                        }}
                    >
                        <Box sx={{ width: sidebarWidth, pl: 1, mt: 10, overflowY: 'auto', scrollbarWidth: 'thin', }}>
                            <List>
                                {renderMenuItems(MenuItems)}
                            </List>
                        </Box>
                        <Box sx={{ width: sidebarWidth, textAlign: 'center' }}>
                            <img style={{ width: "30%", height: "80%", marginLeft: "0px" }} src={`${process.env.PUBLIC_URL}/sylvie_logo.png`} alt="Sylvie Logo" />
                        </Box>
                    </Drawer>
                )}

                <Box sx={{ ...contentStyle(open, isLogin), backgroundColor: "#F8F5ED", paddingTop: "60px" }}>
                    {children}
                </Box>
            </Box>
        </>
    );
};

export default Dashboard;
