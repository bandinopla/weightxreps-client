import { useChangelog } from "./useChangelog"

var collaborators;

/**
 * returns a function that can be used to check if a user has given feedback for a given version. 
 * Given a username, it will return the VERSIONS in which it has collabed.
 */
export const useHasGivenFeedback = ()=>{
    const { changelog } = useChangelog();

    if( changelog )
    {
        return uname => {

            if( !collaborators )
            { 
                collaborators = new Map();

                var lastVersion = null;
				let m;

				changelog.forEach( log => {

					log.done.forEach( line => {

						const regex = /@([a-z0-9_]+)/gi;
						

						while ((m = regex.exec(line)) !== null) {
							if (m.index === regex.lastIndex) {
                                regex.lastIndex++;
                            }

							m.forEach((uname, groupIndex) => {

                                if( groupIndex==0 ) return;
 
                                const what = (log.category?`( ${log.category} ) `:"")+ log.version + " | "+ (log.date?`${log.date} | `:"") + line;

                                if( !collaborators.has(uname) )
                                {
                                    collaborators.set(uname, [what]);
                                }
                                else
                                {
                                    collaborators.get(uname).push(what);
                                }

                            });
						}

					});
				});
 
            } 

            return collaborators.get( uname );

        }
    }

    return null;
}