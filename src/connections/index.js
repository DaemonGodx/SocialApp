import mongoose from "mongoose"

export default function connect(url)
{
    
        mongoose.connect(url)
        .then(()=>
            console.log("DataBase Connected"))
        .catch((err)=>console.log("Error connecting DB",err))


}
