// middlewares/auth.js
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        console.log("Token not found");
        return res.status(404).json({
            success: false,
            message: "Login first"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decoded:", decoded);
        req.user = await User.findById(decoded._id);
        console.log("User found:", req.user);
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};
