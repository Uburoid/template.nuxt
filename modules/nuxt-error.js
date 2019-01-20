const path = require('path')

module.exports = function sentry (moduleOptions) {
    debugger
    this.addPlugin({
        src: path.resolve(__dirname, 'error-plugin.js'),
        fileName: 'sentry-client.js',
        ssr: false,
        options: { hello: 'world' }
    })

  // Initialize the hooks
    /* if (this.nuxt.hook) {
        this.nuxt.hook('render:errorMiddleware', app => app.use((err, req, res, next) => {
            debugger
            this.nuxt
            next('/qweqweqwe');
        }));

        this.nuxt.hook('generate:routeFailed', ({ route, errors }) => {
            debugger
        })
    } 
    else {
        // This is for backwards compatibility (NuxtJS pre-hooks)
        this.nuxt.plugin('renderer', renderer => {

            // Grab Nuxt's original error middleware and overwrite it with our own
            const nuxtErrorMiddleware = renderer.errorMiddleware
            renderer.errorMiddleware = (err, req, res, next) => {
                // Log the error
                debugger
                // Call Nuxt's original error middleware
                nuxtErrorMiddleware.call(renderer, err, req, res, next)
            }
        })
    } */
}