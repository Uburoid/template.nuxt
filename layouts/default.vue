<template>
  <v-app>
    <drawer :show="drawer" @drawler="drawer = arguments[0]"/>
    
    <v-toolbar fixed app clipped-left clipped-right flat>
        <nuxt-link to="/">
            <img class="top-toolbar-logo" src="~assets/default_user.png" height="36">
        </nuxt-link>

        <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>

        <v-toolbar-title v-text="title"></v-toolbar-title>

        <v-spacer></v-spacer>

        <v-menu offset-x offset-y>
            <v-btn fab flat small slot="activator">
                <v-avatar size="36">
                    <img :alt="profile.name" :src="profile.photo">
                </v-avatar>
            </v-btn>

            <v-list class="pa-1" dense>
                <v-list-tile class="ma-2">
                
                    <v-list-tile-avatar size="36">
                        <img :src="profile.photo">
                    </v-list-tile-avatar>
                    
                    <v-list-tile-content>
                        <v-list-tile-title>{{ profile.name }}</v-list-tile-title>
                        <v-list-tile-sub-title v-if="user.email">{{ user.email }}</v-list-tile-sub-title>
                        <!-- <v-list-tile-sub-title v-if="user.role">{{ user.role }}</v-list-tile-sub-title> -->
                    </v-list-tile-content>
                
                </v-list-tile>

                <v-divider class="mb-1"/>

                <v-list-tile v-for="(item, index) in account_items" class="ma-0" 
                    :key="index" 
                    :to="item.to"
                    @click="item.click"
                >
                    <v-list-tile-avatar>
                        <v-icon small>{{ item.icon }}</v-icon>
                    </v-list-tile-avatar>
                
                    <v-list-tile-sub-title>{{ item.title }}</v-list-tile-sub-title>
                </v-list-tile>
            </v-list>
        </v-menu>

    </v-toolbar>

    <v-content>
        <v-container>
            <nuxt keep-alive/>
        </v-container>
    </v-content>

    
  </v-app>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        components: {
            drawer: () => import('@/components/drawler')
        },
        data: () => ({
            drawer: true,
            items: [
                {
                    access: 1000,
                    title: 'Users',
                    icon: 'fa-users',
                    to: '/account',
                    click: () => ({})
                },
                {
                    access: 100,
                    title: 'Account',
                    icon: 'fa-user',
                    to: '/account',
                    click: () => ({})
                },
                {
                    access: 100,
                    title: 'Sign out',
                    icon: 'fa-sign-out-alt',
                    to: '/signout',
                    click: () => ({})
                },
                {
                    access: 0,
                    title: 'Sign in',
                    icon: 'fa-sign-in-alt',
                    to: '/signin',
                    click: () => ({})
                },
                {
                    access: 0,
                    title: 'Sign up',
                    icon: 'fa-user-plus',
                    to: '/signup',
                    click: () => ({})
                }
            ],
            //title: 'Vuetify.js'
        }),
        computed: {
            account_items() {
                return this.items.reduce((memo, item) => {
                    this.account.access > 0 ? this.account.access >= item.access && item.access > 0 && memo.push(item) : item.access === 0 && memo.push(item);

                    return memo;
                }, []);
            },
            ...mapState({
                account: state => state.account,
                user: state => state.account.user,
                profile: state => state.account.user.profile,
                title: state => state.title
            })
        }
    }
</script>

<style scoped>
    .v-toolbar {
        border-bottom-width: 1px;
        border-bottom-color: var(--v-blueGrey-lighten3);
        border-bottom-style: solid;
    }
</style>
