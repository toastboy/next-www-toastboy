declare module 'supertest' {
    export interface MockResponse {
        status: number;
        headers: Record<string, string>;
        body: unknown;
        text: string;
        error?: unknown;
    }

    export interface App {
        __handle?: (url: string, method?: string) => Promise<MockResponse>;
    }

    const request: (app: App) => {
        get: (url: string) => Promise<MockResponse>;
    };

    export default request;
}
