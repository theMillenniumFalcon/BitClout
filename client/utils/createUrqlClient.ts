import { dedupExchange, fetchExchange } from "urql"
import { LoginMutation, LogoutMutation, RegisterMutation, UserLoggedInDocument, UserLoggedInQuery } from "../generated/graphql"
import { betterUpdateQuery } from "./betterUpdateQuery"
import { cacheExchange } from "@urql/exchange-graphcache"

export const createUrqlClient = (ssrExchange: any) => ({
    url: 'http://localhost:4000/graphql',
  exchanges: [dedupExchange, cacheExchange({
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
        logout: (_result, args, cache, info) => {
          betterUpdateQuery<LogoutMutation, UserLoggedInQuery> (
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