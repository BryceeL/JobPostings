import express from "express"
import cors from "cors"

const routes = require('./routes')

const app = express()
app.use(cors())

const port = 3001

app.use('/api', routes)

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
