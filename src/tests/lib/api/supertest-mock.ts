interface MockResponse {
    status: number;
    headers: Record<string, string>;
    body: unknown;
    text: string;
}

interface MockApp {
    __handle?: (url: string, method?: string) => Promise<MockResponse>;
}

const request = (app: MockApp) => {
    const handler = app.__handle;
    if (!handler) {
        throw new Error('supertest mock expects createMockApp to provide __handle');
    }

    return {
        get: async (url: string): Promise<MockResponse> => handler(url, 'GET'),
    };
};

export default request;
