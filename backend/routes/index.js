var express = require('express');
const mongoose = require('mongoose')
const joi = require('joi');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid')
const { Project } = require('.././models/index.js');
const { userModel } = require('.././models/user.js');
const { verifiedUserModel } = require('../models/verifiedUser.js')
const { hashPassword, hashCompare, createToken, decodeToken } = require('./../Auth/auth.js');
const { Db } = require('mongodb');
const api = express.Router()

require("dotenv").config();


//node-emailer

let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD,
    },
})

const sendMail = async (transporter, mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        // console.log('Mail sent successfully')
    } catch (error) {
        console.log(error)
    }
}

// creating user details before verification which will be deleted after 3 mins
api.post('/unverifiedAccounts', async (req, res) => {
    try {
        let x = Math.floor((Math.random() * 1000000));
        req.body.email = req.body.email.toLowerCase()
        let user = await userModel.findOne({ email: req.body.email })
        // console.log(user)
        if (!user) {
            req.body.email = req.body.email.toLowerCase()
            const mailOptions = {
                from: {
                    name: 'Project-Management',
                    address: process.env.USER
                }, // sender address
                to: req.body.email, // list of receivers
                subject: "Verify your Email", // Subject line
                html: `<p>Verify you email to complete the registration to project-Management website</p><p><strong>Please note the code the valid only for 3 minutes</strong><p>Verification Code : <strong>${x}</strong></p>`, // html body
            }
            sendMail(transporter, mailOptions)
            console.log('Email Sent')
            req.body.password = await hashPassword(req.body.password)
            req.body.verificationCode = x
            await userModel.create(req.body)
            res.status(200).send({ message: 'User details successfully created' })
        }
        else {
            res.status(400).send({ message: `User with ${req.body.email} already exists` })
        }
    }
    catch (error) {
        // console.log(error)
        res.status(500).send({ message: "Internal Server Error", error })
    }
});

//verified user accounts creation
api.post('/signup', async (req, res) => {
    try {
        req.body.email = req.body.email.toLowerCase()
        let user = await userModel.findOne({ email: req.body.email })
        console.log(user)
        if (user) {
            req.body.email = req.body.email.toLowerCase()
            // console.log(req.body.email)
            // req.verified = false
            console.log(user.verificationCode)
            console.log(req.body.verifiedCode)
            if (user.verificationCode === req.body.verifiedCode) {
                req.body.verified = true
                req.body.password = await hashPassword(req.body.password)
                await verifiedUserModel.create(req.body)
                res.status(200).send({ message: 'User details successfully created' })
            }
        }
        else {
            res.status(400).send({ message: `User with ${req.body.email} already exists` })
        }
    }
    catch (error) {
        // console.log(error)
        res.status(500).send({ message: "Internal Server Error", error })
    }
});


//user login
api.post('/login', async (req, res) => {
    // console.log(`called`)
    try {
        req.body.email = req.body.email.toLowerCase()
        let user = await verifiedUserModel.findOne({ email: req.body.email })
        // console.log(user)
        if (user) {
            if (await hashCompare(req.body.password, user.password)) {
                //creating a token
                let token = await createToken({
                    name: user.name,
                    email: user.email,
                    id: user._id
                })
                console
                res.status(200).send({ message: 'login successfully', token })
            }
            else {
                res.status(400).send({ message: `Enter vaild credentials` })
            }
        }
    }
    catch (error) {
        // console.log(error)
        res.status(500).send({ message: "Internal Server Error", error })
    }
})


//get all projects
api.get('/projects', async (req, res) => {
    try {
        const data = await Project.find({}, { task: 0, __v: 0, updatedAt: 0 })
        return res.send(data)
    } catch (error) {
        return res.send(error)
    }
})

// Get project by ID
api.get('/project/:id', async (req, res) => {
    if (!req.params.id) res.status(422).send({ data: { error: true, message: 'Id is reaquire' } })
    try {
        const data = await Project.find({ _id: mongoose.Types.ObjectId(req.params.id) }).sort({ order: 1 })
        return res.send(data)
    } catch (error) {
        return res.send(error)
    }
})

// Add project
api.post('/project', decodeToken, async (req, res) => {

    // validate type 
    const project = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
        userId: joi.string().hex().length(24),
    })

    // validation
    const { error, value } = project.validate({ title: req.body.title, description: req.body.description, userId: req.user_data.id });
    if (error) return res.status(422).send(error)


    // insert data 
    try {
        const data = await new Project(value).save()
        // res.send(data)
        res.send({ data: { title: data.title, description: data.description, updatedAt: data.updatedAt, _id: data._id, userId: data.userId } })

    } catch (e) {
        console.log(e)
        res.status(500).send(e)
        if (e.code === 11000) {
            return res.status(422).send({ data: { error: true, message: 'title must be unique' } })
        } else {
            return res.status(500).send({ data: { error: true, message: 'server error' } })
        }
    }


})

// Edit project
api.put('/project/:id', async (req, res) => {
    // validate type 
    const project = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    })

    // // validation
    const { error, value } = project.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error)

    Project.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { ...value }, { upsert: true }, (error, data) => {
        if (error) {
            res.send(error)
        } else {
            res.send(data)
        }
    })


})

// Delete project
api.delete('/project/:id', async (req, res) => {
    try {
        const data = await Project.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) })
        res.send(data)
    } catch (error) {
        res.send(error)
    }

})


//  task api   
api.post('/project/:id/task', async (req, res) => {


    if (!req.params.id) return res.status(500).send(`server error`);

    // validate type 
    const task = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    })

    const { error, value } = task.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error)

    try {
        // const task = await Project.find({ _id: mongoose.Types.ObjectId(req.params.id) }, { "task.index": 1 })
        const [{ task }] = await Project.find({ _id: mongoose.Types.ObjectId(req.params.id) }, { "task.index": 1 }).sort({ 'task.index': 1 })


        let countTaskLength = [task.length, task.length > 0 ? Math.max(...task.map(o => o.index)) : task.length];

        const data = await Project.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $push: { task: { ...value, stage: "Requested", order: countTaskLength[0], index: countTaskLength[1] + 1 } } })
        return res.send(data)
    } catch (error) {
        return res.status(500).send(error)
    }
})

//Get all task
api.get('/project/:id/task/:taskId', async (req, res) => {

    if (!req.params.id || !req.params.taskId) return res.status(500).send(`server error`);

    // res.send(req.params)
    try {

        let data = await Project.find(
            { _id: mongoose.Types.ObjectId(req.params.id) },
            {
                task: {
                    $filter: {
                        input: "$task",
                        as: "task",
                        cond: {
                            $in: [
                                "$$task._id",
                                [
                                    mongoose.Types.ObjectId(req.params.taskId)
                                ]
                            ]
                        }
                    }
                }
            })
        if (data[0].task.length < 1) return res.status(404).send({ error: true, message: 'record not found' })
        return res.send(data)
    } catch (error) {
        return res.status(5000).send(error)
    }


})

//Edit the task by id
api.put('/project/:id/task/:taskId', async (req, res) => {

    if (!req.params.id || !req.params.taskId) return res.status(500).send(`server error`);

    const task = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    })

    const { error, value } = task.validate({ title: req.body.title, description: req.body.description });
    if (error) return res.status(422).send(error)

    try {
        // const data = await Project.find({ $and: [{ _id: mongoose.Types.ObjectId(req.params.id) }, { "task._id": mongoose.Types.ObjectId(req.params.taskId) }] },{
        //     task: {
        //         $filter: {
        //             input: "$task",
        //             as: "task",
        //             cond: {
        //                 $in: [
        //                     "$$task._id",
        //                     [
        //                         mongoose.Types.ObjectId(req.params.taskId)
        //                     ]
        //                 ]
        //             }
        //         }
        //     }
        // })
        const data = await Project.updateOne({
            _id: mongoose.Types.ObjectId(req.params.id),
            task: { $elemMatch: { _id: mongoose.Types.ObjectId(req.params.taskId) } }
        }, { $set: { "task.$.title": value.title, "task.$.description": value.description } })
        return res.send(data)
    } catch (error) {
        return res.send(error)
    }

})


// Delete the task by id
api.delete('/project/:id/task/:taskId', async (req, res) => {

    if (!req.params.id || !req.params.taskId) return res.status(500).send(`server error`);

    try {
        const data = await Project.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $pull: { task: { _id: mongoose.Types.ObjectId(req.params.taskId) } } })
        return res.send(data)
    } catch (error) {
        return res.send(error)
    }

})


api.put('/project/:id/todo', async (req, res) => {
    let todo = []

    for (const key in req.body) {
        // todo.push({ items: req.body[key].items, name: req.body[key]?.name })
        for (const index in req.body[key].items) {
            req.body[key].items[index].stage = req.body[key].name
            todo.push({ name: req.body[key].items[index]._id, stage: req.body[key].items[index].stage, order: index })
        }
    }

    todo.map(async (item) => {
        await Project.updateOne({
            _id: mongoose.Types.ObjectId(req.params.id),
            task: { $elemMatch: { _id: mongoose.Types.ObjectId(item.name) } }
        }, { $set: { "task.$.order": item.order, "task.$.stage": item.stage } })
    })

    res.send(todo)
})



module.exports = api;