// In userController.js
const User = require("../model/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.jwtSecret;

async function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: "No token provided, authorization denied." });
    }
    
    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token is not valid." });
    }
}

async function handleUpdateProfile(req, res) {
    try {
        const { name, email } = req.body;
        const currentUserEmail = req.user.email;
        
        const updatedUser = await User.findOneAndUpdate(
            { email: currentUserEmail },
            { name: name, email: email },
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        
        // Include user ID in the new token
        const newToken = jwt.sign({ 
            id: updatedUser._id,
            name: updatedUser.name, 
            email: updatedUser.email 
        }, secret);
        
        return res.status(200).json({ token: newToken });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "This email is already in use." });
        }
        return res.status(500).send("Internal Server Error");
    }
}

async function handleSignup(req, res) {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists with this email" });
        }
        
        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);
        
        // Create the new user in the database
        const user = await User.create({
            name: name,
            email: email,
            password: hashPassword,
        });
        
        // Create a token for the new user - INCLUDE USER ID
        const token = jwt.sign({ 
            id: user._id,
            name: user.name, 
            email: user.email 
        }, secret);
        
        // Send the token back to the frontend
        return res.status(200).json({ token: token });
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).send("Internal Server Error");
    }
}

async function handleLogin(req, res) {
    try {
        const { email, password } = req.body;
        
        // Find the user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "Invalid email or password" });
        }
        
        // Compare the provided password with the stored hash
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(404).json({ message: "Invalid email or password" });
        }
        
        // Create a token for the logged-in user - INCLUDE USER ID
        const token = jwt.sign({ 
            id: user._id,
            name: user.name, 
            email: user.email 
        }, secret);
        
        // Send the token back to the frontend
        return res.status(200).json({ token: token });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    handleLogin,
    handleSignup,
    handleUpdateProfile,
    verifyToken,
};
