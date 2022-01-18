<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200 flex">
      <span class="card-title">{{ $t("upload") }}</span>
      <i class="fas fa-upload ms-auto text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{
          'text-white bg-green-400 border-green-40 border-solid': isDragover,
        }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragenter.prevent.stop="isDragover = true"
        @dragend.prevent.stop="isDragover = false"
        @dragleave.prevent.stop="isDragover = false"
        @dragover.prevent.stop="isDragover = true"
        @drop.prevent.stop="upload($event)"
      >
        <h5>{{ $t("drop here") }}</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="(upload, index) in uploads" :key="index">
        <!-- File Name -->
        <div class="font-bold text-sm mb-1" :class="upload.textColor">
          <i :class="upload.icon"></i>
          {{ upload.filename }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: `${upload.currentProgress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, storage, songsCollection } from "@/includes/firebase";

export default {
  name: "Upload",
  data() {
    return {
      isDragover: false,
      uploads: [],
    };
  },
  methods: {
    upload(event) {
      this.isDragover = false;

      const files = event.dataTransfer
        ? [...event.dataTransfer.files]
        : [...event.target.files];

      files.forEach((file) => {
        if (file.type !== "audio/mpeg") {
          return;
        }
        const storageRef = storage.ref();
        const songsRef = storageRef.child(`songs/${file.name}`);
        const task = songsRef.put(file);
        let index =
          this.uploads.push({
            task,
            currentProgress: 0,
            filename: file.name,
            variant: "bg-blue-400",
            icon: "fas fa-spinner fa-spin",
            textColor: "",
          }) - 1;

        task.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploads[index].currentProgress = progress;
          },
          () => {
            this.uploads[index].variant = "bg-red-400";
            this.uploads[index].icon = "fas fa-times";
            this.uploads[index].textColor = "text-red-400";
          },
          async () => {
            const song = {
              uid: auth.currentUser.uid,
              displayName: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: "",
              comments_count: 0,
              url: await task.snapshot.ref.getDownloadURL(),
            };

            const songRef = await songsCollection.add(song);
            const songSnapshot = await songRef.get();
            this.addSong(songSnapshot);

            this.uploads[index].variant = "bg-green-400";
            this.uploads[index].icon = "fas fa-check";
            this.uploads[index].textColor = "text-green-400";
          }
        );
      });
    },
  },
  props: ["addSong"],
  beforeUnmount() {
    if (this.uploads.length) {
      this.uploads.forEach((upload) => {
        upload.task.cancel();
      });
    }
  },
};
</script>

<style></style>
