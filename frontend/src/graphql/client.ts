import { GraphQLClient } from 'graphql-request';

/**
 * В dev-режиме запросы идут на относительный '/api/graphql', который
 * проксируется на бэкенд через vite.config.ts (server.proxy).
 * Для прод-сборки используем VITE_GRAPHQL_URL c абсолютным адресом бэкенда
 */
const API_URL = buildUrl(import.meta.env.VITE_GRAPHQL_URL ?? '/api/graphql');

export const gqlClient = new GraphQLClient(API_URL, {
  headers: { 'Content-Type': 'application/json' },
});

function isAbsoluteUrl(p: string): boolean {
  return /^([a-z]+:)?\/\//i.test(p);
}

function buildUrl(p: string): string {
  if (typeof window !== 'undefined' && !isAbsoluteUrl(p)) {
    p = window.location.origin + p;
  }
  return p;
}
