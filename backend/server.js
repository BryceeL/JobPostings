import express from "express"
import cors from "cors"
import routes from "./routes.js"

const app = express()
//Remove origin for development purposes
app.use(cors({
  origin: "https://blitzjobpostings.netlify.app/"
}))

const port = 3001

app.use('/api', routes)

app.listen(port, () => {
  console.log(`Backend server running`);
});
