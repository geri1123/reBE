import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { requireAgencyOwner } from '../middlewares/roleAuth.js';
import { AgentRequestController } from '../controllers/agency/agentsRequests.js';
import { updateAgencyFields } from '../controllers/agency/update/updateAgencyFields.js';
import { updateAgencyLogo } from '../controllers/agency/update/updateAgencyLogo.js';
import { uploadSingleAgencyLogo } from '../middlewares/uploadFile.js';
const router = express.Router();

router.patch('/updateAgencyFields', verifyToken, requireAgencyOwner,updateAgencyFields);
router.get('/getAgentsRequest' , verifyToken , requireAgencyOwner , AgentRequestController.getRequests)
router.patch('/agent-request/respond' , verifyToken ,requireAgencyOwner ,AgentRequestController.respondToRequest  ) 
router.patch(
  '/update-logo',
  verifyToken,
  requireAgencyOwner,
  uploadSingleAgencyLogo,  
  updateAgencyLogo        
);
export default router;