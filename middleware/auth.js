export default async ({ app, store, route, redirect, req, res }) => {
    
    let test = await app.$server.test.get(void 0, { cache: true });
    let meme = await app.$server.auth.signin({ email: 'admin@atlant.club', password: 'two' }, { cache: true });
    store.state.title = meme.referals[0].name
    //console.log(test);
}