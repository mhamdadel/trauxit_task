const logger = require('./app/config/logger');
const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`app listening on port http://localhost:${PORT}`);
});
