<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useConvexMutation, useConvexQuery } from '@convex-vue/core';
import axios from 'axios';

import { api } from 'convex/_generated/api';


const selectedFile = ref<File | null>(null)
const imageUrl = ref<string | null>(null);
const { data: posts, isLoading: isPostGetLoading } = useConvexQuery(api.posts.get, {});

const { data: postSingle } = useConvexQuery(api.posts.getSingle, {
    title: "The Benefits of a Balanced Diet"
});


const { isLoading: isPostAddLoading, mutate: addPost } = useConvexMutation(api.posts.add, {
    onSuccess() {
        console.log("Posts Added")
    },
    onError(err) {
        console.error(err)
    },
    // optimisticUpdate(ctx, variables) {
    //   const currentPosts = ctx.getQuery(api.posts.get, {});
    //   if (!currentPosts) return;

    //   ctx.setQuery(api.posts.get, {}, [
    //     {
    //       _creationTime: Date.now(),
    //       _id: 'optimistic_id' as Id<'Post'>,
    //       subject: variables.subject,
    //       title: variables.title,
    //       description: variables.description,
    //       image: variables.image
    //     },
    //     ...currentPosts
    //   ]);
    // }
});



const { mutate: generateUploadUrl, error: imageUploadError } = useConvexMutation(api.posts.generateUploadUrl);

const { data: imageUrlData } = useConvexQuery(api.posts.getImageUrl, { storageId: "kg2e12sqjpchnea1myxqd539jh706fnx" });

onMounted(() => {
    if (imageUrlData) {
        imageUrl.value = imageUrlData as unknown as string | null;
    }
});

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        selectedFile.value = target.files[0];
    }
};


const handleImageUpload = async () => {
    if (!selectedFile.value) return;

    try {
        const uploadUrl = await generateUploadUrl({}) as string;
        const formData = new FormData();
        formData.append("file", selectedFile.value);

        const { data } = await axios.post(uploadUrl, selectedFile.value, {
            headers: {
                "Content-Type": selectedFile.value.type,
            },
        });


        console.log("Image uploaded successfully");
        console.log(data.storageId)
    } catch (err) {
        console.error("Failed to upload image:", err);
    }
};

const handlePostAdd = () => {
    addPost({
        subject: "Technology",
        title: "The Rise of Quantum Computing",
        description: "An overview of how quantum computing is transforming technology and its potential future impacts.",
        image: "https://images.unsplash.com/photo-1690050070284-d1a628f5b494?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    })
}
</script>


<template>
    <div class="w-full flex items-center justify-center">
        <button @click="handleImageUpload" class="w-fit h-fit text-white bg-green-500 px-3 py-2">Add
            Posts</button>
    </div>

    <div class="w-full flex flex-col items-center justify-center">
        <input type="file" @change="handleFileChange" />
        <button class="w-fit h-fit text-white bg-green-500 px-3 py-2" @click="handleImageUpload"
            :disabled="!selectedFile">Upload Image</button>
    </div>
</template>