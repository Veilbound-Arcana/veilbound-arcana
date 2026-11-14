"use client";

/**
 * React-router-compatible navigation shim backed by the Next.js App Router.
 *
 * The game screens were written against `react-router-dom`'s hook API. This
 * module keeps every screen untouched while the app runs on Next.js: the
 * navigate/location/search-param/param semantics are preserved one-for-one.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import {
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";

export interface RouteLocation {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
  key: string;
}

export function useNavigate() {
  const router = useRouter();
  return useCallback(
    (to: string | number, opts?: { replace?: boolean; state?: unknown }) => {
      if (typeof to === "number") {
        if (to < 0) router.back();
        else if (to > 0) router.forward();
        return;
      }
      if (opts?.replace) router.replace(to);
      else router.push(to);
    },
    [router]
  );
}

export function useLocation(): RouteLocation {
  const pathname = usePathname();
  const params = useNextSearchParams();
  return useMemo(() => {
    const search = params.toString();
    return {
      pathname,
      search: search ? `?${search}` : "",
      hash: "",
      state: null,
      key: pathname,
    };
  }, [pathname, params]);
}

type SetSearchParams = (
  nextInit?:
    | Record<string, string | number | boolean>
    | URLSearchParams
    | ((prev: URLSearchParams) => Record<string, string>),
  opts?: { replace?: boolean }
) => void;

export function useSearchParams(): readonly [URLSearchParams, SetSearchParams] {
  const params = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setSearchParams = useCallback<SetSearchParams>(
    (nextInit, opts) => {
      let next: URLSearchParams;
      if (typeof nextInit === "function") {
        const computed = nextInit(new URLSearchParams(params.toString()));
        next = new URLSearchParams();
        Object.entries(computed).forEach(([k, v]) => next.set(k, String(v)));
      } else if (nextInit instanceof URLSearchParams) {
        next = new URLSearchParams(nextInit.toString());
      } else if (nextInit) {
        next = new URLSearchParams();
        Object.entries(nextInit).forEach(([k, v]) => next.set(k, String(v)));
      } else {
        next = new URLSearchParams();
      }
      const qs = next.toString();
      const href = qs ? `${pathname}?${qs}` : pathname;
      if (opts?.replace) router.replace(href);
      else router.push(href);
    },
    [params, router, pathname]
  );

  const snapshot = useMemo(
    () => new URLSearchParams(params.toString()),
    [params]
  );

  return [snapshot, setSearchParams] as const;
}

/** Route params are provided by the page through `ParamsContext`. */
const ParamsContext = createContext<Record<string, string>>({});

export const RouteParamsProvider: React.FC<{
  params: Record<string, string>;
  children: React.ReactNode;
}> = ({ params, children }) => (
  <ParamsContext.Provider value={params}>{children}</ParamsContext.Provider>
);

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  return useContext(ParamsContext) as T;
}
