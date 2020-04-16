<template>
  <v-form ref="billing" class="px-1">
    <v-card class="pa-2" elevation="20">
      <v-card-title primary-title>
        Billing Details
      </v-card-title>
      <v-row>
        <v-col class="py-0">
          <v-text-field
            v-model="firstName"
            dense
            name="firstName"
            label="First Name"
            outlined
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col class="py-0">
          <v-text-field
            v-model="lastName"
            dense
            name="lastName"
            label="Last Name"
            outlined
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0">
          <v-text-field
            v-model="phone"
            dense
            name="phone"
            label="Phone #"
            outlined
          ></v-text-field>
        </v-col>
        <v-col class="py-0">
          <v-text-field
            v-model="email"
            dense
            label="Email"
            name="email"
            outlined
            :rules="[rules.required, rules.email]"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0">
          <v-text-field
            v-model="address"
            dense
            label="Street Address"
            name="address"
            outlined
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col class="py-0">
          <v-text-field
            v-model="city"
            dense
            label="City"
            name="city"
            outlined
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0">
          <v-select
            v-model="country"
            dense
            item-text="name"
            item-value="code"
            label="Country"
            name="country"
            outlined
            return-object
            :items="countries"
            :rules="[rules.required]"
            @change="shippingOpts(token.id)"
          ></v-select>
        </v-col>
        <v-col class="py-0">
          <v-select
            v-model="region"
            dense
            item-text="name"
            item-value="code"
            label="Region"
            name="region"
            outlined
            :items="country.states"
            :rules="[rules.required]"
          ></v-select>
        </v-col>
        <v-col class="py-0">
          <v-text-field
            v-model="postalCode"
            dense
            label="Postal Code"
            name="postalCode"
            outlined
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
      </v-row>
      <p class="title ml-3 mb-4">Payment Details</p>
      <v-text-field
        v-model="cardNumber"
        label="Card #"
        outlined
        :rules="[rules.required]"
      ></v-text-field>
      <v-row>
        <v-col class="py-0">
          <v-text-field
            v-model="expiryDate"
            label="Date"
            outlined
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col class="py-0">
          <v-text-field
            v-model="cvc"
            label="cvc"
            outlined
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col class="py-0">
          <v-text-field
            v-model="cardZip"
            label="Zip"
            outlined
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-btn color="green" @click.native="submitOrder">Submit</v-btn>
      </v-row>
    </v-card>
  </v-form>
</template>

<script>
import { mapGetters } from 'vuex'
import locale from '~/static/locale'

export default {
  name: 'BillingDetails',
  props: {
    cart: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    countries: locale,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    country: {},
    city: '',
    region: '',
    postalCode: '',
    cardNumber: '4242 4242 4242 4242',
    expiryDate: '01/2023',
    cvc: '123',
    cardZip: '94103',
    rules: {
      email: (v) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(v) || 'Invalid e-mail.'
      },
      required: (v) => !!v || 'Required.'
    }
  }),
  computed: {
    ...mapGetters({
      token: 'token'
    })
  },
  methods: {
    shippingOpts(tokenID) {
      this.$commerce.checkout
        .getShippingOptions(tokenID, {
          country: this.country.code
        })
        .then((r) => {
          this.$emit('shippingCost', r[0].price.formatted)
          this.shipMethod = r[0].id
        })
    },
    submitOrder() {
      if (!this.$refs.billing.validate()) return // eslint-disable-line no-useless-return
      const date = this.expiryDate.split('/')
      const lineItems = {}

      for (const i of this.cart.line_items) {
        lineItems[i.id] = {
          quantity: i.quantity
        }
      }
      // Capture checkout data
      const data = {
        line_items: lineItems,
        customer: {
          firstname: this.firstName,
          lastname: this.lastName,
          email: this.email
        },
        shipping: {
          name: `${this.firstName} ${this.lastName}`,
          street: this.address,
          town_city: this.city,
          county_state: this.region,
          postal_zip_code: this.postalCode,
          country: this.country.code
        },
        fulfillment: {
          shipping_method: this.shipMethod
        },
        payment: {
          gateway: 'test_gateway',
          card: {
            number: this.cardNumber,
            expiry_month: date[0],
            expiry_year: date[1],
            cvc: this.cvc,
            postal_zip_code: this.cardZip
          }
        }
      }

      // make request
      this.$commerce.checkout
        .capture(this.token.id, data)
        .then((r) => {
          console.log('r: ', r)
          this.$emit('orderComplete', { id: r.id, ref: r.customer_reference })
        })
        .catch((e) => {
          this.$emit('orderError', e)
        })
    },
    zip: (v, code) => {
      let pattern
      switch (code) {
        case 'US':
          pattern = /^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/
          break
        case 'CA':
          pattern = /^[abceghjklmnprstvxy][0-9][abceghjklmnprstvwxyz]\s?[0-9][abceghjklmnprstvwxyz][0-9]$/i
          break
        case 'MX':
          pattern = /^\\d{5}$/
          break
      }
      return pattern.test(v) || `Invalid Zip Code for Country: ${code}`
    }
  }
}
</script>
