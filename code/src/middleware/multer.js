
import multer from "multer"
import generateUniqueString from "../utils/generalUniqueString.js";
import { allowedExtensions } from "../utils/allowedExtensions.js";
import fs from 'fs'
import path from 'path' 

/**
 * 
 * check the path if not exist create it
 * store in diskStorage
 * filter the file
 * create multer instance
 * return multer instance
 */
export const multerMiddleLocal = ({
    extensions = allowedExtensions.image,
    filePath = 'general'
}) => {

    const destinationPath = path.resolve(`src/uploads/${filePath}`) 

    // path check
    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true })
    }
    // diskStorage
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destinationPath)
        },
        filename: (req, file, cb) => {
            const uniqueFileName = generateUniqueString(6) + '_' + file.originalname
            cb(null, uniqueFileName)
        }
    })

    // file Filter
    const fileFilter = (req, file, cb) => {
        if (extensions.includes(file.mimetype.split('/')[1])) {
            return cb(null, true)
        }
        cb(new Error('Image format is not allowed!'), false)
    }


    const file = multer({ fileFilter, storage })
    return file
}


export const multerMiddleHost = ({
    extensions = allowedExtensions.image,
}) => {


    // diskStorage
    const storage = multer.diskStorage({
        filename: (req, file, cb) => {
            const uniqueFileName = generateUniqueString(6) + '_' + file.originalname
            cb(null, uniqueFileName)
        }
    })

    // file Filter
    const fileFilter = (req, file, cb) => {
        if (extensions.includes(file.mimetype.split('/')[1])) {
            return cb(null, true)
        }
        cb(new Error('Image format is not allowed!'), false)
    }


    const file = multer({ fileFilter, storage })
    return file
}