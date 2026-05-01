interface MockResponse {
    status: number;
    headers: Record<string, string>;
    body: unknown;
    text: string;
}

interface MockApp {
    __handle?: (url: string, method: string) => Promise<MockResponse>;
}

/** Standard HTTP method strings used by the mock request handler. */
enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}

const request = (app: MockApp) => {
    const handler = app.__handle;
    if (!handler) {
        throw new Error('supertest mock expects createMockApp to provide __handle');
    }

    return {
        get: async (url: string): Promise<MockResponse> => handler(url, HttpMethod.GET),
        post: async (url: string): Promise<MockResponse> => handler(url, HttpMethod.POST),
        put: async (url: string): Promise<MockResponse> => handler(url, HttpMethod.PUT),
        delete: async (url: string): Promise<MockResponse> => handler(url, HttpMethod.DELETE),
        patch: async (url: string): Promise<MockResponse> => handler(url, HttpMethod.PATCH),
    };
};

export default request;
