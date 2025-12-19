export type User = {id:number, email:string, username:string};

export type RegisterPayload = {email:number, username:string, password:string};

export type LoginPayload = {identifier:string, password:string};

export type Tokens = {access_token:string, refresh_token:string};