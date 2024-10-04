<template>
    <div class="mb-6 border border-gray-200 rounded px-8 py-4 shadow">
        <div class="flex flex-row items-center justify-between">
            <h2 class="font-semibold text-base">Dictionary Entries</h2>
            <input v-model="searchInput" placeholder="search dictionary"
                class="border rounded p-2 focus:ring-2 focus:ring-black ring-offset-2" type="search" name="" id="">
        </div>
        <div class="mt-4">
            <ConvexQuery :query="api.entries.searchEntries" :args="{ search: searchInput }">
                <template #loading>
                    <Loader class="size-4 animate-spin"></Loader>
                </template>
                <template #error="{ error }">
                    <p>{{ error }}</p>
                </template>
                <template #empty>
                    <ConvexPaginatedQuery :options="{ numItems: numberOfItems }" :query="api.entries.getEntries"
                        :args="{}">
                        <template #loading>
                            <Loader class="size-4 animate-spin"></Loader>
                        </template>
                        <template #error="{ error, reset }">
                            <p>{{ error }}</p>
                            <button @click="reset">Retry</button>
                        </template>
                        <template #empty><span>No entries yet. Add your first word or sentence
                                above!</span></template>
                        <template #default="{ data: entries, isDone, isLoadingMore, loadMore, reset }">
                            <div class="group mb-6 border border-gray-200 rounded px-8 py-4 shadow flex flex-col items-center justify-center w-full"
                                v-for="(entry, index) in entries" :key="index">
                                <div
                                    class="flex flex-row items-center justify-between w-full mb-4 text-gray-500 text-sm">
                                    <div class="flex gap-2 items-center">
                                        <p class="capitalize">{{ entry.originalLanguage }}</p>
                                        <ArrowRight class="size-4"></ArrowRight>
                                        <p class="capitalize">{{ entry.translatedLanguage }}</p>
                                    </div>
                                    <div>
                                        <time>{{ new Date(entry._creationTime).toLocaleDateString() }}</time>
                                    </div>
                                </div>
                                <div
                                    class="w-full flex flex-col justify-center items-start gap-2 text-base font-medium">
                                    <p>{{ entry.originalText }}</p>
                                    <div class="border border-gray-300 w-full"></div>
                                    <p>{{ entry.translatedText }}</p>
                                </div>
                                <div class="flex flex-row items-center justify-end w-full mt-4">
                                    <Trash @click="removeEntry(entry._id)"
                                        class="cursor-pointer size-4 invisible group-hover:visible group-hover:text-red-500">
                                    </Trash>
                                </div>
                            </div>
                            <footer>
                                <div class="flex flex-row w-full justify-center items-center gap-2">
                                    <button v-if="entries.length > 0"
                                        class="bg-black disabled:bg-gray-400 text-base w-24 h-10 text-white rounded flex flex-row items-center gap-2 justify-center hover:bg-black/90 focus:ring-2 focus:ring-black ring-offset-2 transition-colors duration-500"
                                        :disabled="isDone" @click="loadMore">
                                        <Loader v-if="isLoadingMore" class="size-4 animate-spin"></Loader>
                                        <span v-else>Load more</span>
                                    </button>
                                    <button v-if="isDone && entries.length >= numberOfItems"
                                        class="bg-black disabled:bg-gray-400 text-base w-24 h-10 text-white rounded flex flex-row items-center gap-2 justify-center hover:bg-black/90 focus:ring-2 focus:ring-black ring-offset-2 transition-colors duration-500"
                                        @click="reset">Reset</button>
                                </div>
                            </footer>
                        </template>
                    </ConvexPaginatedQuery>
                </template>
            </ConvexQuery>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ArrowRight, Trash, Loader } from 'lucide-vue-next';
import { api } from '../../convex/_generated/api';
import { useConvexMutation, ConvexQuery, ConvexPaginatedQuery } from "@convex-vue/core";
import type { Id } from '../../convex/_generated/dataModel';

const props = defineProps<{
    numberOfItems: number;
}>();

const searchInput = ref('');
const { mutate: deleteEntry } = useConvexMutation(api.entries.deleteEntry, {
    onSuccess: () => {
        console.log('Entry deleted');
    },
    onError: (error) => {
        alert('Error deleting entry');
        console.error('Error deleting entry', error);
    }
});

const removeEntry = async (id: Id<'entries'>) => {
    if (!confirm('Are you sure you want to delete this entry?')) {
        return;
    }
    await deleteEntry({ id: id });
};
</script>