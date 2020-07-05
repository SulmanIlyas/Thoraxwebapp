const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

// Create Schema
const UserSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

//Store Encrypted Password When Creating Account
UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) user.password = await bcrypt.hash(user.password, 10);
    next();
});

//Generate JWT Token
UserSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id, name: user.name }, process.env.SECRET, { expiresIn: '30d' });
    return token;
};

//Find using email and check if the password matched
UserSchema.statics.findUserByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email });
    if (!user) throw new Error({ error: 'Invalid login credentials' });
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) throw new Error({ error: 'Invalid login credentials' });
    return user;
};

UserSchema.statics.findUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    return user;
};

UserSchema.statics.findUserById = async (_id) => {
    const user = await User.findOne({ '_id': mongoose.Types.ObjectId(_id) });
    return user;
};


module.exports = User = mongoose.model("users", UserSchema, "users");