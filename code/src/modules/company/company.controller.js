import App from "../../../DB/models/application.js"
import Company from "../../../DB/models/company.model.js"
import Job from "../../../DB/models/job.model.js"


//............................. add company ................................
/**
 *  extract user ID from req.authUser
 *  destructure company data from req.body
 *  create a new company
 *  if new company is created successfully return success message
 */
export const addCompany = async(req,res,next)=>{
    //extract user ID from req.authUser
    const{_id}= req.authUser
    //destructure company data from req.body
    const {companyName, description, industry, address, numberOfEmployees, companyEmail, jobs} = req.body
    //create a new company
    const newCompany = await Company.create({companyName, description, industry, address, numberOfEmployees, companyEmail, companyHR:_id, jobs})
    if(!newCompany) return next(new Error('adding failed', {cause:400}))
    res.status(201).json({message:'company added successfully', newCompany})
}

//.............................. update company .........................
/**
 *  extract user id from req.authUser
 *  extract company id from req.params
 *  destructure company data from req.body
 *  check if the company exists
 *  if the company exists update the company data
 *  Return success message 
 */
export const updateCompany =async (req, res, next) => {
    //extract user id from req.authUser
    const { _id } = req.authUser
    //extract company id from req.params
    const companyId = req.params.companyId
    //destructure company data from req.body
    const { companyName, description, industry, address, numberOfEmployees, companyEmail, companyHR } = req.body

    //check if the company exists
    const isCompanyExists = await Company.findById(companyId, {companyHR: _id });
    if (!isCompanyExists) return next(new Error('Company does not exist', { cause: 404 }))

    //if the company exists update the company data
    const updatingCompany = await Company.findByIdAndUpdate(companyId, { companyName, description, industry, address, numberOfEmployees, companyEmail, companyHR }, { new: true });
    if (!updatingCompany) return next(new Error('Updating company failed', { cause: 400 }))

    res.status(200).json({ message: 'Company updated successfully', updatingCompany })
}

//........................... delete company ....................................
/**
 *  Extract user ID from req.authUser
 *  Extract company ID from req.params
 *  Check if the company exists
 *  if the company exists delete the company
 *  Return success message
 */
export const deleteCompany = async (req, res, next) => {
    //Extract user ID from req.authUser
    const { _id } = req.authUser;
    //Extract company ID from req.params
    const companyId = req.params.companyId; 

    //Check if the company exists
    const isCompanyExists = await Company.findById(companyId, {companyHR: _id });
    if (!isCompanyExists) return next(new Error('Company does not exist', { cause: 404 }))

    const deletingCompany = await Company.findByIdAndDelete(companyId);
    if (!deletingCompany) return next(new Error('Deleting company failed', { cause: 400 }))

    //Return success message
    res.status(200).json({ message: 'Company deleted successfully', deletingCompany })
}

//............................. get company data ...............................
/**
 *  Extract user ID from req.authUser
 *  Extract company ID from req.params
 *  find the company by its ID
 *  if the company does not exist return an error
 *  Find all jobs added by the company's HR
 *  Return company data with all jobs
 */
export const getCompanyData = async (req,res,next)=>{
    //Extract user ID from req.authUser
    const {_id} = req.authUser
    //Extract company ID from req.params
    const {companyId} = req.params

    //find the company by its ID
    const getCompany = await Company.findById(companyId)
    if(!getCompany) return next(new Error('company does not exist', {cause:404}))

    //Find all jobs added by the company's HR
    const getJobs = await Job.find({addedBy: getCompany.companyHR})
    res.status(200).json({message:'company data with all jobs:', getJobs})
}

//............................. get company by name ...............................
/**
 *  Extract user ID from req.authUser
 *  Extract company name from req.query
 *  Find the company by its name
 *  If the company does not exist return an error
 *  Return company data
 */
export const getCompanyByName = async (req,res,next)=>{
    //Extract user ID from req.authUser
    const {_id} = req.authUser
    //Extract company name from req.query
    const companyname = req.query.companyname

    //Find the company by its name
    const getCompanyName = await Company.findOne({companyName:companyname})
    if(!getCompanyName) return next(new Error('company does not exist', {cause:404}))

    //Return company data
    res.status(200).json({message:'data :', getCompanyName})
}

//............................. get apps with jobs ...............................
/**
 *  Extract user ID from req.authUser
 *  check if its the owner
 *  Find all jobs associated with the company ID
 *  Find all applications for the found job IDs
 *  Return the applications with user data
 */
export const getAppWithJobs = async (req,res,next)=>{
    // Extract user ID from req.authUser
    const { _id } = req.authUser

    //check if its the owner
    const isCompanyOwner = await Company.find({companyHR:_id})
    if(isCompanyOwner.length==0) return next(new Error('you are not the owner',{cause:404}))

    // Find all jobs associated with the company ID
    const companyJobs = await Job.find({ addedBy: _id});
    if(companyJobs.length==0) return next(new Error('no jobs found',{cause:404}))

    // Find all applications for the found job IDs
    const applications = await App.find( {jobId:companyJobs._id} ).populate('userId');
    if(applications.length==0) return next(new Error('no application found',{cause:404}))

    // Return the applications with user data
    res.status(200).json({ message: 'Applications for company jobs', applications })
}