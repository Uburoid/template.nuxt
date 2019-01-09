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
    }
];

module.exports = acl;