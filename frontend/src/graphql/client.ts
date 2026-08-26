import { GraphQLClient } from 'graphql-request';

/**
 * В dev-режиме запросы идут на относительный '/graphql', который
 * проксируется на бэкенд через vite.config.ts (server.proxy).
 * Для прод-сборки задайте VITE_GRAPHQL_URL с абсолютным адресом бэкенда.
 */
export const gqlClient = new GraphQLClient(import.meta.env.VITE_GRAPHQL_URL ?? '/graphql');
