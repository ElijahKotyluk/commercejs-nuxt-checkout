<template>
  <v-form ref="billing" class="px-1">
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
          :rules="[rules.required]"
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
          v-model="state"
          dense
          item-text="name"
          item-value="code"
          label="State/Province/Territory"
          name="state"
          outlined
          :items="country.states"
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
    <v-text-field v-model="cardNumber" label="Card #" outlined></v-text-field>
    <v-row>
      <v-col class="py-0">
        <v-text-field v-model="expiryDate" label="Date" outlined></v-text-field>
      </v-col>
      <v-col class="py-0">
        <v-text-field v-model="cvv" label="CVV" outlined></v-text-field>
      </v-col>
      <v-col class="py-0">
        <v-text-field v-model="cardZip" label="Zip" outlined></v-text-field>
      </v-col>
    </v-row>
    <v-btn @click.native="printLocales"></v-btn>
  </v-form>
</template>

<script>
import { mapGetters } from 'vuex'
import locale from '~/static/locale'

export default {
  name: 'BillingDetails',
  props: {
    cart: {
      type: () => Object,
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
    state: '',
    postalCode: '',
    cardNumber: '4242 4242 4242 4242',
    expiryDate: '01/2023',
    cvv: '123',
    cardZip: '94103',
    rules: {
      email: (v) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(v) || 'Invalid e-mail.'
      },
      required: (v) => !!v || 'Required',
      zip: (v) => {
        // const pattern = null
      }
    }
  }),
  computed: {
    ...mapGetters({
      token: 'token'
    })
  },
  methods: {
    shippingOpts(tokenID) {
      console.log('id: ', tokenID)
      this.$commerce.checkout
        .getShippingOptions(tokenID, {
          country: this.country.code
        })
        .then((r) => {
          console.log('r: ', r[0].price.formatted)
        })
    }
  }
}
</script>
