const { ACL } = require('./ACL');

(async () => {
    let roles = [
        {
            name: 'Аноним',
            children: [
            ]
        },
        {
            name: 'Пользователь',
            children: [
                {
                    name: 'Администратор',
                    children: [
                        {
                            name: 'root'
                        }
                    ]
                },
                {
                    name: 'Автор',
                },
                {
                    name: 'Партнер',
                    children: [
                        {
                            name: 'Основатель'
                        }
                    ]
                }
            ]
        }
    ]
        
    const model = './model.conf';
    //const model = 'role = roleMatcher, class = regExpMatcher, methods = regExpMatcher, resource = resourceMatcher, token = regExpMatcher, ip = ipMatcher, $options={strict: true, priority: false}';

    const policy = './policy.csv';
    
    /* const policy = `
    allow,*,*,$data._id,{path:'/inspire', owner: { _id: '$data._id' }},*
    #allow,*,*,*,{path:'!/inspire'},*
    #deny,Аноним,*,pageData,{path:'!/inspire'},*
    deny,*,*,pageData,{path:'!/inspire'},invalid, !10
    allow,Пользователь,*,pageData,{path:'!/inspire'},*, !10
    #deny,Аноним,Account,signout,,*
    #deny,*,*,*,{path:'!/inspire'},invalid
    `; */

    const ipMatcher = (policy, value) => {
        return +policy === value
    }

    let acl = new ACL({ model, policy, roles }, { ipMatcher });

    let access_granted = acl.enforce({
        request: {
            role: 'Администратор',
            class: "UI", 
            methods: 'pageData',
            //methods: ['pageData'],
            resource: {
                path: '/home',
                //owner: { _id: 100 }
            },
            token: 'invalid',
            ip: 10
        },
        options: { strict: true, priority: false },
        data: {
            _id: 100
        }
    });

    console.log(access_granted);
})();

//49122a367a27d505-c0559a5494e9a742-246451fd3f9f5a3c
//738767838:AAGisCF0eTHfZ-SJiwUvoyB1mWFYesP0geM
