import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// This interface to make tyescript understand the user payload 
interface Userpayload {
    id: string,
    email: string
}

// This segement to create custom object inside request class
declare global {
    namespace Express {
        interface Request {
            currentUser: Userpayload
        }
    }
}

export const currentuser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (!req.session?.jwt) {
        return next()
    }

    try {
        const payload = jwt.verify(req.session.jwt, "customkey") as Userpayload
        req.currentUser = payload
    } catch (err) {
        next()
    }
    next()

}