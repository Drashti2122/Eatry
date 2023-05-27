export class OtpUser {
    constructor(
        public otp: string
    ) {
        if (!otp) {
            let otp = JSON.parse(localStorage.getItem('otp') as string);
            this.otp = otp;
        }
    }
}
