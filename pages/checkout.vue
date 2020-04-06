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
          <v-card-title>Order Summary</v-card-title>
          <v-container class="px-3">
            <v-row justify="space-between">
              <v-card-subtitle class="title">Product</v-card-subtitle>
              <v-card-subtitle class="title">Subtotal</v-card-subtitle>
            </v-row>
            <v-container>
              <v-row
                v-for="item in items"
                :key="item.name"
                justify="space-between"
              >
                <v-card-subtitle :key="item.name">{{
                  item.name
                }}</v-card-subtitle>
                <v-card-subtitle :key="item.price">{{
                  item.price
                }}</v-card-subtitle>
              </v-row>
            </v-container>
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
import BillingDetails from '~/components/BillingDetails'

export default {
  components: {
    BillingDetails
  },
  data: () => ({
    items: [
      {
        name: 'item-1',
        price: '$10.99'
      },
      {
        name: 'item-2',
        price: '$8.99'
      }
    ]
  })
}
</script>
