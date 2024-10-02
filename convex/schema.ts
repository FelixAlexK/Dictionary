import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  entries: defineTable({
    user_id: v.optional(v.id('users')),
    originalText: v.string(),
    originalLanguage: v.string(),
    translatedText: v.string(),
    translatedLanguage: v.string()
  })
    .searchIndex('search_origLang', {
      searchField: 'originalLanguage'
    })
    .searchIndex('search_origText', {
      searchField: 'originalText'
    })
    .searchIndex('search_transText', {
      searchField: 'translatedText'
    })
    .searchIndex('search_transLang', {
      searchField: 'translatedLanguage'
    }),
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string()
  }).index('by_token', ['tokenIdentifier'])
})
