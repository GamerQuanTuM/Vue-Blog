<script setup lang="ts">
import { formatPostDescription } from '@/functions';
import { onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
    posts: Post[],
    isLoading: boolean,
    isLoadingMore: boolean,
    isDone: boolean,
    loadMore: () => void
}>()

const router = useRouter()


const handleScroll = () => {
    const bottomOfWindow = window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 100;
    if (bottomOfWindow && !props.isLoadingMore && !props.isDone) {
        props.loadMore();
    }
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});


</script>

<template>
    <div class="h-auto w-[95%] md:w-[80%] mx-auto grid md:grid-cols-3 gap-5">
        <div v-if="posts.length > 0" v-for="post in posts" class="shadow-md cursor-pointer rounded-xl"
            @click="router.push(`/${post._id}`)">
            <img :src="post.image" class="h-1/2 w-full rounded-t-xl" />
            <div class="flex flex-col gap-2 p-5 rounded-b-xl">
                <p class="text-gray-600 text-xs mb-2 font-medium">{{ post.subject.toUpperCase() }}</p>
                <h2 class="text-xl font-semibold font-poppins mb-4">{{ post.title }}</h2>
                <p class="font-normal text-base font-poppins">
                    {{ formatPostDescription(post.description) }}...
                </p>
            </div>
        </div>

    </div>
    <div class="h-10 md:h-20"></div>
    <div v-if="isLoading" class="flex flex-col items-center justify-center w-full bg-inherit rounded-lg p-6 my-8 mx-auto">
        <div class="loader"></div>
    </div>
    <div v-if="isLoadingMore" class="flex justify-center mt-4">
        <div class="loader-more"></div>
    </div>
    <div v-if="posts.length === 0 && !isLoading && !isLoadingMore"
        class="flex flex-col items-center justify-center w-full bg-inherit rounded-lg p-6 my-8 mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18M9 3v18m6-18v18M3 15h18" />
        </svg>
        <h2 class="text-xl font-semibold text-gray-700 mb-2">No Posts Available</h2>
        <p class="text-gray-500">There are no posts to display right now. Please check back later.</p>
    </div>
</template>