import { deleteCookie, setCookie } from './cookie';

class TokenManager {
    private static readonly refreshTokenKey = 'refreshToken';
    private static readonly accessTokenCookieName = 'accessToken';

    static storeTokens(refreshToken: string, accessToken: string): void {
        this.saveRefreshToken(refreshToken);
        this.saveAccessToken(accessToken);
    }

    private static saveRefreshToken(token: string): void {
        localStorage.setItem(this.refreshTokenKey, String(token));
    }

    private static saveAccessToken(token: string): void {
        setCookie(this.accessTokenCookieName, String(token));
    }

    static clearTokens(): void {
        this.removeRefreshToken();
        this.removeAccessToken();
    }

    private static removeRefreshToken(): void {
        localStorage.removeItem(this.refreshTokenKey);
    }

    private static removeAccessToken(): void {
        deleteCookie(this.accessTokenCookieName);
    }
}

export const { storeTokens, clearTokens } = TokenManager;