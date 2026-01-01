import express from "express"
import cors from "cors"
import routes from "./routes.js"

const app = express()
//Remove origin for development purposes
app.use(cors({
  origin: "https://blitzjobpostings.netlify.app"
}))

//Routes traffiac to render's port or local port
const port = process.env.PORT || 3001

app.use('/api', routes)

app.listen(port, () => {
  console.log(`Backend server running`);
});
