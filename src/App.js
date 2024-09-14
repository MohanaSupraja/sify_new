// import React, { useState } from 'react';
// import axios from 'axios';
// import Box from '@mui/material/Box';
// import Drawer from '@mui/material/Drawer';
// import CssBaseline from '@mui/material/CssBaseline';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import List from '@mui/material/List';
// import Typography from '@mui/material/Typography';
// import Divider from '@mui/material/Divider';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemText from '@mui/material/ListItemText';
// import { createTheme, ThemeProvider } from '@mui/material/styles';

// const drawerWidth = 240;

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#D3C6F3',
//     },
//   },
// });

// function App() {
//   const [jsonResult, setJsonResult] = useState(null);
//   const [activeItem, setActiveItem] = useState(null);

//   async function fetchData(parameterValue) {
//     try {
//       const url = `http://localhost:3001/fetch/${parameterValue}`;
//       const response = await axios.get(url);
//       setJsonResult(response.data); // Store the JSON result in state
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       throw error;
//     }
//   }

//   async function handleClick(text) {
//     let parameterValue;
//     setActiveItem(text); // Set the active list item on click

//     switch (text) {
//       case 'Sylvie':
//         parameterValue = 0;
//         break;
//       case 'Terra Coastal':
//         parameterValue = 1;
//         break;
//       case 'Wel Worn':
//         parameterValue = 2;
//         break;
//       default:
//         parameterValue = -1;
//         break;
//     }

//     try {
//       await fetchData(parameterValue); // Fetch data and store JSON result in state
//     } catch (error) {
//       console.error(`Error handling ${text} click:`, error);
//       alert('Failed to fetch data. Please try again.');
//     }
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ display: 'flex' }}>
//         <CssBaseline />
//         <AppBar
//           position="fixed"
//           sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, backgroundColor: theme.palette.primary.main }}
//         >
//           <Toolbar>
//             <Typography variant="h6" noWrap>
//               JSON Result
//             </Typography>
//           </Toolbar>
//         </AppBar>
//         <Drawer
//           sx={{
//             width: drawerWidth,
//             flexShrink: 0,
//             '& .MuiDrawer-paper': {
//               width: drawerWidth,
//               boxSizing: 'border-box',
//             },
//           }}
//           variant="permanent"
//           anchor="left"
//         >
//           <Toolbar />
//           <Divider />
//           <List>
//             {['Sylvie', 'Terra Coastal', 'Wel Worn'].map((text) => (
//               <ListItem
//                 key={text}
//                 disablePadding
//                 sx={{ backgroundColor: activeItem === text ? '#D3C6F3' : 'inherit' }}
//               >
//                 <ListItemButton onClick={() => handleClick(text)}>
//                   <ListItemText primary={text} />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//           </List>
//           <Divider />
//         </Drawer>
//         <div style={{ marginLeft: `${drawerWidth}px`, overflow: 'hidden', position: 'fixed', top: "90px", bottom: "40px", left: "30px", right: "30px", border: '2px solid #EDDEE8'  }}>
//           <Box
//             component="main"
//             sx={{
//               flexGrow: 1,
//               bgcolor: '#FFFFFF',
//               p: 3,
//               overflowX: 'auto',
//               overflowY: 'auto', // Enable vertical scrolling
//               maxHeight: '77vh', // Set maximum height to viewport height
//             }}
//           >
//             <Toolbar />
//             {jsonResult && (
//               <pre>{JSON.stringify(jsonResult, null, 2)}</pre>
//             )}
//           </Box>
//         </div>
//       </Box>
//     </ThemeProvider>
//   );
// }

// export default App;
// import axios from 'axios';
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My React App</h1>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
