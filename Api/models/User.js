import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    
},{timestamps: true})

userSchema.pre('save', async function (next) {
    // BEFORE saving new user in db, hash the password
    const newUser = this;
  
    const plainPW = newUser.password;
  
    if (newUser.isModified('password')) {
      newUser.password = await bcrypt.hash(plainPW, 10);
    }
  
    next();
  });

  userSchema.methods.toJSON = function () {
    // toJSON is called every time express does a res.send
  
    const userDocument = this;
  
    const userObject = userDocument.toObject();
  
    // delete userObject.password
  
    delete userObject.__v;
  
    return userObject;
  };


  userSchema.statics.checkCredentials = async function (email, plainPW) {
    // 1. find user in db by email
  
    const user = await this.findOne({ email });
  
    if (user) {
      // 2. if user is found we need to compare plainPW with hashed PW
      const isMatch = await bcrypt.compare(plainPW, user.password);
  
      // 3. return a meaningful response
  
      if (isMatch) return user;
      else return null;
    } else {
      return null;
    }
  };
export default model('user', userSchema);