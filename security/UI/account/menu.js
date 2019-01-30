let items = [
    {
        title: 'ACL',
        icon: 'fa-lock',
        description: 'Access contlol lists',
        
        items: [
            {
                title: 'API',
                icon: 'fa-language',
                to: '/ACL/api',
            },
            {
                title: 'UI',
                icon: 'fa-language',
                to: '/ACL/ui',
            }
        ]
    },
    {
        title: 'users',
        icon: 'fa-users',
        to: '/users',
    },
    { divider: true, inset: false, to: '/users' },
    {
        title: 'account',
        icon: 'fa-user',
        to: '/account',
    },
    {
        title: 'help',
        icon: 'far fa-question-circle',
        to: '/help',
        description: 'Help page for $server functions'
    },
    { divider: true, inset: false, to: '/help' },
    {
        title: 'sign up',
        icon: 'fa-user-plus',
        to: '/signup',
    },
    { divider: true, inset: false, to: '/signup' },
    {
        title: 'sign in',
        icon: 'fa-sign-in-alt',
        to: '/signin',
    },
    {
        title: 'sign out',
        icon: 'fa-sign-out-alt',
        to: '/signout',
    },
]

module.exports = items;