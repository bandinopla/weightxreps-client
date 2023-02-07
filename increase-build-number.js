/**
 * 
 * This script is used when i make a change and want to update the
 * changelog with a version number...
 * 
 */



var fs = require('fs'); 
const yargs = require('yargs');


const validModes = [
    // cambio totalmente el sitio. Otra estructura, otra mecanica.
    'mayor',
    // Se agregó una pagina nueva o un widget nuevo.
    'minor',
    // se corrigio un bug o se agrego/quito texto/imagenes.
    'fix',

    // when you want to set it manually
    'set'
  ];
 
//console.log('Incrementing build number' );

async function run(argv) {
    const { type, value } = argv;

    console.log( argv )

    if (validModes.indexOf(type) === -1) {
        throw new TypeError(
          `Unrecognized mode '${type}'. Did you mean one of "${validModes.join('", "')}"?`,
        );
      }

    fs.readFile('src/version.json',function(err,content) {
        if (err) throw err;
        var metadata = JSON.parse(content);
        var oldValue = `${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision}`;

        switch( type )
        {
            case "mayor":
                metadata.buildMajor++; 
                metadata.buildMinor=0;
                metadata.buildRevision=0;
                break;

            case "minor":
                metadata.buildMinor++; 
                metadata.buildRevision=0;
                break;

            case "set":
                let v = value.split(".");
                metadata.buildMajor = v[0];
                metadata.buildMinor = v[1];
                metadata.buildRevision = v[2];
                break;

            case "fix": 
            default:
                metadata.buildRevision++;
        } 

        metadata.when = new Date().toUTCString();
        
        fs.writeFile('src/version.json',JSON.stringify(metadata),function(err){
            if (err) throw err;
            console.log(`Current build number changed from ${oldValue} -> ${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision}`); // ${metadata.buildTag}
        })
    });

}




yargs
  .command({
    command: '$0 <type> [value]',
    description: `Modifica el archivo [src/version.json] en base a lo que tipees en <type>
                    mayor = cambio grande. Incompatible con version anterior.
                    minor = se agrega algo nuevo, sea un widget o una pagina o funcionalidad nueva.
                    fix = bug fix, corrección, retoque, optimización...
                    set = cuando queres setearla manualmente usando el flag "-value MAYOR.MINOR.FIX"
                    `,
    builder: (command) => {
      return command
        .positional('type', {
          description: `Valid types: "${validModes.join('" | "')}"`,
          type: 'string',
        })
        .option('value', {
          type: 'string', 
          describe: 'Seteala manualmente. Formato: mayor.minor.fix',
        })
        // .option('out-dir', { default: './build', type: 'string' })
        // .option('verbose', { type: 'boolean' });
    },
    handler: run,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
 