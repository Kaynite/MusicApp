<template>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)"
    ></div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button
        @click.prevent="newSong(song)"
        type="button"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
      >
        <i class="fas fa-play"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song.modified_name }}</div>
        <div>{{ song.genre }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">Comments ({{ comments.length }})</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <CommentForm
          :getComments="getComments"
          :commentsCount="song.comments_count"
        />
        <!-- Sort Comments -->
        <select
          v-model="sort"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        >
          <option value="1">Latest</option>
          <option value="2">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto" id="comments">
    <li
      class="p-6 bg-gray-50 border border-gray-200"
      v-for="comment in sortedComments"
      :key="comment.docID"
    >
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{ comment.name }}</div>
        <time>{{ comment.date }}</time>
      </div>

      <p>
        {{ comment.content }}
      </p>
    </li>
  </ul>
</template>

<script>
import { songsCollection, commentsCollection } from "@/includes/firebase";
import CommentForm from "@/components/CommentForm.vue";
import { mapActions } from "vuex";

export default {
  components: { CommentForm },
  name: "Song",
  data() {
    return {
      song: {},
      comments: [],
      sort: "1",
    };
  },
  computed: {
    sortedComments() {
      if (this.sort == "1") {
        return this.comments.slice().sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
      }
      return this.comments.slice().sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
    },
  },
  methods: {
    ...mapActions(["newSong"]),
    async getComments() {
      const comments = await commentsCollection
        .where("song_id", "==", this.$route.params.id)
        .get();
      this.comments = [];
      comments.forEach((comment) => {
        this.comments.push({
          docID: comment.id,
          ...comment.data(),
        });
      });
    },
  },
  async created() {
    const song = await songsCollection.doc(this.$route.params.id).get();
    if (song.exists) {
      this.song = song.data();
      this.getComments();
      const { sort } = this.$route.query;
      this.sort = sort == "1" || sort == "2" ? sort : "1";
    } else {
      this.$router.push({ name: "404" });
    }
  },
  watch: {
    sort(newValue) {
      if (this.$route.query.sort !== newValue) {
        this.$router.push({
          query: {
            sort: newValue,
          },
        });
      }
    },
  },
};
</script>
