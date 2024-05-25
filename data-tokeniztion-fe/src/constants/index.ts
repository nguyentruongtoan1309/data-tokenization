export enum AuthType {
    CONFIGURING = 'configuring',
    UNAUTHENTICATED = 'unauthenticated',
    AUTHENTICATED = 'authenticated',
}

export type AuthStatus = 'configuring' | 'authenticated' | 'unauthenticated';
