import { User } from "../models/user.js";
import bcrypt from "bcrypt";

import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            console.log("Register first");
            return next(new ErrorHandler("INVALID EMAIL OR PASSWORD", 400));
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return next(new ErrorHandler("INVALID EMAIL OR PASSWORD", 400));
        }

        sendCookie(user, res, `LOG IN, ${user.name}`, 200);
        console.log(`Login success ${user.name}`);
    } catch (error) {
        next(error);
    }
};

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            return next(new ErrorHandler("USER ALREADY EXISTS", 400));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({ name, email, password: hashedPassword });

        sendCookie(user, res, "Registered Successfully", 201);
        console.log("Registered successfully");
    } catch (error) {
        next(error);
    }
};

// controllers/user.js
export const getMyProfile = (req, res) => {
    console.log("getMyProfile called");
    console.log("User:", req.user);
    res.status(200).json({
        success: true,
        user: req.user,
    });
};


export const logout = (req, res) => {
    const user = req.user;
    res.cookie("token", "", {
        expires: new Date(Date.now()),
        sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Development" ? false : true,
    }).status(200).json({
        success: true,
        user: user,
    });
    console.log(`Cookie removed, logout done! User: ${user.name}`);
};

