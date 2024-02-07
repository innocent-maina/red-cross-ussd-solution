/* eslint-disable no-console */
/** ------------------------------------------------------
 *  ---------------------------------------
 *  Import required modules
 * ---------------------------------------
 ------------------------------------------------------* */
// const Sentry = require('@sentry/node');
require('dotenv/config');
// const { ProfilingIntegration } = require('@sentry/profiling-node');
const express = require('express');
const cors = require('cors');
const path = require('path');
// const mongoose = require('mongoose');
// require('./config/database')(mongoose);

/** ------------------------------------------------------
 *  ---------------------------------------
 *  Initialize app
 * ---------------------------------------
 ------------------------------------------------------* */
const app = express();

/** ------------------------------------------------------
 *  ---------------------------------------
 *  Set middleware
 * ---------------------------------------
 ------------------------------------------------------* */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

/** ------------------------------------------------------
 *  ---------------------------------------
 *  External MongoDB API Routes
 * ---------------------------------------
 ------------------------------------------------------* */
// const { UserRoutes } = require('./routes');
// app.use('/api/v1/users', UserRoutes);

/** ------------------------------------------------------
 *  ---------------------------------------
 *  USSD Entry point
 * ---------------------------------------
 ------------------------------------------------------* */

const AppController = require('./controllers/app.controller');

app.post('/ussd', (req, res) => {
  AppController(req, res);
});

/** ------------------------------------------------------
 *  ---------------------------------------
 *  Incoming SMS
 * ---------------------------------------
 ------------------------------------------------------* */
app.post('/incoming-messages', (req, res) => {
  const data = req.body;
  console.log(`Received message: \n ${data}`);
  res.sendStatus(200);
});

/** ------------------------------------------------------
 *  ---------------------------------------
 *  SMS Delivery reports
 * ---------------------------------------
 ------------------------------------------------------* */
// app.post('/delivery-reports', (req, res) => {
//   const data = req.body;
//   console.log(`Received report: \n ${data}`);
//   res.sendStatus(200);
// });

/** ------------------------------------------------------
 *  ---------------------------------------
 *  Application Port declaration
 * ---------------------------------------
 ------------------------------------------------------* */
const port = parseInt(process.env.PORT, 10) || 5000;

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '/view/index.html'); // Update the path as needed
  res.sendFile(indexPath);
  // res.send('Your server is running');
});

app.listen(port, () => {
  try {
    console.log(`Server is running on port: ${port}`);
  } catch (error) {
    console.error(error);
  }
});
