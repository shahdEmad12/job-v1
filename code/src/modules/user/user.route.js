import { Router } from "express";
import * as userController from './user.controller.js'
import {validationMiddleware} from '../../middleware/validation.middleware.js'
import * as validationSchemas from "./user.validationSchema.js"; 
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middleware/auth.middleware.js";
import { endPointsRoles } from "./user.endpoints.roles.js";


const router = Router()

router.post('/signup' ,validationMiddleware(validationSchemas.signUpSchema),  expressAsyncHandler(userController.signUp))
router.post('/signin', validationMiddleware(validationSchemas.signInSchema), expressAsyncHandler(userController.signIn))
router.put('/', auth(endPointsRoles.BOTH_USER), validationMiddleware(validationSchemas.updateSchema), expressAsyncHandler(userController.updateUser))
router.delete('/', auth(endPointsRoles.BOTH_USER), validationMiddleware(validationSchemas.deleteSchema),expressAsyncHandler(userController.deleteUser))
router.get('/profile', auth(endPointsRoles.BOTH_USER), validationMiddleware(validationSchemas.deleteSchema), expressAsyncHandler(userController.getUserProfile))
router.put('/password', auth(endPointsRoles.BOTH_USER), validationMiddleware(validationSchemas.newPassSchema), expressAsyncHandler(userController.updatePassword))
router.get('/byRecoveryEmail',  validationMiddleware(validationSchemas.byRecoveryEmailSchema),
    expressAsyncHandler(userController.getDataByRecoveryEmail))
router.get('/:userId', auth(endPointsRoles.BOTH_USER) , validationMiddleware(validationSchemas.getAnotherUserSchema), expressAsyncHandler(userController.getAnotherUserProfile))
router.post('/forgetPass' , validationMiddleware(validationSchemas.forgetPasswordSchema), expressAsyncHandler(userController.forgetPassword))
router.post('/resetPass' , validationMiddleware(validationSchemas.resetPasswordSchema), expressAsyncHandler(userController.ResetPassword))


export default router