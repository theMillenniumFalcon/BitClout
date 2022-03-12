import { dedupExchange, fetchExchange, stringifyVariables } from "urql"
import { LoginMutation, LogoutMutation, MemberMutationVariables, RegisterMutation, UserLoggedInDocument, UserLoggedInQuery, VoteMutationVariables } from "../generated/graphql"
import { betterUpdateQuery } from "./betterUpdateQuery"
import { cacheExchange } from "@urql/exchange-graphcache"
import { gql } from '@urql/core';
import { isServer } from "./isServer";

export const createUrqlClient = (ssrExchange: any, ctx: any) => {

  let cookie = ''
  if (isServer()) {
    cookie = ctx?.req?.headers?.cookie
  }

  return (
    {
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
              const allFields = cache.inspectFields("Query")
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === "posts"
              )
              fieldInfos.forEach((fi) => {
                cache.invalidate("Query", "posts", fi.arguments)
              })
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
            deleteGroup: (_result, args, cache, info) => {
              cache.invalidate({ __typename: "Group", id: (args as any).id })
            },
            deletePost: (_result, args, cache, info) => {
              cache.invalidate({ __typename: "Post", id: (args as any).id })
            },
            vote: (_result, args, cache, info) => {
              const { postId, value } = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: postId } as any
              );

              if (data) {
                if (data.voteStatus === value) {
                  return;
                }
                const newPoints =
                  (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
                cache.writeFragment(
                  gql`
                    fragment __ on Post {
                      points
                      voteStatus
                    }
                  `,
                  { id: postId, points: newPoints, voteStatus: value } as any
                );
              }
            },
            member: (_result, args, cache, info) => {

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
            createGroup: (_result, args, cache, info) => {
              const allFields = cache.inspectFields("Query")
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === "groups"
              )
              fieldInfos.forEach((fi) => {
                cache.invalidate("Query", "groups", fi.arguments)
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
        credentials: "include" as const,
        headers: cookie ? { cookie } : undefined
      }
    }
  )
}