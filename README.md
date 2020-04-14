# Creating a Checkout with Commerce.js SDK and Nuxt.js

This guide continues from (Adding products to a cart with Nuxt.js and Commerce.js)[Adding Products To A Cart](https://github.com/ElijahKotyluk/nuxt-cjs-adding-products)

This guide illustrates how to create a cart and add products to a cart using Nuxt.

[Live Demo](https://commercejs-sdk-nuxt-checkout.herokuapp.com/)

***** *Note* *****

* This guide uses v2 of the Commerce.js SDK

![](https://imgur.com/a/o0Q6e0S)

## Overview
If you followed the previous guides you first created a simple Nuxt application with `create-nuxt-app` that listed the products from your [Chec dashboard](https://authorize.chec.io/login), and then followed up with creating a cart, as well as adding, removing, and clearing a cart. This guide will walk you through creating a page dedicated to submitting an order, generating a checkout token([generateTokenFrom()](https://commercejs.com/docs/api/#generate-token)), and using that token to capture the order([capture()](https://commercejs.com/docs/api/#capture-order)).

## This guide will cover

1. (Optional) Creating shipping zones and adding available zones to products
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
Basic knowldge of Nuxt.js and JavaScript are required for this guide, and some familiarity with Vuetify would help.

- Nuxt.js v2
- JavaScript(ES7)
- Vuetify.js v2.2.15
- Vue.js

## Shipping Zones

Shipping zones are important because they allow you to determine where you will ship to, as well as the different costs for shipping to those different countries, states, or regions. 

![Adding a Zone](https://i.imgur.com/SbxB7oP.png)

### Adding a shipping zone:
To add a shipping zone for your store you should first login to your [Chec dashboard](https://authorize.chec.io/login) and locate the [Shipping](https://dashboard.chec.io/setup/shipping#) tab located in your dashboards setup. Click on the **"+ Add Zone"** button, a modal that contains a form will pop up and ask for some pieces of information; A Zone Name, the name of the zone or region. Countries & Regions, the countries and/or regions you will ship your store's products to. Base Rates, the base rate for shipping to the new shipping zone. 

<img src="https://i.imgur.com/zmLiuJx.png" height="350" width="425" />

### Adding a shipping zone to your products:

You have just set up a shipping zone, now to add the zone to your products. Go to your products in your dashboard and elect a product and scroll down to **Delivery Options**. Enable the newly created zone that appears underneath the default. This will allow you to notify the users of price changes based on the user's selected shipping arrangements, as well as supply the [capture](https://commercejs.com/docs/api/#capture-order) method with the necessary shipping option id to submit the transaction. 

![Add zone to product ](https://i.imgur.com/0TRrqni.png)

## 1. Generating a checkout token:

One of the key parts to capturing a checkout is generating a checkout token using the following method: [generateToken()](https://commercejs.com/docs/api/#generate-token). For this, you will go back into your `store/index.js` file add a new propert on the state object called: `token` which will equal an empty object and add a new action: `genCheckoutToken()`. This action will do as the name says and create a token to be used to capture a checkout order. `generateToken()` expects one parameter, which could be a cart's id, a product's id, or a permalink. The second parameter shouldd be an object that states the type of id you are passing as the first parameter, in this scenario you will be using your cart's id. If all checks out and the reqest is successful; simply commit the token to a `setToken` mutation, which will just set the state's token object to the response of `generateToken()`.

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

After your store has been updated go to your components directory and open up `components/Checkout.vue` in your editor and add your new action to `mapActions` and update the checkout button to call `genToken(cart.id)` when a click event is triggered. Also add the `to="/checkout"` prop and set it to the new checkout route that you will be creating, which can be read about in [Vuetify's VBtn docs](https://vuetifyjs.com/en/components/buttons/)

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


## 3. Generating a checkout token

Your users will need some sort of form or inputs to be able to enter the necessary information in order to submit and complete a checkout order. So first we will go over the expected data that will be necessary in building out this form component. The method used to checkout an order is the [capture(checkout_token_id, data)](https://commercejs.com/docs/api/#capture-order) method on the `checkout` class. The `capture` method expects **2** parameters, a `checkout_token_id: string` and an object that contains data from the user and from their cart.

``` js
// sample capture() method object parameter.
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

## BillingDetails.vue

Create a new Vue file named: `BillingDetails.vue` and put it in the `/components` directory. For this component you will use Vuetify's [VForm components](https://vuetifyjs.com/en/components/forms/) that will contain a few [VTextField](https://vuetifyjs.com/en/components/text-fields/)'s, a couple [VSelect](https://vuetifyjs.com/en/components/selects/)'s and a VBtn component at the end to submit the order.  

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

## BillingDetails.vue cont.

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


## Submit and capture a checkout

This is the last part to the `BillingDetails.vue` component, the `submitOrder()` method. This method first validates the form, if it does not pass validation then return and stop execution of the method's code. If the form and the inputs pass validation, then begin building the `data` object which will be passed to the [checkout.capture()](https://commercejs.com/docs/api/#capture-order) method. The `capture()` method is passed a `checkout_token_id` and the `data` object which will contain all the data billing details provided by the user, the cart's line items, the shipping methods associated with the shipping region, and finally credit card information. Once this object is built you will call the `capture()` method by passing the checkout token id and `data` object, and whether the response is a result or an error you will emit a different event. In the case of a successful result: `'orderComplete'` passing an object containing the order id and customer's reference. In the case of an error: `'orderError'` passing the caught error. 

``` js
// BillingDetails.vue
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
  ...
  }

```



## Checkout page component

This next step you will be creating a new Vue component in the pages directory; `pages/checkout.vue`, this component will be the `/checkout` route as Nuxt will create that route by just adding the `checkout.vue` component file inside of your [Nuxt Pages](https://nuxtjs.org/guide/views#pages) directory.

``` js
// pages/checkout.vue
```




The first thing you'll want to do is revisit your Vuex store located at `store/index.js` and create an empty object in `state` named `cart` which is where all your data related to your cart will be. Next, to retrieve the cart you will go ahead and create an async action, `retrieveCart()`. This action will call `cart.retrieve()` and to retrieve your cart, or intialize a new one. Keep in mind that it is important that these actions are asynchronous and return promises or `nuxtServerInit()` will not work properly. Once those are done, you will want to build out three more actions; [addProductToCart](https://commercejs.com/docs/api/#add-item-to-cart): Adds a product to your cart, [removeProductFromCart](https://commercejs.com/docs/api/#remove-item-from-cart): Removes a product from the cart, (emptyCart)[https://commercejs.com/docs/api/#empty-cart]: Empties the cart. After your actions are complete, you will want to update the `nuxtServerInit()` action to dispatch both `getProducts` and `retrieveCart` and commit mutations to update the state with the returned data([cart.retrieve()](https://commercejs.com/docs/api/#retrieve-a-cart), [products.list()](https://commercejs.com/docs/api/#list-all-products)). After you finish that up, create your mutations which will be, `setProducts`: Sets your products in state, `setCart`: Called by multiple actions to set the `cart` object in state, and then `clearCart`: which will clear your cart object and set it back to it's default value(`{}`). And lastly, you'll want to create the following `getters` to easily retrieve your state from any component. A `cart` getter to retrieve your cart data, and one final getter for the `subtotal` property from the `cart` object called `cartSubtotal`.

```js
// store/index.js

// State
export const state = {
  products: [],
  cart: {}
}

// Actions
export const actions = {
  async nuxtServerInit({ dispatch }) {
    const products = await dispatch('getProducts')

    if (products) {
      await dispatch('retrieveCart')
    }
  },

  async getProducts({ commit }) {
    const products = await Vue.prototype.$commerce.products.list()

    if (products) {
      commit('setProducts', products.data)
    }
  },

  async retrieveCart({ commit }) {
    const cart = await Vue.prototype.$commerce.cart.retrieve()

    if (cart) {
      commit('setCart', cart)
    }
  },

  async addProductToCart({ commit }, { id, count }) {
    const addProduct = await Vue.prototype.$commerce.cart.add(id, (count += 1))

    if (addProduct) {
      commit('setCart', addProduct.cart)
    }
  },

  async removeProductFromCart({ commit }, payload) {
    const removeProduct = await Vue.prototype.$commerce.cart.remove(payload)

    if (removeProduct) {
      commit('setCart', removeProduct.cart)
    }
  },

  async clearCart({ commit }) {
    const clear = await Vue.prototype.$commerce.cart.empty()

    if (clear) {
      commit('clearCart')
    }
  }
}

// Mutations
export const mutations = {
  setProducts(state, payload) {
    state.products = payload
  },

  setCart(state, payload) {
    state.cart = payload
  },

  clearCart(state) {
    state.cart = {}
  }
}

// Getters
export const getters = {
  products(state) {
    return state.products
  },

  cart(state) {
    return state.cart
  },

  cartSubtotal(state) {
    if (state.cart.subtotal) {
      return state.cart.subtotal.formatted
    }
  }
}

```

### 2. Update CommerceItem.vue
In this next step, you will be updating your `CommerceItem.vue` component from the previous guide to use the `addProductToCart`([Add To Cart Response](https://commercejs.com/docs/api/#add-item-to-cart)) action in combination with a component method to allow the specified item to be added to a cart. To do that you will first import Vuex's [...mapActions](https://vuex.vuejs.org/guide/actions.html#dispatching-actions-in-components) to map your store's actions, making them available in your component without having to call `this.$store.dispatch()`. Add the `methods` property to your component in your default export. Inside of your methods you will call `...mapActions` and put the action that you want to dispatch inside, in this case that will be 'addProductToCart' and what it will be bound to in your component(`addToCart`). This will allow you to use `@click="addToCart(product.id)"` for the button event to add that product to your cart. To further understand how a Vuetify button works and all of it's available props, I recommended checking out Vuetify's [v-btn Component](https://vuetifyjs.com/en/components/buttons/).

```js
// CommerceItem.vue
<template>
  <v-card>
    ...
    <v-btn
      block
      class="my-2 mx-1"
      color="green"
      large
      @click="addToCart(product.id)"
     >
       <v-icon class="mr-2" small>mdi-lock</v-icon>
         Add To Cart
     </v-btn>
    ...
  </v-card
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'CommerceItem',
  props: {
    product: {
      type: Object,
      default: () => ({
        description: '',
        id: '',
        media: null,
        name: '',
        price: null,
        quantity: null
      })
    }
  },
  methods: {
    ...mapActions({
      addToCart: 'addProductToCart'
    }),
  }
}
</script>

```

### 3. Cart component
This next step you will be utilizing two of the actions you created earlier in order to build out a cart component and display cart data using Vuetify. First, create your `Checkout.vue` component file in the `components/` directory. From there, you will get started with the `<script></script>` tag and build from there as the component's starting point. At the top import `mapActions` as you will need it for dispatching the actions required for this component. Inside of your export default, you should first start with the `name` property and make sure it matches the filename of the component. Following name, you will write out the props this component will be using. Start off with a `cart` prop which will just be an object type since that's the type it was given in your state. A `value` prop will be a boolean type and used for Vuetify's [v-navigation-drawer](https://vuetifyjs.com/en/components/navigation-drawers), the base of this component. For your methods, use `...mapActions` so you can map the `removeProductFromCart`  action as `removeProduct()` and the `clearCart` action as `clearCart()` inside of your Checkout component.

```js
// components/Checkout.vue
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
  methods: {
    ...mapActions({
      removeProduct: 'removeProductFromCart',
      clearCart: 'clearCart'
    })
  }
}
</script>
```

Here is the template that will be used inside of `components/Checkout.vue`, As you notice in `<v-navigation-drawer>` the `value` prop is bound to the navigation drawer's value, which determines it's open or closed state. There is also a [v-chip](https://vuetifyjs.com/en/components/chips/) component that emit's an event to it's parent when clicked called `closeDrawer`, which will being closing the navigation drawer. Inside of the `v-for` template there is a [v-icon](https://vuetifyjs.com/en/components/icons/) with a click event attached that calls the `removeProduct(product.id)` method and passes the `id` of the cart item to remove it. The last important component is the `v-btn` that calls the `clearCart` method when clicked and will entirely empty the cart. The rest of the template is up to you how you'd like to style it, as long as you keep in mind to utilize those methods and props. A full demonstrated Checkout component template is provided below.

*** Note ***
The demo link provided at the beginning and end of this guide utilizes this template in the checkout component.

```js
// code here
```

### 4. Importing and using Checkout.vue

Since you just created a `Checkout.vue` component, it is time to use it in your application. To do that go to your `pages/index.vue` and add the component to your import's like so: `import Checkout from '~/components/Checkout`, be sure to add `Checkout` to your `index.vue`'s `components` property to correctly register the component. While you are doing imports, it would also be a good time to import the [mapGetters](https://vuex.vuejs.org/guide/getters.html#the-mapgetters-helper) function to map and access your store's getters that were created earlier in this guide. Another addition to this file, will be the [data](https://vuejs.org/v2/guide/instance.html#Data-and-Methods) object which will contain a boolean named `drawer` that will dictate the state of the `Checkout.vue` drawer. The last bit for the script tag is to add the `computed` property and utilize `...mapGetters` to map your `product`, `cart`, and `cartSubtotal` getters that you created earlier as computed properties. 

Now that your components script tag is updated, add the `<checkout />` component element to the template and be sure to set the [v-model](https://vuejs.org/v2/guide/forms.html) attribute to the `drawer` data property and add a `@closeDrawer` listener that sets `drawer` to the opposite of it's current boolean value when `closeDrawer` is emitted from the button you created in the previous section for `Checkout.vue`. The last step for this page component will be to create a button that will activate your Checkout drawer when clicked. For this create a `<v-btn>` and add a `@click` event that will set `drawer` in the data object to it's opposite value. 

```js
// code here
```

***With the previous steps put together you should have something pretty close to this:***

![Checkout.vue](https://i.imgur.com/xa1aKg3.png)

### 5. Run your app!

You should now be able to run your Nuxt application and start adding items to your cart.

```js
// yarn
yarn dev

//npm
npm run dev
```

[Live Demo](https://commercejs-sdk-nuxt-checkout.herokuapp.com/)

## Conclusion
Nice work, you've successfully created a checkout page that contained a form to capture an order.

Let's review what we have accommplished in this guide.

* Learned how to add product variants in your Chec dashboard.
* Expanded your Vuex store to include adding and removing a product from the cart, emptying your cart, and retrieving cart data server-side. 
* Created a navigation drawer Checkout component to display cart data and manipulate the cart's items.
* Listed cart items in your Checkout component with the subtotal.

As you can see, the Commerce.js SDK makes managing a cart straightforward and easy, the only thing left for you to do is style the layout how you see fit.

This guide continues from (Listing products in a catalogue with Nuxt.js and Commerce.js)[Listing Products in a Catalogue](https://github.com/ElijahKotyluk/commercejs-nuxt-demo)

## Built With

* [Nuxt.js](https://github.com/nuxt/nuxt.js) - The front-end framework used
* [Vuetify](https://github.com/vuetifyjs/vuetify) - The Vue material component library used
* [Yarn](https://github.com/yarnpkg/yarn) - Package manager tool

## Authors

* **ElijahKotyluk** - [Github](https://github.com/ElijahKotyluk)

