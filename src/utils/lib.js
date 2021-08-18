module.exports = {
    handleAPIError: (req, res, err) => {
        console.error(`${req.method} ${req.originalUrl} API error:`, err);
        res
            .status(
                err.statusCode
                    ? err.statusCode
                    : 500
            )
            .send(
                err.errorMessage
                    ? (
                        err.errorMessage.stack
                            ? err.errorMessage.stack
                            : err.errorMessage
                    )
                    : err.stack
            );
    }
};