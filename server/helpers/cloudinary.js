import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer'

const storage=new multer.memoryStorage()
cloudinary.config({
    cloud_name:'dfqdkmmh8',
    api_key:'956985393662381',
    api_secret:'JdO8L9mGrhT5tUPRW6UrgO8rl2o'
})

async function imageUploadUtil(file) {
    const result = cloudinary.uploader.upload(file,{resource_type:'auto'})
    return result
}
const upload=multer({storage});
export {upload,imageUploadUtil}