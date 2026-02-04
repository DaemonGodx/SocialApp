import express from "express"
import config from "./config/config.js"
import connect from "./connections/index.js"
import route from "./Routes/index.js"
import cookieParser from "cookie-parser"
import listEndpoints from "express-list-endpoints";
import { startLikeReconciliationJob } from "./jobs/reconcileLikes.js";



const app=express()
app.set("query parser", "extended");
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



connect(config.url)
startLikeReconciliationJob();
app.use("/api",route)
console.log(listEndpoints(app));




app.listen(config.port,()=>{
    console.log("Server connected Succesfully")
})
