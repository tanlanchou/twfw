export enum resultCode {
    success = 200,
    error = 500,
    notFound = 404,
    unauthorized = 401,
    forbidden = 403,
}

export interface result {
    code: resultCode,
    msg: string,
    data: any
}

export function success(data: any): result {
    return {
        code: resultCode.success,
        msg: 'Success',
        data: data
    }
}


export function error(msg: string): result {
    return {
        code: resultCode.error,
        msg: msg,
        data: null
    }
}

