  
const express = require('express');
const mongoose = require('mongoose');
const path = require("path")

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect( process.env.MONGODB_URI || uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})


if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../build'))


  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
  });
}

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});