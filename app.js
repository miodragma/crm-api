const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const sequelize = require('./db/dabatase');

/* Middlewares */
const errorMiddleware = require('./middleware/error');

/* Routes */
const authRoutes = require('./routes/auth');

const app = express();

app.use(helmet());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})

app.use('/auth', authRoutes);

app.use(errorMiddleware);

sequelize.sync()
  .then(result => {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch(err => console.log(err))
