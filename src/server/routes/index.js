const express = require('express');
const Users = require("../users");
const path = require('path');
const settings = require('../settings');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.sendFile(path.join(settings.PUBLIC_PATH, 'index.html'));
});

/* GET users. */
router.get('/users', function(req, res) {
    res.json(JSON.stringify(Users.users));
});

module.exports = router;
