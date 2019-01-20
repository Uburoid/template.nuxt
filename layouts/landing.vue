<template>
  <v-app>

    <v-content>
        <error v-if="error"/>

        <div v-show="!error || (error && error.dialog)">
             {{ user.email }}
             
            <nuxt keep-alive/>
        </div>
        
    </v-content>
    
  </v-app>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';

    export default {
        components: {
            error:  () => import('@/components/errors/error')
        },
        computed: {
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
    }
</script>

