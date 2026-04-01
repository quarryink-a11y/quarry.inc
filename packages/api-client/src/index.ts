import createClient from "openapi-fetch";
import type { paths } from "@quarry/api-types";

export function createApiClient(baseUrl: string) {
  return createClient<paths>({ baseUrl });
}

export type { paths };
export type { components, operations } from "@quarry/api-types";
