import UserRepo from "../repository/userRepo.js"
import config from "../config/config.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userRepo=new UserRepo();
class userService{
    async create(data)
    {
        try{
        if (!data.password) throw new Error("Password is required");
        const user =await userRepo.create(data)
        return user
        }
        catch(err)
        {
            console.log("Service Layer Error",err)
            throw err
        }
        
    }
    async login(data)
    {
        try{
            const user=await userRepo.get(data)
            if(!user) throw new Error("user not Found")
            const isMatch=await bcrypt.compare(data.password,user.password)
            if(isMatch){
                const token=this.createToken(user)
                return {user,token}
            }
            throw new Error("Invalid Password")
        
        }catch(err)
        {
            
            console.log("Service Layer Error",err)
            throw err

        }
    }
    async update(id ,data){
        try{
            const user=await userRepo.update(id ,data)
            return user
        }
        catch(err){
            console.log("ServiceLayerError",err)
            throw err;
        }
    }       
    async getCurrentUser(data){
    try{
        const user=await userRepo.getCurrentuser(data);
        return user;
    }
    catch(err){
        console.log("ServiceLayerError",err)
        throw err;
    }
}
    createToken(data)
    {
        return jwt.sign({user:data},config.key)
    }
    VerifyandGetToken(token){
   if(!token) return null;
        try {
            return jwt.verify(token,config.key);
        } catch (error) {
             console.log(error);
        }
}
getbyid(id){
    return userRepo.getById(id)
}
async getProfileDetails({ profileuserId, currentUserId }) {
    try{
        return await userRepo.getProfileDetails({ profileuserId, currentUserId });
    }
    catch(err)
    {
        console.log("Service Layer Error (getProfileDetails):", err);
        throw err;
    }
}
}
export default userService