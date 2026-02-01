import env from "dotenv"
env.config()
export default {
    url:process.env.MONGO_URL,
    port:process.env.PORT,
    key:process.env.KEY,

}
