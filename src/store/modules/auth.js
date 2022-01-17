import { auth, usersCollection } from "@/includes/firebase";

export default {
  state: {
    showAuthModal: false,
    userLoggedIn: false,
  },
  mutations: {
    toggleAuthModal(state) {
      state.showAuthModal = !state.showAuthModal;
    },
    login(state) {
      state.userLoggedIn = true;
    },
    logout(state) {
      state.userLoggedIn = false;
    },
  },
  getters: {
    showAuthModal: (state) => state.showAuthModal,
  },
  actions: {
    async register({ commit }, payload) {
      const userCred = await auth.createUserWithEmailAndPassword(
        payload.email,
        payload.password
      );

      await usersCollection.doc(userCred.user.uid).set({
        name: payload.name,
        email: payload.email,
        age: payload.age,
        country: payload.country,
      });

      userCred.user.updateProfile({
        displayName: payload.name,
      });

      commit("login");
    },

    async login({ commit }, payload) {
      await auth.signInWithEmailAndPassword(payload.email, payload.password);

      commit("login");
    },

    async logout({ commit }) {
      await auth.signOut();
      commit("logout");
    },

    attemptLogin({ commit }) {
      if (auth.currentUser) {
        commit("login");
      }
    },
  },
};
