<template>
  <v-app light>
    <v-content>
      <v-toolbar>
        <v-toolbar-title>
          <a class="title toolbar-title" href="/">
            Demo Merchant
          </a>
        </v-toolbar-title>
      </v-toolbar>
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

<style>
.toolbar-title {
  color: #000000 !important;
  text-decoration: none;
}
.toolbar-title:hover {
  text-decoration: underline;
  color: #797979 !important;
}
</style>
