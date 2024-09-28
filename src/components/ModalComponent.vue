<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuthStore } from '../stores/auth';

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close']);

const authStore = useAuthStore();
const name = ref('');
const password = ref('');
const error = reactive({
    name: null as string | null,
    password: null as string | null
});

const handleSubmit = () => {
    const v_name = JSON.parse(import.meta.env.VITE_NAME);
    const v_password = import.meta.env.VITE_PASSWORD;
    error.name = null;
    error.password = null;

    if (!name.value || name.value.length < 3) {
        error.name = "Name can't be empty or less than three characters";
        return;
    }
    if (!password.value) {
        error.password = "Password can't be empty";
        return;
    }
    if (name.value && password.value) {
        if (!v_name.includes(name.value)) {
            error.name = "Name is not in the admin list";
            return;
        }
        if (v_password !== password.value) {
            error.password = "Password is wrong";
            return;
        }
        if (v_name.includes(name.value) && v_password === password.value) {
            authStore.setLoginStatus(true);
            emit('close');
        }
    }
};
</script>

<template>
    <div v-if="props.isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 class="text-2xl font-bold mb-6">Admin Login</h2>
            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" id="name" v-model="name"
                        class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 border-2"
                        placeholder="Enter your name" />
                    <div class="mt-2 text-red-500 font-normal" v-if="error.name">{{ error.name }}</div>
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password" v-model="password"
                        class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 border-2"
                        placeholder="Enter your password" />
                    <div class="mt-2 text-red-500 font-normal" v-if="error.password">{{ error.password }}</div>
                </div>
                <div class="flex justify-end space-x-3">
                    <button type="submit"
                        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">Login</button>
                </div>
            </form>
        </div>
    </div>
</template>
