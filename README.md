# Creating a Checkout with Commerce.js SDK and Nuxt.js

This guide continues from (Adding products to a cart with Nuxt.js and Commerce.js)[Adding Products To A Cart](https://github.com/ElijahKotyluk/nuxt-cjs-adding-products)

This guide illustrates how to create a checkout form and capture an order.

[Live Demo](https://commercejs-sdk-nuxt-checkout.herokuapp.com/)

***** *Note* *****

* This guide uses v2 of the Commerce.js SDK

![](https://imgur.com/a/o0Q6e0S)

## Overview
If you followed the previous guides you first created a simple Nuxt application with `create-nuxt-app` that listed the products from your [Chec dashboard](https://authorize.chec.io/login), and then followed up with creating a cart, as well as adding, removing, and clearing a cart. This guide will walk you through creating a page dedicated to submitting an order, generating a checkout token([generateTokenFrom()](https://commercejs.com/docs/api/#generate-token)), and using that token to capture the order([capture()](https://commercejs.com/docs/api/#capture-order)).

## This guide will cover

1. *Optional* Creating shipping zones and adding available zones to products
2. Create Checkout page
3. Create a form for customer information
4. Form validation with Vuetify
5. Submit an order and display the order confirmation number

## Requirements

- IDE of your choice: VS Code is not required, you can use something lightweight like [Atom Code Editor](https://atom.io/) or [Sublime Text](https://www.sublimetext.com/).
- [Commerce.js SDK](https://github.com/chec/commerce.js)
- [Chec.io account](https://authorize.chec.io/signup)
- Yarn or npm
- [Nuxt.js](https://nuxtjs.org/)
- [Vuetify](https://vuetifyjs.com/en/)
- [Vuex](https://nuxtjs.org/guide/vuex-store/)

## Prerequisites
Basic knowldge of Nuxt.js and JavaScript are required for this guide, and some familiarity with Vuetify will help.

- Nuxt.js v2
- JavaScript(ES7)
- Vuetify.js v2.2.15
- Vue.js

## Shipping Zones

Shipping zones are important because they allow you to determine where you will ship to, as well as calculating costs for shipping to those different countries, states, or regions. 

![Adding a Zone](https://i.imgur.com/SbxB7oP.png)

### Adding a shipping zone:
To add a shipping zone for your store you should first login to your [Chec dashboard](https://authorize.chec.io/login) and locate the [Shipping](https://dashboard.chec.io/setup/shipping#) tab located in your dashboards setup. Click on the **"+ Add Zone"** button, a modal that contains a form will pop up and ask for some pieces of information; A Zone Name, the name of the zone or region. Countries & Regions, the countries and/or regions you will ship your store's products to. Base Rates, the base rate for shipping to the new shipping zone. 

<img src="https://i.imgur.com/zmLiuJx.png" height="350" width="425" />

### Adding a shipping zone to your products:

You have just set up a shipping zone, now to add the zone to your products. Go to your products in your dashboard and elect a product and scroll down to **Delivery Options**. Enable the newly created zone that appears underneath the default. This will allow you to notify the users of price changes based on the user's selected shipping arrangements, as well as supply the [capture](https://commercejs.com/docs/api/#capture-order) method with the necessary shipping option id to submit the transaction. 

![Add zone to product ](https://i.imgur.com/0TRrqni.png)

## 1. Generating a checkout token:

One of the key parts to capturing a checkout is generating a checkout token using the following method: [generateToken()](https://commercejs.com/docs/api/#generate-token). For this, you will go back into your `store/index.js` file add a new property on the state object called: `token` which will equal an empty object and add a new action: `genCheckoutToken()`. This action will do as the name says and create a token to be used to capture a checkout order. `generateToken()` expects one parameter, which could be a cart's id, a product's id, or a permalink. The second parameter should be an object that states the type of id you are passing as the first parameter, in this scenario you will be using your cart's id. If all checks out and the request is successful; simply commit the token to a `setToken` mutation, which will just set the state's token object to the response of `generateToken()`.

``` js

  // State
export const state = {
  ...
  token: {},
  ...
}
  // Actions
export const actions = {
  ...
    async genCheckoutToken({ commit }, payload) {
    const token = await v.$commerce.checkout.generateToken(payload, {
      type: 'cart'
    })

    if (token) {
      commit('setToken', token)
    }
  },
  ...
}

// Mutations
export const mutations = {
...
  setToken(state, payload) {
    state.token = payload
  },
...
}

```

After your store has been updated, go to your components directory and open up `components/Checkout.vue` in your editor and add your new action to `mapActions` and update the checkout button to call `genToken(cart.id)` when a click event is triggered. Also add the `to="/checkout"` prop and set it to the new checkout route that you will be creating, which can be read about in [Vuetify's VBtn docs](https://vuetifyjs.com/en/components/buttons/)

``` js
// components/Checkout.vue
<template>
...
  <v-btn
    color="green"
    class="white--text mt-10"
    :disabled="disabled"
    to="/checkout" // Nuxt will create the route when the component is created
    x-large
    @click="genToken(cart.id)" // Pass the current cart's id
  >
    <v-icon small>mdi-lock</v-icon>
    <span>Secure Checkout</span>
  </v-btn>
...
<template>

<script>
...
  methods: {
    ...mapActions({
      removeProduct: 'removeProductFromCart',
      clearCart: 'clearCart',
      genToken: 'genCheckoutToken' // Used in VBtn to call the genCheckoutToken action
    })
  },
...
<script>

```


### Checkout Capture overview

Your users will need some sort of form or inputs to be able to enter the necessary information in order to submit and complete a checkout order. So first we will go over the expected data that will be necessary in building out this form component. The method used to checkout an order is the [capture(checkout_token_id, data)](https://commercejs.com/docs/api/#capture-order) method on the `checkout` class. The `capture` method expects **2** parameters, a `checkout_token_id: string` and an object that contains data from the user and from their cart.

``` js
// sample data to be passed to capture().
{
  "line_items": {
      "item_7RyWOwmK5nEa2V": {
          "quantity": 1,
          "variants": {
              "vrnt_p6dP5g0M4ln7kA": "optn_DeN1ql93doz3ym"
          }
      }
  },
  "discount_code": "20off",
  "extrafields": {
      "extr_Kvg9l6zvnl1bB7": "415-111-2222",
      "extr_bWZ3l8zLNokpEQ": "google.com"
  },
  "customer": {
      "firstname": "John",
      "lastname": "Doe",
      "email": "john.doe@example.com"
  },
  "shipping": {
      "name": "John Doe",
      "street": "123 Fake St",
      "town_city": "San Francisco",
      "county_state": "California",
      "postal_zip_code": "94103",
      "country": "US"
  },
  "fulfillment": {
      "shipping_method": "ship_7RyWOwmK5nEa2V"
  },
  "billing": {
      "name": "John Doe",
      "street": "234 Fake St",
      "town_city": "San Francisco",
      "county_state": "California",
      "postal_zip_code": "94103",
      "country": "US"
  },
  "payment": {
      "gateway": "stripe",
      "card": {
          "number": "4242 4242 4242 4242",
          "expires": "11\/19",
          "cvc": 123,
          "postal_zip_code": "94107",
          "token": "irh98298g49",
          "nonce": 293074902374234
      },
      "razorpay": {
          "payment_id": "839h8d89wg87r3cz3trbis8"
      }
  },
  "pay_what_you_want": "149.99"
}

```

## 2. BillingDetails.vue

Create a new Vue file named: `BillingDetails.vue` and put it in the `/components` directory. For this component you will use Vuetify's [VForm](https://vuetifyjs.com/en/components/forms/) component that will contain a few [VTextField](https://vuetifyjs.com/en/components/text-fields/)'s, a couple [VSelect](https://vuetifyjs.com/en/components/selects/)'s and a VBtn component at the end to submit the order and capture the checkout.  

``` js
// BillingDetails.vue
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
    <v-btn @click.native="submitOrder">Submit</v-btn>
  </v-form>
</template>
```

### Input rules

A prop that Vuetify's inputs have in common is the `rules` prop, which takes an array of functions that take an input value as an argument, returning either true/false or an error string. These are especially useful when you are expecting a certain result or format from the input. For this example only one rule(`required`) is declared to demonstrate how to use the rules. In your components `data` object you will see a `rules` object that contains 2 functions, `email()` and `required()`. `rules.email()` will check if the value is a valid email by testing it against the regex pattern and returning `true` or a string `"Invalid e-mail."`. `rules.required()` will just simply check that a value is present in the input field or returns the string `Required.`.

## 2. BillingDetails.vue cont.

For the script portion of this component, you will first import mapGetters and [locale](https://github.com/ElijahKotyluk/commercejs-nuxt-checkout/blob/master/static/locale/index.js)(A static file containing country and region data specific to this demo). This component will also be passed the `cart` prop from the parent, which is just the cart stored in your state that will be inhereted from the `pages/checkout.vue` component. Inside the components `data` function will live all the input models for the form inputs as seen above, as well as the rules object. The computed property utilizes mapGetters to return the token that is stored in your app's vuex state.

``` js
// components/BillingDetails.vue
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
  }
}
</script>

```

The `shippingOptions()` method takes the token's id as the parameter and calls Commerce.js's [getShippingOptions](https://commercejs.com/docs/api/#get-available-shipping-methods) method. `getShippingOptions()` takes the token id as the first paremeter and an object containing a country and an optional region, returning an array of shipping methods associated with the country and region. Once the request has completed, you will emit a `'shippingCost'` with the formatted price and set the shipMethod to the first id in the results array.


## 3. Submit and capture a checkout

This is the last part to the `BillingDetails.vue` component, the `submitOrder()` method. This method first validates the form, if it does not pass validation then return and stop execution of the method's code. If the form and the inputs pass validation, then begin building the `data` object that will be passed to the [checkout.capture()](https://commercejs.com/docs/api/#capture-order) method. The `capture()` method is passed a `checkout_token_id` and the `data` object which will contain all the data billing details provided by the user, the cart's line items, the shipping methods associated with the shipping region, and finally the customer's credit card information. Once this object is built you will call the `capture()` method by passing the checkout token id and `data` object, and whether the response is a result or an error you will emit a different event. In the case of a successful result: `'orderComplete'` passing an object containing the order id and customer's reference. In the case of an error: `'orderError'` passing the caught error. 

``` js
// BillingDetails.vue
export default {
  ...
  methods: {
    ...
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
          this.$emit('orderComplete', { id: r.id, ref: r.customer_reference })
        })
        .catch((e) => {
          this.$emit('orderError', e)
        })
    },
  }
}

```



## 4. checkout.vue page component

Now that you've updated your vuex store and created a component to handle collecting the billing and shipping information from the customer, you'll want to add a `pages/checkout.vue` component to be all these things to use. Create a new Vue component in the pages directory; `pages/checkout.vue`, this component will be the `/checkout` route as Nuxt will create that route by just adding the `checkout.vue` component file inside of your [Nuxt Pages](https://nuxtjs.org/guide/views#pages) directory.


### pages/checkout.vue script

First you'll start by building out the `<script>` portion of the component by importing the **mapGetters** function from **vuex** and the `BillingDetails.vue` component created previously in this guide(Be sure to correctly register BillingDetails to the components object). In **data** you'll want to add `dialog: false`, which will be used to display the customer's order reference id and the order number with Vuetify's [VDialog](https://vuetifyjs.com/en/components/dialogs/) component. `snackbar: false` which will be used to display an error with Vuetify's [VSnackbar](https://vuetifyjs.com/en/components/snackbars/) component, if there is an error returned from the order capture, the snackbar. The `timeout` data prop will be used in the snackbar to allow it to disappear once the time has passed. In computed you will get the cart from the store using `...mapGetters` to access the `cart` getter. `Total()` will return the orders total cost and will include shipping once a country/region is selected. For mounted you will dispatch `retrieveCart` in the case that the user refreshes the page so that your store will populate with the necessary data again. For now the methods will just contain an `updateCost` method that will trigger and update the shipping cost when the `shippingCost` gets emitted from the `BillingDetails.vue` component. `handleOrderError(e: Error)` will accept an error string as an argument and set the **orderError** data prop and set the snackbar to true, causing it to display for 8seconds displaying the passed error message. `handleOrderRes(data)` accepts an object containg the order number id and order reference id and updates the components **orderNumber** and **orderRef** with the values passed and sets the dialogs value to true, causing the dialog to display. 

``` js
// pages/checkout.vue
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
    updateCost(price) {
      this.shippingCost = price
    },
    handleOrderError(e) {
      this.orderError = e
      this.snackbar = true
    },
    handleOrderRes(data) {
      this.orderNumber = data.id
      this.orderRef = data.ref
      this.dialog = true
    },
  }
}
</script>

```

### pages/checkout.vue template
The base for this component will be Vuetify's [VCard](https://vuetifyjs.com/en/components/cards/) component, inside you'll notice the `billing-details` component will have a few event listeners bound the methods written previously in the script tag: `@shippingCost` - Updates the **shippingCost** data prop, `@orderComplete` - Updates the **orderNumber** and **orderRef** also displays the dialog, `@orderError` - Update the **orderError** data prop and displays the snackbar. The majority of this component's template uses Vuetify's [Grid System](https://vuetifyjs.com/en/components/grids/) to position the different pieces where you want them to go, makes easy work out of making your store mobile responsive by creating rows and columns. At the bottom you will see the [VDialog](https://vuetifyjs.com/en/components/dialogs/) and [VSnackbar](https://vuetifyjs.com/en/components/snackbars/) components that are activated when the data property bound to each components `v-model` has a true value.

``` js
// pages/checkout.vue
<template>
  <v-card elevation="0">
    <v-row align="center" justify="space-around">
      <v-col cols="12" sm="7" lg="5">
        <v-card-title primary-title>
          Billing Details
        </v-card-title>
        <billing-details
          :cart="cart"
          @shippingCost="updateCost" // `@` is shorthand for the `v-on:` directive
          @orderComplete="handleOrderRes" // https://vuejs.org/v2/guide/events.html
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
        <v-card-actions>
          <v-btn outlined to="/">Store</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" top vertical :timeout="timeout">
      {{ orderError }}
    </v-snackbar>
  </v-card>
</template>
```

***With the previous steps put together you should have something pretty close to this:***

![pages/checkout.vue](https://i.imgur.com/QdrBpI2.png)

### 5. Run your app!

You should now be able to run your Nuxt application, add products to a cart, generate a checkout token, and capture the order.

```js
// yarn
yarn dev

//npm
npm run dev
```

[Live Demo](https://commercejs-sdk-nuxt-checkout.herokuapp.com/)

## Conclusion
Nice work, you've successfully created a checkout page and captured an order.

Let's review what we have accommplished in this guide.

* Learned how to create shipping regions and apply them to products in your dashboard
* Generated a checkout token and used that token to capture an order
* Created a component to be used as a form to gather data to submit the capture
* Wrote rules for required inputs
* Created a Checkout page for your customers

As you can see, the Commerce.js SDK greatly simplifies the eCommerce process, the only thing left for you to do is create a theme or layout and style your app as you see fit.

This guide continues from (Adding products to a cart with Nuxt.js and Commerce.js)[Adding Products To A Cart](https://github.com/ElijahKotyluk/nuxt-cjs-adding-products)

## Built With

* [Nuxt.js](https://github.com/nuxt/nuxt.js) - The front-end framework used
* [Vuetify](https://github.com/vuetifyjs/vuetify) - The Vue material component library used
* [Yarn](https://github.com/yarnpkg/yarn) - Package manager tool

## Authors

* **ElijahKotyluk** - [Github](https://github.com/ElijahKotyluk)

