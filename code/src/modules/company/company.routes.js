import { Router } from "express";
import * as companyController from './company.controller.js'
import { endPointsRoles } from "./company.endpoints.roles.js";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middleware/auth.middleware.js";
import {validationMiddleware} from '../../middleware/validation.middleware.js'
import * as validationSchema from './company.validationSchema.js'

const router = Router()

router.post('/', auth(endPointsRoles.ACCESS_COMPANY) ,validationMiddleware(validationSchema.addCompanySchema),expressAsyncHandler(companyController.addCompany))
router.put('/:companyId', auth(endPointsRoles.ACCESS_COMPANY) ,validationMiddleware(validationSchema.addCompanySchema),expressAsyncHandler(companyController.updateCompany))
router.delete('/:companyId', auth(endPointsRoles.ACCESS_COMPANY) ,validationMiddleware(validationSchema.idCompany),expressAsyncHandler(companyController.deleteCompany))
router.get('/:companyId', auth(endPointsRoles.ACCESS_COMPANY) ,validationMiddleware(validationSchema.idCompany),expressAsyncHandler(companyController.getCompanyData))
router.get('/', auth(endPointsRoles.GET_COMPANY_BY_NAME) ,validationMiddleware(validationSchema.companyNameSchema),expressAsyncHandler(companyController.getCompanyByName))
router.get('/app', auth(endPointsRoles.ACCESS_COMPANY) ,validationMiddleware(validationSchema.idHeader),expressAsyncHandler(companyController.getAppWithJobs))


export default router