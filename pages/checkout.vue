<template>
  <v-card elevation="0">
    <v-row align="center" justify="space-around">
      <v-col cols="12" sm="7" lg="5">
        <v-card-title primary-title>
          Billing Details
        </v-card-title>
        <billing-details />
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
              <v-card-subtitle :key="item.name">{{
                item.name
              }}</v-card-subtitle>
              <v-card-subtitle :key="item.price.formatted"
                >${{ item.price.formatted }}</v-card-subtitle
              >
            </v-row>
            <v-divider></v-divider>
            <v-row justify="space-between">
              <v-card-subtitle>Subtotal</v-card-subtitle>
              <v-card-subtitle>$0.00</v-card-subtitle>
            </v-row>
            <v-row justify="space-between">
              <v-card-subtitle>Shipping</v-card-subtitle>
              <v-card-subtitle>$0.00</v-card-subtitle>
            </v-row>
            <v-row justify="space-between">
              <v-card-subtitle>Tax</v-card-subtitle>
              <v-card-subtitle>$0.00</v-card-subtitle>
            </v-row>
            <v-divider></v-divider>
            <v-row justify="space-between">
              <v-card-subtitle>Total</v-card-subtitle>
              <v-card-subtitle>$0.00</v-card-subtitle>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import BillingDetails from '~/components/BillingDetails'

export default {
  components: {
    BillingDetails
  },
  computed: {
    ...mapGetters({
      cart: 'cart'
    })
  }
}
</script>
