const acl = [
    {
        class: '*',
        methods: '*',
        access_level: 0,
        action: (instance, resource) => {
            return 'allow';
        }
    },
    {
        class: '*',
        methods: 'set',
        access_level: 101,
        action: (instance, resource) => {
            return 'allow';
        }
    },
    {
        class: '*',
        methods: 'set',
        access_level: 100,
        action: (instance, resource) => {
            return instance.payload._id === resource.owner_id ? 'allow' : 'deny'
        }
    },
    {
        class: 'UI',
        methods: 'pageData',
        action: (instance, resource) => {
            let { access_level } = instance.payload;
            //debugger
            let { path } = resource;

            return access_level === 0 ? path !== '/inspire' ? 'allow' : 'deny' : 'allow';
        }
    }
];

module.exports = acl;