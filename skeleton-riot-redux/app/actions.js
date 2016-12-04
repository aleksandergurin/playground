export const HANDLE_EMAIL_INPUT = 'HANDLE_EMAIL_INPUT';

export const emailInputAction = (email) => ({
    type: HANDLE_EMAIL_INPUT,
    email: email,
});
