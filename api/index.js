(async () => {
    return
    let { Relation } = require('./models/base_model');
    let models = require('./models');
    
    const { schema: Schema, normalize } = require('normalizr');
    let found;

    let role = await models.Role.find({
        name: 'Пользователь'
    });

    found = await models.Member.find({
        role: true
    });
    /* for(let m of found) {
        m.role = role
        m = await models.Account.save(m);    
    } */

    console.log(found);
    return
    //found = await models.RootMember.find();
    found = await models.Member.find({
        referals: {
            $rel: {
                $length: '*'
            },
            email: {
                verified: false,
                //$selector: 'OPTIONAL MATCH'
            },
            
            /* $aggregation: {
                type: 'count',
                field: 'updated'
            } */
        },
        referer: {
            /* $rel: {
                $length: '*..1'
            }, */
            $selector: 'OPTIONAL MATCH'
        },
        //$selector: 'OPTIONAL MATCH'
    });

    //found = await models.RootList.save(found);

    /* found.members.sort((a, b) => a.$rel.номер - b.$rel.номер);
    let new_list = found.members.shift();
    found.members.push(new_list);
    
    let members = found.members.map((member, inx) => {
        member.$rel.номер = inx + 1;

        return member;
    });

    let updated = await models.List.save({
        member: members[0],
        members
    });

    let to_delete = {
        _id: updated._id
    }

    let deleted = await models.List.delete(to_delete, { keys: 'strict' }); */

    /* found = await models.referal.find();

    found = await models.Email.find({
        //address: 'wonderwoman@atlant.club',
        address: ['mychrome51@gmail.com', 'wonderwoman@atlant.club'],
        //address: '~mychrome51.*',
        member: {
            
            list: {
                members: {
                    $rel: {
                        номер: [1, 7]
                    },
                    email: true
                }
            },
            wallet: {
                member: true
            },
            referer: {
                email: true,
                referals: true
            }
        }
    });

    found = await models.List.find({
        members: true,
        member: true
    });

    found = await models.Club.findOne();

    //found.pin = Date.now();

    //found = models.Email.omitRelations(found);

    let updated = await models.Club.save(found); */

    console.log(found);

    //let schema = Member.schema;
    
    /* let some_data = {
        fake_fld: 'val',
        _id: ['23', '101', 99],
        uniq: 100,
        name: 'Peter The First',
        parent: [{
            $rel: {
                _id: '300',
                some_field: 'many data'
            },
            _id: '400',
            name: 'Ivan IV'
        },{
            $rel: {
                _id: '302'
            },
            _id: '402',
            name: 'Ivan V'
        }],
        children: [
            {
                $rel: {
                    _id: '303'
                },
                _id: '403',
                name: 'Volodya'
            },
            {
                $rel: {
                    _id: '304'
                },
                _id: '404',
                name: 'Masha',
                children: {
                    $rel: {
                        _id: '501',
                        some_field: '555'
                    },
                    _id: '405',
                    name: 'Valya'
                }
            
            },
        ]
    }

    let some_data1 = {
        fake_fld: 'val',
        _id: ['23', '101', 99],
        uniq: 100,
        name: 'Peter The First',
        parent: true,
        children: {
            children: {
                parent: true
            },
            parent: true
        }
    }

    let some_data2 = {
        parent: true,
        children: {
            children: true,
            parent: true
        }
    }
    
    let validated = models.Member.validate(some_data, {
        use_defaults: true,
        convert_types: true
    }); */
    
    /* let schema = new Schema.Entity(models.Email.name, {}, { idAttribute: '_id' });
    Object.entries(models.Email.schema).forEach(entry => {
        let [key, value] = entry;

        typeof(value) !== 'object' && (value = { type: value });

        Array.isArray(value) && (value = { type: value });

        let { type = String } = value;
        
        let isArray = Array.isArray(type);
        type = isArray ? type[0] : type;

        if(type.prototype instanceof Relation) {
            let type_name = type.schema.$end.type ? type.schema.$end.type.name : type.schema.$end.name;
            let node = new Schema.Entity(type_name, {}, { idAttribute: '_id' });
            let relation = new Schema.Entity(type.name, {}, { idAttribute: '_id' });

            node.define({
                $rel: relation
            })

            schema.define({ 
                [key]: isArray ? [node] : node
            });
        }

    }); */

    //let schema = models.Email.normalize_schema();
    let schema = models.Member.normalize_schema();

    let _database = new Schema.Entity('database', {
        data: [schema]
    }, { idAttribute: 'v' });

    let database = {
        data: Array.isArray(found) ? found : [found],
        v: 1.0
    }

    let norm = normalize(database, _database);

    //let saved = await Member.save(some_data);
    //let updated = await Member.update(some_data2);
    //let deleted = await Member.delete(some_data2, { keys: 'any' });
    //let found = await Member.find(some_data1);
    
    console.log(norm);
    
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
});

router.use((err, req, res, next) => {
    /* let error = {
        statusCode: err.httpStatusCode || err.code || 400,
        message: err.message,
        name: err.name,
        stack: err.stack
    };
    
    res.status(error.statusCode).json(error); */
    res.status(err.statusCode).json(err);
});

process.on('unhandledRejection', err => {
    console.log('unhandledRejection => ', err);
});

// Export the server middleware
export default {
    path: '/api',
    handler: router
}