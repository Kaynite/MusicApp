<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <AppUpload :addSong="addSong" />
      </div>
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <CompositionItem
              v-for="(song, index) in songs"
              :key="song.docID"
              :song="song"
              :index="index"
              :updateSong="updateSong"
              :removeSong="removeSong"
              :updateEditingStatus="updateEditingStatus"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AppUpload from "@/components/Upload.vue";
import { songsCollection, auth } from "@/includes/firebase";
import CompositionItem from "@/components/CompositionItem.vue";
export default {
  name: "Manage",
  components: {
    AppUpload,
    CompositionItem,
  },
  data: () => ({
    songs: [],
    isEditing: false,
  }),
  methods: {
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name;
      this.songs[i].genre = values.genre;
    },
    removeSong(i) {
      this.songs.splice(i, 1);
    },
    addSong(document) {
      const song = {
        ...document.data(),
        docID: document.id,
      };
      this.songs.push(song);
    },
    updateEditingStatus(value) {
      this.isEditing = value;
    },
  },
  async created() {
    const snapshot = await songsCollection
      .where("uid", "==", auth.currentUser.uid)
      .get();
    snapshot.forEach(this.addSong);
  },
  beforeRouteLeave(to, from, next) {
    if (this.isEditing) {
      next(
        confirm("You have unsaved chnages. Are you sure you want to leave?")
      );
    } else {
      next();
    }
  },
};
</script>

<style></style>
