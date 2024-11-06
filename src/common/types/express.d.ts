import 'express';

declare module 'express' {
    export interface Request {
        user?: any; // 你可以根据需要定义更具体的类型
        newToken?: string;
    }
}
