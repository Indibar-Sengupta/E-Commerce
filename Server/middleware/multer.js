// 13. It is a middleware to store a storage before upload to cloudinary
import multer from 'multer'

const storage=multer.memoryStorage()
// 13. Here upload the storage in the multer
const upload = multer ({storage :  storage})

export default upload