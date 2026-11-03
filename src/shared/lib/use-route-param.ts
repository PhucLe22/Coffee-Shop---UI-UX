import { useSyncExternalStore } from "react";

/** Placeholder segment pre-rendered for dynamic routes in the static export. */
export const STATIC_PLACEHOLDER_PARAM = "_";

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
