import User from "../models/userSchema.js"
class UserRepo {
    async create(data) {
        try {
            const user = await User.create({
                name: data.name,
                password: data.password,
                email: data.email,
                username: data.username,
                profilePic: data.profilePic

            })
            return user
        } catch (err) {
            console.log("Repository Layer Error ", err)
            throw err
        }

    }
    async get(data) {
        try {
            const user = await User.findOne({ email: data.email })
            return user
        } catch (err) {
            console.log("Repository Layer Error ", err)
            throw err
        }

    }
    async getById(id) {
  return await User.findById(id);
}
    async update(id, data) {
        try {
            Object.keys(data).forEach(
                key => data[key] === undefined && delete data[key]
            );

            const user = await User.findByIdAndUpdate(id, { $set: data }, { new: true });
            return user
        }
        catch (err) {
            console.log("Repository Layer Error ", err)
            throw err
        }
    }
}

export default UserRepo
