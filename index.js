require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const isUrlHttp = require('is-url-http')
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

urlSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		delete returnedObject._id;
		delete returnedObject.__v;
	}
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
  
  if (!isUrlHttp(original_url)) {
    res.json({
      error: 'invalid url'
    });
  } else {
    const urlJson = await Url.findOne({
      original_url: original_url
    }).exec();

    if (urlJson) {
      res.json(urlJson);
    } else {
      let newUrl = new Url({
        original_url: original_url,
        short_url: short_url
      });

      await newUrl.save();
      res.json(newUrl);
    }
  }
})

app.get('/api/shorturl/:short_url', async (req, res) => {
  let urlJson = await Url.findOne({
    short_url: req.params.short_url
  }).exec();

  if (urlJson) {
    res.redirect(urlJson.original_url);
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
