// Imports
const axios = require('axios').default;
const express = require('express');
const cors = require('cors');
const http = require('http');

// Library inits
const app = express();
app.use(express.json());
app.use(cors());

// variable inits
const uri = 'https://www.fireeye.com/content/dam/legacy/cyber-map/weekly_sanitized.min.js';
let data;

// download data
async function getData() {
  await axios.get(uri)
    .then((req) => {
      let idCounter = 0;
      const attacks = [];
      req.data.attacks.forEach((element) => {
        const tmpObj = element;
        tmpObj.id = idCounter;
        idCounter += 1;
        attacks.push(tmpObj);
        data = attacks;
      });
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log('[ERROR]: Error with downloading data:');
      // eslint-disable-next-line no-console
      console.log(`[ERROR]: ${err}`);
    });
}
getData();
setInterval(getData, 1000000);

// webserver endpoints
app.get('/', async (req, res) => {
  console.log('Access');
  res.status(200).send(data);
});

app.get('/countrys', async (req, res) => {
  console.log('Access');
  let countrys = [];

  data.forEach((attack) => {
    countrys.push(attack.OriginCode);
    countrys.push(attack.Destination);
  });

  countrys = countrys.map((country) => country);
  countrys = countrys.filter((a, b) => countrys.indexOf(a) === b);
  countrys = countrys.sort();

  const output = { countrys };

  res.status(200).send(output);
});

// Server starten
http.createServer(app).listen(3000, () => {
  console.log('Server online auf port 3000');
});
