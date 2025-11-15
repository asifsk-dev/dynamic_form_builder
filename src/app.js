const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const qs = require("qs");
const swaggerUi = require('swagger-ui-express');

const errorHandler = require("./middleware/errorHandler");
const router = require("./routes/index.routes");
const swaggerDocument = require('./docs/swagger.json');

const app = express();

app.use(cors());
app.use(express.json({ type: '*/*', strict: true }));
app.use(express.urlencoded({ extended: true }));

// Morgan
app.use(morgan("dev"));

// Query Parser
app.set("query parser", str => qs.parse(str));

// Routes
app.get('/ping', (req, res, next) => {
  res.status(200).json({ message: 'API Service is Active' });
});

app.use('/api', router);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Not Found
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
})

// Global error handler
app.use(errorHandler);

module.exports = app;
