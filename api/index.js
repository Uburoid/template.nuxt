(async () => {
    let { Node, Relation, Member, member2member } = require('./models/base_model');

    let schema = Member.schema;
    
    let some_data = {
        fake_fld: 'val',
        _id: ['23', '101', 99],
        uniq: 100,
        name: 'Peter The First',
        parent: [{
            $rel: {
                _id: 300,
                some_field: 'many data'
            },
            _id: '400',
            name: 'Ivan IV'
        },{
            $rel: {
                _id: 302
            },
            _id: '402',
            name: 'Ivan V'
        }],
        children: [
            {
                $rel: {
                    _id: 303
                },
                _id: '403',
                name: 'Volodya'
            },
            {
                $rel: {
                    _id: 304
                },
                _id: '404',
                name: 'Masha',
                children: {
                    $rel: {
                        _id: 501,
                        some_field: '555'
                    },
                    _id: '405',
                    name: 'Valya'
                }
            
            },
        ]
    }
    
    let validated = Member.validate(some_data, {
        use_defaults: true,
        convert_types: false
    });
    
    //let saved = await Member.save(some_data);
    let updated = await Member.update(some_data);
    let deleted = await Member.delete(some_data, { strict: true });
    let found = await Member.findOne(some_data);
    
    console.log(schema);
    
})();



const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');

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
const { loadDefaultKeyPair } = require('./jwt');

/* router.all('/_load_default_key_pair_', async (req, res) => {
    console.log('request _load_default_key_pair_');

    await loadDefaultKeyPair();

    res.end();
}); */

router.all('/_server_', async (req, res) => {
    console.log('request _server_');

    await loadDefaultKeyPair();

    res.end(code);
});

let patterns = ['/:type\.:action', '/:type'];

router.all(patterns, multipartDetector, async (req, res, next) => {

    let { type, action = 'get' } = req.params;

    let object = new Types[type]({ req, res });

    try {
        let result = await object[action](req.body);

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
    let error = {
        code: err.httpStatusCode || err.code || 400,
        message: err.message,
        name: err.name,
        stack: err.stack
    };
    
    res.status(error.code).json(error);
});

process.on('unhandledRejection', err => {
    console.log('unhandledRejection => ', err);
});

// Export the server middleware
export default {
    path: '/api',
    handler: router
}