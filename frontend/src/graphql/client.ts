import { GraphQLClient } from 'graphql-request';

/**
 * В dev-режиме запросы идут на относительный '/graphql', который
 * проксируется на бэкенд через vite.config.ts (server.proxy).
 * Для прод-сборки VITE_GRAPHQL_URL с абсолютным адресом бэкенда.
 */
const path: string = import.meta.env.VITE_GRAPHQL_URL ?? '/graphql';
const API_URL: string = `${window.location.origin}${['//', 'http'].some((s) => path.startsWith(s)) ? new URL(path).pathname : path}`;

export const gqlClient = new GraphQLClient(API_URL);
