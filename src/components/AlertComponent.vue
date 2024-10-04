<script setup lang="ts">
import { watch } from 'vue';


const emit = defineEmits(['hideAlert']);

const { isVisible = false, message = '' } = defineProps<{
    isVisible: boolean;
    message: string;
}>();



watch(() => isVisible, (newVal) => {
    if (newVal) {
        setTimeout(() => {
            emit('hideAlert');
        }, 15000);
    }
});

</script>

<template>
    <div v-if="isVisible"
        class="fixed flex flex-row justify-between items-center top-0 left-0 w-full bg-red-500 text-white text-center p-4 transition-transform duration-300 ease-in-out z-50"
        :class="{ '-translate-y-full': !isVisible, 'translate-y-0': isVisible }">
        <p class=" font-semibold">{{ message }}</p>
        <button @click="$emit('hideAlert')"
            class="bg-red-700 text-base py-2 px-4 text-white rounded flex flex-row items-center gap-2 justify-center hover:bg-red-800   transition-colors duration-500">Close</button>
    </div>
</template>