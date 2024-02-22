const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
}, {
    timestamps: true
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
});

UserSchema.methods.comparePasswords = async function (_password) {
    return await bcrypt.compare(_password, this.password);
}

const User = mongoose.model('users', UserSchema);

module.exports = User;