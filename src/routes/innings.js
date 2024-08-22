import {Router} from 'express';
import { createInnings } from '../controllers/Innings.js';

const router = Router();

router.route('/create_innings').post(createInnings);



export default router;