<template>
  <v-app>
    <drawer :show="drawer" @drawler="drawer = arguments[0]"/>
    
    <v-toolbar fixed app clipped-left clipped-right flat>
        <nuxt-link to="" @click.native="drawer = !drawer">
            <img class="top-toolbar-logo" src="~assets/2956ab668f2b82c.jpg" height="54">
        </nuxt-link>

        <!-- <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon> -->

        <v-toolbar-title v-text="title"></v-toolbar-title>

        <v-spacer></v-spacer>

        <v-menu offset-x offset-y>
            <v-btn fab flat small slot="activator">
                <v-avatar size="36">
                    <img :alt="profile.name" :src="profile.avatar">
                </v-avatar>
            </v-btn>

            <v-list class="pa-1" dense>
                <v-list-tile class="ma-2">
                
                    <v-list-tile-avatar size="36">
                        <img :src="profile.avatar">
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
        
            <nuxt keep-alive/>
        
    </v-content>

    
  </v-app>
</template>

<script>
    import { mapState } from 'vuex';
    let map_state = {
        title: state => state.title
    };

    export default {
        components: {
            drawer: () => import('@/components/drawler')
        },
        asyncData() {
            map_state = {
                title: state => state.title
            }
        },
        data: () => ({
            drawer: false,
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
                    title: 'Help',
                    icon: 'far fa-question-circle',
                    to: '/help',
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
            ]
            
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
                ...map_state
            })
        },
        methods: {
            async avatar() {
                return await this.$server.account.avatar();
            }
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
