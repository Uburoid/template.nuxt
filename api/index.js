import express from 'express'
const cookieParser = require('cookie-parser');

//import jwt from 'express-jwt'
//import jsonwebtoken from 'jsonwebtoken'

//import axios from 'axios';

// Create express router
const router = express.Router();

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
const app = express();

router.use(express.json());
router.use(cookieParser());

router.use((req, res, next) => {
    Object.setPrototypeOf(req, app.request);
    Object.setPrototypeOf(res, app.response);

    req.res = res;
    res.req = req;

    next();
});

///////////////////////////////////////////////////////////////////////////////////////

//TODO: SET LIMITS!!!
const Busboy = require('busboy');

const MemoryStream = require('memorystream');

let multipartDetector = function(req, res, next) {
    if(req.headers['content-type'] && req.headers['content-type'].indexOf('multipart/form-data') !== -1) {

        let busboy = new Busboy({ headers: req.headers });
    
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

            let memStream = new MemoryStream();

            file.on('data', function(data) {
                console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
            });

            file.on('end', function(...args) {
                console.log('File [' + fieldname + '] Finished', args);
                req.body['files'] = req.body['files'] || {};
                req.body.files[fieldname] = {
                    filename,
                    encoding, 
                    mimetype,
                    stream: memStream
                }
            });

            file.pipe(memStream);
        });

        busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            console.log('Field [' + fieldname + ']: value: ' + val, fieldnameTruncated, valTruncated, encoding, mimetype);
            req.body[fieldname] = val;
        });
    
        busboy.on('finish', function() {
            console.log('Done parsing form!');

            next();
        });
    
        req.pipe(busboy);

    }
    else next();
};

///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////////////

const { Types, code } = require('./classes');

router.all('/_server_', (req, res) => {
    console.log('request');

    res.end(code);
})

let patterns = ['/:type\.:action', '/:type'];

router.all(patterns, multipartDetector, async (req, res, next) => {

    let { type, action = 'get' } = req.params;

    let object = new Types[type]({ req, res });

    try {
        let result = await object[action](req.body, { req, res });

        if(result) {
            result.$sendAsFile ? res.sendFile(result.file) : res.json(result);
        }
        else res.json({status: `${type}.${action} executed with empty result`});
    }
    catch(err) {
        next(err);
    }
})

router.use((err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
            res.status(401).send('invalid token...');
        }
        else {        
            let error = {
                code: err.httpStatusCode || err.code || 400,
                message: err.message,
                stack: err.stack
            };
            
            //res.status(err.httpStatusCode || err.code || 400).json(err);
            res.status(error.code).json(error);
        }
    }
);

process.on('unhandledRejection', err => {
    console.log('unhandledRejection => ', err);
});

// Export the server middleware
export default {
    path: '/api',
    handler: router
}