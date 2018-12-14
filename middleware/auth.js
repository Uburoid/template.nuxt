export default async ({ app, store, route, redirect }) => {

    let test = await app.$server.test.get(void 0, { cache: true });
    store.state.title = test
    //console.log(test);
}