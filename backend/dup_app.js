const express = require('express');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const admin = require('firebase-admin');
const app = express();
const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');
const PORT = process.env.PORT || 3001;
const { Firestore } = require('@google-cloud/firestore');
const jwt = require('jsonwebtoken');
const serviceAccount = require('./sylvie-dynamic-pricing-b5620d51f78c.json'); // Path to your service account key file
const bodyParser = require('body-parser');
const { authenticateToken, authorizeRoles } = require('./auth');
const SECRET_KEY = 'sylvie';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const firestore = admin.firestore();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());








app.post('/website-length', async (req, res) => {
    try {
        // console.log("STARTTIME for length :", dayjs().format('{YYYY} MM-DDTHH:mm:ss  [Z] A'))
        const { sourceId } = req.body;
        const query = firestore.collection('products').where('source_id', '==', sourceId);
        const countSnapshot = await query.count().get();
        const length = countSnapshot.data().count;
        // console.log("received length", length);
        // console.log("ENDTIME for length:", dayjs().format('{YYYY} MM-DDTHH:mm:ss  [Z] A'))
        res.json({ length });  // Return length as an object
    } catch (error) {
        console.error('Error fetching length:', error);
        res.status(500).json({ error: 'Failed to fetch length' });
    }
});




app.post('/login-users', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        // Fetch user by email
        const snapshot = await firestore.collection('users').where('email', '==', email).get();

        if (snapshot.empty) {
            return res.status(401).json({ error: 'User not found' });
        }

        const user = snapshot.docs[0].data();
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log("password invalid");
            return res.status(401).json({ error: 'Invalid password' });
        }
        const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, role: user.role, name: user.firstname });
    } catch (error) {
        console.error('Error logging in user: ', error);
        res.status(500).json({ error: 'Failed to login user' });
    }
});



app.post('/add-users', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
    const { firstname, lastname, email, password, role } = req.body;

    console.log(firstname, role)
    try {
        // Check if the email already exists
        const query = firestore.collection('users').where('email', '==', email);
        const snapshot = await query.get();

        if (!snapshot.empty) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Add the new user
        await firestore.collection('users').add({
            firstname,
            lastname,
            email,
            password,
            role
        });

        res.status(200).json({ message: 'User added successfully' });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Failed to add user' });
    }
});
app.get('/get-users', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
    try {
        console.log("hi")
        let query = firestore.collection('users');
        const snapshot = await query.get();
        const data = [];
        snapshot.forEach(doc => {
            data.push({ id: doc.id, ...doc.data() });
        });
        // console.log("received users");
        res.json(data);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});
app.post('/remove-users', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
    const { email } = req.body;

    try {
        const userRef = await firestore.collection('users').where('email', '==', email).get();
        if (userRef.empty) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        userRef.forEach(async (doc) => {
            await doc.ref.delete();
        });

        res.status(200).json({ message: 'User removed successfully' });
    } catch (error) {
        console.error('Error removing user:', error);
        res.status(500).json({ error: 'Failed to remove user' });
    }
});
app.put('/update-users', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
    const { email, role } = req.body;
    try {
        console.log(email, role)
        const userQuerySnapshot = await firestore.collection('users').where('email', '==', email).get();
        if (userQuerySnapshot.empty) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userDoc = userQuerySnapshot.docs[0];
        await firestore.collection('users').doc(userDoc.id).update({ role });

        res.status(200).json({ message: 'Role updated successfully' });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ error: 'Failed to update role' });
    }
});
app.post('/fetch-lastid', authenticateToken, authorizeRoles('Admin', 'User', 'Developer'), async (req, res) => {
    const { tabIndex, label } = req.body;
    console.log(tabIndex, label);
    let results = [];
    try {
        let query;
        let productCollection;
        console.log("DATETIME:", dayjs().format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A'));

        if (label === "Well Worn") {
            productCollection = firestore.collection('products');
            query = productCollection.where("source_id", "==", 2)
                .orderBy('Name', 'asc')
                .select('Category', 'Name', 'Description', 'Price', 'source_id');
        } else {
            productCollection = firestore.collection('sylvie_products');
            query = productCollection.where("websiteName", "==", label)
                .select('category', 'name', 'description', 'price', 'websiteName');
        }

        const countSnapshot = await query.count().get();
        const length = countSnapshot.data().count;
        console.log("received length", length);

        const snapshot = await query.get();
        console.log("DATETIME:", dayjs().format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A'));

        if (!snapshot.empty) {
            results = snapshot.docs.map(doc => ({ ...doc.data() }));
        }

        console.log("DATETIME:", dayjs().format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A'));
        res.status(200).json({ documents: results, length: length });
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
});

app.post('/fetch-more', authenticateToken, authorizeRoles('Admin', 'User', 'Developer'), async (req, res) => {
    const { name, label } = req.body;
    console.log(name, label)
    let results = [];
    try {
        let query;
        let productCollection;
        console.log("DATETIME:", dayjs().format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A'))
        if (label === 2) {
            productCollection = firestore.collection('products');
            query = productCollection.where("source_id", "==", label);
            query = query.where("Name", "==", name);
        } else {
            productCollection = firestore.collection('sylvie_products');
            query = productCollection.where("name", "==", name)
        }

        const snapshot = await query.get();
        console.log("DATETIME:", dayjs().format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A'))

        if (!snapshot.empty) {
            // results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            results = snapshot.docs.map(doc => ({ ...doc.data() }));
        }
        console.log("DATETIME:", dayjs().format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A'))
        // console.log("results:", results)
        res.status(200).json({ documents: results });
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
});

app.get('/fetch-length', authenticateToken, authorizeRoles('Admin', 'User', 'Developer'), async (req, res) => {
    try {
        const websitesCollection = firestore.collection('websites');
        const sylvieProductsCollection = firestore.collection('sylvie_products');
        const ProductsCollection = firestore.collection('products');
        const websitesSnapshot = await websitesCollection.get();
        const validWebsiteNames = new Set(websitesSnapshot.docs.map(doc => doc.id));
        const result = {};
        for (const websiteName of validWebsiteNames) {
            if (websiteName == 'Well Worn') {
                const query2 = ProductsCollection.where('source_id', '==', 2).orderBy('source_id', 'asc');
                const countSnapshot2 = await query2.get();
                result[websiteName] = countSnapshot2.size;
            }
            else {
                const query = sylvieProductsCollection.where('websiteName', '==', websiteName);
                const countSnapshot = await query.get();
                result[websiteName] = countSnapshot.size; // .size returns the number of documents in the snapshot
            }
        }
        console.log("Result counts:", result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching document counts:', error);
        res.status(500).json({ error: 'Failed to fetch counts' });
    }
});







// const fetchData = async (collectionName, sourceId) => {
//   console.log("DATETIME:", dayjs().format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A'))

//   let snapshot = await firestore.collection(collectionName).where('source_id', '==', sourceId).get();
//   const data = [];
//   snapshot.forEach(doc => {
//     data.push({ id: doc.id, ...doc.data() });
//   });
//   console.log("DATETIME:", dayjs().format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A'))
//   // console.log(data)
//   return data;
// };


// app.get('/fetch/:parameterValue', async (req, res) => {
//   try {
//     const parameterValue = parseInt(req.params.parameterValue); // Get the parameterValue from the URL path and convert to integer

//     if (isNaN(parameterValue)) {
//       throw new Error('Invalid parameterValue');
//     }

//     let collectionName = (parameterValue === 0 || parameterValue === 1 || parameterValue === 2) ? 'products' : 'olive';
//     const data = await fetchData(collectionName, parameterValue);
//     res.json(data);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Failed to fetch data' });
//   }
// });

app.post('/compare-price', authenticateToken, authorizeRoles('Developer', 'User', 'Admin'), async (req, res) => {
    const { categoryFilter } = req.body;
    console.log("in compare price function:", categoryFilter);

    const result = {};
    const websitesCollection = firestore.collection('websites');

    try {
        // Fetch all document IDs from the 'websites' collection
        const websitesSnapshot = await websitesCollection.get();
        const validWebsiteNames = new Set(websitesSnapshot.docs.map(doc => doc.id));

        // Initialize result object with website names as keys and empty arrays as values
        validWebsiteNames.forEach(name => {
            result[name] = [];
        });

        // Function to process query snapshots and update the result object
        const processQuerySnapshot = (querySnapshot, defaultWebsiteName = null) => {
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const websiteName = defaultWebsiteName || data.websiteName;
                const price = data.price || data.Price;  // Assuming different field names for price

                // Ensure the websiteName exists in result
                if (result.hasOwnProperty(websiteName)) {
                    if (price) {
                        result[websiteName].push(price);
                    }
                }
            });
        };

        // Query the 'products' collection
        const productsQuery = firestore.collection('products').where("Category", "==", categoryFilter).orderBy('Name', 'asc');
        const productsSnapshot = await productsQuery.get();
        processQuerySnapshot(productsSnapshot, 'Well Worn');

        // Query the 'sylvie_products' collection
        const sylvieProductsQuery = firestore.collection('sylvie_products').where("category", "==", categoryFilter).orderBy("name", 'asc');
        const sylvieProductsSnapshot = await sylvieProductsQuery.get();
        processQuerySnapshot(sylvieProductsSnapshot);

        // Add '-' for websites that do not have any products
        for (const websiteName of validWebsiteNames) {
            if (result[websiteName].length === 0) {
                result[websiteName] = ['-', '-'];
            } else {
                // Compute min and max prices
                const prices = result[websiteName];
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);
                const Pcount = prices.length;
                result[websiteName] = [minPrice, maxPrice, Pcount];
            }
        }

        // Check if no products were found
        if (Object.keys(result).length === 0) {
            return res.status(404).json({ message: 'No products found for the specified category' });
        }

        console.log("res:", result);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching prices:", error);
        res.status(500).json({ message: 'An error occurred while fetching prices' });
    }
});



app.put('/update-category', authenticateToken, authorizeRoles('Developer'), async (req, res) => {
    const { name, category } = req.body;
    try {
        console.log(name, category)
        const docRef = firestore.collection('sylvie_products').doc(name);
        await docRef.update({ category: category });
        res.status(200).json({ message: 'Category updated successfully' });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});



app.get('/fetch-web', authenticateToken, authorizeRoles('Admin', 'Developer', 'User'), async (req, res) => {

    try {
        // console.log("fetch")
        let query = firestore.collection('websites');

        const snapshot = await query.get();
        const data = [];
        snapshot.forEach(doc => {
            data.push({ id: doc.id, ...doc.data() });
        });
        // console.log("received", data);

        res.status(200).json(data);


    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.post('/add-Web', authenticateToken, authorizeRoles('Developer'), async (req, res) => {
    const { name, url, elementId } = req.body;
    // console.log("ele:",elementId)

    try {
        const websitesCollection = firestore.collection('websites');

        // Get the last document
        const lastDocSnapshot = await websitesCollection.orderBy('id', 'desc').limit(1).get();

        let newId;
        if (lastDocSnapshot.empty) {
            // If there are no documents, start with ID 1
            newId = 0;
        } else {
            // Otherwise, increment the ID of the last document
            const lastDoc = lastDocSnapshot.docs[0];
            const lastId = lastDoc.data().id;
            newId = lastId + 1;
        }

        // Add the new document with the incremented ID
        await websitesCollection.doc(name).set({ name, url, elementId, id: newId });

        res.status(200).json({ message: 'Website added successfully' });
    } catch (error) {
        console.error('Error adding website:', error);
        res.status(500).json({ error: 'Failed to add website' });
    }
});



app.put('/update-Web', authenticateToken, authorizeRoles('Developer'), async (req, res) => {
    const { name, url, elementId } = req.body; // Ensure these fields are extracted directly
    console.log({ name, url, elementId });
    try {
        // Update the document in Firestore
        await firestore.collection('websites').doc(name).set({
            name,
            url,
            elementId
        });

        res.status(200).json({ message: 'Website updated successfully' });
    } catch (error) {
        console.error('Error updating website:', error);
        res.status(500).json({ error: 'Failed to update website' });
    }
});



app.post('/remove-Web', authenticateToken, authorizeRoles('Developer'), async (req, res) => {
    const { id, name, url } = req.body;
    console.log("name:", name);

    try {
        const websitesRef = firestore.collection('websites');

        // Delete the specified document
        await websitesRef.doc(name).delete();

        // Retrieve all remaining websites
        const websitesSnapshot = await websitesRef.get();
        const websites = [];
        websitesSnapshot.forEach(doc => {
            websites.push({ id: doc.data().id, ...doc.data(), docId: doc.id });
        });

        // Sort websites by their current id
        websites.sort((a, b) => a.id - b.id);

        // Reassign new IDs
        const updatedWebsites = websites.map((website, index) => ({
            ...website,
            newId: index
        }));

        // Update the documents with new IDs
        const batch = firestore.batch();
        updatedWebsites.forEach((website) => {
            const websiteRef = websitesRef.doc(website.docId);
            batch.update(websiteRef, { id: website.newId });
        });
        await batch.commit();

        res.status(200).json({ message: 'Website deleted and IDs updated successfully' });
    } catch (error) {
        console.error('Error deleting website:', error);
        res.status(500).json({ error: 'Failed to delete website' });
    }
});


app.post('/extract-products', authenticateToken, authorizeRoles('Developer'), async (req, res) => {
    const { url, elementId } = req.body;
    console.log("url", url);
    console.log("element id:", elementId);
    try {
        const result = await axios.post("https://us-central1-sylvie-dynamic-pricing.cloudfunctions.net/extract_data", { url, elementId });
        console.log("result : ", result.data);
        res.status(200).json({ message: 'Extracted successfully', data: result.data });
    } catch (error) {
        console.error('Error processing request:', error);

        if (error.response) {
            // Server responded with a status other than 200 range
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
            res.status(error.response.status).json({ error: error.response.data });
        } else if (error.request) {
            // No response was received
            console.error('Error request:', error.request);
            res.status(500).json({ error: 'No response received from the server' });
        } else {
            // Something else caused the error
            console.error('Error message:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
});

app.post('/save-all', authenticateToken, authorizeRoles('Developer'), async (req, res) => {
    const { data } = req.body;
    console.log("data", data);
    const collectionName = "sylvie_products";

    try {
        // Ensure data is an array
        if (!Array.isArray(data)) {
            throw new Error('Data must be an array');
        }

        const batch = firestore.batch();
        let savedCount = 0;
        let duplicatesCount = 0;

        for (const product of data) {
            const productName = product.name;

            if (!productName) {
                throw new Error('Product name is missing in the extracted data');
            }

            const docRef = firestore.collection(collectionName).doc(productName);

            // Check if the document already exists
            const doc = await docRef.get();
            if (doc.exists) {
                console.log(`Duplicate found for product: ${productName}`);
                duplicatesCount++;
            }

            // Update or set the document with new values
            batch.set(docRef, product, { merge: true });
            savedCount++;
        }

        await batch.commit();

        res.status(200).json({ message: 'Stored successfully', data, savedCount, duplicatesCount });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});

app.put('/edit-all', async (req, res) => {
    const { editprev, editItem } = req.body;
    console.log("data", editprev, editItem);
    const collectionName = "temp_products";

    try {
        // Reference to the document with the specific id (editprev)
        const docRef = firestore.collection(collectionName).doc(editprev);
        const snapshot = await docRef.get();

        if (snapshot.exists) {
            // Update the document with the new data (editItem)
            await docRef.set(editItem, { merge: true });
            res.status(200).json({ message: 'Document edited successfully', data: editItem });
        } else {
            res.status(404).json({ message: 'Document not found' });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});





app.post('/store-products', authenticateToken, authorizeRoles('Developer'), async (req, res) => {
    const { data, websiteName, activityId } = req.body;
    // console.log("websiteName:",websiteName,activityId);
    const collectionName = "temp_products";

    try {
        const parsedData = JSON.parse(data);

        const productName = parsedData.name;

        if (!productName) {
            return res.status(400).json({ error: 'Product name is missing in the extracted data' });
        }
        const activitiesSnapshot = await firestore.collection('activities').get();
        let activeActivity = null;

        activitiesSnapshot.forEach(doc => {
            const activities = doc.data().activities || [];
            const active = activities.find(activity => activity.status === 'Active');
            if (active) {

                activeActivity = active;
                return false; // Break out of the loop once we find the active activity
            }

        });

        if (activeActivity === null) {
            // console.log("no active activity found!")
            return res.status(400).json({ error: 'No active activity found' });
        }

        // Step 2: Extract the activity ID

        const activityId = activeActivity.id;



        // Step 3: Add the activity ID to the parsedData object
        parsedData.activityId = activityId;
        const existingDoc = await firestore.collection(collectionName).doc(productName).get();
        if (existingDoc.exists) {
            console.log('A document with this product name already exists');
            return res.status(400).json({ error: 'A document with this product name already exists' });
        }

        // Add newId to parsedData
        const snapshot = await firestore.collection(collectionName).orderBy('id', 'desc').limit(1).get();
        let newId = 1;
        if (!snapshot.empty) {
            const lastDoc = snapshot.docs[0];
            newId = lastDoc.data().id + 1;
        }

        parsedData.id = newId; // Assuming id is the key for newId
        parsedData.websiteName = websiteName;
        // parsedData.activityId = activityId;

        parsedData.date = dayjs().format('YYYY-MM-DD')
        // console.log("paresed:",parsedData)

        // Add a new document with the product name and the updated data from parsedData
        await firestore.collection(collectionName).doc(productName).set(parsedData);

        res.status(200).json({ message: 'stored successfully', data: parsedData });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});

app.get('/gettemp-products', authenticateToken, authorizeRoles('Developer'), async (req, res) => {
    const collectionName = "temp_products";
    // console.log("hi")
    try {
        const products = [];
        const snapshot = await firestore.collection(collectionName).get();

        snapshot.forEach((doc) => {
            if (doc.exists) {
                products.push(doc.data());
            } else {
                console.log(`Document with ID ${doc.id} does not exist.`);
            }
        });

        res.status(200).json({ message: 'Successfully fetched products', data: products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});
app.post('/removetemp-products', authenticateToken, authorizeRoles('Developer'), async (req, res) => {
    const collectionName = "temp_products";

    try {
        const collectionRef = firestore.collection(collectionName);
        let snapshot = await collectionRef.get();

        if (snapshot.empty) {
            return res.status(200).json({ message: 'No documents found in collection' });
        }

        let deletedCount = 0;


        // Delete documents in batches
        while (!snapshot.empty) {
            let batch = firestore.batch();
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
                deletedCount++;
            });

            await batch.commit();

            // Fetch the next batch of documents
            snapshot = await collectionRef.get();
        }

        return res.status(200).json({ message: 'Successfully deleted products', count: deletedCount });
    } catch (error) {
        console.error('Error deleting products:', error);
        res.status(500).json({ error: 'Failed to delete products' });
    }
});
app.post('/add-activity', authenticateToken, authorizeRoles('Developer'), async (req, res) => {
    const { activityName, websiteName, websiteElementId } = req.body;
    console.log("activity name:", activityName, websiteName, websiteElementId);

    if (!activityName) {
        return res.status(400).json({ message: 'Activity name is required' });
    }

    if (!websiteName) {
        return res.status(400).json({ message: 'Website name is required' });
    }

    try {
        const activityRef = firestore.collection('activities').doc(websiteName);
        const doc = await activityRef.get();
        const date = dayjs().format('YYYY-MM-DD');

        if (!doc.exists) {
            // If the document does not exist, create it with the first activity
            await activityRef.set({
                activities: [{
                    id: `${websiteName}1`,
                    activityName: activityName,
                    status: 'Inactive',
                    date,
                    websiteName: websiteName,
                    websiteElementId: websiteElementId
                }]
            });

            res.status(201).json({ message: `${activityName} added successfully`, data: { activityName } });
        } else {
            // If the document exists, add the new activity to the array
            const data = doc.data();
            const activities = data.activities || [];
            const activityExists = activities.some(activity => activity.activityName === activityName);

            if (activityExists) {
                const activeActivityExists = activities.some(activity => activity.activityName === activityName && activity.status === 'Active');
                if (activeActivityExists) {
                    return res.status(400).json({ message: ` "${activityName}" is already in active status` });
                }
            }

            const newId = activities.length + 1;

            activities.push({
                id: `${websiteName}${newId}`,
                activityName: activityName,
                status: 'Inactive',
                date,
                websiteName: websiteName,
                websiteElementId: websiteElementId
            });

            await activityRef.update({ activities });

            res.status(201).json({ message: `${activityName} added successfully`, data: { activityName } });
        }
    } catch (error) {
        console.error('Error adding activity:', error);
        res.status(500).json({ message: 'Error adding activity', error });
    }
});

app.get('/get-activities', authenticateToken, authorizeRoles('Developer'), async (req, res) => {
    try {

        const snapshot = await firestore.collection('activities').get();
        // console.log("snap:",snapshot)
        const activities = [];
        snapshot.forEach(doc => {
            activities.push({ id: doc.id, ...doc.data() });
        });
        // console.log("activities:",activities)
        res.status(200).json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ message: 'Error fetching activities', error });
    }
});
app.post('/remove-activities', authenticateToken, authorizeRoles('Developer'), async (req, res) => {
    try {
        const { websiteName, activityName } = req.body;

        console.log("websiteName:", websiteName)
        // Fetch the document with ID matching the lowercase website
        const docRef = firestore.collection('activities').doc(websiteName);
        const doc = await docRef.get();

        if (!doc.exists) {
            console.log(`No activities found for website: ${websiteName}`)
            return res.status(404).json({ message: `No activities found for website: ${websiteName}` });
        }

        const activitiesData = doc.data();
        const activitiesArray = activitiesData.activities || [];

        // Find the index of the activity to be removed
        const activityIndex = activitiesArray.findIndex(activity => activity.activityName === activityName);

        if (activityIndex === -1) {
            console.log(`Activity '${activityName}' not found for website: ${websiteName}`)
            return res.status(404).json({ message: `Activity '${activityName}' not found for website: ${websiteName}`, data: { activityName } });
        }

        // Remove the activity from the array
        activitiesArray.splice(activityIndex, 1);

        // Update the document in Firestore
        await docRef.update({ activities: activitiesArray });

        return res.status(200).json({ message: `Activity '${activityName}' successfully updated ` });
    } catch (error) {
        console.error('Error removing activity:', error);
        res.status(500).json({ message: 'Error removing activity', error });
    }
});
app.post('/update-activities', authenticateToken, authorizeRoles('Developer'), async (req, res) => {
    try {
        const { date, websiteName, activityName, id, status, websiteElementId } = req.body;
        // console.log("website:", websiteName, activityName,id,websiteElementId);

        // Fetch the document with ID matching the websiteName
        const docRef = firestore.collection('activities').doc(websiteName);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: `No activities found for website: ${websiteName}` });
        }

        const activitiesData = doc.data();
        const activitiesArray = activitiesData.activities || [];

        // Find the index of the activity to be updated
        const activityIndex = activitiesArray.findIndex(activity => (activity.activityName === activityName));

        if (activityIndex === -1) {
            return res.status(404).json({ message: `Activity '${activityName}' not found for website: ${websiteName}`, data: { activityName } });
        }

        // Check if any other activity across all documents is already in "active" state
        if (status === "Active") {
            const activitiesSnapshot = await firestore.collection('activities').get();
            let isActiveFound = false;

            activitiesSnapshot.forEach(doc => {
                const data = doc.data();
                const activities = data.activities || [];
                if (activities.some(activity => activity.status === "Active" && !(doc.id === websiteName && activity.activityName === activityName && activity.id === id))) {
                    isActiveFound = true;
                }
            });

            if (isActiveFound) {
                return res.status(401).json({
                    message: 'Cannot update status. Another activity is already in active state.'
                });
            }
        }

        // Update the activity in the array
        activitiesArray[activityIndex] = {
            id: id,
            activityName: activityName,
            status: status,
            date: date,
            websiteName: websiteName,
            websiteElementId: websiteElementId
        };

        // Update the document in Firestore
        await docRef.update({ activities: activitiesArray });
        res.status(200).json({ message: `Activity '${activityName}' updated successfully`, data: { activityName } });
    } catch (error) {
        console.error('Error updating activity:', error);
        res.status(500).json({ message: 'Error updating activity', error });
    }
});

app.get('/get-all', authenticateToken, authorizeRoles('Developer', 'Admin'), async (req, res) => {
    try {

        const snapshot = await firestore.collection('sylvie_products').get();
        // console.log("snap:",snapshot)
        const products = [];
        snapshot.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });
        console.log("products:", products)
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error });
    }
});
app.post('/add-sylviecategory', authenticateToken, authorizeRoles('Developer'), async (req, res) => {
    try {
        const { category } = req.body;
        const categoriesRef = firestore.collection('sylvie_categories');

        const snapshot = await categoriesRef.get();
        const id = snapshot.size + 1; // Calculate the new id based on existing documents

        await categoriesRef.doc(category).set({ name: category, id });
        return res.status(200).json({ message: `Category ${category} added with id ${id}!` });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ message: 'Error adding category', error });
    }
});

app.get('/get-sylviecategory', authenticateToken, authorizeRoles('Developer', 'Admin', 'User'), async (req, res) => {
    try {
        const snapshot = await firestore.collection('sylvie_categories').get();
        console.log("cat")
        const categories = [];
        snapshot.forEach((doc) => {
            categories.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories', error });
    }
});
app.put('/update-sylviecategory', authenticateToken, authorizeRoles('Developer'), async (req, res) => {
    try {
        const { name, newName } = req.body;

        // console.log("Updating category:", name, "to", newName);

        if (!name || !newName) {
            return res.status(400).json({ message: 'Both name and newName must be provided.' });
        }

        const categoryRef = firestore.collection('sylvie_categories').doc(name);
        const doc = await categoryRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const batch = firestore.batch();
        batch.update(categoryRef, { name: newName });

        if (name !== newName) {
            const newCategoryRef = firestore.collection('sylvie_categories').doc(newName);
            batch.delete(categoryRef);
            batch.set(newCategoryRef, { ...doc.data(), name: newName });
        }

        await batch.commit();

        // console.log("Category updated successfully:", name, "to", newName);
        res.status(200).json({ message: `Category ${name} updated to ${newName} successfully!` });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
});


app.post('/remove-sylviecategory', authenticateToken, authorizeRoles('Developer'), async (req, res) => {
    try {
        const { deleteItem } = req.body;
        console.log("cat:", deleteItem)
        const categoryRef = firestore.collection('sylvie_categories').doc(deleteItem);
        const doc = await categoryRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await categoryRef.delete();
        res.status(200).json({ message: `Category ${deleteItem} removed!` });
    } catch (error) {
        console.error('Error removing category:', error);
        res.status(500).json({ message: 'Error removing category', error });
    }
});
app.post('/deletetempitem', authenticateToken, authorizeRoles('Developer'), async (req, res) => {
    try {
        const { name } = req.body;

        // Delete the document with the specified ID (name)
        const tempProductsRef = firestore.collection('temp_products').doc(name);
        const doc = await tempProductsRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'No matching document.' });
        }

        await tempProductsRef.delete();
        // console.log('Deleted document with ID:', name);

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error removing item:', error);
        res.status(500).json({ message: 'Error removing item', error });
    }
});

app.put('/update-subcategory', async (req, res) => {
    const { uid, subcategory } = req.body;

    try {
        // console.log(uid, subcategory)
        const docRef = firestore.collection('products').doc(uid);
        await docRef.update({ SubCategory: subcategory });
        res.status(200).json({ message: 'Sub Category updated successfully' });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update Sub Category' });
    }
});

app.get('/get-category', async (req, res) => {
    try {
        let query = firestore.collection('categories');
        const snapshot = await query.get();
        const data = [];
        snapshot.forEach(doc => {
            data.push({ id: doc.id, ...doc.data() });
        });
        res.json(data);
        // console.log("received");
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});


app.post('/add-category', async (req, res) => {
    const { category } = req.body;
    // console.log("add category : ", category)
    const Category = category.trim().charAt(0).toUpperCase() + category.trim().slice(1).toLowerCase();

    const categoriesDocRef = firestore.collection('categories2').doc('categoriesDoc');

    try {
        // Update the document by appending the new category to the existing categories array
        await categoriesDocRef.update({
            categories: Firestore.FieldValue.arrayUnion(Category)
        });

        res.status(200).json({ message: 'Category added successfully' });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ error: 'Failed to add category' });
    }
});

app.post('/remove-category', async (req, res) => {
    const { category } = req.body;
    const categoriesDocRef = firestore.collection('categories2').doc('categoriesDoc');
    const productsCollectionRef = firestore.collection('products');

    try {
        const querySnapshot = await productsCollectionRef.where('Category', '==', category).get();
        const productCount = querySnapshot.size;

        if (productCount > 0) {
            res.status(200).json({ message: `Cannot remove "${category}" as ${productCount} products are associated with it` });
            // console.log(`Cannot remove category "${category}" because it is associated with ${productCount} products`);
        }
        else {
            await categoriesDocRef.update({
                categories: Firestore.FieldValue.arrayRemove(category)
            });

            res.status(200).json({ message: 'Category removed successfully' });
        }
    }
    catch (error) {
        console.error('Error removing category:', error);
        res.status(500).json({ error: 'Failed to remove category' });
    }
});

app.post('/add-subcategory', async (req, res) => {
    const { category, subcategory } = req.body;
    const Subcategory = subcategory.trim().charAt(0).toUpperCase() + subcategory.trim().slice(1).toLowerCase();

    const categoriesDocRef = firestore.collection('subcategories2').doc(category);

    try {
        // Get the document with the ID matching the category
        const doc = await categoriesDocRef.get();

        if (!doc.exists) {
            // If the document does not exist, create it with the new category and subcategory
            await categoriesDocRef.set({ subcategories: [Subcategory] });
        } else {
            // If the document exists, update the existing category's subcategories array
            const data = doc.data();
            if (data.subcategories) {
                // Add the new subcategory to it, avoiding duplicates
                if (!data.subcategories.includes(Subcategory)) {
                    data.subcategories.push(Subcategory);
                }
            } else {
                // If subcategories array does not exist, create it with the new subcategory
                data.subcategories = [Subcategory];
            }

            // Update the document with the new data
            await categoriesDocRef.update(data);
        }

        res.status(200).json({ message: 'Subcategory added successfully' });
    } catch (error) {
        console.error('Error adding subcategory:', error);
        res.status(500).json({ error: 'Failed to add subcategory' });
    }
});
app.post('/remove-subcategory', async (req, res) => {
    const { category, subcategory } = req.body;
    const categoriesDocRef = firestore.collection('subcategories2').doc(category);
    const productsCollectionRef = firestore.collection('products');

    try {
        const querySnapshot = await productsCollectionRef.where('SubCategory', '==', subcategory).get();
        // console.log(querySnapshot.docs[0])
        const productCount = querySnapshot.size;
        // console.log(productCount)

        if (productCount > 0) {
            // console.log(`Cannot remove category "${subcategory}" because it is associated with ${productCount} products`);
            res.status(200).json({ message: `Cannot remove "${subcategory}" as ${productCount} products are associated with it` });
        }
        else {
            await categoriesDocRef.update({
                subcategories: Firestore.FieldValue.arrayRemove(subcategory)
            });
            res.status(200).json({ message: 'Subcategory removed successfully' });
        }

        // Respond with success message


    } catch (error) {
        console.error('Error removing subcategory:', error);
        return res.status(500).json({ error: 'Failed to remove subcategory' });
    }
});



app.post('/add-categories', async (req, res) => {
    const productCollection = firestore.collection('products');
    const categoriesDocRef = firestore.collection('categories2').doc('categoriesDoc'); // Use a specific document ID

    try {
        // Fetch distinct categories from the products collection
        const categorySnapshot = await productCollection.select('Category').get();
        let categories = [];
        categorySnapshot.forEach(doc => {
            const category = doc.data().Category;
            if (category && !categories.includes(category)) {
                categories.push(category);
            }
        });

        // Sort categories alphabetically
        categories.sort();

        const docSnapshot = await categoriesDocRef.get();

        if (!docSnapshot.exists) {
            // If the document doesn't exist, create it with the initial set of categories
            await categoriesDocRef.set({ categories });
            return res.status(200).json({ message: 'Categories added successfully' });
        } else {
            // If the document exists, merge new categories with existing ones
            const existingCategories = docSnapshot.data().categories;

            // Filter out duplicates
            const newCategories = categories.filter(category => !existingCategories.includes(category));

            if (newCategories.length > 0) {
                // Add new categories to the existing list
                const updatedCategories = existingCategories.concat(newCategories).sort(); // Sort categories alphabetically
                await categoriesDocRef.update({ categories: updatedCategories });

                return res.status(200).json({ message: 'New categories added successfully' });
            } else {
                return res.status(400).json({ error: 'No new categories to add' });
            }
        }
    } catch (error) {
        console.error('Error adding categories:', error);
        return res.status(500).json({ error: 'Failed to add categories' });
    }
});

app.post('/add-subcategories', async (req, res) => {
    const productCollection = firestore.collection('products');
    const subcategoriesCollection = firestore.collection('subcategories2');

    try {
        // Fetch all documents from the products collection
        const productSnapshot = await productCollection.get();
        let subcategories = {};

        productSnapshot.forEach(doc => {
            const { Category, SubCategory } = doc.data();
            if (Category && SubCategory) {
                if (!subcategories[Category]) {
                    subcategories[Category] = new Set();
                }
                subcategories[Category].add(SubCategory);
            }
        });

        // Convert Sets to Arrays and sort them
        for (const category in subcategories) {
            subcategories[category] = Array.from(subcategories[category]).sort();
        }

        // Update Firestore with the new subcategories
        for (const [category, subs] of Object.entries(subcategories)) {
            const subcategoriesDocRef = subcategoriesCollection.doc(category);
            const docSnapshot = await subcategoriesDocRef.get();

            if (!docSnapshot.exists) {
                // If the document does not exist, create it with the new subcategories
                await subcategoriesDocRef.set({ subcategories: subs });
            } else {
                // If the document exists, merge new subcategories with existing ones
                const existingSubcategories = docSnapshot.data().subcategories;

                // Convert existing subcategories to Set to remove duplicates
                const existingSubcategoriesSet = new Set(existingSubcategories);

                // Filter out duplicates from the new subcategories and convert to Set
                const newSubcategoriesSet = new Set(subs.filter(sub => !existingSubcategoriesSet.has(sub)));

                // Combine existing and new subcategories Sets and convert back to Array
                const updatedSubcategories = [...existingSubcategoriesSet, ...newSubcategoriesSet];

                // Update Firestore document with merged subcategories
                await subcategoriesDocRef.set({ subcategories: updatedSubcategories.sort() });
            }
        }

        return res.status(200).json({ message: 'Subcategories added/updated successfully' });
    } catch (error) {
        console.error('Error adding subcategories:', error);
        return res.status(500).json({ error: 'Failed to add subcategories' });
    }
});



app.get('/get-categories', async (req, res) => {

    try {
        let query = firestore.collection('categories2');
        const snapshot = await query.get();
        const data = [];
        snapshot.forEach(doc => {
            data.push({ id: doc.id, ...doc.data() });
        });
        // console.log("received cat::", data);
        let allCategories = data.reduce((acc, curr) => {
            return acc.concat(curr.categories);
        }, []);

        // Sorting categories in ascending order by name
        allCategories.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

        // console.log("Received categories:", allCategories);
        res.json(allCategories);

    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
})
app.get('/get-subcategories', async (req, res) => {

    try {
        let query = firestore.collection('subcategories2');
        const snapshot = await query.get();
        const data = [];
        snapshot.forEach(doc => {
            const subcategories = doc.data().subcategories.sort();
            data.push({ id: doc.id, subcategories });
        });

        // console.log("received sub cat::", data);
        res.json(data);
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ error: 'Failed to fetch sub category' });
    }
})
app.put('/update-category', async (req, res) => {
    const { uid, category } = req.body;
    const productsCollectionRef = firestore.collection('products');

    try {
        // Query the collection for the document with the matching uid
        const querySnapshot = await productsCollectionRef.where('uid', '==', uid).get();

        if (querySnapshot.empty) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        // Get the document (there should only be one document due to unique uid)
        const doc = querySnapshot.docs[0];

        // Update the document with the new category
        await doc.ref.update({ Category: category });

        res.status(200).json({ message: 'Category updated successfully' });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});
app.put('/update-subcategory', async (req, res) => {
    const { uid, subcategory } = req.body;
    const productsCollectionRef = firestore.collection('products');

    try {
        // Query the collection for the document with the matching uid
        const querySnapshot = await productsCollectionRef.where('uid', '==', uid).get();

        if (querySnapshot.empty) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        // Get the document (there should only be one document due to unique uid)
        const doc = querySnapshot.docs[0];

        // Update the document with the new category
        await doc.ref.update({ SubCategory: subcategory });

        res.status(200).json({ message: 'SubCategory updated successfully' });
    } catch (error) {
        console.error('Error updating sub category:', error);
        res.status(500).json({ error: 'Failed to update sub category' });
    }
});

app.put('/edit-category', async (req, res) => {
    const { oldCategory, newCategory } = req.body;
    // console.log("old and new:", oldCategory, newCategory)
    const categoriesDocId = 'categoriesDoc'; // The ID of the document containing the categories array
    const productsCollectionRef = firestore.collection('categories2').doc(categoriesDocId);
    try {
        const doc = await productsCollectionRef.get();
        if (!doc.exists) {
            res.status(404).json({ error: 'Document not found' });
            return;
        }
        let { categories } = doc.data();
        const categoryIndex = categories.indexOf(oldCategory);

        if (categoryIndex === -1) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }
        categories[categoryIndex] = newCategory;
        await productsCollectionRef.update({ categories });

        res.status(200).json({ message: 'Category updated successfully' });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});
app.put('/edit-subcategory', async (req, res) => {
    const { selectedCat, oldSubCategory, newSubcategory2 } = req.body;
    // console.log("old and new:", selectedCat, oldSubCategory, newSubcategory2)
    // The ID of the document containing the categories array
    const productsCollectionRef = firestore.collection('subcategories2').doc(selectedCat);
    try {
        const doc = await productsCollectionRef.get();
        if (!doc.exists) {
            res.status(404).json({ error: 'Document not found' });
            return;
        }
        let { subcategories } = doc.data();
        const subcategoryIndex = subcategories.indexOf(oldSubCategory);

        if (subcategoryIndex === -1) {
            res.status(404).json({ error: 'Sub Category not found' });
            return;
        }
        subcategories[subcategoryIndex] = newSubcategory2;
        await productsCollectionRef.update({ subcategories });

        res.status(200).json({ message: 'Sub Category updated successfully' });
    } catch (error) {
        console.error('Error updating sub category:', error);
        res.status(500).json({ error: 'Failed to update sub category' });
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
