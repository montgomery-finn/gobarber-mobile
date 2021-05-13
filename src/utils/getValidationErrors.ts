import { ValidationError } from 'yup';

interface Errors {
    [key: string]: string; //vai ter vários campos 'key' com um nome do tipo string que contém um valor string
}

export default function getValidationError(err: ValidationError): Errors {
    const validationErrors: Errors = {};

    err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
    });

    return validationErrors;
}