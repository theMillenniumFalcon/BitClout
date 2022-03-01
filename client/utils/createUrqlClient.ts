import { dedupExchange, fetchExchange, stringifyVariables } from "urql"
import { LoginMutation, LogoutMutation, RegisterMutation, UserLoggedInDocument, UserLoggedInQuery } from "../generated/graphql"
import { betterUpdateQuery } from "./betterUpdateQuery"
import { cacheExchange, Resolver } from "@urql/exchange-graphcache"
import { gql } from '@urql/core';

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info

    const allFields = cache.inspectFields(entityKey)
    const fieldInfos = allFields.filter(info => info.fieldName === fieldName)
    const size = fieldInfos.length
    if (size === 0) {
      return undefined
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`

    const isInCache = cache.resolve(cache.resolveFieldByKey(entityKey, fieldKey) as string, "posts")
    info.partial = !isInCache

    let hasMore = true
    const results: string[] = []
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string
      const data = cache.resolve(key, "posts") as string[]
      const _hasMore = cache.resolve(key, "hasMore")
      if (!_hasMore) {
        hasMore = _hasMore as boolean
      }
      results.push(...data)
    })

    return {
      __typename: "PaginationPosts", hasMore, posts: results
    }
  };
};

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  exchanges: [dedupExchange, cacheExchange({
    keys: {
      Paginationposts: () => null
    },
    resolvers: {
      Query: {
        posts: cursorPagination()
      }
    },
    updates: {
      Mutation: {
        login: (_result, args, cache, info) => {
          betterUpdateQuery<LoginMutation, UserLoggedInQuery>(
            cache,
            { query: UserLoggedInDocument },
            _result,
            (result, query) => {
              if (result.login.errors) {
                return query
              } else {
                return {
                  userLoggedIn: result.login.user
                }
              }
            }
          )
        },
        register: (_result, args, cache, info) => {
          betterUpdateQuery<RegisterMutation, UserLoggedInQuery>(
            cache,
            { query: UserLoggedInDocument },
            _result,
            (result, query) => {
              if (result.register.errors) {
                return query
              } else {
                return {
                  userLoggedIn: result.register.user
                }
              }
            }
          )
        },
        vote: (_result, args, cache, info) => {
          const { postId, value } = args
          const data = cache.readFragment(
            gql`
              fragment _ on Post {
                id
                points
                voteStatus
              }
            `,
            { id: postId }
          )
          if (data) {
            if (data.voteStatus === value) {
              return
            }
            const newPoints = (data.points as number) + (!data.voteStatus? 1 : 2) * (value as any)
            cache.writeFragment(
              gql`
                fragment __ on Post {
                  points
                  voteStatus
                }
              `,
              { id: postId, points: newPoints, voteStatus: value }
            )
          }
        },
        createPost: (_result, args, cache, info) => {
          const allFields = cache.inspectFields("Query")
          const fieldInfos = allFields.filter(
            (info) => info.fieldName === "posts"
          )
          fieldInfos.forEach((fi) => {
            cache.invalidate("Query", "posts", fi.arguments)
          })
        },
        logout: (_result, args, cache, info) => {
          betterUpdateQuery<LogoutMutation, UserLoggedInQuery>(
            cache,
            { query: UserLoggedInDocument },
            _result,
            () => ({ userLoggedIn: null })
          )
        }
      }
    }
  }), ssrExchange, fetchExchange],
  fetchOptions: {
    credentials: "include" as const
  }
})