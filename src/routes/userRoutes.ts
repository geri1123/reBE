import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { uploadSingleProfileImage } from '../middlewares/uploadFile.js';
import { updateProfileImage } from '../controllers/user/updateprofile.js';
import { changeUsername } from '../controllers/user/updateUsername.js';

import { changePassword } from '../controllers/user/updatePassword.js';

import { updateProfileFields } from '../controllers/user/updateProfileFields.js';
const router = express.Router();
router.use(verifyToken);
router.patch('/update-profileImg',  uploadSingleProfileImage, updateProfileImage);
router.patch('/update-username' ,  changeUsername); 
router.patch('/update-password' ,  changePassword);
router.patch('/user/update-me' , updateProfileFields )
export default router;