'use strict';

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/[-T:\.Z]/g, "") + file.originalname);
    }
});

const upload = multer({
    storage: storage
});

module.exports = upload;