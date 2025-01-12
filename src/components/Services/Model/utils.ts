import jwt from 'jsonwebtoken';

export const formatInputAmount = (amount: string) => {
    const formatted = amount
        .replace(/[^0-9.,]/g, '')
        .replace(',', '.')
        .replace(/(\..*?)([.,])/g, '$1') // keep only the first dot
        .replace(/(\.\d{9}).*/, '$1'); // truncate after 9 decimal places

    return formatted;
}

export const getJwtExpiration = (token: string) => {
    const decoded = jwt.decode(token) as { exp: number };

    return decoded.exp;
}

export const isJwtExpired = (token: string) => {
    const expiration = getJwtExpiration(token);
    const now = Date.now() / 1000;

    return expiration < now;
}