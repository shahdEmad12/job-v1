import joi from 'joi'
import { systemRoles } from '../../utils/systemRoles.js'
import { generalRules } from '../../utils/general.validation.rules.js'

export const signUpSchema = {
    body: joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        userName: joi.string().required(),
        email: joi.string().email().required(), 
        password: joi.string().required(), 
        recoveryEmail: joi.string().required(), 
        DOB: joi.date().required(), 
        mobileNumber: joi.number().required(),
        role: joi.string().valid(...Object.values(systemRoles)).default(systemRoles.USER),
        status: joi.number().valid('offline','online').default('offline'),
    }).with('email', 'password')
}

export const signInSchema = {
    body: joi.object({
        email: joi.string().email(), 
        password: joi.string().required(), 
        mobileNumber: joi.number(),
    }).xor('email', 'mobileNumber').required(),
}

export const updateSchema = {
    body: joi.object({
        firstName: joi.string(),
        lastName: joi.string(),
        email: joi.string().email(), 
        password: joi.string(), 
        recoveryEmail: joi.string(), 
        DOB: joi.date(), 
        mobileNumber: joi.number(),
    }),
    headers: generalRules.headersRules,
}

export const deleteSchema = {
    headers: generalRules.headersRules,
}

export const newPassSchema = {
    body: joi.object({ 
        newPassword: joi.string().required(), 
    }),
    headers: generalRules.headersRules,
}

export const byRecoveryEmailSchema = {
    body: joi.object({ 
        recoveryEmail: joi.string().lowercase().trim(), 
    })
}

export const getAnotherUserSchema = {
    params: joi.object({ 
        userId: generalRules.dbId, 
    }),
    headers: generalRules.headersRules,
}

export const forgetPasswordSchema = {
    body: joi.object({ 
        email: joi.string().email().required(), 
    })
}

export const resetPasswordSchema = {
    body: joi.object({ 
        email: joi.string().email().required(),
        sentOtp: joi.string().required(),
        newPassword: joi.string().required(),
    })
}