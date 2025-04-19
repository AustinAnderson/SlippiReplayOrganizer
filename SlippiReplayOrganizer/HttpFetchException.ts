export class HttpException extends Error {
    public constructor(
        public readonly message: string,
        public readonly inner?: Error,
        public readonly status?: number
    ) {
        super(`${message}, failed with status code ${status}`);
    }
}