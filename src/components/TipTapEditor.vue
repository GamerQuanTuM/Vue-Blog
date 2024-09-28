<template>
    <div class="flex flex-col border-2 rounded-lg">
        <div class="min-h-12 border-b-2 px-5 flex flex-wrap items-center gap-3 py-3">
            <!-- toolbar buttons -->
            <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
                :class="{ 'bg-blue-100 text-blue-700 rounded-full': editor?.isActive('heading', { level: 1 }) }"
                @click="toggleHeading({ level: 1 })">
                <IconH1 class="h-5 w-5" />
            </button>
            <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
                :class="{ 'bg-blue-100 text-blue-700 rounded-full': editor?.isActive('heading', { level: 2 }) }"
                @click="toggleHeading({ level: 2 })">
                <IconH2 class="h-5 w-5" />
            </button>
            <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
                :class="{ 'bg-blue-100 text-blue-700 rounded-full': editor?.isActive('heading', { level: 3 }) }"
                @click="toggleHeading({ level: 3 })">
                <IconH3 class="h-5 w-5" />
            </button>
            <div class="border-l-2 h-full py-4"></div>
            <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
                :class="{ 'bg-blue-100 text-blue-700 rounded-full': editor?.isActive('bold') }" @click="toggleBold">
                <IconBold class="h-5 w-5" />
            </button>
            <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
                :class="{ 'bg-blue-100 text-blue-700 rounded-full': editor?.isActive('italic') }" @click="toggleItalic">
                <IconItalic class="h-5 w-5" />
            </button>
            <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
                :class="{ 'bg-blue-100 text-blue-700 rounded-full': editor?.isActive('underline') }"
                @click="toggleUnderline">
                <IconUnderline class="h-5 w-5" />
            </button>
            <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
                :class="{ 'bg-blue-100 text-blue-700 rounded-full': editor?.isActive('strike') }"
                @click="toggleStrikethrough">
                <IconStrikethrough class="h-5 w-5" />
            </button>
            <div class="border-l-2 h-full py-4"></div>
            <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
                :class="{ 'bg-blue-100 text-blue-700 rounded-full': editor?.isActive('bulletList') }"
                @click="toggleBulletList">
                <IconList class="h-5 w-5" />
            </button>
            <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
                :class="{ 'bg-blue-100 text-blue-700 rounded-full': editor?.isActive('orderedList') }"
                @click="toggleOrderedList">
                <IconListNumbers class="h-5 w-5" />
            </button>
            <div class="border-l-2 h-full py-4"></div>
            <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
                :class="{ 'bg-blue-100 text-blue-700 rounded-full': editor?.isActive({ textAlign: 'left' }) }"
                @click="setTextAlign('left')">
                <IconAlignLeft class="h-5 w-5" />
            </button>
            <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
                :class="{ 'bg-blue-100 text-blue-700 rounded-full': editor?.isActive({ textAlign: 'center' }) }"
                @click="setTextAlign('center')">
                <IconAlignCenter class="h-5 w-5" />
            </button>
            <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
                :class="{ 'bg-blue-100 text-blue-700 rounded-full': editor?.isActive({ textAlign: 'right' }) }"
                @click="setTextAlign('right')">
                <IconAlignRight class="h-5 w-5" />
            </button>

            <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
                :class="{ 'bg-blue-100 text-blue-700 rounded-full': editor?.isActive('codeBlock') }"
                @click="toggleCode">
                <IconCode class="h-5 w-5" />
            </button>

            <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
                :class="{ 'bg-blue-100 text-blue-700 rounded-full': editor?.isActive('blockquote') }"
                @click="toggleBlockquote">
                <IconQuote class="h-5 w-5" />
            </button>

            <div>
                <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
                    :class="{ 'bg-blue-100 text-blue-700 rounded-full': editor?.isActive('link') }"
                    @click="openLinkUploadModal">
                    <IconCirclesRelation class="h-5 w-5" />
                </button>
            </div>
            <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
                @click="openImageUploadModal">
                <IconPhoto class="h-5 w-5" />
            </button>
            <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
                :class="{ 'bg-blue-100 text-blue-700 rounded-full': editor?.isActive('setHorizontalRule') }"
                @click="toggleHorizontalLine">
                <IconSlash class="h-5 w-5 rotate-[55deg]" />
            </button>
        </div>
        <div class="flex-1 w-full max-w-full overflow-auto">
            <editor-content class="prose prose-img:max-h-60 prose-img:w-full prose-img:object-cover prose-a:text-blue-500 prose-a:cursor-pointer px-5 py-3 min-h-48"
                :editor="editor" />
        </div>
    </div>

    <!-- Modal Component -->
    <ImageUploadModal :isOpen="isImageUploadModalOpen" title="Insert Image" @close="closeImageUploadModal"
        ref="childImageUploadRef" @image-action="handleImageAction" />
    <LinkUploadModal :isOpen="isLinkUploadModalOpen" title="Insert Link" @close="closeLinkUploadModal"
        ref="childLinkUploadRef" @link-action="handleLinkAction" />
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TextAlign from '@tiptap/extension-text-align';
import GapCursor from '@tiptap/extension-gapcursor';
import Underline from '@tiptap/extension-underline';

import CodeBlock from "./CodeBlock";
import ImageUploadModal from './ImageUploadModal.vue';
import LinkUploadModal from './LinkUploadModal.vue';

import "./tiptap.css";

import { IconH1, IconH2, IconH3, IconBold, IconItalic, IconUnderline, IconStrikethrough, IconList, IconListNumbers, IconQuote, IconAlignLeft, IconAlignCenter, IconAlignRight, IconCirclesRelation, IconPhoto, IconCode, IconSlash } from "@tabler/icons-vue";
import { ref, watch } from 'vue';

const emit = defineEmits<{
    (e: 'post', field: keyof Post, value: string): void
}>();

const props = defineProps<{
    content: string,
}>();

const isImageUploadModalOpen = ref<boolean>(false);
const isLinkUploadModalOpen = ref<boolean>(false);

const childImageUploadRef = ref<any>(null);
const childLinkUploadRef = ref<any>(null);

const openImageUploadModal = () => {
    isImageUploadModalOpen.value = true;
};
const openLinkUploadModal = () => {
    if (editor.value?.isActive('link')) {
        editor.value.chain().focus().unsetLink().run();
    } else {
        isLinkUploadModalOpen.value = true;
    }
};
const closeImageUploadModal = () => {
    isImageUploadModalOpen.value = false;
    setImageUrl(null);
};
const closeLinkUploadModal = () => {
    isLinkUploadModalOpen.value = false;
};

// Initialize the editor
const editor = useEditor({
    content: props.content,
    extensions: [
        StarterKit,
        CodeBlock,
        Blockquote,
        Bold,
        Italic,
        Link,
        Image,
        ListItem,
        OrderedList,
        BulletList,
        HorizontalRule,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        GapCursor,
        Underline,
    ],
    onUpdate: ({ editor }) => {
        emit('post', 'description', editor.getHTML());
    },
});

watch(
    () => props.content,
    (newContent) => {
        if (editor.value && editor.value.getHTML() !== newContent) {
            editor.value.commands.setContent(newContent);
        }
    }
);

const toggleHeading = ({ level }: { level: 1 | 2 | 3 }) => {
    editor.value?.chain().focus().toggleHeading({ level }).run();
};

const toggleBold = () => {
    editor.value?.chain().focus().toggleBold().run();
};

const toggleItalic = () => {
    editor.value?.chain().focus().toggleItalic().run();
};

const toggleUnderline = () => {
    editor.value?.chain().focus().toggleUnderline().run();
};

const toggleStrikethrough = () => {
    editor.value?.chain().focus().toggleStrike().run();
};

const toggleBulletList = () => {
    editor.value?.chain().focus().toggleBulletList().run();
};

const toggleOrderedList = () => {
    editor.value?.chain().focus().toggleOrderedList().run();
};

const toggleBlockquote = () => {
    editor.value?.chain().focus().toggleBlockquote().run();
};

const toggleCode = () => {
    editor.value?.chain().focus().toggleCodeBlock().run();
};

const toggleHorizontalLine = () => {
    editor.value?.chain().focus().setHorizontalRule().run();
};

const setImageUrl = (url: string | null) => {
    if (url) {
        editor.value?.chain().focus().setImage({ src: url }).run();
    } else {
        console.log("Empty Url provided");
        return;
    }
};

const setLinkUrl = (url: string | null) => {
    if (url) {
        const hasProtocol = /^https?:\/\//i.test(url);
        const absoluteUrl = hasProtocol ? url : `https://${url}`;
        editor.value?.chain().focus().setLink({ href: absoluteUrl }).run();
    } else {
        editor.value?.chain().focus().unsetLink().run();
    }
};

const setTextAlign = (alignment: 'left' | 'center' | 'right') => {
    editor.value?.chain().focus().setTextAlign(alignment).run();
};

const handleImageAction = (action: "proceed" | "cancel", url: string | null) => {
    if (action === "proceed" && url) {
        setImageUrl(url);
    }
    closeImageUploadModal();
};

const handleLinkAction = (action: "proceed" | "cancel", url: string | null) => {
    if (action === "proceed" && url) {
        setLinkUrl(url);
    }
    closeLinkUploadModal();
};
</script>
