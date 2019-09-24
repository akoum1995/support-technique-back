const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
mongoose.connect('mongodb://localhost:27017/technoPro-DB', { useNewUrlParser: true });
const app = express();



app.use(bodyParser.json());
app.use(cors());
const connexion = require('./apis/connexion')
app.use('/connexion', connexion)

// const api = require('./routes/api')
// app.use('/api', api)

 const api = require('./apis/api')
 app.use('/api', api)

 const upload = require('./apis/upload')
 app.use('/upload', upload)

app.listen(3000, () => {
  console.log('server is running on port 3000');
})