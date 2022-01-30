import fetch from "node-fetch"; 

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require('express');
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
});


app.get('/about', (req, res) => {
    
    fetch("http://localhost:3000/profile").then(response => response.json()).then(data=> res.send(data))
  // fetch("http://localhost:3000/profile").then(response => res.send(response.json()))
  });

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});