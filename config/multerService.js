'use strict';

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.orignalname);
    }
});

const upload = multer({
    dest: 'public',
    // storage: storage
});

module.exports = upload;