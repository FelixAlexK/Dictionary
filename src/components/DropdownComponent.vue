<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
    options: { id: number; label: string }[];

}>();


const emit = defineEmits<{
    (e: 'select', option: { id: number; label: string }): void;
}>();

const searchQuery = ref("");
const isOpen = ref(false);

const filteredOptions = computed(() =>
    props.options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
);

const selectOption = (option: { id: number; label: string }) => {
    searchQuery.value = option.label;
    isOpen.value = false;
    emit("select", option);
};


const closeDropdown = () => {
    setTimeout(() => {
        isOpen.value = false;
    }, 200); // small delay to allow option click
};




</script>

<template>
    <div class="relative ">
        <input type="text" v-model="searchQuery" @focus="isOpen = true" @blur="closeDropdown"
            placeholder="Search language..."
            class="border rounded p-2 focus:ring-2 focus:ring-black ring-offset-2 w-full" />

        <ul v-if="isOpen"
            class="absolute right-1 left-1 border border-t-0 overflow-y-auto list-none p-0 bg-white max-h-60 z-50">
            <li v-for="option in filteredOptions" :key="option.id" @click="selectOption(option)"
                class="p-2 cursor-pointer hover:bg-gray-200">
                {{ option.label }}
            </li>
            <li v-if="!filteredOptions.length" class="p-2 cursor-pointer hover:bg-gray-200">No results found</li>
        </ul>
    </div>
</template>
