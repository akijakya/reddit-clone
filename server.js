'use strict';

const app = require('./routes');
const config = require('./config');
const port = config.app.port;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});