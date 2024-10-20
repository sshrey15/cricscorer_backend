import {Router} from 'express';
import { addTeams, getTeams, get_team, delete_all, getTeamById } from '../controllers/Teams.js';
import {  join_team } from '../controllers/Players.js';
import { createMatch, getAllMatches } from '../controllers/Match.js';
import { create_result } from '../controllers/Results.js';


const router = Router();

router.route('/teams').post(addTeams).get(getTeams).delete(delete_all);
router.route('/join_team').post(join_team)
router.route('/create_match').post(createMatch);
router.route('/matches').get(getAllMatches)
router.route('/team').post(get_team);
router.route('/team/:id').get(getTeamById)
router.route('/result').post(create_result)


export default router;