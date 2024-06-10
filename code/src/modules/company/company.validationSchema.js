import joi from 'joi'

import { generalRules } from '../../utils/general.validation.rules.js'

export const addCompanySchema ={
    body: joi.object({
        companyName:joi.string().required(), 
        description:joi.string().required(), 
        industry:joi.string().required(), 
        address:joi.string().required(), 
        numberOfEmployees:joi.number().required(), 
        companyEmail:joi.string().email().required(), 
        companyHR:generalRules.dbId,
        jobs:generalRules.dbId
    }),

    headers: generalRules.headersRules,
}

export const idCompany= {
    params: joi.object({
        companyId : generalRules.dbId
    }),
    headers: generalRules.headersRules,
}

export const companyNameSchema = {
    query: joi.object({
        companyname:joi.string().required(),
    }),
    headers: generalRules.headersRules,
}

export const idHeader= {
    headers: generalRules.headersRules
}

