<template>
    <v-navigation-drawer
            clipped1
            v-model="$visible"
            fixed1
            app
            floating1
            disable-resize-watcher1
            temporary
            right
            style="z-index: 7"
        >
            <v-list class="pa-1" dense>
                <v-list-tile class="ma-2">
                
                    <v-list-tile-avatar size="34">
                        <img :src="profile.avatar">
                    </v-list-tile-avatar>
                    
                    <v-list-tile-content>
                        <v-list-tile-title class1="title font-weight-bold"><h2>{{ profile.name }}</h2></v-list-tile-title>
                        <v-list-tile-sub-title v-if="user.email">{{ user.email }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                
                </v-list-tile>

                <v-divider class="mb-1"/>

                <template v-for="(item, inx) in items">

                    <v-divider
                        v-if="item.divider"
                        :inset="item.inset"
                        :key="inx"
                    ></v-divider>


                    <v-list-group
                        v-else-if="item.items && item.items.length"
                        no-action
                        :key="inx"
                        :value="true"
                        class="no-before"
                    >
                        <!-- <v-list-tile-avatar>
                            <v-icon small>{{ item.icon }}</v-icon>
                        </v-list-tile-avatar> -->

                        <v-list-tile slot="activator">
                                <div style="display: flex">
                                    <v-list-tile-avatar>
                                        <v-icon small>{{ item.icon }}</v-icon>
                                    </v-list-tile-avatar>

                                    <v-list-tile-content>
                                            
                                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                        <v-list-tile-sub-title v-if="item.description">{{ item.description }}</v-list-tile-sub-title>
                                    </v-list-tile-content>
                                </div>

                        </v-list-tile>

                        <v-list-tile class="ma-0" dense
                            v-for="(item, inx) in item.items"
                            :key="inx"
                            :to="item.to"
                            avatar
                        >
                            <v-list-tile-avatar>
                                <v-icon small>{{ item.icon }}</v-icon>
                            </v-list-tile-avatar>

                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                <v-list-tile-sub-title v-if="item.description">{{ item.description }}</v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>

                    </v-list-group>

                    <v-list-tile class="ma-0" dense
                        v-else
                        :key="item.title"
                        :to="item.to"
                        avatar
                    >
                        <v-list-tile-avatar>
                            <v-icon small>{{ item.icon }}</v-icon>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                <v-list-tile-sub-title v-if="item.description">{{ item.description }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>

                </template>

            </v-list>

    </v-navigation-drawer>
    <!-- <v-menu offset-y left>
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
        </v-menu> -->
</template>

<script>
    import { mapState, mapGetters } from 'vuex';

    export default {
        props: ['visible'],
        data: () => ({
            group: true
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

<style scoped>
    .no-before::before {
        height: 0px!important;
    }
</style>

