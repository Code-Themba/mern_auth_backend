const router = require('express').Router();

const {
    deleteProfile,
    getProfile,
    loginUser,
    logoutUser,
    registerUser,
    updateProfile 
} = require('../controllers/userController'); 

const protectRoutes = require('../middleware/authMiddleware');

router.delete('/delete-profile', protectRoutes, deleteProfile);
router.get('/get-profile', protectRoutes, getProfile);
router.post('/login', loginUser);
router.get('/logout', protectRoutes, logoutUser);
router.post('/register', registerUser);
router.put('/update-profile', protectRoutes, updateProfile);

module.exports = router;