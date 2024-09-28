<script setup lang="ts">
import { ref, onMounted, watch, reactive } from 'vue';
import { IconChevronRight, IconPlus } from '@tabler/icons-vue';

import Data from '@/components/DataComponent.vue';
import { useAuthStore } from '../stores/auth';
import Modal from '../components/ModalComponent.vue';
import SingleDataComponent from '@/components/SingleDataComponent.vue';

export type ActiveSchema = "Post" | "Comment"

const authStore = useAuthStore();
const schemas = reactive<string[]>(["Post", "Comment"])
const isOpen = ref(false);
const activePostId = ref<string | null>(null)
const activeCommentId = ref<string | null>(null)
const active = ref<ActiveSchema | null>(null);
const selected = ref<Post | Comment | null>(null)
const isCreatingNew = ref(false);

const openModal = () => {
    isOpen.value = true;
};

const closeModal = () => {
    isOpen.value = false;
};

const handleActive = (activeSchema: ActiveSchema) => {
    active.value = activeSchema;
    isCreatingNew.value = false;
};

const handleSelected = (data: Post | Comment) => {
    selected.value = data;
    isCreatingNew.value = false;
}

const handleCreateNew = () => {
    isCreatingNew.value = true;
    if (active.value === 'Post') {
        selected.value = {
            title: '',
            _id: '',
            description: '',
            image: '',
            subject: '',
        } as Post;
    } else if (active.value === 'Comment') {
        selected.value = {
            email: '',
            _id: '',
            name: '',
            comment: '',
            postId: '',
        } as Comment;
    }
};

onMounted(() => {
    authStore.checkLoginStatus();
    if (!authStore.isAdminLoggedIn) {
        openModal();
    }

    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, '', url.toString());
});

watch(() => authStore.isAdminLoggedIn, (newVal) => {
    if (newVal) {
        closeModal();
    }
});

watch(() => active.value, (newVal) => {
    if (newVal) {
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, '', url.toString());
        selected.value = null;
        isCreatingNew.value = false;
    }
});

</script>

<template>
    <div v-if="!authStore.isAdminLoggedIn" class="bg-white min-w-screen min-h-screen">
        <Modal :isOpen="isOpen" @close="closeModal" />
    </div>

    <div v-else class="bg-white h-screen flex flex-col">
        <header class="h-12 w-full bg-black">
            <div class="mx-12 flex items-center h-full">
                <h1 class="text-xl font-semibold text-white text-center">Admin Panel</h1>
            </div>
        </header>

        <main class="flex-1 flex overflow-hidden">
            <div class="w-1/4 border-r-2 overflow-y-auto">
                <div class="h-14 border-b-2 w-full flex items-center">
                    <h1 class="text-center font-medium text-lg text-black mx-5">Schemas</h1>
                </div>
                <div v-for="schema in schemas" :key="schema">
                    <div class="w-[95%] flex justify-between items-center gap-5 my-3 px-3 mx-auto h-14 cursor-pointer"
                        :class="{
                            'bg-blue-500 text-white': active === schema,
                            'hover:bg-slate-100 bg-white text-gray-500': active !== schema,
                        }" @click="handleActive(schema as ActiveSchema)">
                        <h1 class="text-base">{{ schema }}</h1>
                        <IconChevronRight class="w-4 h-4" :class="active === schema ? 'text-white' : 'text-gray-300'" />
                    </div>
                </div>
            </div>
            <div class="w-1/4 flex flex-col h-full overflow-hidden" :class="{ 'border-r-2': active != null }">
                <div v-if="active" class="h-14 w-full flex items-center justify-between border-b-2">
                    <h1 class="text-center font-medium text-lg text-black mx-5">{{ active }}</h1>
                    <IconPlus @click="handleCreateNew" class="w-6 h-6 mr-7 cursor-pointer" />
                </div>
                <Data :active="active" :activeCommentId="activeCommentId" :activePostId="activePostId"
                    :handleSelected="handleSelected" class="flex-1 overflow-y-auto" :isCreatingNew="isCreatingNew" />
            </div>
            <div class="flex-1">
                <SingleDataComponent :data="selected" :active="active" :isCreatingNew="isCreatingNew" />
            </div>
        </main>
    </div>
</template>

<style></style>