let accessToken:string | null = null;
let refreshToken:string|null=null;
let onLogout:(() => Promise<void>|void) |null = null;


export const authBridge = {
    // getters
    getAccessToken: () =>accessToken,
    getRefreshToken: () => refreshToken,

    // setters (called by the store)
    setAccessToken: (t:string|null) => {accessToken = t;},
    setRefreshToken: (t:string|null) => {refreshToken =t;},

    // logout callback registration (store provides the fn)
    setOnLogout: (fn: typeof onLogout) => { onLogout = fn;},
    callLogout: async () => {if (onLogout) await onLogout();}
}