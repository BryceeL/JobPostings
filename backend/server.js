import express from "express"
import cors from "cors"

import routes from "./routes.js"

const app = express()
app.use(cors ({
  origin: process.env.CLIENT_URL || "http://localhost:3001",
}))

const port = process.env.PORT || 3001;
//comment
app.use('/api', routes)

app.listen(port, () => {
  console.log(`Backend server running on ${port}`);
});
