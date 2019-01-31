<template>
    <v-layout column justify-center align-center>
        <v-flex xs12 sm8 md6>
            <div>WELCOME TO OUR SITE!</div>
            <nuxt-link to="/news">NEWS PAGE</nuxt-link>
            <nuxt-link to="/inspire">INSPIRE PAGE</nuxt-link>
            <nuxt-link to="/signin">SIGN IN</nuxt-link>
            <nuxt-link to="/signup">SIGN UP</nuxt-link>
            <nuxt-link to="/poppo">NOT FOUND</nuxt-link>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        //layout: 'default'
    }
</script>