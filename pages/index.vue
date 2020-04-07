<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-row class="d-flex justify-end">
        <v-btn class="drawer-btn" fixed right @click.stop="drawer = !drawer">
          <v-icon class="mr-4">mdi-cart-outline</v-icon>
          <span class="mx-2">items</span>
          <span v-if="subtotal" class="mx-2">${{ subtotal }}</span>
          <span v-else class="mx-2">$0.00</span>
        </v-btn>
      </v-row>

      <v-col class="text-center ma-5">
        <span class="display-1">Demo Merchant</span>
      </v-col>

      <v-row>
        <template v-for="product in products">
          <v-col :key="product.id" class="mt-5" cols="12" sm="6" md="4">
            <commerce-item :key="product.id" :product="product" />
          </v-col>
        </template>
      </v-row>
    </v-flex>

    <checkout v-model="drawer" :cart="cart" @update="drawer = !drawer" />
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import Checkout from '~/components/Checkout'
import CommerceItem from '~/components/CommerceItem'

export default {
  components: {
    Checkout,
    CommerceItem
  },
  data: () => ({
    drawer: false
  }),
  computed: {
    ...mapGetters({
      products: 'products',
      cart: 'cart',
      subtotal: 'cartSubtotal'
    })
  }
}
</script>

<style>
.drawer-btn {
  z-index: 5;
}
</style>
