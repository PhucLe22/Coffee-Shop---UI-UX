"use client";

import { useSyncExternalStore } from "react";
import { STATIC_PLACEHOLDER_PARAM } from "./static-route-param";

const noopSubscribe = () => () => {};

/**
 * Returns the dynamic route param. In the static export, URLs that weren't
 * pre-rendered are rewritten to the placeholder page, so the real value is
 * read from the last segment of the browser URL instead.
 */
export function useRouteParam(param: string) {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      if (param !== STATIC_PLACEHOLDER_PARAM) return param;
      const last = window.location.pathname.split("/").filter(Boolean).pop();
      return last ? decodeURIComponent(last) : param;
    },
    () => param,
  );
}
