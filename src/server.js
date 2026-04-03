const app = require('./app');
const start = async () => {
  app.listen(3000, () => {
    console.log(`Server running on port 3000 [development]`);
  });
};

start();
