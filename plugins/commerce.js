import Commerce from '@chec/commerce.js'
import Vue from 'vue'

Vue.prototype.$commerce = new Commerce(process.env.COMMERCEJS_API_KEY, true)
