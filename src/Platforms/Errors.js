'use strict';

class NotSupportedError extends Error {

    constructor(message) {
        super(message);
        this.name = 'NotSupported';
    }

}

class BadRequestError extends Error {

    constructor(message) {
        super(message);
        this.name = 'BadRequest';
    }

}

class BadAuthenticationError extends Error {

    constructor(message) {
        super(message);
        this.name = 'BadAuthentication';
    }

}

class NotAuthorizedError extends Error {

    constructor(message) {
        super(message);
        this.name = 'NotAuthorized';
    }

}

class ForbiddenRequestError extends Error {

    constructor(message) {
        super(message);
        this.name = 'ForbiddenRequest';
    }

}

class NotFoundError extends Error {

    constructor(message) {
        super(message);
        this.name = 'NotFound';
    }

}

class RateLimitError extends Error {

    constructor(message) {
        super(message);
        this.name = 'RateLimit';
    }

}

class InternalServerError extends Error {

    constructor(message) {
        super(message);
        this.name = 'InternalServer';
    }

}

class UnknownError extends Error {

    constructor(message) {
        super(message);
        this.name = 'Unknown';
    }

}

module.exports = {
    NotSupportedError,
    BadRequestError,
    ForbiddenRequestError,
    BadAuthenticationError,
    NotAuthorizedError,
    NotFoundError,
    RateLimitError,
    InternalServerError,
    UnknownError,
};
