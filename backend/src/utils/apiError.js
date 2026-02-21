class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        stack = "",
        errors = []
    ) {
        super(message)
        this.data = null
        this.statusCode = statusCode
        this.errors = errors
        this.success = false

        if (stack)
            this.stack = stack
        else
            Error.captureStackTrace(this, this.constructor)

    }
}

export { ApiError }