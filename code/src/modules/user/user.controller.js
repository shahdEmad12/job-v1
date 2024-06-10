import USER from "../../../DB/models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { generateOTP } from "../../utils/generateOtp.js"

//................................signup....................................
/**
 * Register a new user
 *  Destructure data from req.body
 *  Check if email already exists
 *  Check if mobile number already exists
 *  Hash the password
 *  Create a new user
 *  Return success response
 */
export const signUp =
    async (req,res,next)=>{
        // Destructure data from req.body
        const {firstName, lastName, userName, email, password, recoveryEmail, DOB, mobileNumber, role, status} = req.body
    
        // Check if email already exists
        const isEmailExists = await USER.findOne({email})
        if(isEmailExists) return next(new Error('email is already exists', {cause:400}))

        // Check if mobile number already exists
        const isMobileNumberExists = await USER.findOne({mobileNumber})
        if(isMobileNumberExists) return next(new Error('phone number is already exists', {cause:400}))
    
        // Hash the password
        const hashedPassword = bcrypt.hashSync(password,+process.env.SALT_ROUNDS)
        // Create a new user
        const newUser = await USER.create({firstName, lastName, userName, email, password:hashedPassword, recoveryEmail, DOB, mobileNumber, role, status})
        if(!newUser) return next(new Error('user registration failed', {cause:500}))
        // Return success response
        return res.status(201).json({message:'user registration success', newUser})
    
    }

//...........................signin..................................
/**
 *  Destructure data from req.body
 *  Find user by email or mobile number
 *  If user not found return error
 *  Compare passwords
 *  If passwords don't match return error
 *  Generate JWT token 
 *  Update user status
 *  Return success response
 */
    export const signIn = async (req,res,next)=>{
        //Destructure data from req.body
        const {mobileNumber, email, password} = req.body
        //Find user by email or mobile number
        const user = await USER.findOne({
            $or: [
                {email}, {mobileNumber}
            ]
        })
        if(!user) return next(new Error('invalid login credentials', { cause: 400 }))
        //Compare passwords
        const isPasswordMatch = bcrypt.compareSync(password, user.password)
        if(!isPasswordMatch) return next(new Error('invalid login credentials', { cause: 409 }))
        //Generate JWT token
        const token = jwt.sign({id: user._id, email: user.email, role: user.role},process.env.LOGIN_SIGNATURE,{expiresIn : '2h'})
        //Update user status
        const updateStatus = await USER.findOneAndUpdate({ _id: user._id },{status: 'online'}, {new:true})
        //Return success response
        return res.status(200).json({message:'login success', token ,status:updateStatus.status})
    }

//................................update user....................................
/**
 *  Destructure data from req.body 
 *  Extract user ID from req.authUser
 *  if email is provided check if it already exists in the database
 *  if email exists return error
 *  if mobileNumber is provided check if it already exists in the database
 *  if mobileNumber exists return error
 *  Update user data 
 *  Return success response 
 */
    export const updateUser = async (req,res,next)=>{
        //Destructure data from req.body 
        const{email , mobileNumber , recoveryEmail , DOB , lastName , firstName} = req.body
        //Extract user ID from req.authUser
        const{_id} = req.authUser
    
        //if email is provided check if it already exists in the database
        if (email) {
            const isEmailExists = await USER.findOne({ email })
            if (isEmailExists) return next(new Error('Email is already exists', { cause: 409 }))
        }
    
        //if mobileNumber is provided check if it already exists in the database
        if (mobileNumber) {
            const isMobileNumberExists = await USER.findOne({ mobileNumber })
            if (isMobileNumberExists) return next(new Error('mobileNumber is already exists', { cause: 409 }))
        }
    
        //Update user data 
        const userUpdateData = await USER.findByIdAndUpdate(_id, {email , mobileNumber , recoveryEmail , DOB , lastName , firstName}, {new: true})
        if(!userUpdateData) return next(new Error('updating failed', {cause:400}))
        //Return success response
        return res.status(200).json({message:'updated successfully', userUpdateData})
    }

//................................delete password....................................
/**
 *  extract user ID from req.authUser
 *  find user by ID and delete it
 *  if deleting is successful return success response
 *  if deleting fails return error
 */
    export const deleteUser = async (req,res,next)=>{
        //extract user ID from req.authUser
        const{_id} = req.authUser
    
        //find user by ID and delete it
        const deleting = await USER.findByIdAndDelete(_id)
        if(!deleting) return next(new Error('deleting failed', {cause:400}))
        //if deleting is successful return success response
        return res.status(200).json({message:'deleting successfully'})
    }

//............................... Get User Profile .................................
/**
 *  extract user ID from req.authUser
 *  find user by ID
 *  if user profile is found return user data
 *  if user profile is not found return error
 */
    export const getUserProfile = async (req, res, next) => {
        //extract user ID from req.authUser
        const {_id} = req.authUser
        //find user by ID
        const userProfile = await USER.findById(_id)
        //if user profile is found return user data
        res.status(200).json({ message: "User data:", userProfile })
    }

//................................update password....................................
/**
 *  Extract new password from req.body
 *  Extract user ID from req.authUser
 *  Get user data from req.authUser
 *  Compare new password
 *  if new password matches the hashed password return error
 *  Hash the new password
 *  Update user password 
 *  if update is successful return success message 
 *  if update fails return error
 */
    export const updatePassword = async (req,res,next)=>{
        //Extract new password from req.body
        const{newPassword} = req.body
        //Extract user ID from req.authUser
        const{_id} = req.authUser
        //Get user data from req.authUser
        const user = req.authUser
        //comparing hash password
        const isPasswordExists = bcrypt.compareSync(newPassword, user.password)
        if(isPasswordExists) return next(new Error('password already exists', {cause:400}))
    
        //hash the new password
        const hashedPass = bcrypt.hashSync(newPassword,+process.env.SALT_ROUNDS)
        //update password
        const userUpdatePass = await USER.findByIdAndUpdate(_id, {password:hashedPass}, {new: true})
        if(!userUpdatePass) return next(new Error('updating failed', {cause:400}))
        //if update is successful return success message 
        return res.status(200).json({message:'updated successfully', userUpdatePass})
    }

//.............................. forget password ......................................
/**
 *  destruction of email from req.body
 *  Find user by email
 *  if user not found return error
 *  Generate OTP
 *  Update user's OTP field
 *  return success response
 */
export const forgetPassword = async (req, res, next) => {
    //destruction of email from req.body
    const { email } = req.body

        // Find user by email
        const user = await USER.findOne({ email })

        if (!user) {
            next(new Error('user not found', {cause:404}))
        }

        // Generate OTP
        const otp = generateOTP()

        // Update user's OTP field
        user.passwordResetOTP = otp
        await user.save()

        res.status(200).json({ message: "OTP generated successfully", otp })
    }

// ...................... reset password .................................
/**
 *  destruction of email from req.body
 *  Find user by email
 *  if user not found return error
 *  Check if OTP matches
 *  hash new password
 *  Update user's password
 * Clear OTP after password reset
 *  return success response
 */
    export const ResetPassword = async (req, res, next) => {
        const { email, sentOtp, newPassword } = req.body
    
            // Find user by email
            const user = await USER.findOne({ email })
    
            if (!user) {
                next(new Error('user not found', {cause:404}))
            }
    
            // Check if OTP matches
            if (user.passwordResetOTP !== sentOtp) {
                return next(new Error('Invalid OTP', {cause:400}))
            }
    
            // hash new password
            const hashedPassword = bcrypt.hashSync(newPassword,+process.env.SALT_ROUNDS)
            // Update user's password
            user.password = hashedPassword; 
            user.passwordResetOTP = null; // Clear OTP after password reset
            await user.save();
    
            res.status(200).json({ message: "Password updated successfully" });    
    }
    
//.............................. get data by recoveryemail ..............................
/**
 *  extract recovery email from req.body
 *  find user data by recovery email 
 *  if no user data is found return error 
 *  if user data is found, return success message
 */
    export const getDataByRecoveryEmail = async (req,res,next)=>{
        //extract recovery email from req.body
        const { recoveryEmail } = req.body;
        //find user data by recovery email 
        const byRecoveryEmail = await USER.find({recoveryEmail})
        if(!byRecoveryEmail.length) return next(new Error ('recoveryemail not found', {cause:404}))
        //if user data is found, return success message
    res.status(200).json({message:'data:', byRecoveryEmail})
}

//............................... Get another User Profile .................................
/**
 *  extract user id from req.params
 *  find user profile by user id 
 *  if user profile is found return success message 
 */
export const getAnotherUserProfile = async (req, res, next) => {
    //extract user id from req.params
    const {userId} = req.params
    //find user profile by user id 
    const anotherUserProfile = await USER.findById(userId)
    if(!anotherUserProfile) return next(new Error('user not found', {cause:404}))
    //if user profile is found return success message 
    res.status(200).json({ message: "User data:", anotherUserProfile })
}