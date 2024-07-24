const app = require('./app');
const sequelize = require('./config/config');

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log('Database connected...');
    await sequelize.sync();
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
});
