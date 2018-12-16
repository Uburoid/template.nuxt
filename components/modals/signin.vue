<template>
    <v-dialog
      v-model="show"
      width="500"
      hide-overlay
    >
        <signin/>

    </v-dialog>
</template>

<script>
export default {
    props: ['show'],
    components: {
        signin: () => import('@/components/signin')
    },
    data: () => ({
    })
}
</script>

