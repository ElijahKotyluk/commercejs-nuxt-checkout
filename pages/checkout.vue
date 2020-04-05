<template>
  <v-card>
    <v-card-title primary-title>
      Billing Details
    </v-card-title>
    <v-row>
      <v-col>
        <v-form class="px-5">
          <v-row>
            <v-col>
              <v-text-field
                name="firstName"
                label="First Name"
                outlined
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                name="lastName"
                label="Last Name"
                outlined
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-text-field
            name="phone"
            label="Phone #"
            outlined
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            name="email"
            label="Email"
            outlined
            :rules="[rules.required, rules.email]"
          ></v-text-field>
          <v-text-field
            name="address"
            label="Street Address"
            outlined
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            name="city"
            label="City"
            outlined
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            name="state"
            label="State"
            outlined
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            name="zip"
            label="Zip Code"
            outlined
            :rules="[rules.required]"
          ></v-text-field>
        </v-form>
      </v-col>
      <v-col>
        <v-card max-width="500">
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
export default {
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
    ],
    rules: {
      email: (v) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(v) || 'Invalid e-mail.'
      },
      required: (v) => !!v || 'Required'
    }
  })
}
</script>
