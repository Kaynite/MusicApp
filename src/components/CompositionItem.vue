<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm" class="flex">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 ms-auto"
        @click.prevent="showForm = true"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600"
        @click.prevent="destroy"
      >
        <i class="fa fa-times"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div
        class="text-center text-white font-bold p-4 mb-4 rounded"
        :class="alert.variant"
        v-if="alert.show"
      >
        {{ alert.message }}
      </div>
      <VeeForm
        @submit="update"
        :validation-schema="schema"
        :initial-values="initialValues"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">{{ $t("song title") }}</label>
          <VeeField
            name="title"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            :placeholder="$t('enter song title')"
            @input="updateEditingStatus(true)"
          />
          <ErrorMessage name="title" class="text-red-600" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">{{ $t("genre") }}</label>
          <VeeField
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            :placeholder="$t('enter genre')"
            @input="updateEditingStatus(true)"
          />
          <ErrorMessage name="genre" class="text-red-600" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600 me-2"
          :disabled="inSubmission"
        >
          {{ $t("submit") }}
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          @click.prevent="showForm = false"
          :disabled="inSubmission"
        >
          {{ $t("go back") }}
        </button>
      </VeeForm>
    </div>
  </div>
</template>

<script>
import { songsCollection, storage } from "@/includes/firebase";
export default {
  name: "CompositionItem",
  data() {
    return {
      showForm: false,
      schema: {
        title: "required|min:3|max:100",
        genre: "alpha_spaces",
      },
      initialValues: {
        title: this.song.modified_name,
        genre: this.song.genre,
      },
      alert: {
        show: false,
        variant: "bg-blue-500",
        message: "",
      },
      inSubmission: false,
    };
  },
  methods: {
    async update(values) {
      this.inSubmission = true;
      this.alert.show = true;
      this.alert.variant = "bg-blue-500";
      this.alert.message = "Updating the song! Please wait!";

      try {
        await songsCollection
          .doc(this.song.docID)
          .update({ modified_name: values.title, genre: values.genre });
      } catch (error) {
        this.inSubmission = false;
        this.alert.variant = "bg-red-500";
        this.alert.message = "Something went wrong! Try again later";
        return;
      }
      this.updateSong(this.index, {
        modified_name: values.title,
        genre: values.genre,
      });
      this.updateEditingStatus(false);
      this.inSubmission = false;
      this.alert.variant = "bg-green-500";
      this.alert.message = "Updated Successfully!";
    },
    async destroy() {
      const storageRef = storage.ref();
      const songRef = storageRef.child(`songs/${this.song.original_name}`);
      await songRef.delete();
      await songsCollection.doc(this.song.docID).delete();
      this.removeSong(this.index);
    },
  },
  props: {
    song: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateEditingStatus: {
      type: Function,
      required: false,
    },
  },
};
</script>
