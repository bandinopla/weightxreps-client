import { BriefUserFieldsFragmentDoc } from "../data/generated---db-types-and-hooks";
import { __resolveReferencedUserId } from "../data/type-policies";

export const ForumPolicy = {
    ForumMessage: {
        fields: {
            user: __resolveReferencedUserId
        }
    },

    Query: {
        fields: {
            getForumMessages: { 
                    keyArgs: ["sectionId"] ,
                    merge( existing, incoming,{readField} ) {


                        if( existing )
                        {
                            return {
                                messages    : [ ...existing.messages, ...incoming.messages ]

                                            // sort highest to lowest ID (which is the same as sorting from most recent to oldest)
                                            .sort( (a,b)=>Number(readField("id",b))-Number(readField("id",a)) )

                                            // remove duplicates
                                            .filter( (m, i, arr)=>arr.findIndex(mgs=>readField("id",mgs)==readField("id",m))==i )
                                            
                                            ,

                                users       : combineUsers(existing.users, incoming.users )
                            };
                        }

                        return incoming;

                    }
            },

            getThreadMessages: {
                keyArgs: ["messageId"],
                merge( existing, incoming, { args } ) {

                    const merged = existing ? existing.messages.slice(0) : [];
                    let users = existing ? existing.users.slice(0) : [];

                    if( incoming )
                    { 
                        const { offset = 0 } = args;

                        for (let i = 0; i < incoming.messages.length; ++i) {
                            merged[offset + i] = incoming.messages[i];
                        }

                        users = combineUsers(users, incoming.users )
                    }

                    return {
                        messages: merged,
                        users: users
                    } 
                },

                read(existing, { args: { offset, limit }}) {

                    if( !offset && !limit )
                    {
                        return existing;
                    }

                    let messages = existing?.messages.slice(offset, offset + limit); 
 
                    return messages?.length>0 && (messages.length==Object.keys(messages).length) && {
                        ...existing,
                        messages: existing.messages.slice(offset, offset + limit)
                    }
                }
            }
        }
    }
    
} 

/** 
 * Returns the new messages merged with the existing making sure they are sorted in chronological order from older to newest.
 * 
 * @param {import("../data/generated---db-types-and-hooks").GetThreadMessagesQuery["getThreadMessages"]} existing 
 * @param {import("../data/generated---db-types-and-hooks").GetThreadMessagesQuery["getThreadMessages"]} incoming 
 * @param {import("@apollo/client/cache/core/types/common").ReadFieldFunction} readField 
 * @param {boolean} mostRecentFirst If TRUE it will put incoming first if it is newer
 * @returns 
 */
const sortMessages = (existing, incoming, readField, mostRecentFirst = false ) => {

    // incoming has "older" data than existing
    //const isOldData = new Date( readField("when", incoming.messages.slice(-1)[0] )) < new Date( readField("when", existing.messages[0] ) );
    let messages    = existing.messages; 
    
    if( mostRecentFirst )  
    {
        messages = [...incoming.messages, ...messages ];
    }
    else 
    {
        messages = messages.concat( incoming.messages );
    }

    return messages
                    // remove duplicates
                    .filter( (m, i, arr)=>arr.findIndex(mgs=>readField("id",mgs)==readField("id",m))==i ); 
}


const combineUsers = (usersA, usersB)=>{
    return [...usersA, ...usersB].filter( (user, i, arr)=>arr.findIndex(u=>u.__ref==user.__ref)==i )
}