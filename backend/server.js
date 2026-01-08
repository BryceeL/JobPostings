import express from "express"
import cors from "cors"
import routes from "./routes.js"

const app = express()

//Routes traffic to render's port or local port
const port = process.env.PORT || 3001

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://blitzjobpostings.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  }
}))

app.use(express.json())
//api route
app.use('/api', routes)

app.listen(port, () => {
  console.log(`Backend server running at ${port}`);
});