const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, path.join(__dirname, '..', 'uploads'));
},
filename: function (req, file, cb) {
const ext = path.extname(file.originalname);
const name = file.fieldname + '-' + Date.now() + ext;
cb(null, name);
}
});


function fileFilter(req, file, cb) {
// accept image files
if (file.mimetype.startsWith('image/')) cb(null, true);
else cb(new Error('Invalid file type'), false);
}


const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });


module.exports = upload;