<template>
  <v-dialog
    :value="dialog"
    class="d-flex justify-center"
    max-width="600"
    @input="$emit('update:dialog', false)"
  >
    <v-card class="text-center">
      <v-card-title>
        <span>{{ product.name }} -</span>
        <v-spacer></v-spacer>
        <span class="green--text">
          {{ product.price.formatted_with_symbol }}
        </span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="mt-5 mb-5">
        {{ strippedDesc }}
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="black" text @click="closeDialog">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ProductDetails',
  props: {
    product: {
      type: Object,
      default: () => {}
    },
    dialog: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    strippedDesc() {
      let str = this.product.description
      if (str === '') return

      str = str.toString()
      return str.replace(/(<([^>]+)>)/gi, '')
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style>
.nav-text {
  color: #6c7c8f;
}
</style>
