import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { handle, MockHttpError, userFromToken } from "./handlers";

const LATENCY_MS = 250;

function parseBody(data: unknown) {
  if (data == null || data === "") return {};
  if (typeof FormData !== "undefined" && data instanceof FormData) {
    const out: Record<string, unknown> = {};
    data.forEach((value, key) => { out[key] = value; });
    return out;
  }
  if (typeof data === "string") {
    try { return JSON.parse(data); } catch { return {}; }
  }
  return data;
}

function resolvePath(config: InternalAxiosRequestConfig) {
  let url = config.url ?? "";
  if (config.baseURL && url.startsWith(config.baseURL)) url = url.slice(config.baseURL.length);
  url = url.replace(/^https?:\/\/[^/]+/, "").replace(/^\/api(?=\/)/, "");
  const [path, search] = url.split("?");
  const query: Record<string, unknown> = Object.fromEntries(new URLSearchParams(search ?? ""));
  for (const [k, v] of Object.entries(config.params ?? {})) if (v !== undefined && v !== null) query[k] = v;
  return { path: path.startsWith("/") ? path : `/${path}`, query };
}

/** Axios adapter that answers every request from the in-memory demo dataset. */
export async function mockAdapter(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  await new Promise((r) => setTimeout(r, LATENCY_MS));
  const { path, query } = resolvePath(config);
  const method = (config.method ?? "get").toUpperCase();
  const auth = String(config.headers?.Authorization ?? "");
  const user = userFromToken(auth.replace(/^Bearer\s+/i, ""));

  try {
    const { status, body } = handle({ method, path, query, body: parseBody(config.data), user });
    return { data: body, status, statusText: "OK", headers: {}, config, request: {} };
  } catch (e) {
    const status = e instanceof MockHttpError ? e.status : 500;
    const message = e instanceof Error ? e.message : "Mock error";
    if (status === 404 && message.startsWith("[mock]")) console.warn(message);
    const response = { data: { success: false, message }, status, statusText: message, headers: {}, config, request: {} } as AxiosResponse;
    throw new AxiosError(message, String(status), config, {}, response);
  }
}
