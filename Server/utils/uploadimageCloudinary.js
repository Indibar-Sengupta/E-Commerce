// 13 Step. This imports the v2 version of Cloudinary's Node SDK.
  // v2 supports promises and better syntax — much easier to work with.
import {v2 as cloudinary} from 'cloudinary'

cloudinary.config({
  cloud_name : process.env.CLOUDINARY_CLOUDNAME,
  api_key : process.env.CLOUDINARY_APIKEY,
  api_secret : process.env.CLOUDINARY_SECRET

})

const uploadimage= async(image)=>{
  // 13. If image already in buffer then use image.buffer otherwise convert to buffer
    // This ensures that the image is in a buffer format, which is required by cloudinary.uploader.upload_stream.
  const buffer=image.buffer || Buffer.from(await image.arrayBuffer())

  const uploadImg= await new Promise((resolve,reject)=>{
    // 13. This is the folder name which will be present in cloudinary website
    cloudinary.uploader.upload_stream({folder : "Mudikhana"},(error,uploadResult)=>{
      return resolve(uploadResult)
    }).end(buffer)
})
 return uploadImg
}

export default uploadimage