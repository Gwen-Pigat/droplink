/**
 * DropLink Server Entrypoint
 */
const app = require('./src/app');
const { PORT } = require('./src/config');

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
