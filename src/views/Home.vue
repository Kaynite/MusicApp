<template>
  <!-- Introduction -->
  <section class="mb-8 py-20 text-white text-center relative">
    <div
      class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(assets/img/header.png)"
    ></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">
          {{ $t("listen") }}
        </h1>
        <p class="w-full md:w-8/12 mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dolor mollis, congue augue non, venenatis elit. Nunc justo eros,
          suscipit ac aliquet imperdiet, venenatis et sapien. Duis sed magna
          pulvinar, fringilla lorem eget, ullamcorper urna.
        </p>
      </div>
    </div>

    <img
      class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="assets/img/introduction-music.png"
    />
  </section>

  <!-- Main Content -->
  <section class="container mx-auto">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200 flex">
        <span class="card-title">{{ $t("songs") }}</span>
        <i class="fa fa-headphones-alt text-2xl ms-auto text-green-500"></i>
      </div>
      <!-- Playlist -->

      <ol id="playlist" v-if="songs.length">
        <SongItem v-for="song in songs" :key="song.docID" :song="song" />
      </ol>
      <p class="text-center p-4" v-else>{{ $t("no songs") }}</p>
      <!-- .. end Playlist -->
    </div>
  </section>
</template>

<script>
import SongItem from "@/components/SongItem.vue";
import { songsCollection } from "@/includes/firebase";

export default {
  name: "Home",
  components: { SongItem },
  data() {
    return {
      songs: [],
      perPage: 10,
      lastDoc: null,
      pendingRequests: false,
    };
  },
  methods: {
    async getSongs() {
      if (this.pendingRequests) {
        return;
      }
      this.pendingRequests = true;
      let snapshots = songsCollection
        .orderBy("modified_name")
        .limit(this.perPage);

      if (this.lastDoc != null) {
        snapshots = snapshots.startAfter(this.lastDoc);
      }

      snapshots = await snapshots.get();

      this.lastDoc = snapshots.docs[snapshots.docs.length - 1];

      snapshots.forEach((document) => {
        this.songs.push({
          docID: document.id,
          ...document.data(),
        });
      });
      this.pendingRequests = false;
    },
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;

      if (Math.round(innerHeight) + scrollTop == offsetHeight) {
        this.getSongs();
      }
    },
  },
  created() {
    this.getSongs();

    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>
