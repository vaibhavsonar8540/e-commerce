const mongoose = require("mongoose")
require('dotenv').config()

async function connectToDb() {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(">>>> DB is Connected >>>>")
    } catch (error) {
        console.log("Error while connecting DB" , error)
    }
}


module.exports = connectToDb