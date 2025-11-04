import express from 'express'
import { getUserProfile, login, resetPassword, sendOtp, updateProfile } from '../Controllar/AuthControllar.js'


const AuthRoute = express.Router()


AuthRoute.post("/login", login);

AuthRoute.get("/get-user-profile/:id", getUserProfile);

AuthRoute.put("/update-user-profile/:id", updateProfile);

AuthRoute.post("/send-otp", sendOtp);

AuthRoute.post("/reset-password", resetPassword);




export default AuthRoute