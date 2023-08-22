const express = require('express');
const router = express.Router();
const helper = require(__class_dir + '/helper.class.js');
const m$task = require(__module_dir + '/task.module.js');
const jwt = require('jsonwebtoken');  // Import jwt module

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return helper.sendErrorResponse(res, 'Unauthorized', 403);
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            return helper.sendErrorResponse(res, 'Unauthorized', 403);
        }
        req.userId = decoded.userId;  // Use userId from decoded JWT payload
        next();
    });
}

router.post('/', verifyToken, async function (req, res, next) {
    const newTask = {
        items: req.body.items
    };

    // Add userId to the new task object
    newTask.userId = req.userId;

    const addTask = await m$task.add(newTask);
    helper.sendResponse(res, addTask);
});

router.get('/', verifyToken, async function (req, res, next) {
    // Use userId from req.userId to fetch tasks specific to the user
    const tasks = await m$task.getAllByUserId(req.userId);
    helper.sendResponse(res, tasks);
});

router.get('/:id', verifyToken, async function (req, res, next) {
    const taskId = req.params.id;
    const task = await m$task.getById(taskId);

    if (!task || task.userId !== req.userId) {
        return helper.sendErrorResponse(res, 'Task not found', 404);
    }

    helper.sendResponse(res, task);
});

router.put('/:id', verifyToken, async function (req, res, next) {
    const taskId = req.params.id;
    const updatedTask = {
        id: taskId,
        items: req.body.items
    };

    const updateResult = await m$task.update(updatedTask);

    if (updateResult.success) {
        helper.sendResponse(res, updateResult.message);
    } else {
        helper.sendErrorResponse(res, updateResult.message, 400);
    }
});

router.delete('/:id', verifyToken, async function (req, res, next) {
    const taskId = req.params.id;
    const deleteResult = await m$task.remove(taskId);

    if (deleteResult.success) {
        helper.sendResponse(res, deleteResult.message);
    } else {
        helper.sendErrorResponse(res, deleteResult.message, 400);
    }
});

module.exports = router;
