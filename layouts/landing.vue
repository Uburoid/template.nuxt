<template>
    <v-app>
        
        
        <!-- <drawer :show="settings.drawer" @drawer="$store.commit('SET_SETTINGS', { drawer: arguments[0] })"/> -->
    
        <v-toolbar dense fixed app clipped-left clipped-right flat style="z-index: 7">
            <nuxt-link to="" @click.native="left_drawer = !left_drawer">
                <v-avatar size="34">
                    <img class="top-toolbar-logo" src="~assets/Army_of_Russia.svg">
                </v-avatar>
            </nuxt-link>
            <!-- <v-btn fab flat small slot="activator">
                <v-avatar size="30">
                    <img class="top-toolbar-logo" src="~assets/Army_of_Russia.svg">
                </v-avatar>
            </v-btn> -->

            <!-- <drawer :show.sync="settings.drawer"/> -->

            <!-- <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon> -->

            <v-toolbar-title v-text="title"></v-toolbar-title>

            <v-spacer></v-spacer>

            <nuxt-link to="" @click.native="right_drawer = !right_drawer">
                <!-- <img :alt="profile.name" :src="profile.avatar" height="34"> -->
                <v-avatar size="34">
                    <img :alt="profile.name" :src="profile.avatar">
                </v-avatar>
            </nuxt-link>

            <!-- <account-menu/> -->
            <!-- <v-menu offset-x offset-y>
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
            </v-menu> -->

        </v-toolbar>

        <drawer :visible.sync="left_drawer"/>
        <account-menu :visible.sync="right_drawer"/>

        <v-content>
            <!-- {{ !$store.state.error }} -->
            <!-- <component v-if="error" :is="error.component"/> -->
            <error v-if="error"/>

            <div v-show="!error || (error && error.dialog)" style="height:100%">
                <nuxt style="height:100%" keep-alive/>
            </div>
            
        </v-content>

        
    </v-app>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';

    export default {
        components: {
            drawer: () => import('@/components/drawer'),
            error:  () => import('@/components/errors/error'),
            accountMenu: () => import('@/components/menu'),
            //errorDialog:  () => import('@/components/errors/error-dialog'),
        },
        asyncData(ctx) {
            debugger
        },
        data: (vm) => {

            return {
                left_drawer: false,
                right_drawer: false
            };
        },
        created() {
            //throw new Error('default');

            if(process.browser) {
                /* let settings = localStorage.getItem('settings');
                settings = settings ? JSON.parse(settings) : {};
                
                this.$store.commit('SET_SETTINGS', settings); */

                //debugger
                /* const cookie = document.cookie && document.cookie.split(',').reduce((memo, cookie) => {
                    let [key, value] = cookie.split('=');
                    memo[key] = decodeURIComponent(value);

                    return memo;
                }, {}); */
                

                /* const page_with_error = this.getCookie('page-with-error');

                page_with_error && this.$store.commit('SET_PAGE_WITH_ERROR', JSON.parse(page_with_error));

                this.deleteCookie('page-with-error'); */
            }
        },
        computed: {
            /* account_items() {
                return this.items.reduce((memo, item) => {
                    this.account.access > 0 ? this.account.access >= item.access && item.access > 0 && memo.push(item) : item.access === 0 && memo.push(item);

                    return memo;
                }, []);
            }, */
            /* settings() {
                debugger
                if(process.browser && localStorage) {
                    let settings = localStorage.getItem('settings');
                    settings = settings ? JSON.parse(settings) : this.$store.state.settings;
        
                    return settings;
                }
        
                return this.$store.state.settings;
            }, */
            ...mapGetters([
                'settings'
            ]),
            ...mapState({
                account: state => state.account,
                user: state => state.account.user,
                profile: state => state.account.user.profile,
                title: state => state.title,
                error: state => {
                    return state.error && state.error.display && state.error;
                },
                settings: state => state.settings
            })
        },
        methods: {
            getCookie(name) {
                var matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));

                return matches ? decodeURIComponent(matches[1]) : void 0;
            },
            setCookie(name, value, options) {
                options = options || {};

                let expires = options.expires;

                if (typeof expires == "number" && expires) {
                    let d = new Date();

                    d.setTime(d.getTime() + expires * 1000);
                    expires = options.expires = d;
                }
                if (expires && expires.toUTCString) {
                    options.expires = expires.toUTCString();
                }

                value = encodeURIComponent(value);

                let updatedCookie = name + "=" + value;

                for(let propName in options) {
                    updatedCookie += "; " + propName;

                    let propValue = options[propName];

                    if (propValue !== true) {
                        updatedCookie += "=" + propValue;
                    }
                }

                document.cookie = updatedCookie;
            },
            deleteCookie(name) {
                this.setCookie(name, "", {
                    expires: -1
                });
            }
        },
        watch: {
            
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
