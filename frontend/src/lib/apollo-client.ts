'use client';

import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import Cookies from 'js-cookie';

function makeClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
  });

  const authLink = setContext((_, { headers }) => {
    const token = typeof window !== 'undefined' ? Cookies.get('accessToken') : null;

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            bulls: {
              keyArgs: ['input', ['filters', 'orderBy']],
              merge(existing, incoming, { args }) {
                if (!args?.input?.after) {
                  return incoming;
                }
                return {
                  ...incoming,
                  edges: [...(existing?.edges || []), ...incoming.edges],
                };
              },
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  });
}

// Create a singleton instance for client-side
let apolloClientInstance: ApolloClient<object> | null = null;

export function getApolloClient() {
  if (typeof window === 'undefined') {
    // Always create a new client on the server
    return makeClient();
  }

  // Create the client once on the client-side
  if (!apolloClientInstance) {
    apolloClientInstance = makeClient();
  }

  return apolloClientInstance;
}

export const apolloClient = typeof window !== 'undefined' ? getApolloClient() : null;
