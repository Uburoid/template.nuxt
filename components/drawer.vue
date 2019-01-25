<template lang="html">
    <!-- <v-menu offset-y right>
        <v-btn fab flat small slot="activator">
            <v-avatar size="30">
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
    </v-menu> -->
    <v-navigation-drawer
        clipped1
        v-model="$visible"
        fixed1
        app
        floating1
        disable-resize-watcher1
        temporary
        style="z-index: 7"
    >

        <v-list class="pa-1" dense>
            <v-list-tile class="ma-2">
            
                <v-list-tile-avatar size="24">
                    <img src="~assets/Army_of_Russia.svg">
                </v-list-tile-avatar>
                
                <v-list-tile-content>
                    <v-list-tile-title><h2>Разделы сайта</h2></v-list-tile-title>
                </v-list-tile-content>
            
            </v-list-tile>

            <v-divider class="mb-1"/>

            <v-list-tile v-for="(item, index) in items" 
                class1="ma-0" 
                :key="index" 
                :to="item.to"
                nuxt1
            >
                <v-list-tile-avatar>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-avatar>
            
                <v-list-tile-content>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    <v-list-tile-sub-title v-if="item.description">{{ item.description }}</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
        
    </v-navigation-drawer>

</template>

<script>
    import { mapState, mapGetters } from 'vuex';

    export default {
        props: ['visible'],
        data: () => ({}),
        methods: {
        },
        computed: {
            $visible: {
                get() {
                    return this.visible;
                },
                set(val) {
                    this.$emit('update:visible', val);
                    //typeof(this.visible) !== 'undefined' && val !== this.visible && this.$emit('update:visible', val);
                }
            },
            ...mapState({
                items: state => state.drawer_items
            })
        },
        watch: {
            /* visible(val) {
                this.$emit('update:visible', val);
            } */
        }
    }
</script>

<style>
</style>