const express = require('express')
const cors = require('cors')

const routes = require('./routes')

const app = express()
app.use(cors())

const port = 3001

//node server.js to run this server backend locally
app.use('/api', routes)

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
