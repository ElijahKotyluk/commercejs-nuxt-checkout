<template>
  <v-form class="px-1">
    <v-row>
      <v-col>
        <v-text-field
          name="firstName"
          label="First Name"
          outlined
          :rules="[rules.required]"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          name="lastName"
          label="Last Name"
          outlined
          :rules="[rules.required]"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-text-field
      name="phone"
      label="Phone #"
      outlined
      :rules="[rules.required]"
    ></v-text-field>
    <v-text-field
      name="email"
      label="Email"
      outlined
      :rules="[rules.required, rules.email]"
    ></v-text-field>
    <v-text-field
      name="address"
      label="Street Address"
      outlined
      :rules="[rules.required]"
    ></v-text-field>
    <v-text-field
      name="city"
      label="City"
      outlined
      :rules="[rules.required]"
    ></v-text-field>
    <v-text-field
      name="state"
      label="State"
      outlined
      :rules="[rules.required]"
    ></v-text-field>
    <v-text-field
      name="zip"
      label="Zip Code"
      outlined
      :rules="[rules.required]"
    ></v-text-field>
  </v-form>
</template>

<script>
export default {
  name: 'BillingDetails',
  data: () => ({
    rules: {
      email: (v) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(v) || 'Invalid e-mail.'
      },
      required: (v) => !!v || 'Required'
    }
  })
}
</script>
