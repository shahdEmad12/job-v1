

export const asyncHandler = (err, req, res, next)=>{
    if(err){
    return res.status(err['cause'] || 500).json({
    message:'catch error',
    errormsg: err.message,
    errorlocation: err.stack
})
    }
}