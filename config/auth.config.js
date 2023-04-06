export const secret = 'ThisIsMySecretCodeForJWT';
export const hashSecret = 'ThisIsMySecretForHash';
export const saltRounds = 10;
export const usernamePattern = /^(?!.*[{}\/;':"!@#$%^&*()_+]).{8,32}$/;
export const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&;:<>/\?]).{8,32}$/;
