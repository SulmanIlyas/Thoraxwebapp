
const uuidv4 = require('uuid/v4');

aws = require('aws-sdk'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    multerS3 = require('multer-s3');

aws.config.update({
    secretAccessKey: process.env.S3SECRET,
    accessKeyId: process.env.S3ID,
    region: 'eu-central-1'
});

var s3 = new aws.S3();

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        fileFilter: (req, file, cb) => {
            if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") { cb(null, true); }
            else {
                cb(null, false);
                return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
            }
        }, key: function (req, file, cb) {
            const { org } = req.token;
            const { _id } = req.params;
            const fileName = `${uuidv4()}${file.originalname.toLowerCase().split(' ').join('-')}`;
            if (file.fieldname !== 'organization')
                cb(null, `{fileName}`);
            else
                cb(null, `${fileName}`);
        }
    })
});

var uploadFile = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        fileFilter: (req, file, cb) => {
            if (file.mimetype == "any for now") { cb(null, true); } else {
                cb(null, false);
                return cb(new Error('Format not allowed!'));
            }
        },
        key: function (req, file, cb) {
            const { org } = req.token;
            const { _id } = req.params;
            const fileName = `${uuidv4()}${file.originalname.toLowerCase().split(' ').join('-')}`;
            cb(null, `${fileName}`);
        }
    })
});

module.exports = {
    uploadImage: upload,
    uploadFile: uploadFile
}
