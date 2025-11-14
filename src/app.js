const express = require("express");
const cors = require("cors");

const errorHandler = require("./middleware/errorHandler");
const router = require("./routes/index.routes");

const app = express();

app.use(cors());
app.use(express.json({ type: '*/*', strict: true }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/ping', (req, res, next) => {
  res.status(200).json({ message: 'API Service is Active' });
});

app.use('/api', router);

// Not Found
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
})

// Global error handler
app.use(errorHandler);

module.exports = app;
