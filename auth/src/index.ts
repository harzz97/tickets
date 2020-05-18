import mongoose from 'mongoose'
import { app } from './app'
const PORT = 3000
const start = async() => {

    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex : true
        })
        console.log("Connected to mongoose")
    } catch(err) {
        console.log("Mongo error",err)
    }
    
}

app.listen(PORT, () => { console.log(`Auth Service listening on ${PORT} `) })

start()