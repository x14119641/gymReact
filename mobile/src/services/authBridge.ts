let accessToken:string | null = null;
let refreshToken:string|null=null;
let onLogout:(() => Promise<void>|void) |null = null;
let onAccessToken: ((t: string|null) => Promise<void> | void) | null=null;


export const authBridge = {
    // getters
    getAccessToken: () =>accessToken,
    getRefreshToken: () => refreshToken,

    // setters (called by the store)
    setAccessToken: (t:string|null) => {accessToken = t;},
    setRefreshToken: (t:string|null) => {refreshToken =t;},

    // callbacks so api.ts can update store without importing it. (Fixing refresh token still keeping user loged in agter token expired)
    setOnAccessToken: (fn: typeof onAccessToken) => {onAccessToken = fn;},
    callSetAccessToken: async (t:string|null) => {if (onAccessToken) await onAccessToken(t);},

    // logout callback registration (store provides the fn)
    setOnLogout: (fn: typeof onLogout) => { onLogout = fn;},
    callLogout: async () => {if (onLogout) await onLogout();}
}