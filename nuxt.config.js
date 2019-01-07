require('dotenv').config({
    path: '.env.local'
});

module.exports = {
    //mode: 'spa',

    server: {
        host: process.env.NUXT_HOST,
        port: process.env.NUXT_PORT
    },

    env: {
        baseURL: `${process.env.API_PROTOCOL || 'http'}://${process.env.API_HOST || 'localhost'}${process.env.API_PORT ? ':' + process.env.API_PORT : ''}${process.env.API_SUFFIX}`,
        //externalURL: process.env.EXTERNAL_API,
        server: {
            //externalURL: process.env.EXTERNAL_API,
        }
    },

    /*
    ** Headers of the page
    */
    head: {
        title: 'pkg.name',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'pkg.description' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto+Condensed:300,400,500,700|Material+Icons' },
            //{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
            { rel: 'stylesheet', href: "https://use.fontawesome.com/releases/v5.3.1/css/all.css", integrity: "sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU", crossorigin: "anonymous" },
        ]
    },

    /*
    ** Customize the progress-bar color
    */
    //loading: false,
    loading: './components/loading.vue',

    /*
    ** Global CSS
    */
    css: [
        '@/assets/custom.css'
    ],

    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        '@/plugins/vuetify',
        '@/plugins/axios',
        '@/plugins/server',
        //'@/plugins/eventbus',
        //'@/plugins/croppa',
        //'@/plugins/utils',
        //'@/plugins/beforeEach', //not correct work in nuxt
    ],

    /*
    ** Nuxt.js modules
    */
    modules: [
        //'@nuxtjs/localtunnel'
        //'@nuxtjs/separate-env',
        //'cookie-universal-nuxt'
    ],

    /*
    ** Build configuration
    */
    build: {
        /*
        ** You can extend webpack config here
        */
        //vendor: ['axios', 'vuetify'], //depricated

        extend (config, { isDev, isClient }) {
            isDev && isClient && (config.devtool = 'eval-source-map');
        }
    },

    serverMiddleware: [
        '~/api'
    ],

    router: {
        middleware: ['auth']
    }
}
