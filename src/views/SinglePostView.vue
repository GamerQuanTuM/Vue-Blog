<script setup lang="ts">
import { ref, onMounted, watch, reactive, computed } from 'vue';
import { RouterLink, useRoute, useRouter } from "vue-router";
import { IconUserCircle, IconBrandGithub, IconBrandLinkedin, IconMenu2 } from '@tabler/icons-vue';
import { useConvexMutation, useConvexQuery } from "@convex-vue/core";
import { api } from "../../convex/_generated/api";
import type { Id } from '../../convex/_generated/dataModel';
import { formatPostDescription } from '@/functions';

const navOptions = [
  { name: "HOME", link: "/" },
  { name: "SPORTS", link: "/sports" },
  { name: "TECHNOLOGY", link: "/tech" },
  { name: "GAMING", link: "/gaming" },
  { name: "ENTERTAINMENT", link: "/entertainment" },
]

const visibleSubcomments = ref(new Set())
const activeReplyForm = ref<string | null>(null)
const replyForm = ref({
  name: '',
  email: '',
  comment: ''
})
const showContent = ref(false);

const isMenuOpen = ref(false);
let commentData = reactive({
  name: "",
  email: "",
  comment: ""
})

const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);

const { data: post, isLoading: isPostLoading, error: postError } = useConvexQuery(api.posts.getSingle, { id: id.value as string });
const { data: postBySubject, isLoading: isPostBySubjectLoading, error: postBySubjectError } = useConvexQuery(
  api.posts.getSingleBySubject,
  computed(() => {
    return post.value?.subject ? { subject: post.value.subject } : { subject: '' };
  }),
  { enabled: computed(() => !!post.value?.subject) },
);
const { data: comments, isLoading: isCommentLoading, error: commentError } = useConvexQuery(api.comments.getByPostId, { postId: id.value as string });
const { mutate: postComment, isLoading: isAddCommentLoading, error: addCommentError } = useConvexMutation(api.comments.add)
const { mutate: updateComment, isLoading: isUpdateCommentLoading, error: updateCommentError } = useConvexMutation(api.comments.update)

const handleCommentData = <T extends keyof Comment>(field: T, value: Comment[T]) => {
  commentData = { ...commentData, [field]: value };
};

const submitComment = () => {
  postComment({
    ...commentData,
    postId: id.value as Id<"Post">,
    subcomment: [],
})

  commentData.comment = "",
    commentData.name = "",
    commentData.email = ""
}

const submitReply = (comment: Comment) => {
  const { _creationTime, ...rest } = comment;

  // Filter out undefined values from subcomment array
  const subcomments = (Array.isArray(comment.subcomment) ? comment.subcomment : [comment.subcomment])
    .filter((subcomment): subcomment is { name: string; email: string; comment: string; } => subcomment !== undefined);

  // Ensure replyForm.value is of the correct type
  const newReply = { ...replyForm.value };

  const postCommentObj = {
    ...rest,
    subcomment: [...subcomments, newReply]
  };

  updateComment(postCommentObj);
  replyForm.value = { name: '', email: '', comment: '' };
  activeReplyForm.value = null;
};


const toggleSubcomments = (commentId: string) => {
  if (visibleSubcomments.value.has(commentId)) {
    visibleSubcomments.value.delete(commentId)
  } else {
    visibleSubcomments.value.add(commentId)
  }
}

const isSubcommentsVisible = (commentId: string) => {
  return visibleSubcomments.value.has(commentId)
}

const showReplyForm = (commentId: string | null) => {
  if (activeReplyForm.value === commentId) {
    activeReplyForm.value = null
  } else {
    activeReplyForm.value = commentId
  }
}

const reloadPostData = () => {
  id.value = route.params.id;
  window.location.reload()
};

onMounted(() => {
  setTimeout(() => {
    showContent.value = true;
  }, 500);
});

watch(() => route.params.id, (newId) => {
  if (newId !== id.value) {
    reloadPostData();
  }
});

const filteredPost = computed<Post[]>(() => {
  if (postBySubject?.value && post?.value?._id) {
    return postBySubject.value.filter((p: Post) => p._id != post.value?._id).slice(0, 3);
  }
  return [];
});

const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value;


</script>

<template>
  <div class="bg-white h-auto">
    <nav class="h-14 bg-black">
      <div class="w-[90%] md:w-[70%] h-10 mx-auto flex justify-between items-center pt-5">
        <div class="md:hidden">
          <button @click="toggleMenu">
            <IconMenu2 class="w-5 h-5 text-white" />
          </button>
        </div>
        <div class="flex gap-5 items-center">
          <RouterLink to="/">
            <h1 class="text-lg font-bold text-white mr-10 cursor-pointer">Shuvam's Blog</h1>
          </RouterLink>
          <RouterLink v-for="(option, index) in navOptions" :key="index"
            class="hidden md:block text-gray-300 hover:text-white text-xs p-2" :to="option.link">{{ option.name }}
          </RouterLink>
        </div>
        <div class="flex items-center gap-5">
          <a href="https://www.github.com/GamerQuantuM" target="__blank"
            class="w-6 h-6 border-white rounded-full border-2 flex items-center justify-center">
            <IconBrandGithub class="w-4 h-4 text-gray-300" />
          </a>
          <a href="https://www.linkedin.com/in/shuvam-santra10" target="__blank"
            class="w-6 h-6 border-white rounded-full flex items-center justify-center">
            <IconBrandLinkedin class="w-6 h-6 text-gray-300" />
          </a>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <transition name="fade">
      <div v-if="isMenuOpen" class="absolute top-14 left-0 w-full bg-black text-white pb-10 z-20">
        <div class="flex flex-col mt-8">
          <RouterLink v-for="(option, index) in navOptions" :key="index"
            class="block py-2 px-4 text-base hover:bg-gray-700 transition duration-150 ease-in-out" :to="option.link">
            {{ option.name }}
          </RouterLink>
        </div>
      </div>
    </transition>

    <main class="container mx-auto">
      <div v-if="isPostLoading || isCommentLoading || isPostBySubjectLoading"
        class="flex justify-center items-center min-h-screen px-4">
        <div class="loader"></div>
      </div>

      <div v-if="postError" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded px-4" role="alert">
        <p class="font-bold">Error</p>
        <p>{{ postError.message }}</p>
      </div>

      <article v-else-if="post"
        :class="{ 'opacity-0 translate-y-8': !showContent, 'opacity-100 translate-y-0': showContent }"
        class="bg-white overflow-hidden transition-all duration-500 ease-out">
        <div class="px-4">
          <div class="container mx-auto mt-8 md:mt-20">
            <div class="mt-4 bg-blue-100 px-2.5 py-2 rounded w-fit mx-auto">
              <h1 class="text-blue-800 text-sm md:text-base font-semibold text-center">{{ post.subject }}</h1>
            </div>
          </div>

          <h1 class="text-3xl md:text-5xl font-bold text-gray-900 mt-5 mb-5 md:mb-14 text-center">{{ post.title }}</h1>

          <img :src="post.image" :alt="post.title"
            class="w-full md:w-[80%] mx-auto h-[20rem] md:h-[30rem] object-cover">

          <div
            class="max-w-full md:max-w-[60%] h-auto md:min-h-60 w-auto md:mx-auto md:-mt-32 bg-white p-2 md:p-6 relative md:shadow-lg mb-3 md:mb-10">
            <div class="prose h-auto mx-auto py-5" v-html="post.description"></div>
          </div>
        </div>

        <h1 class="text-xl md:text-3xl font-bold my-3 w-[90%] md:w-[80%] mx-auto">Related Posts</h1>
        <h2 class="text-xs md:text-sm text-indigo-700 font-normal my-3 w-[90%] md:w-[80%] mx-auto">Post you may also
          like</h2>
        <section
          class="flex flex-col md:flex-row md:justify-between items-center my-10 gap-5 w-[90%] md:w-[80%] mx-auto">
          <RouterLink :to="`/${post._id}`" v-for="post in filteredPost" :key="post._id"
            class="flex flex-col gap-3 shadow-md rounded-xl p-3 h-[29rem] cursor-pointer">
            <img :src="post.image" alt="" class="w-full h-1/2 object-cover mb-3">
            <div class="h-1/2 flex flex-col bg-white gap-3">
              <p class="text-gray-600 text-xs mb-2 font-medium">{{ post.subject.toUpperCase() }}</p>
              <h2 class="text-xl font-semibold font-poppins mb-4">{{ post.title }}</h2>
              <p class="font-normal text-base font-poppins"> {{ formatPostDescription(post.description) }}......</p>
            </div>
          </RouterLink>
        </section>

        <div class="h-auto w-full mx-auto bg-gray-100 rounded-none p-4 w-">
          <form @submit.prevent="submitComment" class="grid grid-cols-1 gap-4 w-full md:w-1/2 mx-auto">
            <div class="space-y-1 mb-2">
              <p class="text-xs md:text-sm font-bold text-indigo-700">Enjoyed the article?</p>
              <h1 class="text-xl md:text-3xl font-bold">Leave a comment below!</h1>
            </div>
            <hr class="mb-3" />
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input v-model="commentData.name"
                @input="(e: Event) => handleCommentData('name', (e.target as HTMLInputElement).value)" type="text"
                id="name" name="name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input v-model="commentData.email"
                @input="(e: Event) => handleCommentData('email', (e.target as HTMLInputElement).value)" type="email"
                id="email" name="email"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label for="comment" class="block text-sm font-medium text-gray-700">Comment</label>
              <textarea v-model="commentData.comment"
                @input="(e: Event) => handleCommentData('comment', (e.target as HTMLTextAreaElement).value)"
                id="comment" name="comment" rows="4"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
            </div>
            <div>
              <button type="submit" :disabled="isAddCommentLoading"
                class="inline-flex w-full mt-5 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed">
                Comment
              </button>
            </div>
            <hr class="my-5" />
          </form>

          <!-- Related Posts -->

          <!-- All Comments -->
          <section class="w-full md:w-1/2 mx-auto">
            <h1 class="text-lg md:text-3xl font-bold mb-5">Comments</h1>

            <article v-if="comments.length ===0 ">
              <h1 class="text-sm md:text-lg font-medium text-gray-500">No Comments</h1>
            </article>

            <article class="flex flex-col gap-6">
              <div v-for="comment in comments" :key="comment._id" class="bg-gray-100 rounded-lg p-4">
                <div class="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4">
                  <IconUserCircle class="w-10 h-10 text-gray-500" />
                  <div class="flex-1 w-full">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h3 class="font-semibold text-gray-900">{{ comment.name }}</h3>
                      <span class="text-sm text-gray-500">
                        {{ new Date(comment._creationTime).toLocaleString() }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">{{ comment.email }}</p>
                    <p class="mt-2 text-gray-700">{{ comment.comment }}</p>
                    <div class="mt-3 flex items-center space-x-4">
                      <button @click="() => showReplyForm(comment._id)"
                        class="text-sm text-blue-600 hover:text-blue-800 focus:outline-none">
                        Reply
                      </button>
                      <div v-if="comment.subcomment && comment.subcomment.length > 0">
                        <button @click="toggleSubcomments(comment._id)"
                          class="text-sm text-blue-600 hover:text-blue-800 focus:outline-none">
                          {{ isSubcommentsVisible(comment._id) ? 'Hide' : 'View' }}
                          {{ comment.subcomment.length }} {{ comment.subcomment.length === 1 ? 'reply' : 'replies' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <transition name="fade">
                  <div v-if="activeReplyForm === comment._id" class="mt-4 ml-0 sm:ml-14">
                    <form @submit.prevent="submitReply(comment)" class="space-y-2">
                      <input v-model="replyForm.name" placeholder="Your Name" class="w-full px-3 py-2 border rounded"
                        required />
                      <input v-model="replyForm.email" type="email" placeholder="Your Email"
                        class="w-full px-3 py-2 border rounded" required />
                      <textarea v-model="replyForm.comment" placeholder="Your Reply"
                        class="w-full px-3 py-2 border rounded" required></textarea>
                      <button type="submit" :disabled="isUpdateCommentLoading"
                        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed">Submit
                        Reply</button>
                    </form>
                  </div>
                </transition>
                <transition name="fade">
                  <div v-if="isSubcommentsVisible(comment._id) && comment.subcomment && comment.subcomment.length > 0"
                    class="mt-4 ml-0 sm:ml-14 pl-4 border-l-2 border-gray-300">
                    <div v-for="subcomment in comment.subcomment" :key="subcomment.email" class="mt-3">
                      <div class="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4">
                        <IconUserCircle class="w-8 h-8 text-gray-500" />
                        <div class="flex-1">
                          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <h4 class="font-semibold text-gray-900">{{ subcomment.name }}</h4>
                          </div>
                          <p class="text-sm text-gray-600 mt-1">{{ subcomment.email }}</p>
                          <p class="mt-2 text-gray-700">{{ subcomment.comment }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </article>
          </section>

        </div>
      </article>

    </main>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
