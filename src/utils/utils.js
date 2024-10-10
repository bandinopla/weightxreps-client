

export const todayAsYMD = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
};


export const dateToYMD = (d, asLocal = false) => {
    const year = asLocal ? d.getFullYear() : d.getUTCFullYear();
    const month = (asLocal ? d.getMonth() : d.getUTCMonth()) + 1;
    const day = asLocal ? d.getDate() : d.getUTCDate();
  
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

export const date2NiceString = date => {
    let m = date.toString().match(/^(?<day>\w+) (?<month>\w+) (?<date>\d+) (?<year>\d+)/);
    return m.groups.day+" "+m.groups.date+", "+m.groups.month+" "+m.groups.year;
};

export const ymd2date = (ymd, asUTC)=> {

    if( asUTC )
        return new Date( Date.UTC( ymd.substr(0,4), Number(ymd.substr(5,2))-1, ymd.substr(8) ) )
    
    return new Date( ymd.substr(0,4), Number(ymd.substr(5,2))-1, ymd.substr(8) ) 
};

/**
 * Deeply merges an array of objects
 * @param {Object[]} objects - Array of objects to merge
 * @returns {Object} Merged object
 */
export const mergeObjects = (objects) => {
    return objects.reduce((result, obj) => {
        obj && Object.entries(obj).forEach(([key, value]) => {
        if (result.hasOwnProperty(key) && typeof result[key] === 'object' && typeof value === 'object') {
          result[key] = mergeObjects([result[key], value]);
        } else {
          result[key] = value;
        }
      });
      return result;
    }, {});
  };


export const isEmail = txt => txt.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)!=null;