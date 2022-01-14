<template>
  <AppHeader></AppHeader>
  <router-view></router-view>
  <AppPlayer></AppPlayer>
  <AuthModal></AuthModal>
</template>

<script>
import AppHeader from "./components/Header.vue";
import AuthModal from "./components/AuthModal.vue";
import AppPlayer from "@/components/Player.vue";

export default {
  name: "App",
  components: {
    AppHeader,
    AuthModal,
    AppPlayer,
  },
  created() {
    this.$store.dispatch("attemptLogin");
  },
};
</script>
