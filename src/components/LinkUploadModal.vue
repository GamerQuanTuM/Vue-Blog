<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
    isOpen: boolean;
    title: string;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'link-action', action: 'proceed' | 'cancel', imageUrl: string | null): void;
}>();

const linkUrl = ref<string | null>(null)

const setLinkUri = ref<"proceed" | "cancel">("cancel")

const handleSetLinkUri = (uri: "proceed" | "cancel") => {
    setLinkUri.value = uri
    emit('link-action', uri, linkUrl.value);
    linkUrl.value = null
}

defineExpose({
    linkUrl,
    setLinkUri: handleSetLinkUri,
})

// Close modal function
const closeModal = () => {
    emit('close');
};
</script>

<template>
    <div v-if="props.isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black opacity-50" @click="closeModal"></div>

        <!-- Modal -->
        <div class="bg-white rounded-lg shadow-lg z-10 w-[40%]">
            <div class="flex justify-between items-center mb-2 px-6 py-4">
                <h2 class="text-xl font-semibold">{{ props.title }}</h2>
                <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="border-b-2 w-full"></div>
            <div class="my-4 px-6 w-full flex flex-col gap-3">
                <input v-model="linkUrl" type="text" placeholder="Enter Your Link URL" class="px-6 border-2 h-12">
            </div>
            <div class="flex gap-5 justify-end mr-5 mb-5">
                <button @click="handleSetLinkUri('proceed')"
                    class="bg-green-500 w-fit h-fit p-2 text-white text-base rounded-lg">Proceed</button>
                <button @click="handleSetLinkUri('cancel')"
                    class="bg-red-500 w-fit h-fit p-2 text-white text-base rounded-lg">Cancel</button>
            </div>
        </div>
    </div>
</template>
