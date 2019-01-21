<template lang="html">
    <v-navigation-drawer
        clipped
        v-model="visible"
        fixed
        app
        
        disable-resize-watcher
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
    </v-navigation-drawer>
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