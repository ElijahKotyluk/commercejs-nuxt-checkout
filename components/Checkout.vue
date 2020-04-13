<template>
  <v-navigation-drawer absolute :value="value" right temporary width="500">
    <v-row class="d-flex my-8">
      <v-icon class="ml-10 mr-2" color="#6C7C8F" dense>mdi-cart-outline</v-icon>
      <span class="nav-text title">Cart</span>

      <v-chip class="ml-auto mr-10" outlined @click.stop="$emit('update')">
        Close Cart
      </v-chip>
    </v-row>
    <v-divider></v-divider>

    <v-list>
      <v-list-item
        v-if="!cart.line_items || cart.line_items.length <= 0"
        class="text-center mb-2"
      >
        <v-list-item-content>
          <span class="subtitle-1 font-weight-light nav-text">
            Cart is empty!
          </span>
        </v-list-item-content>
      </v-list-item>

      <template v-for="product in cart.line_items">
        <v-list-item :key="product.product_id" class="mb-2">
          <v-list-item-title>
            {{ product.name }}
          </v-list-item-title>

          <span class="mr-2">
            {{ product.quantity }}
          </span>
          <span class="mr-2">
            ${{ product.line_total.formatted_with_symbol || '0.00' }}
          </span>
          <v-icon @click.stop="removeProduct(product.id)">mdi-cancel</v-icon>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <v-list-item-title>
          <span class="nav-text subtitle-1 font-weight-medium">Subtotal</span>
        </v-list-item-title>

        <span v-if="cart.subtotal" class="mr-1 nav-text">
          {{ cart.subtotal.formatted_with_symbol }}
        </span>
        <span v-else class="mr-1 nav-text">{{ subtotal }}</span>
        <v-chip class="pr-5" color="green" label outlined small>USD</v-chip>

        <v-btn class="ml-2" color="red" label outlined small @click="clearCart">
          Clear
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item class="justify-center">
        <v-btn
          color="green"
          class="white--text mt-10"
          :disabled="disabled"
          to="/checkout"
          x-large
          @click="genToken(cart.id)"
        >
          <v-icon small>mdi-lock</v-icon>
          <span>Secure Checkout</span>
        </v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Checkout',
  props: {
    cart: {
      type: Object,
      default: () => {}
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    disabled: true,
    subtotal: '$0.00'
  }),
  watch: {
    cart: {
      handler(val) {
        console.log('val: ', val)
        if (val.line_items && val.line_items.length >= 1) {
          this.disabled = false
        } else {
          this.disabled = true
        }
      }
    }
  },
  methods: {
    ...mapActions({
      removeProduct: 'removeProductFromCart',
      clearCart: 'clearCart',
      genToken: 'genCheckoutToken'
    })
  }
}
</script>

<style>
.nav-text {
  color: #6c7c8f;
}
</style>
