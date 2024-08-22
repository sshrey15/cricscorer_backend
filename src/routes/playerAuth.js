import {Router} from 'express';
import { signup_players,login_players } from '../controllers/auth.js';

const router = Router();

router.route('/player_signup').post(signup_players)
router.route('/player_login').post(login_players)

export default router;