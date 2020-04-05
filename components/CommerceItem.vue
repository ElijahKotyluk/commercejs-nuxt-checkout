<template>
  <v-card class="mb-5" elevation="0" height="375" width="350">
    <v-hover v-slot:default="{ hover }">
      <v-img :src="product.media.source" aspect-ratio="1" contain>
        <v-overlay
          :value="hover"
          absolute
          color="rgba(255, 255, 255, 0.956)"
          opacity="0.85"
          z-index="3"
        >
          <v-btn
            block
            class="my-2 mx-1"
            color="#6c7c90"
            large
            outlined
            @click="showDialog"
          >
            Product Details
          </v-btn>
          <v-btn
            v-if="product.quantity > 0"
            block
            class="my-2 mx-1"
            color="green"
            large
            @click="addToCart({ id: product.id })"
          >
            <v-icon class="mr-2" small>mdi-lock</v-icon>
            Add To Cart
          </v-btn>
          <v-btn
            v-if="product.quantity <= 0"
            block
            class="my-2 mx-1 accent-1"
            color="red"
            large
          >
            <v-icon class="mr-2" small>mdi-lock</v-icon>
            Sold Out
          </v-btn>
        </v-overlay>
      </v-img>
    </v-hover>
    <v-card-actions>
      {{ product.name }}
      <span
        v-if="product.quantity <= 0"
        class="caption font-italic font-weight-medium red--text accent-1"
      >
        (Sold out)
      </span>

      <v-spacer></v-spacer>

      <span class="ml-2">{{ product.price.formatted_with_symbol }}</span>
    </v-card-actions>

    <product-details
      :product="product"
      :dialog.sync="showDetails"
      @closeDialog="closeDialog"
    />
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import ProductDetails from './ProductDetails'

export default {
  name: 'CommerceItem',
  components: {
    ProductDetails
  },
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
  data: () => ({
    showDetails: false
  }),
  methods: {
    ...mapActions({
      addToCart: 'addProductToCart'
    }),
    closeDialog() {
      this.showDetails = false
    },
    showDialog() {
      this.showDetails = true
    }
  }
}
</script>

<style>
.v-image__image {
  height: 80%;
  width: 100%;
}
</style>
