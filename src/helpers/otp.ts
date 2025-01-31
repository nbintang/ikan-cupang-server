export const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString(); // Generate a random 4-digit OTP
export const generateExpirationTime = () => new Date(Date.now() + 2 * 60 * 1000); // Generate a 2-minute expiration time
export const generateOtps = ( ) =>{
    const otp = generateOtp()
    const expiresAt = generateExpirationTime()
    return {otp,expiresAt}
}