const multer = require('multer');
const uuidv4 = require('uuid/v4');
const fs = require('fs');

//MiddleWare To Upload Images
const DIR = './public/images';
const storageImage = multer.diskStorage({
    destination: (req, file, cb) => {
        var name = '';
        if (file.fieldname === 'user') name = req.params._id;
        else name = req.params._id;
        var newDestination = `${DIR}/${file.fieldname}/${name}`;
        newDestination = newDestination.replace(/\s/g, '');
        var stat = null;
        try { stat = fs.statSync(newDestination); }
        catch (err) { fs.mkdirSync(newDestination, { recursive: true }); }
        if (stat && !stat.isDirectory()) { throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"'); }
        cb(null, newDestination);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

const uploadImage = multer({
    storage: storageImage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") { cb(null, true); }
        else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});


//MiddleWare To Upload Files

const DIRF = './public/files';

const storageFile = multer.diskStorage({
    destination: (req, file, cb) => {
        var name = req.token.org;
        var newDestination = `${DIRF}/${file.fieldname}/${name}`;
        newDestination = newDestination.replace(/\s/g, '');
        var stat = null;
        try { stat = fs.statSync(newDestination); }
        catch (err) { fs.mkdirSync(newDestination, { recursive: true }); }
        if (stat && !stat.isDirectory()) { throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"'); }
        cb(null, newDestination);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

const uploadFile = multer({
    storage: storageFile,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "application/pdf" || file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.mimetype == "application/msword"
            || file.mimetype == "application/vnd.ms-excel" || file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.mimetype == "application/vnd.ms-powerpoint" || file.mimetype == "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ) {cb(null, true);} else {
            cb(null, false);
            return cb(new Error('Format not allowed!'));
        }
    }
});

module.exports = {
    uploadImage: uploadImage,
    uploadFile: uploadFile
}
