
module.exports = function sentry (moduleOptions) {
  if (this.nuxt.hook) {
    /* this.nuxt.hook('render:errorMiddleware', app => app.use((err, req, res, next) => {
        debugger
        console.log('ERROR');
        next();
    })); */
  } else {
    this.nuxt.plugin('renderer', renderer => {
      debugger
      // Grab Nuxt's original error middleware and overwrite it with our own
      const nuxtErrorMiddleware = renderer.errorMiddleware
      renderer.errorMiddleware = (err, req, res, next) => {
        // Log the error
        debugger
        console.log('ERROR');

        // Call Nuxt's original error middleware
        nuxtErrorMiddleware.call(renderer, err, req, res, next)
      }
    })
  }
}