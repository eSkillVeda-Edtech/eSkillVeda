// In api.js

const {Router} = require("express");
// IMPORT THE NEW FUNCTIONS
const { handleSignup, handleLogin, handleUpdateProfile, verifyToken } = require("../controller/userController");
const router = Router();

router.post('/signup', handleSignup);
router.post('/login', handleLogin);

// ==========================================================
// ==                  NEW PROTECTED ROUTE                 ==
// ==========================================================
// This route will first run verifyToken. If it succeeds, it will run handleUpdateProfile.
router.put('/profile', verifyToken, handleUpdateProfile);


module.exports = router;