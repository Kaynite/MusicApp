<template>
  <section v-if="userLoggedIn">
    <div
      class="text-white text-center p-4 mb-4 rounded"
      :class="alert.variant"
      v-show="alert.show"
    >
      {{ alert.message }}
    </div>
    <VeeForm @submit="addComment" :validation-schema="schema">
      <VeeField
        as="textarea"
        name="comment"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Your comment here..."
      />
      <ErrorMessage name="comment" class="text-red-500" as="p" />
      <button
        :disabled="inSubmission"
        type="submit"
        class="py-1.5 px-3 rounded text-white bg-green-600 block mt-4"
      >
        Submit
      </button>
    </VeeForm>
  </section>
</template>

<script>
import { auth, commentsCollection, songsCollection } from "@/includes/firebase";
import { mapState } from "vuex";

export default {
  name: "CommentForm",
  props: {
    getComments: {
      type: Function,
      required: true,
    },
    commentsCount: {
      required: true,
    },
  },
  data() {
    return {
      schema: {
        comment: "required|min:3",
      },
      inSubmission: false,
      alert: {
        show: false,
        variant: "",
        message: "",
      },
    };
  },
  methods: {
    async addComment(values, { resetForm }) {
      this.inSubmission = true;
      this.alert.variant = "bg-blue-500";
      this.alert.message = "Plaese wait! Your comment is being submitted";
      this.alert.show = true;

      const comment = {
        content: values.comment,
        date: new Date().toString(),
        song_id: this.$route.params.id,
        uid: auth.currentUser.uid,
        name: auth.currentUser.displayName,
      };

      try {
        await commentsCollection.add(comment);
        await songsCollection.doc(this.$route.params.id).update({
          comments_count: this.commentsCount + 1,
        });
      } catch (error) {
        this.inSubmission = false;
        this.alert.variant = "bg-red-500";
        this.alert.message = "An error occured, Please try again later!";
        return;
      }

      this.inSubmission = false;
      this.alert.variant = "bg-green-500";
      this.alert.message = "Your comment was submitted successfully!";

      resetForm();
      this.getComments();
    },
  },
  computed: {
    ...mapState(["userLoggedIn"]),
  },
};
</script>
