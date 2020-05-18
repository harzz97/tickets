import { CustomError } from "./CustomError";

export class NotAuthorized extends CustomError {
    constructor() {
        super('Not Authorized')
        Object.setPrototypeOf(this, NotAuthorized.prototype)
    }
    statusCode = 401
    serializeErrors() {
        return [{ message: 'Not Authorized' }]
    }
}