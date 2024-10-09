import {Router} from 'express';
import { addTeams, getTeams, get_team } from '../controllers/Teams.js';
import {  join_team } from '../controllers/Players.js';
import { createMatch } from '../controllers/Match.js';


const router = Router();

router.route('/teams').post(addTeams).get(getTeams);
router.route('/join_team').post(join_team)
router.route('/create_match').post(createMatch);
router.route('/team').post(get_team);


export default router;