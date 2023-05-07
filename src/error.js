export class AppError extends Error {
    code;
    message;
    detail;

    static ERROR_CODES = { UNKNOWN: 'UNKNOWN' };

    constructor(code, message, detail) {
        super(message);
        this.code = code;
        this.message = message;
        this.detail = detail;
    }

    static unknown(error) {
        console.error(error);
        return new AppError(AppError.ERROR_CODES.UNKNOWN, error.message, error.stackTrace);
    }
}
