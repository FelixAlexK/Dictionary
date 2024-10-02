import { paginationOptsValidator } from 'convex/server'
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
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const results = await ctx.db.query('entries').paginate(args.paginationOpts)

    return {
      ...results,
      page: results.page.map((result) => ({
        _id: result._id,
        _creationTime: result._creationTime,
        originalText: result.originalText,
        originalLanguage: result.originalLanguage,
        translatedText: result.translatedText,
        translatedLanguage: result.translatedLanguage
      }))
    }
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

    return searchResults
  }
})

export const deleteEntry = mutation({
  args: { id: v.id('entries') },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id)
  }
})
