export interface MyResponse<T = any> {
    type: string;
    message: string;
    data?: T;
    token: string,
    otpToken: string,
    email: string,
    status: string,
    userStatus: string
}
