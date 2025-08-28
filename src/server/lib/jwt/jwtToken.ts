import jwt, { type SignOptions, type JwtPayload, VerifyOptions } from "jsonwebtoken";


type JWTExtracted<T> = JwtPayload & { data: T };
const { JWT_SECRET } = process.env;


type GenerateTokenOptions = Omit<SignOptions, 'expiresIn'> & { secret?: string };

export function generateToken(data: any, expiresInSeconds = 60 * 60 * 24 * 7, options?: GenerateTokenOptions): string | undefined {


    if (!options?.secret || !JWT_SECRET) return;


    if (typeof data === "object") {
        return jwt.sign({ data }, options?.secret || JWT_SECRET, { expiresIn: expiresInSeconds, ...options });
    }
    return;
}


type ExtractTokenOptions = VerifyOptions & { secret?: string };

export function extractToken<T = JwtPayload>(token?: string, options?: ExtractTokenOptions): JWTExtracted<T> | undefined {

    try {

        if (!token) return;
        if (!options?.secret || !JWT_SECRET) return;

        // verify token
        const decoded = jwt.verify(token, options?.secret || JWT_SECRET, options) as any;


        if (typeof decoded === "object" && decoded.data) {
            return decoded as JWTExtracted<T>;
        } else {
            return;
        }

    } catch (error) {
        return;
    }

}
