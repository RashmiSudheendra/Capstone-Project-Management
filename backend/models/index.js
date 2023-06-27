// "serve": "nodemon server.js",
// "start": "node server.js",

// import { number, string } from "joi";
// import mongoose from "mongoose";
const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
// import validator from "validator";
const validator = require('validator')


const project = new mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    description: String,
    userId: ObjectId,
    task: [
        {
            id: Number,
            title: String,
            description: String,
            order: Number,
            stage: String,
            index: Number,
            attachment: [
                { type: String, url: String }
            ],
            created_at: { type: Date, default: Date.now },
            updated_at: { type: Date, default: Date.now },
        }
    ]
}, { timestamps: true })


const Project = mongoose.model('Project', project)
module.exports = { Project }

// export default mongoose.model('Project', project);