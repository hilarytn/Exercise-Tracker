import mongoose from 'mongoose';

const { Schema } = mongoose;

const exerciseLogSchema = new mongoose.Schema({
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, required: true }
  });
  
  const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    count: { type: Number},
    log: { type: [exerciseLogSchema]}
  });


const User = mongoose.model('User', userSchema);

export default User;