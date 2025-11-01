export function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

export function validatePassword(password: string): boolean {
    return password.length >= 6; // Minimum length for password
}

export function validateBookUpload(file: Express.Multer.File): boolean {
    const validMimeTypes = ['application/pdf'];
    return validMimeTypes.includes(file.mimetype);
}

export function validateUserInput(user: { email: string; password: string }): boolean {
    return validateEmail(user.email) && validatePassword(user.password);
}