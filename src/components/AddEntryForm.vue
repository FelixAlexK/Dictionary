<template>
    <div class="mb-6 border border-gray-200 rounded px-8 py-4 shadow">
        <h2 class="font-semibold text-base">Add New Entry</h2>
        <div class="mt-4">
            <form @submit.prevent="createEntry" class="flex flex-col space-y-4">
                <label for="from-language">From:</label>
                <Dropdown
                    :disabled="fromLanguage?.label.toLowerCase() === toLanguage?.label && fromLanguage?.label !== undefined"
                    :options="langOptions" @select="handleSelectFromLang">
                </Dropdown>
                <input :disabled="fromLanguage?.label === undefined" v-model="originalText"
                    class="border rounded p-2 focus:ring-2 focus:ring-black ring-offset-2"
                    :placeholder="fromLanguage?.label !== undefined ? `Enter ${fromLanguage?.label} word or sentence` : 'Select language first'"
                    type="text">
                <label class="pt-4" for="to-language">To:</label>
                <Dropdown
                    :disabled="toLanguage?.label.toLowerCase() === fromLanguage?.label && toLanguage?.label !== undefined"
                    :options="langOptions" @select="handleSelectToLang">
                </Dropdown>
                <input :disabled="toLanguage?.label === undefined" v-model="translatedText"
                    class="border rounded p-2 focus:ring-2 focus:ring-black ring-offset-2"
                    :placeholder="toLanguage?.label !== undefined ? `Enter ${toLanguage?.label} translation` : 'Select language first'"
                    type="text">
                <Transition mode="out-in">
                    <Button v-if="!addEntrySuccess"
                        :disabled="addEntryLoading && fromLanguage?.label === '' || toLanguage?.label === ''"
                        class="bg-black text-base p-2 text-white rounded flex flex-row items-center gap-2 justify-center hover:bg-black/90 focus:ring-2 focus:ring-black ring-offset-2 transition-colors duration-500"
                        type="submit">
                        <Plus :size="20"></Plus>Add Entry
                    </Button>
                    <Button v-else disabled
                        class="bg-green-500 text-base p-2 text-white rounded flex flex-row items-center gap-2 justify-center focus:ring-2 focus:ring-black ring-offset-2 transition-colors">
                        <Check :size="20"></Check>Add Entry
                    </Button>
                </Transition>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus, Check } from 'lucide-vue-next';
import Dropdown from '@/components/DropdownComponent.vue';

const props = defineProps<{
    langOptions: { id: number; label: string }[];
    addEntryLoading: boolean;
    addEntrySuccess: boolean;
}>();

const emit = defineEmits<{
    (e: 'create-entry', entry: { originalLanguage: string; originalText: string; translatedLanguage: string; translatedText: string }): void;
}>();

const fromLanguage = ref<{ id: number; label: string } | null>(null);
const toLanguage = ref<{ id: number; label: string } | null>(null);
const originalText = ref('');
const translatedText = ref('');

const handleSelectFromLang = (option: { id: number; label: string }) => {
    fromLanguage.value = option;
};

const handleSelectToLang = (option: { id: number; label: string }) => {
    toLanguage.value = option;
};

const createEntry = () => {
    if (fromLanguage.value?.label === undefined || toLanguage.value?.label === undefined) {
        alert('Please select both languages');
        return;
    }
    emit('create-entry', {
        originalLanguage: fromLanguage.value.label,
        originalText: originalText.value,
        translatedLanguage: toLanguage.value.label,
        translatedText: translatedText.value,
    });

    originalText.value = '';
    translatedText.value = '';
};
</script>