<template>
    <v-layout column justify-center align-center>
        <v-flex xs12 sm8 md6>
            <div>ERROR, NOT FOUND! {{ date }}</div>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    data: () => ({
        date: 0
    }),
    created() {
        console.log('not found created');
        this.date = Date.now();
    },
    mounted() {
        //console.log(document.cookie);
    }
}
</script>