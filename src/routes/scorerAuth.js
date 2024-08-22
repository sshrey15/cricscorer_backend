import {Router}  from 'express';
import { createScorer, loginScorer, logoutScorer} from '../controllers/auth.js';

const router = Router();

router.route('/scorer_signup').post(createScorer);
router.route('/scorer_login').post(loginScorer);
router.route('/scorer_logout').get(logoutScorer);

export default router;
