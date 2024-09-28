<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useConvexQuery } from '@convex-vue/core';
import { IconPencil } from '@tabler/icons-vue';
import type { ActiveSchema } from '@/views/AdminView.vue';
import { api } from '../../convex/_generated/api';

const props = defineProps<{
    active: ActiveSchema | null;
    activePostId: string | null;
    activeCommentId: string | null;
    handleSelected: (data: Post | Comment) => void,
    isCreatingNew: boolean
}>();

const { data: posts, isLoading: isPostGetLoading } = useConvexQuery(api.posts.get, {});
const { data: comments, isLoading: isCommentGetLoading } = useConvexQuery(api.comments.get, {});

const selectedPostId = ref(props.activePostId);
const selectedCommentId = ref(props.activeCommentId);


watch(() => props?.isCreatingNew, (newVal) => {
    if (newVal) {
        selectedCommentId.value = null
        selectedPostId.value = null
    }
})



const handlePostClick = (data: Post) => {
    const url = new URL(window.location.href);
    url.searchParams.set('post-id', data._id);
    window.history.pushState({}, '', url.toString());
    selectedPostId.value = data._id;
    props.handleSelected(data);
};

const handleCommentClick = (data: Comment) => {
    const url = new URL(window.location.href);
    url.searchParams.set('comment-id', data._id);
    window.history.pushState({}, '', url.toString());
    selectedCommentId.value = data._id;
    props.handleSelected(data);
};

watch(() => props.active, (newVal) => {
    if (newVal) {
        selectedPostId.value = null,
            selectedCommentId.value = null
    }
})
</script>

<template>
    <div v-if="props.active" class="w-full px-3 mx-auto cursor-pointer flex-1">
        <div v-if="props.active === 'Post'" class="flex flex-col gap-3 my-4 overflow-y-auto">
            <!-- Render skeleton loader if posts are loading -->
            <div v-if="isPostGetLoading">
                <div v-for="n in 10" :key="n"
                    class="h-14 flex items-center justify-between w-full px-3 bg-gray-100 animate-pulse">
                    <div class="w-3/4 h-4 bg-gray-300 rounded"></div>
                    <div class="w-4 h-4 bg-gray-300 rounded"></div>
                </div>
            </div>

            <!-- Render posts when loaded -->
            <div v-else v-for="post in posts" :key="post._id" :class="{
                'bg-blue-500 text-white': selectedPostId === post._id,
                'hover:bg-slate-100 bg-white text-gray-500': selectedPostId !== post._id,
            }" class="h-14 flex items-center justify-between w-full px-3" @click="handlePostClick(post)">
                <h1>{{ post.title.slice(0, 25) }}...</h1>
                <IconPencil class="w-4 h-4" />
            </div>
        </div>

        <div v-if="props.active === 'Comment'" class="flex flex-col gap-3 my-4 overflow-y-auto">
            <!-- Render skeleton loader if comments are loading -->
            <div v-if="isCommentGetLoading">
                <div v-for="n in 10" :key="n"
                    class="h-14 flex items-center justify-between w-full px-3 bg-gray-100 animate-pulse">
                    <div class="w-3/4 h-4 bg-gray-300 rounded"></div>
                    <div class="w-4 h-4 bg-gray-300 rounded"></div>
                </div>
            </div>

            <!-- Render comments when loaded -->
            <div v-else v-for="comment in comments" :key="comment._id" :class="{
                'bg-blue-500 text-white': selectedCommentId === comment._id,
                'hover:bg-slate-100 bg-white text-gray-500': selectedCommentId !== comment._id,
            }" class="h-14 flex items-center justify-between w-full px-3" @click="handleCommentClick(comment)">
                <h1>{{ comment.name.slice(0, 25) }}...</h1>
                <IconPencil class="w-4 h-4" />
            </div>
        </div>
    </div>
</template>
