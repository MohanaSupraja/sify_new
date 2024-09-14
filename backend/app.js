

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();
const PORT = process.env.PORT || 3001;
const serviceAccount = require('./sylvie-dynamic-pricing-b5620d51f78c.json'); // Path to your service account key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const firestore = admin.firestore();


app.use(cors());

app.use(express.json());
app.get('/fetch/:parameterValue', async (req, res) => {
  try {
    const parameterValue = parseInt(req.params.parameterValue); // Get the parameterValue from the URL path and convert to integer
    if (isNaN(parameterValue)) {
      throw new Error('Invalid parameterValue');
    }
    const snapshot = await firestore.collection('products').where('source_id', '==', parameterValue).get();
    const data = [];
    snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });

    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
