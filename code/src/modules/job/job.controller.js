import Job from "../../../DB/models/job.model.js"
import Company from "../../../DB/models/company.model.js"
import App from "../../../DB/models/application.js"
import cloudinaryConnection from '../../utils/cloudinary.js'
//............................. add job ................................
/** 
 *  Extract user id from req.authUser
 *  Destructure job details from req.body
 *  Create a new job document 
 *  If the job creation fails return an error
 *  Return success message 
 */
export const addJob = async(req,res,next)=>{
    //Extract user id from req.authUser
    const{_id}= req.authUser
    //Destructure job details from req.body
    const {jobTitle, jobLocation, WorkingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, companyId} = req.body
    //Create a new job document 
    const newJob = await Job.create({jobTitle, jobLocation, WorkingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, addedBy:_id, companyId})
    if(!newJob) return next(new Error('adding failed', {cause:400}))
    res.status(201).json({message:'job added successfully', newJob})
}

//............................. update job ..............................
/**
 *  Destructure job details from req.body
 *  Extract user id from req.authUser
 *  Extract job id from req.params
 *  Check if the job exists
 *  If the job doesn't exist return an error
 *  Update the job
 *  If the update fails return an error
 *  Return success message and the updated job document
 */
export const updateJob = async(req,res,next)=>{
    //Destructure from req.body
    const {jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, addedBy} = req.body
    //Extract user id from req.authUser
    const {_id} = req.authUser
    //Extract job id from req.params
    const jobId = req.params.jobId

    //Check if the job exists
    const isJobExists = await Job.findById(jobId, {addedBy:_id})
    if(!isJobExists) return next(new Error('job does not exist', {cause:404}))

    //Update the job
    const updatingJob = await Job.findByIdAndUpdate(jobId, {jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, addedBy}, {new: true})
    if(!updatingJob) return next(new Error('updating failed', {cause:400}))
    res.status(200).json({message:'job updated successfully', updatingJob})
}

//............................. delete job ...............................
/**
 *  Extract user id from req.authUser
 *  Extract job id from req.params
 *  Check if the job exists 
 *  If the job doesn't exist return an error
 *  Delete the job with the provided job id
 *  If the deletion fails return an error
 *  Return success message 
 */
export const deleteJob = async (req,res,next)=>{
    //Extract user id from req.authUser
    const {_id} = req.authUser
    //Extract job id from req.params
    const jobId = req.params.jobId

    //Check if the job exists
    const isJobExists = await Job.findById(jobId, {addedBy:_id})
    if(!isJobExists) return next(new Error('job does not exist', {cause:404}))

    //Delete the job with the provided job id
    const deletingJob = await Job.findByIdAndDelete(jobId)
    if(!deletingJob) return next(new Error('deleting failed', {cause:400}))
    res.status(200).json({message:'job deleted successfully', deletingJob})
}

//............................. get job with company ................................
/**
 *  Find all jobs
 *  Populate the 'addedBy' field to get company details
 *  Return the list of jobs with company details
 */
export const getJobWithCompany = async(req,res,next)=>{
    //Find all jobs and Populate the 'addedBy' field to get company details
    const jobWithCompany = await Job.find().populate([{path:'addedBy'}])
    res.status(200).json({message:'data: ', jobWithCompany})
}

//............................. get job with company name ................................
/**
 *  Extract the company name from the request query parameters
 *  Find the company in the database based on company name
 *  if the company is not found return error
 *  if the company is found find all jobs associated with the company
 *  if no jobs are found return error
 *  Return the list of jobs with the company
 */
export const getJobWithCompanyName = async(req,res,next)=>{
    //Extract the company name from the request query parameters
    const { companyName } = req.query

        // Find the company based on the company name
        const company = await Company.findOne({ companyName })

        if (!company) {
            return next(new Error('Company not found', {cause:404}))
        }

        // find all jobs associated with the found company
        const jobs = await Job.findOne({ companyId: company._id })
        if(!jobs) next(new Error('job not found', {cause:404}))
        res.status(200).json({message:'data: ', jobs})
}

//............................. get job with company filters ................................
/**
 *  Extract filter from the request body
 *  Initialize an empty object to store filters in it 
 *  Construct the query object based on the filters found
 *  Find jobs that match any of the provided filter 
 *  Return the found jobs
 */
export const getJobs = async(req,res,next)=>{
    const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.body
    const filters = {}

    // Construct the query object based on the provided filters
    if (workingTime) filters.workingTime = workingTime
    if (jobLocation) filters.jobLocation = jobLocation
    if (seniorityLevel) filters.seniorityLevel = seniorityLevel
    if (jobTitle) filters.jobTitle = jobTitle
    if (technicalSkills) filters.technicalSkills = technicalSkills

    // Find jobs that match any of the provided filter criteria
    const jobs = await Job.find(filters)
    if(!jobs) return next(new Error('failed', {cause:400}))

    res.status(200).json({ message: 'Jobs found', jobs })
}
//........................... apply job ..................................
/**
 *  Extract user id from req.authUser
 *  Extract data from the request body
 *  Check if PDF file is uploaded 
 *  Upload PDF file to Cloudinary
 *  Create a new application document 
 *  Return success response
 */
export const applyJob = async (req, res, next) => {
    //Extract user id from req.authUser
    const { _id } = req.authUser
    //Extract data from the request body
    const { jobId, userTechSkills, userSoftSkills } = req.body

    // Check if PDF file is uploaded
    if (!req.file || req.file.mimetype !== 'application/pdf') {
        return next(new Error('Please upload a PDF file', { cause: 400 }))
    }

    // Upload PDF file to Cloudinary
    const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(req.file.path, {
        folder: `jobApplications/${_id}`,
        resource_type: 'raw'
    })

    // Create a new application document
    const application = await App.create({
        jobId,
        userId: _id,
        userTechSkills,
        userSoftSkills,
        userResume: {
            url: secure_url,
            public_id: public_id
        }
    })

    res.status(201).json({ message: 'Application submitted successfully', application })
}
