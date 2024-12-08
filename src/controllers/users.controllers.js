import User from "../models/users.models.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// const saltRounds = 10
// const encryptPassword = async (req, res) => {
//     const { password } = req.body;
//     bcrypt.hash(password, saltRounds, function (err, hash) {
//         if (err) {
//             res.status(400).json({
//                 message: "error is occuring while encrypting the password",
//                 err: err,
//             })
//         }
//         console.log(hash)
//         res.status(200).json({
//             message: "password encrypted successfully",
//             hash: hash,
//         })

//     });
// }

// access token
const generateAccessToken = (user) => {
    return jwt.sign({ email: user.email },
        process.env.ACCESS_JWT_SECRET, {
        expiresIn: "7h"
    })
}

// REFRESH TOKEN
const generateRefreshToken = (user) => {
    return jwt.sign({ email: user.email },
        process.env.REFRESH_JWT_SECRET),
        { expiresIn: "7d" }
}

// register User
const registerUser = async (req, res) => {
    const { email, password } = req.body

    if (!email) {
        return res.status(400).json({
            message: "email is required"
        })
    }
    if (!password) {
        return res.status(400).json({
            message: "password is required"
        })
    }

    const user = await User.findOne({ email: email })
    if (user) {
        return res.status(401).json({ message: "user already exist" })
    }
    const createUser = await User.create({
        email,
        password
    })
    res.json({
        message: "user created successfully",
        data: createUser
    })

}

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email,
    });
    if (!user) {
        res.status(400).json({
            message: "user not found",
        });
    }
    if (!email) {
        res.status(400).json({
            message: "email is required",
        });
    }
    if (!password) {
        res.status(400).json({
            message: "email is required",
        });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(400).json({
            message: "invalid passoword",
        });
    }
    
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    // cookies
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });
  
  
    res.status(200).json({
      message: "user loggedIn successfully",
      accessToken,
      refreshToken,
      data: user,
    });
  };

// logout user
const logoutUser = async (req, res) => {
    res.clearCookie("refreshToken");
    res.json({
        message: "user logout successfully"
    })
}

// refresh token
const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!refreshToken) {
        return res.status(401).json({
            message: "no refresh token found"
        })
    }

    // logic likhunga yahan iski 
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
    const user = await User.findOne({
        email: decodedToken.email
    })
    if (!user) {
        return res.status(404).json({
            message: "invalid token"
        })
    }
    const generateToken = generateAccessToken(user);
    res.json({
        //yahan access token ka error aasakta hai sirf capital wala msla hoga
        message: "access token generated", accessToken: generateToken
    })
    res.json({ decodedToken })
}
// authenticate using middleware
const authenticateUser = async (req, res) => {
    if (err) return res.status(401).json({
        message: "no token found"
    });
    // idhr bhi error aasakta hai due to token name
    jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({
            message: "invalid token"
        })
        req.user = user;
        next()
    })
}

export { registerUser, loginUser, logoutUser, refreshToken, authenticateUser }