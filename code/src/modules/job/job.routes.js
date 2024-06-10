import { Router } from "express"
import * as jobController from './job.controller.js'
import { endPointsRoles } from "./job.endpoints.roles.js"
import expressAsyncHandler from "express-async-handler"
import { auth } from "../../middleware/auth.middleware.js";
import {validationMiddleware} from '../../middleware/validation.middleware.js'
import * as validationSchemas from "./job.validationSchema.js"
import { multerMiddleHost } from "../../middleware/multer.js"
import { allowedExtensions } from "../../utils/allowedExtensions.js"

const router = Router()

router.post('/', auth(endPointsRoles.ACCESS_JOB) ,validationMiddleware(validationSchemas.addJobSchema), expressAsyncHandler(jobController.addJob))
router.put('/:jobId', auth(endPointsRoles.ACCESS_JOB) ,validationMiddleware(validationSchemas.addJobSchema), expressAsyncHandler(jobController.updateJob))
router.delete('/:jobId', auth(endPointsRoles.ACCESS_JOB) ,validationMiddleware(validationSchemas.idJobSchema),expressAsyncHandler(jobController.deleteJob))
router.get('/withCompany', auth(endPointsRoles.BOTH_COMPANY),expressAsyncHandler(jobController.getJobWithCompany))
router.get('/withCompanyName', auth(endPointsRoles.BOTH_COMPANY) ,validationMiddleware(validationSchemas.companyNameSchema),expressAsyncHandler(jobController.getJobWithCompanyName))
router.get('/jobs', auth(endPointsRoles.BOTH_COMPANY) ,validationMiddleware(validationSchemas.getJobsSchema),expressAsyncHandler(jobController.getJobs))
router.post('/app', auth(endPointsRoles.ACCESS_USER), multerMiddleHost({ extensions: allowedExtensions.document }).single('userResume'), validationMiddleware(validationSchemas.applyAppSchema),expressAsyncHandler(jobController.applyJob))

export default router