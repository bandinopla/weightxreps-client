import { useState, useEffect } from 'react';
import { inProduction } from '../system-config';

/**
 * @typedef {Object} LogItem
 * @property {string} version
 * @property {[string]} date
 * @property {string[]} done
 * @property {[string]} category
 */

/** @type {Promise<LogItem[]>} */
let changeLogLoader;

function sortItems(a, b) {
  if (a.date && b.date) return b.date.localeCompare(a.date);
  if (a.date && !b.date) return -1;
  if (!a.date && b.date) return 1;

  if (a.category !== b.category) return 0;

  const pa = a.version.split(".").map(Number);
  const pb = b.version.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pb[i] - pa[i];
  }

  return 0;
}



export const useChangelog = () => {
	/**
	 * @type {[logs:LogItem[]]}
	 */
  const [logs, setLogs] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; 

    const fetchChangeLog = async () => {

        if(!changeLogLoader) {
			changeLogLoader = Promise.all([
				fetch('/changelog.txt').then(resp=>resp.text()),
				fetch( (inProduction? "https://ai.weightxreps.net":"http://localhost:5173" ) +'/changelog.txt').then(resp=>resp.text()),
			])
			.then( logs => {

				// scan and sort...
				let sorted = logs.map( (log, logIndex) => {

					let out = [];
					let thing;
					let category = ["","ai"][logIndex];

					log.split("\n").forEach( line => {

						line = line.trim();

						const m = line.match(/(?<version>\d{1}\.\d{1,3}\.\d{1,3})(?<rest>.*)/)
					 
						if( m )
						{
							let rest = m.groups.rest?.trim() ?? "";

							thing = {
								version: m.groups.version,
								done:[],
								category
							}

							out.push( thing );

							const mDate = line.match(/:\s(?<date>\d{4}-\d{2}-\d{2})(?<rest>.*)/);

							if( mDate )
							{
								thing.date = mDate.groups.date;

								rest= mDate.groups.rest?.trim() ?? "";

								if( rest.length>1 )
								{
									thing.done.push( rest )
								}
							}
							else 
							{
								if( rest.length>1 )
								{
									thing.done.push( rest )
								}
							}
						}
						else 
						{  
							if( line )
								thing.done.push( line )
						}

					})

					return out;

				});

				sorted = sorted.flat()

				//
				sorted.sort(sortItems);
 
				 
				return sorted

			} ) 
        }

      try { 
        const logs = await changeLogLoader;
        if (isMounted) {
          setLogs(logs);
          setLoading(false);
        }
		console.log("LOGS = ", logs)
      } catch (e) { 
          setError('Failed to load the changelog. Please try again later.');
          setLoading(false);
      
      }
    };

    fetchChangeLog();

    return () => {
      isMounted = false; 
    };
  }, []);

  return { changelog:logs, loading, error };
};
 
