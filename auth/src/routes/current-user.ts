import express from 'express';
import { currentuser } from '@averagecoders/common';

const router = express.Router()

router.get("/api/users/currentuser", currentuser, (req, res) => {

    res.send({currentUser: req.currentUser || null })
})

export { router as currentUserRouter };