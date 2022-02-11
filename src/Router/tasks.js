const express = require("express");
const router = new express.Router();
const { Task } = require("../models/tasks");
const auth = require("../middleware/auth");

router.post("/tasks", auth, (req, res) => {
  req.body.owner = req.user._id;
  new Task(req.body).save()
    .then((result) => res.status(201).send(result))
    .catch((error) => res.status(400).send(error));
});

router.get("/tasks", auth, async (req, res) => {
    try {
        const sort = {}
        if (req.query.sort) {
            const parts = req.query.sort.split('_')
            if (parts[0] === 'completed') {sort[parts[0]] = parts[1] === 'desc' ? 1 : -1}
            else {sort[parts[0]] = parts[1] === 'desc' ? -1 : 1}
        }
        
        const page = req.query.page || 1
        const limit = req.query.limit || 10

        await req.user.populate({
            path : 'tasks',
            match : req.query.completed, // filter
            options : {
                limit : limit, // number of tasks in every page
                skip : (page - 1) * limit, // page number
                sort
            }
        })

        res.status(200).send(req.user.tasks)

    } catch (error) {
        res.status(500).send({error : 'something went wrong!'})
    }
    
});

router.get("/tasks/:id", auth ,async (req, res) => {
    try {
        const task = await Task.findOne({_id : req.params.id , owner : req.user._id})
        if (!task) return res.status(404).send()

        res.status(200).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
});

router.patch("/tasks/:id", auth, async (req, res) => {
    try {
        const updateTask = await Task.findOneAndUpdate({_id : req.params.id , owner : req.user._id})
        if (!updateTask) return res.status(404).send()
    
        res.status(200).send(updateTask)
    } catch (error) {res.status(404).send(error)}

});

router.delete("/tasks/:id", auth, (req, res) => {
    try {
        const task = Task.findOneAndDelete({_id : req.params.id , owner : req.user._id})
        if (!task) return res.status(404).send()

        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
});

module.exports = router;
