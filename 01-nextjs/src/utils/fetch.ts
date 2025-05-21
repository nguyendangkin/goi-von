import queryString from "query-string";

export interface IRequest<T = any> {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: any;
    queryParams?: Record<string, any>;
    useCredentials?: boolean;
    headers?: Record<string, string>;
    nextOption?: RequestInit;
}

interface IErrorResponse {
    statusCode: number;
    message: string;
    error: string;
}

// Hàm xử lý response chung
const handleResponse = async <T>(
    res: Response
): Promise<T | IErrorResponse> => {
    const json = await res.json();
    if (res.ok) {
        return json as T;
    } else {
        return {
            statusCode: res.status,
            message: json?.message ?? "",
            error: json?.error ?? "",
        };
    }
};

// Hàm gửi request JSON
export const sendRequest = async <T>(
    props: IRequest<T>
): Promise<T | IErrorResponse> => {
    const {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {},
    } = props;

    const fullUrl = queryParams
        ? `${url}?${queryString.stringify(queryParams)}`
        : url;

    const options: RequestInit = {
        method,
        headers: new Headers({
            "Content-Type": "application/json",
            ...headers,
        }),
        body: body ? JSON.stringify(body) : undefined,
        ...nextOption,
    };

    if (useCredentials) options.credentials = "include";

    const res = await fetch(fullUrl, options);
    return handleResponse<T>(res);
};

// Hàm gửi request File/FormData
export const sendRequestFile = async <T>(
    props: IRequest<T>
): Promise<T | IErrorResponse> => {
    const {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {},
    } = props;

    const fullUrl = queryParams
        ? `${url}?${queryString.stringify(queryParams)}`
        : url;

    const options: RequestInit = {
        method,
        headers: new Headers({ ...headers }), // Không set Content-Type
        body: body ?? undefined,
        ...nextOption,
    };

    if (useCredentials) options.credentials = "include";

    const res = await fetch(fullUrl, options);
    return handleResponse<T>(res);
};
