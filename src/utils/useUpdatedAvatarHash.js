import { makeVar, useReactiveVar } from "@apollo/client";

/**
 * @type {{ uid:number, time:number }}
 */
export const $avatarUpdated = makeVar(); //<--- { uid, time:number} se le pasa el UID del usuario que actualizó su avatar



export const useUpdatedAvatarHash = uid =>{
    const updateInfo = useReactiveVar($avatarUpdated);
    return updateInfo && updateInfo.uid==uid?  updateInfo.time.toString() : "";
}