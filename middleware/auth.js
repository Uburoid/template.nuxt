export default async ({ app, store, route, redirect, req, res }) => {
    
    let test = await app.$server.test.get(void 0, { cache: true });
    let member = await app.$server.account.signin({ email: 'mychrome51@gmail.com', password: '123' }, { cache: true });
    store.state.title = member.name
    //console.log(test);
}