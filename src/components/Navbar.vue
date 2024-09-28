<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { IconBrandGithub, IconBrandLinkedin, IconMenu2, IconX } from '@tabler/icons-vue';

type NavOptions = {
    name: string;
    link: string;
}[];

const props = defineProps<{
    navLink: string;
}>();

const route = useRoute();
const currentUrl = route.fullPath;

const navOptions: NavOptions = [
    { name: 'HOME', link: '/' },
    { name: 'SPORTS', link: '/sports' },
    { name: 'TECHNOLOGY', link: '/tech' },
    { name: 'GAMING', link: '/gaming' },
    { name: 'ENTERTAINMENT', link: '/entertainment' },
];

const isMenuOpen = ref(false);
const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value;
</script>

<template>
    <nav class="relative h-44 md:h-[26rem] bg-black">
        <div class="w-[90%] md:w-[70%] h-10 mx-auto flex justify-between items-center pt-5">
            <div class="flex gap-5 items-center">
                <div class="md:hidden">
                    <button @click="toggleMenu">
                        <IconMenu2 class="w-5 h-5 text-white" />
                    </button>
                </div>
                <RouterLink to="/">
                    <h1 class="text-lg font-bold text-white mr-10 cursor-pointer">Shuvam's Blog</h1>
                </RouterLink>
                <RouterLink v-for="(option, index) in navOptions" :key="index"
                    class="hidden md:block text-gray-300 hover:text-white text-xs p-2"
                    :class="{ 'border border-white rounded-md': option.link === currentUrl }" :to="option.link">
                    {{ option.name }}
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

        <!-- Mobile Menu -->
        <transition name="fade">
            <div v-if="isMenuOpen" class="absolute top-14 left-0 w-full bg-black text-white pb-10 z-20">
                <div class="flex flex-col mt-8">
                    <RouterLink v-for="(option, index) in navOptions" :key="index"
                        class="block py-2 px-4 text-base hover:bg-gray-700 transition duration-150 ease-in-out"
                        :class="{ 'bg-gray-700': option.link === currentUrl }" :to="option.link">
                        {{ option.name }}
                    </RouterLink>
                </div>
            </div>
        </transition>

        <div class="flex-1 flex flex-col justify-center items-center h-full">
            <h1 class="text-3xl md:text-5xl font-bold text-white pb-12">{{ props.navLink }}</h1>
        </div>

        <div class="mt-0 md:-mt-32 w-full">
            <slot></slot>
        </div>
    </nav>
</template>

<style scoped>
/* Animation for the mobile menu */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
    {
    opacity: 0;
}
</style>
