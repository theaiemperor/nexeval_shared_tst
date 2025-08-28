import { Types } from "mongoose";


export function verifyMongoUID(id?: string): boolean {

    if (!id || id.length < 1) return false;

    if (!Types.ObjectId.isValid(id)) return false;

    return true;

}
