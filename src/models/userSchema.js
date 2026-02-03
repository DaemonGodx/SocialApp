import mongoose from "mongoose"
import bcrypt from "bcrypt"

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
     profilePic: {
      url: {
        type: String,
        required: true,
        default: "https://i.pravatar.cc/300",
      },
      publicId: {
        type: String,
        default: null, // default avatar ke liye null
      },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    followersCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    followingCount: {
        type: Number,
        default: 0,
        min: 0,
    },

},
    { timestamps: true });

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", UserSchema);
export default User;