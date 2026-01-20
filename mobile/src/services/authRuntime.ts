export type Tokens = {
  access: string | null;
  refresh: string | null;
  hydrated: boolean;
};

let getTokensFn: (() => Tokens) | null = null;
let logoutFn: (() => Promise<void> | void) | null = null;
let setTokensFn: ((access: string, refresh?: string | null) => Promise<void> | void) | null = null;


export function setAuthRuntime(opts: {
  getTokens: () => Tokens;
  logout: () => Promise<void> | void;
  setTokens: (access: string, refresh?: string | null) => Promise<void> | void;

}) {
  getTokensFn = opts.getTokens;
  logoutFn = opts.logout;
  setTokensFn = opts.setTokens;
}

export function getTokens() {
  if (!getTokensFn) return { access: null, refresh: null, hydrated: false };
  return getTokensFn();
}

export async function runtimeLogout() {
  if (logoutFn) await logoutFn();
}

export async function runtimeSetTokens(access: string, refresh?: string | null) {
  if (setTokensFn) await setTokensFn(access, refresh ?? null);
}