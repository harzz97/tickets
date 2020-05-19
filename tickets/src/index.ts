import mongoose from 'mongoose'
import { app } from './app'
const PORT = 3000
const start = async() => {

    if(!process.env.MONGO_URI) {
        throw new Error("MONGO_URI should be defined")
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex : true
        })
        console.log("Tickets connected to mongoose")
    } catch(err) {
        console.log("Mongo error",err)
    }
    
}

app.listen(PORT, () => { console.log(`Tickets Service listening on ${PORT} `) })

start()