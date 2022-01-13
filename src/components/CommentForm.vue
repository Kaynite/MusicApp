<template>
  <VeeForm @submit="addComment" :validation-schema="schema">
    <VeeField
      as="textarea"
      name="comment"
      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      placeholder="Your comment here..."
    />
    <ErrorMessage name="comment" class="text-red-500" as="p" />
    <button
      type="submit"
      class="py-1.5 px-3 rounded text-white bg-green-600 block mt-4"
    >
      Submit
    </button>
  </VeeForm>
</template>

<script>
export default {
  name: "CommentForm",
  data() {
    return {
      schema: {
        comment: "required|min:3",
      },
    };
  },
  methods: {
    addComment() {
      console.log("aaaaa");
    }
  }
};
</script>
