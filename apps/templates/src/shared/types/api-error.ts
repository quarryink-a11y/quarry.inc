import type { components } from "@quarry/api-types";
import type { NextResponse } from "next/server";

export type ApiErrorResponse = components["schemas"]["ApiErrorResponseDto"];

export type RouteHandlerResponse<T> = NextResponse<T | ApiErrorResponse>;
