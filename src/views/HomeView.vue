<script setup lang="ts">
import { Save, Plus, ArrowRight, Check } from 'lucide-vue-next'
import languages from '@cospired/i18n-iso-languages'
import { ref, watch, watchEffect } from 'vue';
import enLocale from '@cospired/i18n-iso-languages/langs/en.json';
import { api } from '../../convex/_generated/api';
import { useConvexQuery, useConvexMutation, ConvexQuery } from "@convex-vue/core";

languages.registerLocale(enLocale);
const fromLanguage = ref('')
const originalText = ref('')
const toLanguage = ref('')
const translatedText = ref('')
const addEntrySuccess = ref(false)
const searchInput = ref('')

const langs = Object.values(languages.getNames('en'))

const { error: addEntryError, isLoading: addEntryLoading, mutate: addEntry } = useConvexMutation(api.entries.createEntry, {
    onSuccess: () => {
        addEntrySuccess.value = true
        setTimeout(() => {
            addEntrySuccess.value = false
        }, 3000)
    },
    onError: (error) => {
        console.error('Error creating entry', error)
    }
});




const createEntry = async () => {
    await addEntry({ originalLanguage: fromLanguage.value, originalText: originalText.value, translatedLanguage: toLanguage.value, translatedText: translatedText.value })
}

watchEffect(() => searchInput.value)



</script>

<template>
    <div class="container mx-auto p-4 text-sm">
        <header class="">
            <div class="flex flex-row items-center justify-between mb-6">
                <h1 class="text-3xl font-bold ">Dictionary</h1>
            </div>

        </header>
        <main class="">
            <div class="mb-6 border border-gray-200 rounded px-8 py-4 shadow">

                <h2 class="font-semibold text-base">Add New Entry</h2>
                <div class="mt-4">
                    <form @submit.prevent="createEntry" class="flex flex-col space-y-4">
                        <label for="to-language">From:</label>
                        <select v-model="fromLanguage" id="from-language"
                            class="border rounded p-2 focus:ring-2 focus:ring-black ring-offset-2">
                            <option value="" disabled selected>Select Language</option>
                            <option :disabled="lang.toLowerCase() === toLanguage" :value="lang.toLowerCase()"
                                v-for="(lang, index) in langs" :key="index">{{
                                    lang }}</option>
                        </select>
                        <input v-model="originalText"
                            class="border rounded p-2 focus:ring-2 focus:ring-black ring-offset-2"
                            :placeholder="`Enter ${fromLanguage.charAt(0).toUpperCase() + fromLanguage.slice(1)} word or sentence`"
                            type="text">
                        <label class="pt-4" for="to-language">To:</label>
                        <select v-model="toLanguage" id="to-language"
                            class="border rounded p-2 focus:ring-2 focus:ring-black ring-offset-2">
                            <option value="" disabled selected>Select Language</option>
                            <option :disabled="lang.toLowerCase() === fromLanguage" :value="lang.toLowerCase()"
                                v-for="(lang, index) in langs" :key="index">{{
                                    lang }}</option>
                        </select>
                        <input v-model="translatedText"
                            class="border rounded p-2 focus:ring-2 focus:ring-black ring-offset-2"
                            :placeholder="`Enter ${toLanguage.charAt(0).toUpperCase() + toLanguage.slice(1)} translation`"
                            type="text">
                        <Transition mode="out-in">
                            <Button v-if="!addEntrySuccess" :disabled="addEntryLoading"
                                class="bg-black text-base p-2 text-white rounded flex flex-row items-center gap-2 justify-center hover:bg-black/90 focus:ring-2 focus:ring-black ring-offset-2 transition-colors duration-500"
                                type="submit">
                                <Plus :size="20"></Plus>Add Entry
                            </Button>
                            <Button v-else disabled
                                class="bg-green-500 text-base p-2 text-white rounded flex flex-row items-center gap-2 justify-center focus:ring-2 focus:ring-black ring-offset-2 transition-colors duration-500">
                                <Check :size="20"></Check>Add Entry
                            </Button>
                        </Transition>
                    </form>
                </div>

            </div>
            <div class="mb-6 border border-gray-200 rounded px-8 py-4 shadow ">

                <div class="flex flex-row items-center justify-between">
                    <h2 class="font-semibold text-base">Dictionary Entries</h2>

                    <input v-model="searchInput" placeholder="search dictionary"
                        class="border rounded p-2 focus:ring-2 focus:ring-black ring-offset-2" type="search" name=""
                        id="">


                </div>



                <div class="mt-4">


                    <ConvexQuery :query="api.entries.searchEntries" :args="{ search: searchInput }">
                        <template #loading></template>
                        <template #error></template>
                        <template #empty><span>No entries yet. Add your first word or sentence
                                above!</span></template>
                        <template #default="{ data: entries }">

                            <div class="mb-6 border border-gray-200 rounded px-8 py-4 shadow flex flex-col items-center justify-center w-full"
                                v-for="(entry, index) in entries" :key="index">
                                <div
                                    class="flex flex-row items-center gap-2 justify-start w-full mb-4 text-gray-500 text-sm">
                                    <p class="capitalize  ">{{ entry.originalLanguage }}</p>
                                    <ArrowRight class="size-4"></ArrowRight>
                                    <p class="capitalize  ">{{ entry.translatedLanguage }}</p>
                                </div>
                                <div
                                    class="w-full flex flex-col justify-center items-start gap-2 text-base font-medium">
                                    <p>{{ entry.originalText }}</p>
                                    <div class="border border-gray-300 w-full"></div>
                                    <p>{{ entry.translatedText }}</p>
                                </div>
                            </div>

                        </template>

                    </ConvexQuery>


                </div>

            </div>
        </main>
    </div>

</template>

<style></style>