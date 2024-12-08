import userRoutes from "./src/routes/users.routes.js"
import dotenv from "dotenv";
dotenv.config();
import express from "express"
import connectDB from "./src/db/index.js";
import cookieParser from "cookie-parser";
import cors from "cors"


const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use("/api/v1",userRoutes)


// app.listen(port, () => {
//   console.log(`Example app listening on port ${process.env.PORT}`)
// })


connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("MONGO DB connection failed !!! ", err);
    });

