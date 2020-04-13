<template>
  <v-app light>
    <v-content>
      <v-toolbar>
        <v-toolbar-title>
          <a class="title toolbar-title" href="/">
            Demo Merchant
          </a>
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn
          class="drawer-btn"
          color="black"
          elevation="0"
          outlined
          right
          @click.stop="drawer = !drawer"
        >
          <v-icon class="mr-4">mdi-cart-outline</v-icon>
          <p v-if="cart.line_items" class="mb-1">
            {{ cart.line_items.length }}
          </p>
        </v-btn>
      </v-toolbar>
      <checkout v-model="drawer" :cart="cart" @update="drawer = !drawer" />
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import Checkout from '~/components/Checkout.vue'

export default {
  components: {
    Checkout
  },
  data: () => ({
    drawer: false
  }),
  computed: {
    ...mapGetters({
      cart: 'cart',
      subtotal: 'cartSubtotal'
    })
  },
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
