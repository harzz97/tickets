import mongoose from 'mongoose'
import { app } from './app'
const PORT = 3000
const start = async() => {
    
    if(!process.env.MONGO_URI){
        throw new Error("AUTH MONGO URI not defined")
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex : true
        })
        console.log("Auth connected to mongoose")
    } catch(err) {
        console.log("Mongo error",err)
    }
    
}

app.listen(PORT, () => { console.log(`Auth Service listening on ${PORT} `) })

start()