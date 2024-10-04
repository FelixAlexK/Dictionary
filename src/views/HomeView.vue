<template>
    <div class="container mx-auto p-4 text-sm">
        <AlertComponent :is-visible="showAlert" @hide-alert="showAlert = false" :message="alertMessage" />
        <header class="">
            <div class="flex flex-row items-center justify-between mb-6">
                <h1 class="text-3xl font-bold">Dictionary</h1>
            </div>
        </header>
        <main class="">
            <AddEntryForm :langOptions="langOptions" :addEntryLoading="addEntryLoading"
                :addEntrySuccess="addEntrySuccess" @create-entry="createEntry" />
            <DictionaryEntries :numberOfItems="numberOfItems" />
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import languages from '@cospired/i18n-iso-languages';
import enLocale from '@cospired/i18n-iso-languages/langs/en.json';
import deLocale from '@cospired/i18n-iso-languages/langs/de.json';
import { api } from '../../convex/_generated/api';
import { useConvexMutation } from "@convex-vue/core";
import AlertComponent from '@/components/AlertComponent.vue';
import AddEntryForm from '@/components/AddEntryForm.vue';
import DictionaryEntries from '@/components/DictionaryEntries.vue';

languages.registerLocale(enLocale);
languages.registerLocale(deLocale);

const showAlert = ref(false);
const alertMessage = ref('');
const addEntrySuccess = ref(false);
const numberOfItems = ref(10);

const getLang = computed(() => {
    return languages.langs().includes(navigator.language.split('-')[0]) ? navigator.language.split('-')[0] : 'en';
});

const langs = Object.values(languages.getNames(getLang.value)).sort((a, b) => a.localeCompare(b));

const langOptions = computed(() => {
    return langs.map((lang, index) => {
        const obj = {
            id: index,
            label: lang
        };
        return obj;
    });
});

const { isLoading: addEntryLoading, mutate: addEntry } = useConvexMutation(api.entries.createEntry, {
    onSuccess: () => {
        addEntrySuccess.value = true;
        setTimeout(() => {
            addEntrySuccess.value = false;
        }, 3000);
    },
    onError: (error) => {
        showAlert.value = true;
        alertMessage.value = 'Error creating entry';
        console.error('Error creating entry', error);
    }
});

const createEntry = async (entry: { originalLanguage: string; originalText: string; translatedLanguage: string; translatedText: string }) => {
    await addEntry(entry);
};
</script>