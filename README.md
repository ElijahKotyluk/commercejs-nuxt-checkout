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

You have just set up a shipping zone, now it's time to go to your products, select a product and scroll down to **Delivery Options** and enable the newly created zone. 

![Add zone to product ](https://i.imgur.com/0TRrqni.png)

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

