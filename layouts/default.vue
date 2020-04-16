<template>
  <v-app light>
    <div :style="{ backgroundImage: `url(${backgroundUrl})`, height: '100%' }">
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
            color="green"
            elevation="0"
            outlined
            right
            @click.stop="drawer = !drawer"
          >
            <v-icon class="mr-4">mdi-cart-outline</v-icon>
            <p v-if="cart.total_items" class="mb-1">
              {{ cart.total_items }}
            </p>
            <p v-else class="mb-1">0</p>
          </v-btn>
        </v-toolbar>
        <checkout v-model="drawer" :cart="cart" @update="drawer = !drawer" />
        <v-container>
          <nuxt />
        </v-container>
      </v-content>
    </div>
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
    backgroundUrl: '/guitar-1940733_1920.jpg',
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
