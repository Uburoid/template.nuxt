


export default (context) => {
    debugger
    if (process.browser) {
        setTimeout(() => {
            context.store.dispatch('nuxtClientInit', context)
        }, 0);
    }
}