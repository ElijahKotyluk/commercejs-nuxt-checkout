import Vue from 'vue'

const v = Vue.prototype
export const state = () => ({
  products: [],
  cart: {},
  token: {}
})

// Actions
export const actions = {
  async nuxtServerInit({ dispatch }) {
    return await dispatch('getProducts')
  },

  async getProducts({ commit }) {
    const products = await v.$commerce.products.list()

    if (products) {
      commit('setProducts', products.data)
    }
  },

  async retrieveCart({ commit }) {
    const cart = await v.$commerce.cart.retrieve()

    if (cart) {
      commit('setCart', cart)
    }
  },

  async genCheckoutToken({ commit }, payload) {
    const token = await v.$commerce.checkout.generateToken(payload, {
      type: 'cart'
    })

    if (token) {
      commit('setToken', token)
    }
  },

  async addProductToCart({ commit }, { id, count }) {
    const addProduct = await v.$commerce.cart.add(id, (count += 1))

    if (addProduct) {
      commit('setCart', addProduct.cart)
    }
  },

  async removeProductFromCart({ commit }, payload) {
    const removeProduct = await v.$commerce.cart.remove(payload)

    if (removeProduct) {
      commit('setCart', removeProduct.cart)
    }
  },

  async clearCart({ commit }) {
    const clear = await v.$commerce.cart.empty()

    if (clear) {
      commit('clearCart')
    }
  },

  async updateCart({ commit }, { id, quantity }) {
    const update = await v.$commerce.cart.update(id, quantity)

    if (update) {
      commit('updateCart', update)
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

  setToken(state, payload) {
    state.token = payload
  },

  addProductToCart(state, payload) {
    state.cart.push(payload)
  },

  removeProductFromCart(state, payload) {
    const filtered = state.cart.filter((v) => {
      return v.line_item_id !== payload
    })

    state.cart = filtered
  },

  clearCart(state) {
    state.cart = {}
  },

  updateCart(state, payload) {
    state.cart = payload
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
  },

  token(state) {
    return state.token
  }
}
