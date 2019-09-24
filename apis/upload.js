const routes = require('express').Router();
const process = require('process');
const multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.cwd() + '/images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now().toString() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});
var upload = multer({ storage: storage });



routes.get('/:name', (req, res) => {
    res.sendFile(process.cwd() + '/images/' + req.params.name);
})

routes.post('/', upload.single('Image'), (req, res) => {
    res.send(req.file);
})

module.exports = routes;