require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dns = require('dns');
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ encoded: false }));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number
});

let Url = mongoose.model('shorturl', urlSchema);

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req, res) => {
  const countDocuments = await Url.countDocuments();
  const original_url = req.body.url;
  const short_url = countDocuments + 1;
  
  dns.lookup(original_url, (error, address, family) => {
    if (error) {
      res.json({
        error: 'invalid url'
      });
    } else {
      Url.findOne({
        original_url: originalUrl
      })
    }
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
