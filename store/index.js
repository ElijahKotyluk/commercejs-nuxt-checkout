import Vue from 'vue'

const commerce = Vue.prototype.$commerce
export const state = () => ({
  products: [],
  cart: {}
})

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
  },

  async updateCart({ commit }, { id, quantity }) {
    const update = await commerce.cart.update(id, quantity)

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
  }
}
