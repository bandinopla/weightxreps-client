export const VideosCachePolicy = {
    Query: {
        fields: {
            getVideos: {
                keyArgs: false,

                merge(existing = [], incoming) {
                     
                    // the "incoming" are old in this implementation, so ignore videos from user we already have videos of.
                    return [...existing, ...incoming.filter(vid=>!existing.find(e=>e.user.__ref==vid.user.__ref)) ];
                },
            }
        }
    }
}