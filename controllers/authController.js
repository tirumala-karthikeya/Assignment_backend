const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { validationResult, check } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

require("dotenv").config();

exports.validateRegistration = [
    check("name").notEmpty().withMessage("Name is required").trim(),
    check("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Valid email is required").normalizeEmail(),
    check("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ message: "User registered successfully", token: generateToken(user._id) });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({ 
            message: "Login successful", 
            token: generateToken(user._id),
            user: { name: user.name, email: user.email }  
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};



exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            text: `Click the following link to reset your password: ${resetLink}`
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Reset link sent to your email." });

    } catch (error) {
        console.error("Error in resetPasswordRequest:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await user.save();

        res.json({ message: "Password reset successful. You can now login with your new password." });

    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ message: "Server error" });
    }
};
