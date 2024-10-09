import {Router} from 'express';
import { patch_scorecard } from '../controllers/Scorecard.js';


const router = Router();





router.route('/scorecard').patch(patch_scorecard);



export default router;


