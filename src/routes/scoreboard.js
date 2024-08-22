import {Router} from 'express';


const router = Router();





router.route('/scoreboard').post().get()
router.route('/scoreboard/:inningsId').get()
router.route('/scoreboard/').put()


export default router;



