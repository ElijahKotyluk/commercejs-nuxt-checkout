<template>
  <v-app light>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('retrieveCart')
  }
}
</script>
