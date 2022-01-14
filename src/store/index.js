import { createStore } from "vuex";
import { auth, usersCollection } from "@/includes/firebase";
import { Howl } from "howler";
import helper from "@/includes/helpers";

export default createStore({
  state: {
    showAuthModal: false,
    userLoggedIn: false,
    currentSong: {},
    sound: {},
    seek: "00:00",
    duration: "00:00",
    songProgress: "0%",
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
    newSong(state, payload) {
      state.currentSong = payload;
      state.sound = new Howl({
        src: state.currentSong.url,
        html5: true,
      });
    },
    updatePosition(state) {
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());

      state.songProgress = `${
        (state.sound.seek() / state.sound.duration()) * 100
      }%`;
    },
  },
  getters: {
    showAuthModal: (state) => state.showAuthModal,
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }
      return false;
    },
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

    newSong({ commit, state, dispatch }, payload) {
      if (state.sound instanceof Howl) {
        state.sound.unload();
      }

      commit("newSong", payload);
      state.sound.play();

      state.sound.on("play", () => {
        requestAnimationFrame(() => {
          dispatch("progress");
        });
      });
    },

    toggleAudio({ state }) {
      if (state.sound.playing) {
        if (state.sound.playing()) {
          state.sound.pause();
        } else {
          state.sound.play();
        }
      }
    },

    progress({ state, commit, dispatch }) {
      commit("updatePosition");
      if (state.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch("progress");
        });
      }
    },

    updateSeek({ state, dispatch }, payload) {
      const { x, width } = payload.currentTarget.getBoundingClientRect();

      const clickX = payload.clientX - x;
      const percentage = clickX / width;
      const seconds = state.sound.duration() * percentage;

      state.sound.seek(seconds);
      state.sound.once("seek", () => {
        dispatch("progress");
      });
    },
  },
  modules: {},
});
