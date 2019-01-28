try {
    let cd = shell.cd(process.cwd());
    console.log(`cd: ${cd}`);


    //let stop = shell.exec('pm2 stop all');
    //console.log(`stop: ${stop}`);

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