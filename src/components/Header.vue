<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
        >Music</router-link
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li v-if="!isLoggedIn">
            <a
              class="px-2 text-white"
              href="#"
              @click.prevent="toggleAuthModal"
            >
              {{ $t("log_reg") }}
            </a>
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">{{
                $t("manage")
              }}</router-link>
            </li>

            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logout">{{
                $t("logout")
              }}</a>
            </li>
          </template>
        </ul>
        <ul class="text-white ms-auto">
          <li @click="changeLocale" class="cursor-pointer">
            {{ currentLocale }}
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "Header",
  methods: {
    ...mapMutations(["toggleAuthModal"]),
    logout() {
      this.$store.dispatch("logout");
      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: "home" });
      }
    },
    changeLocale() {
      const body = document.querySelector("body");
      if (this.$i18n.locale == "en") {
        this.$i18n.locale = "ar";
        body.classList.add("rtl");
        body.setAttribute("dir", "rtl");
      } else {
        this.$i18n.locale = "en";
        body.classList.remove("rtl");
        body.setAttribute("dir", "ltr");
      }
    },
  },
  computed: {
    ...mapState({
      isLoggedIn: (state) => state.auth.userLoggedIn,
    }),
    currentLocale() {
      return this.$i18n.locale == "ar" ? "English" : "العربية";
    },
  },
};
</script>
