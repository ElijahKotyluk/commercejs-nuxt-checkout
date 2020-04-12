<template>
  <v-card elevation="0">
    <v-row align="center" justify="space-around">
      <v-col cols="12" sm="7" lg="5">
        <v-card-title primary-title>
          Billing Details
        </v-card-title>
        <billing-details
          :cart="cart"
          @shippingCost="updateCost"
          @orderComplete="handleOrderRes"
          @orderError="handleOrderError"
        />
      </v-col>
      <v-col cols="12" sm="5">
        <v-card max-width="400">
          <v-card-title class="pb-0">Order Summary</v-card-title>
          <v-container>
            <v-row justify="space-between">
              <v-card-subtitle class="title py-1 pl-3">Product</v-card-subtitle>
              <v-card-subtitle class="title py-1 pr-3"
                >Subtotal</v-card-subtitle
              >
            </v-row>
            <v-row
              v-for="item in cart.line_items"
              :key="item.id"
              justify="space-between"
            >
              <v-card-subtitle :key="item.name"
                >{{ item.name }} x {{ item.quantity }}</v-card-subtitle
              >
              <v-card-subtitle :key="item.price.formatted"
                >${{ item.price.formatted }}</v-card-subtitle
              >
            </v-row>
            <v-divider></v-divider>
            <v-row justify="space-between">
              <v-card-subtitle>Subtotal</v-card-subtitle>
              <v-card-subtitle v-if="cart.subtotal">{{
                cart.subtotal.formatted_with_symbol
              }}</v-card-subtitle>
              <v-card-subtitle v-else>$0.00</v-card-subtitle>
            </v-row>
            <v-row justify="space-between">
              <v-card-subtitle>Shipping</v-card-subtitle>
              <v-card-subtitle>${{ shippingCost }}</v-card-subtitle>
            </v-row>
            <v-divider></v-divider>
            <v-row justify="space-between">
              <v-card-subtitle>Total</v-card-subtitle>
              <v-card-subtitle>{{ total }}</v-card-subtitle>
            </v-row>
            <v-row justify="center">
              <v-btn class="my-2" to="/">Edit Cart</v-btn>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title>Order Confirmation: {{ orderRef }}</v-card-title>
        <v-card-text>
          Thank you for your order!
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" top vertical :timeout="timeout">
      {{ orderError }}
    </v-snackbar>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import BillingDetails from '~/components/BillingDetails'

export default {
  components: {
    BillingDetails
  },
  data: () => ({
    dialog: false,
    shippingCost: '0.00',
    snackbar: false,
    timeout: 8000,
    orderNumber: '',
    orderRef: '',
    orderError: ''
  }),
  computed: {
    ...mapGetters({
      cart: 'cart'
    }),
    total() {
      let total = '0.00'
      if (this.cart.subtotal) {
        total = +this.cart.subtotal.raw + +this.shippingCost
      }

      return `$${total}`
    }
  },
  mounted() {
    this.$store.dispatch('retrieveCart')
  },
  methods: {
    handleOrderRes(data) {
      /**
       * if successful open dialog if error display error message in snackbar
       */
      this.orderNumber = data.id
      this.orderRef = data.ref
      console.log('data: ', data)
      this.dialog = true
    },
    handleOrderError(e) {
      this.orderError = e
      this.snackbar = true
    },
    updateCost(price) {
      this.shippingCost = price
    }
  }
}
</script>
