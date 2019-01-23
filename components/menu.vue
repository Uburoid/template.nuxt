<template>
    <v-menu offset-y left>
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
                        <v-list-tile-title class1="title font-weight-bold"><h2>{{ profile.name }}</h2></v-list-tile-title>
                        <v-list-tile-sub-title v-if="user.email">{{ user.email }}</v-list-tile-sub-title>
                        <!-- <v-list-tile-sub-title v-if="user.role">{{ user.role }}</v-list-tile-sub-title> -->
                    </v-list-tile-content>
                
                </v-list-tile>

                <v-divider class="mb-1"/>

                <template v-for="(item, index) in items">
                    <v-divider
                        v-if="item.divider"
                        :inset="item.inset"
                        :key="index"
                    ></v-divider>

                    <v-list-tile class="ma-0" dense
                        v-else
                        :key="item.title"
                        :to="item.to"
                        avatar
                    >
                        <v-list-tile-avatar>
                            <v-icon small>{{ item.icon }}</v-icon>
                        </v-list-tile-avatar>

                        <v-list-tile-sub-title>{{ item.title }}</v-list-tile-sub-title>
                    </v-list-tile>
                
                    

                </template>
            </v-list>
        </v-menu>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';

    export default {
        props: ['show'],
        data: () => ({
            /* items: [
                { icon: 'apps', title: 'Welcome', to: '/' },
                { icon: 'bubble_chart', title: 'Inspire', to: '/inspire' },
                { icon: 'fa-error', title: 'NOT FOUND', to: '/not-found' },
                { icon: 'fa-phone', title: 'Messaging', to: '/messaging' },
            ] */
        }),
        methods: {
        },
        computed: {
            ...mapState({
                items: state => state.account_items/* .map(item => {
                    let { to, ...rest } = item;
                    return item.divider ? rest : item;
                }) */,
                profile: state => state.account.user.profile,
                user: state => state.account.user,
            })
        }
    }
</script>

<style>
    .v-navigation-drawer__border {
        background-color: var(--v-blueGrey-lighten3)!important;
    }
</style>

