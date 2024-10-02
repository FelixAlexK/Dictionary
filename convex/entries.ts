import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const createEntry = mutation({
  args: {
    originalText: v.string(),
    originalLanguage: v.string(),
    translatedText: v.string(),
    translatedLanguage: v.string(),
    userId: v.optional(v.id('users'))
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('entries', {
      translatedText: args.translatedText,
      translatedLanguage: args.translatedLanguage,
      originalText: args.originalText,
      originalLanguage: args.originalLanguage,
      user_id: args.userId
    })
  }
})

export const getEntries = query({
  handler: async (ctx) => {
    return await ctx.db.query('entries').collect()
  }
})

export const searchEntries = query({
  args: { search: v.string() },
  handler: async (ctx, args) => {
    const [
      searchOrigLangResults,
      searchOrigTextResults,
      searchTransLangResults,
      searchTransTextResults
    ] = await Promise.all([
      ctx.db
        .query('entries')
        .withSearchIndex('search_origLang', (q) => q.search('originalLanguage', args.search))
        .take(10),
      ctx.db
        .query('entries')
        .withSearchIndex('search_origText', (q) => q.search('originalText', args.search))
        .take(10),
      ctx.db
        .query('entries')
        .withSearchIndex('search_transLang', (q) => q.search('translatedLanguage', args.search))
        .take(10),
      ctx.db
        .query('entries')
        .withSearchIndex('search_transText', (q) => q.search('translatedText', args.search))
        .take(10)
    ])

    const searchResults = [
      ...searchOrigLangResults,
      ...searchOrigTextResults,
      ...searchTransLangResults,
      ...searchTransTextResults
    ]

    if (searchResults.length === 0) {
      return await ctx.db.query('entries').order('desc').collect()
    }

    return searchResults
  }
})

export const deleteEntry = mutation({
  args: { id: v.id('entries') },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id)
  }
})
