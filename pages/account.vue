<template>
    <div v-if="$store.state.account">
        <no-ssr>
            <vue-json-pretty :data="$store.state.account"/>
        </no-ssr>
    </div>
</template>

<script>
//import VueJsonPretty from 'vue-json-pretty'

export default {
    layout: 'landing',
    components: {
        VueJsonPretty: () => import('vue-json-pretty')
    },
    asyncData(ctx) {
        //debugger
            
    },
    data: () => ({
    }),
    methods: {
    }
}
</script>

