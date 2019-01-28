import { resolve, reject } from 'q';
import { readFileSync, writeFileSync } from 'fs';

(async () => {
    return
    /* const neo4j = require('neo4j-driver').v1;
    const driver = neo4j.driver('bolt://206.81.24.70:7687', neo4j.auth.basic("neo4j", "123"), {disableLosslessIntegers: true}); //WARNING: POSSIBLE NUMBER DATA LOSS!!!

    const fs = require('fs-extra');
    const path = require('path');
    const json5 = require('json5');

    const backup = path.join(process.cwd(), 'backup') + '/';
    const driver1 = neo4j.driver('bolt://104.248.92.115:7687', neo4j.auth.basic("neo4j", "123"), {disableLosslessIntegers: true}); //WARNING: POSSIBLE NUMBER DATA LOSS!!!
 */
    /* let nodes = fs.readFileSync(backup + 'nodes.json', { encoding: 'utf-8' });
    nodes = JSON.parse(nodes);

    nodes = nodes.reduce((memo, node) => {
        let { labels, ...rest } = node.n;
        labels = labels.map(label => '`' + label + '`');

        if(labels.length) {
            let cql = `MERGE (n${rest.sys_id}:${labels.join(':')} {sys_id: ${rest.sys_id}}) SET n${rest.sys_id} = $n${rest.sys_id}`;
            memo.params['n' + rest.sys_id] = rest;
            memo.cql.push(cql);
        }

        return memo;
    }, { cql: [], params: {}});

    let cql = nodes.cql.join('\n');

    let session = driver1.session();
        session
            .run(cql, nodes.params)
            .then(result => {
                result.records = result.records.map(record => {
                    let nodes = {};

                        for(let key of record.keys) {
                            let value = record.get(key);
                            nodes[key] = { ...value };
                        }

                        return nodes;
                });

                console.log(result.records);
                session.close();
            });

    console.log(nodes); */

    /* let nodes = fs.readFileSync(backup + 'relations.json', { encoding: 'utf-8' });
    nodes = JSON.parse(nodes);

    let b = 1
    nodes = nodes.reduce((memo, node, inx) => {

        let batch = 'b' + (inx % 50 === 0 ? b++ : b);
        let { type, ...rest } = node.r;

        if(type) {
            type = '`' + type + '`';

            let cql = `MATCH (a${node.a.sys_id} {sys_id:${node.a.sys_id}})\nMATCH (b${node.b.sys_id} {sys_id:${node.b.sys_id}})\nMERGE (a${node.a.sys_id})-[r${rest.sys_id}:${type}]->(b${node.b.sys_id}) SET r${rest.sys_id} = $r${rest.sys_id}\nWITH {} AS a`;
            memo.params['r' + rest.sys_id] = rest;
            memo.cql[batch] = memo.cql[batch] || [];
            memo.cql[batch].push(cql);
        }

        return memo;
    }, { cql: {}, params: {}});

    for(let key in nodes.cql) {
        let cql = nodes.cql[key];

        cql = cql.join('\n') + '\nRETURN *';

        await new Promise((resolve, reject) => {
            let session = driver1.session();
            session
                .run(cql, nodes.params)
                .then(result => {
                    result.records = result.records.map(record => {
                        let nodes = {};
    
                            for(let key of record.keys) {
                                let value = record.get(key);
                                nodes[key] = { ...value };
                            }
    
                            return nodes;
                    });
    
                    resolve(result.records);
                    session.close();
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                }
                );
        });

    } */
    

    /* let session = driver.session();
    session
        .run('MATCH (n) WHERE NOT "Metrics" IN LABELS(n) RETURN n {.*, sys_id: ID(n), labels: LABELS(n)}')
        .then(result => {
            result.records = result.records.map(record => {
                let nodes = {};

                    for(let key of record.keys) {
                        let value = record.get(key);
                        nodes[key] = { ...value };
                    }

                    return nodes;
            });

            fs.writeFileSync(backup + 'nodes.json', JSON.stringify(result.records), { encoding: 'utf-8' });

            console.log(result.records);
            session.close();
        });

        session = driver.session();
        session
            .run(`MATCH (a) WHERE NOT 'Metrics' IN LABELS(a)
                    MATCH (b) WHERE NOT 'Metrics' IN LABELS(b)
                    MATCH (a)-[r]->(b) 
                    RETURN a {sys_id: ID(a)},
                    r {.*, sys_id: ID(r), type: TYPE(r)},
                    b {sys_id: ID(b)}`)
            .then(result => {
                result.records = result.records.map(record => {
                    let nodes = {};
    
                        for(let key of record.keys) {
                            let value = record.get(key);
                            nodes[key] = { ...value };
                        }
    
                        return nodes;
                });
    
                fs.writeFileSync(backup + 'relations.json', JSON.stringify(result.records), { encoding: 'utf-8' });
    
                console.log(result.records);
                session.close();
            }) */

    //driver.query
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
    /* const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
    console.log('Express Server IP:', ip); */

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
const path = require('path');
const childProcess = require('child_process');
const shell = require('shelljs');

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

router.all('/reciever', async (req, res) => {
    console.log('request reciever');

    res.sendStatus(200);
});

router.all('/rebuild', async (req, res, next) => {
    console.log('rebuild hook');
    //console.log(`HOOK DETAILS: ${JSON.stringify(req.body, null, 2)}`);

    const { exec } = require('child_process');

    let workerProcess = exec('node ./api/cicd.js', { detached: true },  function(error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);
        }

        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
    });

    workerProcess.on('exit', function (code) {
        console.log('Child process exited with exit code ' + code);
    });

    /* new Promise((resolve, reject) => {
        try {

            let cd = shell.cd(process.cwd());
            console.log(`cd: ${cd}`);

            let stash = shell.exec('git stash');
            console.log(`pull: ${stash}`);

            let pull = shell.exec('git pull');
            console.log(`pull: ${pull}`);

            let npm = req.body.commits.some(commit => {
                return commit.modified.includes('package.json');
            });

            if(npm) {
                console.log(`npm operations strarting...`);

                let install = shell.exec('npm install');
                console.log(`install: ${install}`);
        
                let update = shell.exec('npm update');
                console.log(`update: ${update}`);
            }


            let update = shell.exec('npm run build');
            console.log(`update: ${update}`);

            let restart = shell.exec('pm2 restart all');
            console.log(`restart: ${restart}`);
            
            resolve('ok');
        }
        catch(err) {
            reject(err);
        }
    }) */

    /* try {
        let cd = shell.cd(process.cwd());
        console.log(`cd: ${cd}`);

        let stash = shell.exec('git stash');
        console.log(`pull: ${stash}`);

        let pull = shell.exec('git pull');
        console.log(`pull: ${pull}`);

        let cmd = shell.exec('mkdir cicd');
        console.log(`mkdir cicd: ${cmd}`);

        cmd = shell.exec('cp package.json cicd/package.json');
        console.log(`cp package.json cicd/package.json: ${cmd}`);

        cmd = shell.exec('cp .env.local cicd/.env.local');
        console.log(`cp .env.local cicd/.env.local: ${cmd}`);

        cmd = shell.exec('cp nuxt.config.js cicd/nuxt.config.js');
        console.log(`cp nuxt.config.js cicd/nuxt.config.js: ${cmd}`);

        let nuxt = readFileSync('./cicd/nuxt.config.js', { encoding: 'utf-8' });
        console.log(`read nuxt.config.js`);

        nuxt = nuxt.replace('srcDir: \'./\',', 'srcDir: \'../\',');

        writeFileSync('./cicd/nuxt.config.js', nuxt, { encoding: 'utf-8' });
        console.log(`write nuxt.config.js`);

        cmd = shell.cd(process.cwd() + '/cicd');
        console.log(`cd cicd: ${cmd}`);


        console.log(`npm operations strarting...`);

        let install = shell.exec('npm install');
        console.log(`install: ${install}`);

        let update = shell.exec('npm update');
        console.log(`update: ${update}`);

        
        cmd = shell.exec('npm run build');
        console.log(`npm run build: ${cmd}`);

        cmd = shell.exec('mv .nuxt ../.nuxt');
        console.log(`mv .nuxt ../.nuxt: ${cmd}`);

        cmd = shell.cd(process.cwd());
        console.log(`cd ..: ${cmd}`);

        cmd = shell.exec('rm -rf cicd');
        console.log(`rm -rf cicd: ${cmd}`);

        let restart = shell.exec('pm2 restart all');
        console.log(`restart: ${restart}`);
    }
    catch(err) {

        console.log(`ERROR: ${err}`);
    } */

    next();
    //res.sendStatus(200);
});

let patterns = ['/:type\.:action', '/:type'];

router.all(patterns, multipartDetector, async (req, res, next) => {

    let { type, action = 'get' } = req.params;

    let object = new Types[type.toLowerCase()]({ req, res });

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
    console.log(err);
    
    res.status(err.statusCode || 400).json(err);
});

process.on('unhandledRejection', err => {
    console.log('unhandledRejection => ', err);
});

// Export the server middleware
export default {
    path: '/api',
    handler: router
}