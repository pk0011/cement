const express = require('express');
const app = express();
const router = express.Router();
const multer = require("multer");
const path = require("path");

// storage engine 

console.log('hello');
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `blah.png`)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100000
    }
})
// router.use('/profile', express.static('upload/images'));
router.post("/upload", upload.single('profile'), (req, res) => {
    console.log('pk');
    res.json({
        success: 1
    })
})

function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: 0,
            message: err.message
        })
    }
}
router.use(errHandler);

module.exports = router;