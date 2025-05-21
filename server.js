
const app = require('./app');

const PORT = process.env.PORT || 5000;


app.get('/', (req, res) => {
  res.send('Fraud Detection API is running...');
});

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

module.exports = server;
