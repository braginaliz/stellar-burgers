import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

const URL = process.env.BURGER_API_URL;

const checkResponse = async <T>(res: Response): Promise<T> => {
    const data = await res.json();
    if (res.ok) {
        return data;
    } else {
        return Promise.reject(data);
    }
};

export type TServerResponseStatus = { success: boolean };

type TServerResponse<T> = TServerResponseStatus & T;

type TRefreshResponse = TServerResponse<{
    refreshToken: string;
    accessToken: string;
}>;

export const refreshToken = async (): Promise<TRefreshResponse> => {
    const response = await fetch(`${URL}/auth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            token: localStorage.getItem('refreshToken')
        })
    });
    const refreshData = await checkResponse<TRefreshResponse>(response);

    if (!refreshData.success) {
        return Promise.reject(refreshData);
    }

    localStorage.setItem('refreshToken', refreshData.refreshToken);
    setCookie('accessToken', refreshData.accessToken);
    return refreshData;
};

export const fetchWithRefresh = async <T>(url: RequestInfo, options: RequestInit): Promise<T> => {
    try {
        const response = await fetch(url, options);
        return await checkResponse<T>(response);
    } catch (err) {
        if ((err as { message: string }).message === 'jwt expired') {
            const refreshData = await refreshToken();
            if (options.headers) {
                (options.headers as { [key: string]: string }).authorization = refreshData.accessToken;
            }
            const response = await fetch(url, options);
            return await checkResponse<T>(response);
        }
        return Promise.reject(err);
    }
};

type TIngredientsResponse = TServerResponse<{
    data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<{
    orders: TOrder[];
    total: number;
    totalToday: number;
}>;

type TOrdersResponse = TServerResponse<{
    data: TOrder[];
}>;

export const getIngredientsApi = async (): Promise<TIngredient[]> => {
    const response = await fetch(`${URL}/ingredients`);
    const data = await checkResponse<TIngredientsResponse>(response);
    
    if (data?.success) {
        return data.data;
    }
    return Promise.reject(data);
};

export const getFeedsApi = async (): Promise<TFeedsResponse> => {
    const response = await fetch(`${URL}/orders/all`);
    const data = await checkResponse<TFeedsResponse>(response);
    
    if (data?.success) {
        return data;
    }
    return Promise.reject(data);
};

export const getOrdersApi = async (): Promise<TOrder[]> => {
    const data = await fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            authorization: getCookie('accessToken')
        } as HeadersInit
    });
    
    if (data?.success) {
        return data.orders;
    }
    return Promise.reject(data);
};

type TNewOrderResponse = TServerResponse<{
    order: TOrder;
    name: string;
}>;

export const orderBurgerApi = async (data: string[]): Promise<TNewOrderResponse> => {
    const result = await fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            authorization: getCookie('accessToken')
        } as HeadersInit,
        body: JSON.stringify({
            ingredients: data
        })
    });
    
    if (result?.success) {
        return result;
    }
    return Promise.reject(result);
};

type TOrderResponse = TServerResponse<{
    orders: TOrder[];
}>;

export const getOrderByNumberApi = async (number: number): Promise<TOrderResponse> => {
    const response = await fetch(`${URL}/orders/${number}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return checkResponse<TOrderResponse>(response);
};

export type TRegisterData = {
    email: string;
    name: string;
    password: string;
};

type TAuthResponse = TServerResponse<{
    refreshToken: string;
    accessToken: string;
    user: TUser;
}>;

export const registerUserApi = async (data: TRegisterData): Promise<TAuthResponse> => {
    const response = await fetch(`${URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    });
    
    const result = await checkResponse<TAuthResponse>(response);
    
    if (result?.success) {
        return result;
    }
    return Promise.reject(result);
};

export type TLoginData = {
    email: string;
    password: string;
};

export const loginUserApi = async (data: TLoginData): Promise<TAuthResponse> => {
    const response = await fetch(`${URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    });
    
    const result = await checkResponse<TAuthResponse>(response);
    
    if (result?.success) {
        return result;
    }
    return Promise.reject(result);
};

export const forgotPasswordApi = async (data: { email: string }): Promise<TServerResponse<{}>> => {
    const response = await fetch(`${URL}/password-reset`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    });
    
    const result = await checkResponse<TServerResponse<{}>>(response);
    
    if (result?.success) {
        return result;
    }
    return Promise.reject(result);
};

export const resetPasswordApi = async (data: { password: string; token: string }): Promise<TServerResponse<{}>> => {
    const response = await fetch(`${URL}/password-reset/reset`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    const result = await checkResponse<TServerResponse<{}>>(response);
    
    if (result?.success) {
        return result;
    }
    return Promise.reject(result);
};

type TUserResponse = TServerResponse<{ user: TUser }>;

export const getUserApi = async (): Promise<TUserResponse> => {
    return fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
        headers: {
            authorization: getCookie('accessToken')
        } as HeadersInit
    });
};

export const updateUserApi = async (user: Partial<TRegisterData>): Promise<TUserResponse> => {
    return fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            authorization: getCookie('accessToken')
        } as HeadersInit,
        body: JSON.stringify(user)
    });
};

export const logoutApi = async (): Promise<TServerResponse<{}>> => {
    const response = await fetch(`${URL}/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: localStorage.getItem('refreshToken')
        })
    });
    
    return checkResponse<TServerResponse<{}>>(response);
};