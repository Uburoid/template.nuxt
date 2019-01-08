<template>
    <div>
        <vue-json-pretty :data="$store.state.account"/>
    </div>
</template>

<script>
//import VueJsonPretty from 'vue-json-pretty'

export default {
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

