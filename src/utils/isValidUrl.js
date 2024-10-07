export default function isValidUrl(url) {
    if (typeof url !== 'string') {
        throw new Error( `URL must be a string, got <${typeof url}> ` );
      }
      let u = new URL(url);

      if( u.search!="" || u.hash!="" )
      {
        throw new Error("URL must be clean, with no querystrings of hashes.");
      }

      return true;
}