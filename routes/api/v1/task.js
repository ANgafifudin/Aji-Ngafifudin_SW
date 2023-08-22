const express = require('express');
const config = require(`${__config_dir}/app.config.json`);
const router = express.Router();
const helper = require(__class_dir + '/helper.class.js');
const m$task = require(__module_dir + '/task.module.js');
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return helper.sendErrorResponse(res, 'Unauthorized', 403);
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            return helper.sendErrorResponse(res, 'Unauthorized', 403);
        }
        req.userId = decoded.userId;
        next();
    });
}

router.post('/', verifyToken, async function (req, res, next) {
    const newTask = {
        items: req.body.items
    };

    newTask.userId = req.userId;

    const addTask = await m$task.add(newTask, req.userId);
    helper.sendResponse(res, addTask);
});

router.get('/', verifyToken, async function (req, res, next) {
    const tasks = await m$task.getAllByUserId(req.userId);
    helper.sendResponse(res, tasks);
});

router.get('/:id', verifyToken, async function (req, res, next) {
    const taskId = req.params.id;
    const task = await m$task.getById(taskId, req.userId);

    if (!task) {
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

    const updateResult = await m$task.update(updatedTask, req.userId);

    if (updateResult.success) {
        helper.sendResponse(res, updateResult.message);
    } else {
        helper.sendErrorResponse(res, updateResult.message, 400);
    }
});

router.delete('/:id', verifyToken, async function (req, res, next) {
    const taskId = req.params.id;
    const deleteResult = await m$task.remove(taskId, req.userId);

    if (deleteResult.success) {
        helper.sendResponse(res, deleteResult.message);
    } else {
        helper.sendErrorResponse(res, deleteResult.message, 400);
    }
});

module.exports = router;
