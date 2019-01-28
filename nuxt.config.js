require('dotenv').config({
    path: '.env.local'
});

module.exports = {
    //srcDir: './',
    //mode: 'spa',
    //modern: 'server',
    /* vue: {
        config: {
            errorHandler: (err, vm, info) => {
                debugger

                err.component = 'error-dialog';
                vm.$error && vm.$error(err, info);
                
                //return false;
                return !!vm.$error;
            }
        }
    }, */

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
        '@/assets/custom.css',
        'codemirror/lib/codemirror.css',
        // merge css
        //'codemirror/addon/merge/merge.css'
        // theme css
        //'codemirror/theme/base16-dark.css'
    ],

    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        '@/plugins/clientInit',
        '@/plugins/error-handler',
        '@/plugins/vuetify',
        '@/plugins/axios',
        '@/plugins/server',
        { ssr: false, src: '@/plugins/codemirror/codemirror'}
        //'@/plugins/eventbus',
        //'@/plugins/croppa',
        //'@/plugins/utils',
        //'@/plugins/beforeEach', //not correct work in nuxt
    ],

    /*
    ** Nuxt.js modules
    */
    modules: [
        //'@/modules/nuxt-error',
        'cookie-universal-nuxt',
        //'@/modules/error-handler',
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
        analyze: false,
        extend (config, { isDev, isClient }) {
            process.on('unhandledRejection', err => {
                debugger
                console.log('unhandledRejection => ', err);
            });
            //debugger
            isDev && isClient && (config.devtool = 'eval-source-map');
            
            config.node = { __dirname: true };
        },
        optimization: {
            minimize: true,
            splitChunks: {
                chunks: 'all',
                automaticNameDelimiter: '.',
                name: true,
                cacheGroups: {},
                minSize: 50000,
                maxSize: 50000
            }
          },
          maxChunkSize: 50000,
          
          parallel: true,

    },
    
    extractCSS: true,

    serverMiddleware: [
        '~/api'
    ],

    router: {
        middleware: ['on-page'],
        extendRoutes (routes, resolve) {
            /* routes.push({
                //name: 'custom',
                path: '*',
                component: resolve(__dirname, 'pages/404.vue')
            }); */

            /* debugger
            routes.splice(0, 1);
            routes = routes.map(route => {
                route.beforeEnter = (to, from, next) => {
                    debugger
                    console.log(to, from, this);
                    next();
                };

                return route;
            });
            routes.push({
                //name: 'custom',
                path: '*',
                component: resolve(__dirname, 'pages/404.vue'),
                beforeEnter: (to, from, next) => {
                    debugger
                    console.log(to, from, this);
                    next();
                }
            }); */
        }
    } 
}
