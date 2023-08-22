const express = require('express');
const router = express.Router();
const auth = require(__module_dir + '/auth.module.js');
const helper = require(__class_dir + '/helper.class.js');

router.post('/register', async (req, res) => {
    const registerResult = await auth.register(req.body);
    helper.sendResponse(res, registerResult);
});

router.post('/login', async (req, res) => {
    const loginResult = await auth.login(req.body);
    helper.sendResponse(res, loginResult);
});

module.exports = router;
