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
            <div v-if="imageUrl" class="my-4 px-6 w-full flex flex-col gap-3">
                <div class="w-[95%] mx-auto min-h-40 border-2">
                    <img :src="imageUrl" alt="" class="w-full h-full max-h-80 object-cover">
                </div>

                <div class="flex gap-5 justify-end mr-3">
                    <button @click="handleSetImageUri('proceed')"
                        class="bg-green-500 w-fit h-fit p-2 text-white text-base rounded-lg">Proceed</button>
                    <button @click="handleSetImageUri('cancel')"
                        class="bg-red-500 w-fit h-fit p-2 text-white text-base rounded-lg">Cancel</button>
                </div>
            </div>
            <div v-else class="my-4 px-6 w-full">
                <div :class="{ 'border-blue-500': active, 'border-dotted': !active }"
                    class="w-[95%] mx-auto min-h-20 border-2 flex items-center justify-between px-9"
                    @click="handleActive">
                    <div class="flex gap-2 items-center">
                        <h1 class="text-slate-400 text-sm font-normal">Drag or paste an image here</h1>
                        <IconPhoto class="w-5 h-5" color="#94a3b8" />
                    </div>

                    <button @click="triggerFileInput" class="h-fit w-fit p-2 border-gray-300 border-[1px] flex gap-3">
                        <IconUpload class="w-5 h-5" color="#94a3b8" />
                        <h1 class="text-gray-500 text-base">Upload</h1>
                    </button>
                </div>
                <input type="file" ref="fileInput" class="hidden" @change="handleFileChange" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
import { IconPhoto, IconUpload } from "@tabler/icons-vue";
import axios from 'axios';

// Define props and emits
const props = defineProps<{
    isOpen: boolean;
    title: string;
}>();

// Define ref with boolean type
const active = ref<boolean>(false);
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const imageUrl = ref<string | null>(null)

const setImageUri = ref<"proceed" | "cancel">("cancel")

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'image-action', action: 'proceed' | 'cancel', imageUrl: string | null): void;
}>();



// Close modal function
const closeModal = () => {
    emit('close');
    active.value = false;
    imageUrl.value = null
};

const handleSetImageUri = (uri: "proceed" | "cancel") => {
    setImageUri.value = uri
    emit('image-action', uri, imageUrl.value);
    imageUrl.value = null
}

defineExpose({
    imageUrl,
    setImageUri: handleSetImageUri,
})

// Handle active state toggle
const handleActive = () => {
    active.value = true;
};

// Trigger file input click
const triggerFileInput = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};

// Handle file change
const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        selectedFile.value = target.files[0];
        handleImageUpload();
    }
};

// Handle image upload
const handleImageUpload = async () => {
    if (!selectedFile.value) return;

    try {
        const formData = new FormData();
        formData.append("file", selectedFile.value);
        // formData.append("upload_preset", `${import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET}`);
        // formData.append("folder", "vue-blog");
        // const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, formData, {
        //     headers: {
        //         "Content-Type": "multipart/form-data",
        //     },
        // });

        // imageUrl.value = data.secure_url

        const url = `${import.meta.env.VITE_CONVEX_SITE}/sendImage`;

        const { data } = await axios.post(url, formData, {
            headers: {
                'Content-Type': selectedFile.value.type,
            },
        });

        imageUrl.value = data
    } catch (err) {
        console.error("Failed to upload image:", err);
    }
};
</script>

<style scoped>
/* Add any additional styles here */
</style>
