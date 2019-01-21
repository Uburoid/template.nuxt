<template lang="html">
    <v-menu offset-y right>
        <v-btn fab flat small slot="activator">
            <v-avatar size="30">
                <!-- <img :alt="profile.name" :src="profile.avatar"> -->
                <img class="top-toolbar-logo" src="~assets/Army_of_Russia.svg">
            </v-avatar>
        </v-btn>

        <v-list class="pa-1" dense>
            <v-list-tile class="ma-2">
            
                <v-list-tile-avatar size="24">
                    <img src="~assets/Army_of_Russia.svg">
                </v-list-tile-avatar>
                
                <v-list-tile-content>
                    <v-list-tile-title><h2>Разделы сайта</h2></v-list-tile-title>
                    <!-- <v-list-tile-sub-title v-if="user.email">{{ user.email }}</v-list-tile-sub-title> -->
                    
                </v-list-tile-content>
            
            </v-list-tile>

            <v-divider class="mb-1"/>

            <v-list-tile v-for="(item, index) in items" class="ma-0" 
                :key="index" 
                :to="item.to"
            >
                <v-list-tile-avatar>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-avatar>
            
                <v-list-tile-sub-title>{{ item.title }}</v-list-tile-sub-title>
            </v-list-tile>
        </v-list>
    </v-menu>
    <!-- <v-navigation-drawer
        clipped
        v-model="visible"
        fixed
        app
        floating
        disable-resize-watcher
        temporary
    >
        <v-list>
            <v-list-tile
                router
                :to="item.to"
                :key="i"
                v-for="(item, i) in items"
                exact
            >
                <v-list-tile-action>
                    <v-icon v-html="item.icon"></v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                    <v-list-tile-title v-text="item.title"></v-list-tile-title>
                </v-list-tile-content>

            </v-list-tile>
        </v-list>
    </v-navigation-drawer> -->
</template>

<script>
    import { mapState, mapGetters } from 'vuex';

    export default {
        props: ['show'],
        data: () => ({}),
        methods: {
        },
        computed: {
            visible: {
                get() {
                    return this.show;
                },
                set(val) {
                    
                    typeof(this.show) !== 'undefined' && val !== this.show && this.$emit('drawer', val);
                }
            },
            ...mapState({
                items: state => state.drawer_items
            })
        }
    }
</script>

<style>
    .v-navigation-drawer__border {
        background-color: var(--v-blueGrey-lighten3)!important;
    }
</style>