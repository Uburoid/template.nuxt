<template lang="html">
    <v-navigation-drawer
        clipped
        v-model="visible"
        fixed
        app
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
export default {
    props: ['show'],
    data: () => ({
        items: [
            { icon: 'apps', title: 'Welcome', to: '/' },
            { icon: 'bubble_chart', title: 'Inspire', to: '/inspire' }
        ]
    }),
    methods: {
    },
    computed: {
        visible: {
            get() {
                return this.show;
            },
            set(val) {
                this.$emit('drawler', val);
            }
        }
    }
}
</script>

<style>
    .v-navigation-drawer__border {
        background-color: var(--v-blueGrey-lighten3)!important;
    }
</style>