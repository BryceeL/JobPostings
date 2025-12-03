const express = require('express')
const cors = require('cors')

const routes = require('./routes')

process.env.PUPPETEER_CACHE_DIR = process.env.PUPPETEER_CACHE_DIR || "/tmp/puppeteer";

const app = express()
app.use(cors ({
  origin: process.env.CLIENT_URL || "http://localhost:3001",
}))

const port = process.env.PORT || 3001;

app.use('/api', routes)

app.listen(port, () => {
  console.log(`Backend server running on ${port}`);
});
