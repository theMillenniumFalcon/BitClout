import { dedupExchange, fetchExchange, stringifyVariables } from "urql"
import { LoginMutation, LogoutMutation, RegisterMutation, UserLoggedInDocument, UserLoggedInQuery } from "../generated/graphql"
import { betterUpdateQuery } from "./betterUpdateQuery"
import { cacheExchange, Resolver } from "@urql/exchange-graphcache"

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

    // const visited = new Set();
    // let result: NullArray<string> = [];
    // let prevOffset: number | null = null;

    // for (let i = 0; i < size; i++) {
    //   const { fieldKey, arguments: args } = fieldInfos[i];
    //   if (args === null || !compareArgs(fieldArgs, args)) {
    //     continue;
    //   }

    //   const links = cache.resolve(entityKey, fieldKey) as string[];
    //   const currentOffset = args[cursorArgumentt];

    //   if (
    //     links === null ||
    //     links.length === 0 ||
    //     typeof currentOffset !== 'number'
    //   ) {
    //     continue;
    //   }

    //   const tempResult: NullArray<string> = [];

    //   for (let j = 0; j < links.length; j++) {
    //     const link = links[j];
    //     if (visited.has(link)) continue;
    //     tempResult.push(link);
    //     visited.add(link);
    //   }

    //   if (
    //     (!prevOffset || currentOffset > prevOffset) ===
    //     (mergeMode === 'after')
    //   ) {
    //     result = [...result, ...tempResult];
    //   } else {
    //     result = [...tempResult, ...result];
    //   }

    //   prevOffset = currentOffset;
    // }

    // const hasCurrentPage = cache.resolve(entityKey, fieldName, fieldArgs);
    // if (hasCurrentPage) {
    //   return result;
    // } else if (!(info as any).store.schema) {
    //   return undefined;
    // } else {
    //   info.partial = true;
    //   return result;
    // }
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