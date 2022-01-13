<template>
  <VeeForm :validation-schema="schema" @submit="login">
    <div
      class="text-white text-center p-4 mb-4 rounded font-bold"
      :class="[alert_variant, { hidden: !show_alert }]"
    >
      {{ alert_msg }}
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <VeeField
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage name="email" class="text-red-600" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <VeeField
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage name="password" class="text-red-600" />
    </div>
    <button
      :disabled="in_submission"
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      Submit
    </button>
  </VeeForm>
</template>

<script>
export default {
  name: "LoginForm",
  data() {
    return {
      schema: {
        email: "required|email|min:3|max:255",
        password: "required|min:6|max:255",
      },
      in_submission: false,
      show_alert: false,
      alert_variant: "bg-green-500",
      alert_msg: "",
    };
  },
  methods: {
    async login(values) {
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = "bg-blue-500";
      this.alert_msg = "Authenticating!";

      try {
        await this.$store.dispatch("login", values);
      } catch (error) {
        this.in_submission = false;
        this.alert_variant = "bg-red-500";
        this.alert_msg = "Invalid Login Data!";
        return;
      }

      this.in_submission = false;
      this.alert_variant = "bg-green-500";
      this.alert_msg = "Logged in successfully!";
      window.location.reload();
    },
  },
};
</script>

<style></style>
