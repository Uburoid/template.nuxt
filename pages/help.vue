<template>
    <div>
        <no-ssr>
            <vue-json-pretty :data="$isServer ? {} : $server.help()"/>
        </no-ssr>
    </div>
</template>

<script>
//import VueJsonPretty from 'vue-json-pretty'

export default {
    head: {
        title: '$server help'
    },
    components: {
        VueJsonPretty: () => import('vue-json-pretty')
    },
    asyncData(ctx) {
        //debugger
            
    },
    data: () => ({
    }),
    computed: {
    },
    methods: {
    }
}
</script>

