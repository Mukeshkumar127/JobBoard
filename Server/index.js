const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/hero', (req,res) => {
    res.send('MUKESH');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/job'));
app.use('/api/applications', require('./routes/apply'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT, () => console.log('Server started on port', PORT)))
  .catch(err => console.error('MongoDB connection error:',err));
