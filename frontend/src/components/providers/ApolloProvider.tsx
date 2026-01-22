'use client';

import { ApolloClient, ApolloProvider as BaseApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie';
import { useMemo } from 'react';

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

  return new ApolloClient({
    link: authLink.concat(httpLink),
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

interface ApolloProviderProps {
  children: React.ReactNode;
}

export function ApolloProvider({ children }: ApolloProviderProps) {
  const client = useMemo(() => makeClient(), []);

  return (
    <BaseApolloProvider client={client}>
      {children}
    </BaseApolloProvider>
  );
}
