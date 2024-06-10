import joi from 'joi'
import { generalRules } from '../../utils/general.validation.rules.js'


export const addJobSchema = {
    body: joi.object({
        jobTitle: joi.string().required(), 
        jobLocation: joi.string().valid('onsite', 'remotely', 'hybrid').required(), 
        WorkingTime: joi.string().valid('part-time' , 'full-time').required(), 
        seniorityLevel: joi.date().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').required(), 
        jobDescription: joi.string().required(),
        technicalSkills: joi.array().items(joi.string()).required(),
        softSkills: joi.array().items(joi.string()).required(),
        addedBy: generalRules.dbId,
        companyId: generalRules.dbId,
    }),
    headers: generalRules.headersRules,
}

export const idJobSchema ={
    params: joi.object({
        jobId: generalRules.dbId,
    }),
    headers: generalRules.headersRules,
}

export const getJobSchema = {
    body: joi.object({
        jobTitle: joi.string().required(), 
        jobLocation: joi.string().valid('onsite', 'remotely', 'hybrid').required(), 
        WorkingTime: joi.string().valid('part-time' , 'full-time').required(), 
        seniorityLevel: joi.date().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').required(), 
        technicalSkills: joi.array().items(joi.string()).required(),
    }),
    headers: generalRules.headersRules,
}

export const companyNameSchema = {
    query: joi.object({
        companyName : joi.string().required(),
    }),
    headers: generalRules.headersRules,
}

export const getJobsSchema = {
    body: joi.object({
        jobTitle: joi.string(), 
        jobLocation: joi.string().valid('onsite', 'remotely', 'hybrid'), 
        WorkingTime: joi.string().valid('part-time' , 'full-time'), 
        seniorityLevel: joi.date().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'), 
        technicalSkills: joi.array().items(joi.string()),
    }),
    headers: generalRules.headersRules,
}

export const applyAppSchema = {
    body: joi.object({
        jobId: generalRules.dbId, 
        userTechSkills: joi.array().items(joi.string()), 
        userSoftSkills: joi.array().items(joi.string()), 
        userResume: joi.string(),
    }),
    headers: generalRules.headersRules,
}