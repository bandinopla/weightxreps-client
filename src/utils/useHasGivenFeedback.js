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

                //console.group("COLABS");
                changelog.split("\n").forEach( line=>{

                    let m = line.match(/- +(\d+\.\d+\.\d+)\s+:/);
                    if( m )
                    {
                        lastVersion = line.replace("- ","");
                    }
                    else 
                    {
                        const regex = /@([a-z0-9_]+)/gi;
                        
                        while ((m = regex.exec(line)) !== null) {
                            if (m.index === regex.lastIndex) {
                                regex.lastIndex++;
                            }

                            // The result can be accessed through the `m`-variable.
                            m.forEach((uname, groupIndex) => {

                                if( groupIndex==0 ) return;

                                //console.log( uname, lastVersion)
                                const what = lastVersion + " | " + line;

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
                        
                    }

                });
                //console.groupEnd();
            } 

            return collaborators.get( uname );

        }
    }

    return null;
}