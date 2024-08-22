import {Router} from 'express';

const router = Router();

router.route('/innings').post().get()
router.route('innings/:matchId').get()