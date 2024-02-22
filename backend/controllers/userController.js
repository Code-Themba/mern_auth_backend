const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const genToken = require('../utils/tokenGenerator');

//Route     -   /api/account/delete-profile
//Desc      -   Deletes A Registered User's Profile From Database.
//Access    -   Private
const deleteProfile = asyncHandler(async (req, res) => { 
    const user = await User.findById(req.user._id);
    if (user) { 
        await user.deleteOne();
        res.cookie('authToken', '', {
            httpOnly: true,
            expires: new Date(0)
        });
        res.status(200).json({
            message: `User ${user._id} profile deleted successfully.`
        })
    } else { 
        res.status(404);
        throw new Error('User not found');
    }
});

//Route     -   /api/account/get-profile
//Desc      -   Retrieves A Registered User's Profile From Database.
//Access    -   Private
const getProfile = asyncHandler(async (req, res) => { 
    const user = {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email
    }

    res.status(200).json(user);
});

//Route     -   /api/account/login
//Desc      -   Logging In An Existing User.
//Access    -   Public
const loginUser = asyncHandler(async (req, res) => { 
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(req.body)
    if (user && (await user.comparePasswords(password))) {
        genToken(res, user._id);
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email
        });
    }else {
        res.status(401);
        throw new Error('Invalid credentials entered.');

    }
});

//Route     -   /api/account/logout
//Desc      -   Logging out A User.
//Access    -   Private
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('authToken', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({
       message: 'User logged out.'
   }) 
});

//Route     -   /api/account/register
//Desc      -   For Registering New Users.
//Access    -   Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, confirm_password } = req.body; 
    const user_exists = await User.findOne({ email });
    if (user_exists) {
        res.status(403)
        throw new Error('User with that email address already exists.')
    }
    if (password !== confirm_password) {
        res.status(403);
        throw new Error('Please make sure passwords match');
    } else {
        const user = await User.create({
            username,
            email,
            password
        });
        if (user) {
            genToken(res, user._id)
            res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            password: user.password
        });
        } else {
            res.status(403);
            throw new Error('Oops something went wrong...');
        }
    }
})

//Route     -   /api/account/update-profile
//Desc      -   Updates A Registered User's Profile From Database.
//Access    -   Private
const updateProfile = asyncHandler(async (req, res) => { 
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) { 
            user.password = req.body.password;
        }
        const updatedUserData = await user.save();
        res.status(200).json({
            _id: updatedUserData._id,
            username: updatedUserData.username,
            email: updatedUserData.email
        })
    } else {
        res.status(401);
        throw new Error('User not found.')
    }
    
});

module.exports = {
    deleteProfile,
    getProfile,
    loginUser,
    logoutUser,
    registerUser,
    updateProfile
}