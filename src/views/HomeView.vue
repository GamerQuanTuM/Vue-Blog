<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useConvexPaginatedQuery, useConvexQuery } from "@convex-vue/core";
import Navbar from "@/components/Navbar.vue";
import Cover from "@/assets/cover.png";
import { api } from "../../convex/_generated/api";
import { formatPostDescription } from "@/functions";

const router = useRouter();

const {
  data: paginatedPosts,
  isLoading,
  isLoadingMore,
  isDone,
  loadMore,
} = useConvexPaginatedQuery(api.posts.paginatedPosts, { cover: true }, { numItems: 3 });

const { data: coverPost, isLoading: isCoverPostLoading } = useConvexQuery(api.posts.getCoverPost, {});


const getPostClass = (index: number) => {
  const positionInGroup = index % 6;

  if (positionInGroup < 3) return 'w-full sm:w-1/2 md:w-1/3';
  if (positionInGroup < 5) return 'w-full sm:w-1/2';
  return 'w-full';
};

const isFullWidthPost = (index: number) => {
  return index % 6 === 5;
};

// Function to handle scroll event
const handleScroll = () => {
  const bottomOfWindow = window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 100;
  if (bottomOfWindow && !isLoadingMore.value && !isDone.value) {
    loadMore();
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

console.log(coverPost.value)

</script>

<template>
  <div>
    <Navbar navLink="Home">
      <div v-if="isLoading && isCoverPostLoading" class="min-h-screen flex items-center justify-center">
        <div class="loader"></div>
      </div>
      <div v-else class="w-[90%] md:w-[70%] mx-auto">
        <!-- cover pic -->
        <div class="h-fit md:h-80 w-full flex flex-col md:flex-row drop-shadow-md rounded-md mb-8">
          <div class="w-full md:w-[70%] h-1/2 md:h-full">
            <img :src="coverPost[0].image ?? Cover" alt="" class="w-full h-full object-cover border-black">
          </div>
          <div
            class="w-full md:w-[40%] h-1/2 md:h-full bg-gray-100 flex flex-col items-center pt-8 pb-3 px-6 gap-3 cursor-pointer"
            @click="router.push(`/${coverPost[0]._id}`)">
            <p class="text-gray-600 text-xs mb-2 font-medium">{{ coverPost[0].subject.toUpperCase() }}</p>
            <h2 class="text-base md:text-xl font-semibold font-poppins mb-4">{{  coverPost[0].title }}</h2>
            <p class="font-normal text-sm md:text-base font-poppins pb-8 md:pb-0">
              {{ formatPostDescription(coverPost[0].description) }} <span class="text-xs text-gray-400">see more</span>
            </p>
          </div>


        </div>
        <div class="flex flex-wrap -mx-2">
          <div v-for="(post, index) in paginatedPosts" :key="post._id" :class="['px-2 mb-4', getPostClass(index)]">
            <div class="cursor-pointer" @click="router.push(`/${post._id}`)" :class="[
              'bg-white rounded-lg shadow-md overflow-hidden h-full',
              { 'flex flex-col md:flex-row': isFullWidthPost(index) }
            ]">
              <img :src="post.image" :alt="post.title" :class="[
                'object-cover',
                isFullWidthPost(index) ? 'w-full h-48 md:h-80' : 'w-full h-48'
              ]">
              <div :class="[
                'p-4 m-3',
                { 'md:w-1/2 flex flex-col my-5 mx-3': isFullWidthPost(index) }
              ]">
                <p class="text-gray-600 text-xs mb-2 font-medium">{{ post.subject.toUpperCase() }}</p>
                <h2 class="text-xl font-semibold font-poppins mb-4">{{ post.title }}</h2>
                <p class="font-normal text-base font-poppins">
                  {{ formatPostDescription(post.description) }}...
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="isLoadingMore" class="flex justify-center mt-4">
          <div class="loader-more"></div>
        </div>
      </div>
    </Navbar>
  </div>
</template>
