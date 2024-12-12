<script lang="ts" setup>
import { ref, watch } from 'vue';
import { IconEdit, IconTrash, IconX } from '@tabler/icons-vue';
import { useConvexMutation } from '@convex-vue/core';
import axios from 'axios';

import type { ActiveSchema } from '@/views/AdminView.vue';
import TipTapEditor from './TipTapEditor.vue';
import { api } from '../../convex/_generated/api';
import type { Id } from 'convex/_generated/dataModel';

const props = defineProps<{
    data: Post | Comment | null;
    active: ActiveSchema | null;
    isCreatingNew: boolean;
}>();

const isCover = ref<boolean>(false)


const postData = ref<{
    title: string;
    description: string;
    image: string;
    subject: string;
    cover: boolean
}>({
    title: '',
    description: '',
    image: '',
    subject: '',
    cover: false
});

const commentData = ref<{
    email: string;
    name: string;
    comment: string;
    postId: string;
    subcomment?: {
        name: string;
        email: string;
        comment: string;
    }[];
}>({
    email: '',
    name: '',
    comment: '',
    postId: props?.data?._id as string,
    subcomment: [{
        name: "",
        email: "",
        comment: "",
    }]
});

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const temporaryImg = ref<string | null>(null);


const isImageUploading = ref<boolean>(false)

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        selectedFile.value = target.files[0];
        temporaryImg.value = URL.createObjectURL(target.files[0]);
    }
};

const triggerFileInput = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};

const resetImage = () => {
    temporaryImg.value = null;
    selectedFile.value = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

const { isLoading: isPostAddLoading, mutate: addPost } = useConvexMutation(api.posts.add, {
    onSuccess(data) {
        window.location.reload();
    },
    onError(err) {
        console.error(err)
    },
});
const { isLoading: isCommentAddLoading, mutate: addComment } = useConvexMutation(api.comments.add, {
    onSuccess(data) {
        console.log("Posts Added", data);
        window.location.reload();
    },
    onError(err) {
        console.error(err)
    },
});

const { isLoading: isPostUpdateLoading, mutate: updatePost } = useConvexMutation(api.posts.update, {
    onSuccess(data) {
        console.log("Posts Added", data)
    },
    onError(err) {
        console.error(err)
    },
});
const { isLoading: isCommentUpdateLoading, mutate: updateComment } = useConvexMutation(api.comments.update, {
    onSuccess(data) {
        console.log("Posts Added", data)
    },
    onError(err) {
        console.error(err)
    },
});

const { isLoading: isPostDeleteLoading, mutate: deletePost } = useConvexMutation(api.posts._delete, {
    onSuccess(data) {
        console.log("Posts Deleted", data);
        window.location.reload();
    },
    onError(err) {
        console.error(err)
    },
});
const { isLoading: isCommentDeleteLoading, mutate: deleteComment } = useConvexMutation(api.comments._delete, {
    onSuccess(data) {
        console.log("Comments Deleted", data);
        window.location.reload();
    },
    onError(err) {
        console.error(err)
    },
});

watch(
    () => props.data,
    (newData) => {
        if (props.active === 'Post' && newData) {
            postData.value = {
                title: (newData as Post).title ?? '',
                description: (newData as Post).description ?? '',
                image: (newData as Post).image ?? '',
                subject: (newData as Post).subject ?? '',
                cover: (newData as Post).cover ?? false,
            };
        } else if (props.active === 'Comment' && newData) {
            commentData.value = {
                email: (newData as Comment).email ?? '',
                name: (newData as Comment).name ?? '',
                comment: (newData as Comment).comment ?? '',
                postId: (newData as Comment).postId ?? '',
                subcomment: (newData as Comment).subcomment ?? []
            };
        }
    },
    { immediate: true }
);

watch(() => props.isCreatingNew, (newVal) => {
    if (newVal) {
        postData.value = {
            title: '',
            description: '',
            image: '',
            subject: '',
            cover: isCover.value
        };

        commentData.value = {
            email: '',
            name: '',
            comment: '',
            postId: '',
            subcomment: []
        };
    }
})


watch(() => props.active, (newData) => {
    if (!props.isCreatingNew) {
        if (newData === 'Post') {
            postData.value = {
                title: '',
                description: '',
                image: '',
                subject: '',
                cover: isCover.value
            };
        } else if (newData === 'Comment') {
            commentData.value = {
                email: '',
                name: '',
                comment: '',
                postId: '',
                subcomment: []
            };
        }
    }
});

const updatePostData = <T extends keyof Post>(field: T, value: Post[T]) => {
    if (props.data && props.active === 'Post') {
        postData.value = { ...postData.value, [field]: value };
        if (field === 'cover') {
            isCover.value = value as boolean; 
        }
    }
};

const updateCommentData = <T extends keyof Comment>(field: T, value: Comment[T]) => {
    if (props.data && props.active === 'Comment') {
        commentData.value = { ...commentData.value, [field]: value };
    }
};


const saveNewData = async () => {
    if (props.active === 'Post') {
        if (props.isCreatingNew) {
            let imageUrl = postData.value.image;
            if (temporaryImg.value) {
                imageUrl = await handleImageUpload();
            }
            addPost({
                description: postData.value.description ?? "",
                subject: postData.value.subject ?? "",
                image: imageUrl ?? "",
                title: postData.value.title ?? "",
                cover: isCover.value  // Use isCover.value here
            });
        } else {
            let imageUrl = postData.value.image;
            if (temporaryImg.value) {
                imageUrl = await handleImageUpload();
            }
            updatePost({
                description: postData.value.description ?? "",
                subject: postData.value.subject ?? "",
                image: imageUrl ?? "",
                title: postData.value.title ?? "",
                _id: props.data?._id as string,
                cover: isCover.value  // Use isCover.value here
            });
        }
    } else if (props.active === 'Comment') {
        if (props.isCreatingNew) {
            addComment({
                email: commentData.value.email ?? "",
                name: commentData.value.name ?? "",
                comment: commentData.value.comment ?? "",
                postId: commentData.value.postId as Id<'Post'> ?? "",
                subcomment: commentData.value.subcomment ?? []
            });
        } else {
            updateComment({
                email: commentData.value.email ?? "",
                name: commentData.value.name ?? "",
                comment: commentData.value.comment ?? "",
                postId: commentData.value.postId as Id<'Post'>,
                _id: props.data?._id as string,
                subcomment: commentData.value.subcomment ?? []
            });
        }
    }
};


const deleteSubCommentByIndex = (index: number, subcomment: { name: string, email: string, comment: string }[]) => {
    const filteredSubComment = subcomment.filter((_, i) => i != index);
    updateCommentData("subcomment", filteredSubComment)

}

const deletePostDocument = (id: string) => {
    deletePost({
        _id: id
    })

}
const deleteCommentDocument = (id: string) => {
    deleteComment({
        _id: id
    })

}

const handleImageUpload = async () => {
    if (!selectedFile.value) return;

    try {
        isImageUploading.value = true
        const formData = new FormData();
        formData.append("file", selectedFile.value);
        const url = `${import.meta.env.VITE_CONVEX_SITE}/sendImage`; // Corrected template literal syntax

        const { data } = await axios.post(url, formData, {
            headers: {
                'Content-Type': selectedFile.value.type,
            },
        });
        isImageUploading.value = false;
        postData.value.image = data;

        // Clear temporary image state
        resetImage();

        return data;
    } catch (err) {
        isImageUploading.value = false
        console.error("Failed to upload image:", err);
    }
};



</script>

<template>
    <div class="h-full w-full flex flex-col"
        v-if="active === 'Post' && (isCreatingNew || (postData.description != '' && postData.image != '' && postData.subject != '' && postData.title != ''))">
        <div class="flex justify-between items-center w-full bg-[#E8F1FE]">
            <div class="h-fit py-3 w-full  justify-center px-7 flex flex-col gap-1">
                <h1 class="text-[#132540] text-base md:text-xl font-medium">{{ isCreatingNew ? 'Create New Post' : postData.title }}
                </h1>
                <h1 class="text-[#132540] text-sm md:text-base font-normal">{{ isCreatingNew ? 'New Subject' : postData.subject }}
                </h1>
            </div>
            <div class="flex items-center mr-5">
                <span class="text-gray-700 w-20">Set Cover</span>
                <label class="relative inline-block w-12 h-6">
                    <input :checked="isCreatingNew ? false : postData.cover"
                        @change="(e: Event) => updatePostData('cover', (e.target as HTMLInputElement).checked)"
                        type="checkbox" id="toggle" class="sr-only peer" />
                    <span
                        class="block w-full h-full bg-gray-300 rounded-full peer-checked:bg-green-500 transition-all"></span>
                    <span
                        class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-6 transition-transform"></span>
                </label>
            </div>

        </div>
        <div class="flex-1 overflow-y-auto">
            <div class="flex flex-col gap-8 items-center w-[80%] mx-auto py-10">
                <div class="w-full flex flex-col gap-2">
                    <label class="text-[#10115E] text-sm">Title</label>
                    <input v-model="postData.title"
                        @input="(e: Event) => updatePostData('title', (e.target as HTMLInputElement).value)"
                        placeholder="Enter Your title" class="border border-slate-400 rounded-md h-10 px-3" />
                </div>
                <div class="w-full flex flex-col gap-2">
                    <label class="text-[#10115E] text-sm">Subject</label>
                    <select v-model="postData.subject"
                        @change="(e: Event) => updatePostData('subject', (e.target as HTMLSelectElement).value)"
                        class="border border-slate-400 rounded-md h-10 px-3 w-full">
                        <option value="" disabled selected>Select a Subject</option>
                        <option value="Sports">Sports</option>
                        <option value="Technology">Technology</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Entertainment">Entertainment</option>
                    </select>
                </div>
                <div class="w-full flex flex-col gap-2">
                    <label class="text-[#10115E] text-sm">Description</label>
                    <div class="max-h-auto">
                        <TipTapEditor :content="isCreatingNew ? '' : postData.description" @post="updatePostData" />
                    </div>
                </div>
                <div class="w-full flex flex-col gap-2 relative">
                    <label class="text-[#10115E] text-sm">Image</label>

                    <!-- New clickable div for image upload -->
                    <div v-if="!postData.image && !temporaryImg" @click="triggerFileInput"
                        class="w-full h-40 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <div class="text-center text-gray-500">
                            <IconEdit class="w-12 h-12 mx-auto mb-2" />
                            <p>Click to Upload Image</p>
                        </div>
                    </div>

                    <!-- Existing image display with edit/delete options -->
                    <img v-if="postData.image && !temporaryImg" :src="postData.image"
                        class="max-h-60 rounded-md object-cover" alt="Post image" />

                    <img v-if="temporaryImg" :src="temporaryImg" class="max-h-60 rounded-md object-cover"
                        alt="Temporary Post image" />

                    <div class="flex items-center gap-3 absolute right-3 top-10">
                        <button @click="triggerFileInput"
                            class="text-white hover:text-blue-500 focus:outline-none transition-colors duration-200"
                            aria-label="Edit image">
                            <IconEdit class="w-8 h-8" />
                        </button>
                        <button
                            @click="isCreatingNew ? resetImage() : (temporaryImg ? resetImage() : postData.image = '')"
                            v-if="temporaryImg || isCreatingNew"
                            class="text-white hover:text-blue-500 focus:outline-none transition-colors duration-200"
                            aria-label="Delete image">
                            <IconX class="w-8 h-8" />
                        </button>

                        <input ref="fileInput" type="file" class="hidden" @change="handleFileChange">
                    </div>
                </div>
            </div>
        </div>
        <div class="h-20 w-full bg-[#E8F1FE] justify-end px-7 flex items-center gap-3">
            <button v-if="!isCreatingNew" @click="deletePostDocument(props?.data?._id as string)"
                class="bg-red-500 text-white px-4 py-2 rounded-md">Delete
                Document</button>
            <button v-if="isCreatingNew" @click="saveNewData" :disabled="isPostAddLoading || isImageUploading"
                class="bg-blue-500 text-white px-4 py-2 rounded-md disabled:cursor-not-allowed disabled:bg-slate-400">{{
                    isPostAddLoading || isImageUploading ?
                        "Saving Post" : "Save New Post" }}</button>
            <button v-else @click="saveNewData" :disabled="isPostUpdateLoading || isImageUploading"
                class="bg-blue-500 text-white px-4 py-2 rounded-md disabled:cursor-not-allowed disabled:bg-slate-400">{{
                    isPostUpdateLoading || isImageUploading ?
                        "Updating Post" : "Update Post" }}</button>


        </div>
    </div>

    <div v-else-if="active === 'Comment' && (isCreatingNew || (commentData.comment != '' && commentData.email != '' && commentData.name != '' && commentData.postId != ''))"
        class="w-full h-full flex flex-col">
        <div class="h-20 w-full bg-[#E8F1FE] justify-center px-7 flex flex-col gap-1">
            <h1 class="text-[#132540] text-base md:text-xl font-medium">{{ isCreatingNew ? 'Create New Comment' : commentData.name }}
            </h1>
            <h1 class="text-[#132540] text-sm md:text-base font-normal">{{ isCreatingNew ? 'New Email' : commentData.email }}</h1>
        </div>
        <div class="flex-1 overflow-y-auto">
            <div class="flex flex-col gap-8 items-center w-[80%] mx-auto py-10">
                <div class="w-full flex flex-col gap-2">
                    <label class="text-[#10115E] text-sm">Name</label>
                    <input v-model="commentData.name"
                        @input="(e: Event) => updateCommentData('name', (e.target as HTMLInputElement).value)"
                        placeholder="Enter Your name" class="border border-slate-400 rounded-md h-10 px-3" />
                </div>
                <div class="w-full flex flex-col gap-2">
                    <label class="text-[#10115E] text-sm">Email</label>
                    <input v-model="commentData.email"
                        @input="(e: Event) => updateCommentData('email', (e.target as HTMLInputElement).value)"
                        placeholder="Enter Your email" class="border border-slate-400 rounded-md h-10 px-3" />
                </div>
                <div class="w-full flex flex-col gap-2">
                    <label class="text-[#10115E] text-sm">Comment</label>
                    <textarea v-model="commentData.comment"
                        @input="(e: Event) => updateCommentData('comment', (e.target as HTMLTextAreaElement).value)"
                        placeholder="Enter Your comment"
                        class="border border-slate-400 rounded-md h-40 px-3 py-2 overflow-y-auto" />
                </div>
                <div class="w-full flex flex-col gap-2">
                    <label class="text-[#10115E] text-sm">SubComment</label>

                    <div class="max-h-40 border border-gray-200 rounded-lg overflow-y-auto p-4 bg-white shadow-sm">
                        <div v-if="commentData?.subcomment && commentData.subcomment.length > 0">
                            <div v-for="(comment, index) in commentData.subcomment" :key="index"
                                class="mb-4 last:mb-0 bg-gray-50 rounded-lg p-4 shadow-sm transition-all duration-200 hover:shadow-md">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center space-x-2">
                                        <h3 class="font-semibold text-gray-800">{{ comment.name }}</h3>
                                        <span class="text-sm text-gray-500">{{ comment.email }}</span>
                                    </div>
                                    <button @click="deleteSubCommentByIndex(index, commentData?.subcomment)"
                                        class="text-gray-400 hover:text-red-500 focus:outline-none transition-colors duration-200"
                                        aria-label="Delete comment">
                                        <IconTrash class="w-5 h-5" />
                                    </button>
                                </div>
                                <p class="text-gray-700">{{ comment.comment }}</p>
                            </div>
                        </div>
                        <div v-else class="text-center py-8 text-gray-500">
                            No sub-comments yet.
                        </div>
                    </div>
                </div>
                <div class="w-full flex flex-col gap-2">
                    <label class="text-[#10115E] text-sm">Post ID</label>
                    <input readonly v-model="commentData.postId"
                        @input="(e: Event) => updateCommentData('postId', (e.target as HTMLInputElement).value)"
                        placeholder="Enter Post ID" class="border border-slate-400 rounded-md h-10 px-3" />
                </div>
            </div>
        </div>
        <div class="h-20 w-full bg-[#E8F1FE] justify-end px-7 flex items-center gap-3">
            <button v-if="!isCreatingNew" @click="deleteCommentDocument(props?.data?._id as string)"
                class="bg-red-500 text-white px-4 py-2 rounded-md">Delete
                Document</button>
            <button v-if="isCreatingNew" @click="saveNewData" :disabled="isCommentAddLoading"
                class="bg-blue-500 text-white px-4 py-2 rounded-md disabled:cursor-not-allowed disabled:bg-slate-400">{{
                    isCommentAddLoading ?
                        "Saving Comment" : "Save New Comment" }}</button>
            <button v-else @click="saveNewData" :disabled="isCommentUpdateLoading"
                class="bg-blue-500 text-white px-4 py-2 rounded-md disabled:cursor-not-allowed disabled:bg-slate-400">{{
                    isCommentUpdateLoading ?
                        "Updating Comment" : "Update Comment" }}</button>
        </div>
    </div>
</template>

<style scoped>
.ql-toolbar {
    border: 0px !important;
}

#toggle:checked+.block {
    background-color: #4CAF50;
    /* Green for "On" state */
}

#toggle:checked+.block .dot {
    transform: translateX(100%);
}
</style>
