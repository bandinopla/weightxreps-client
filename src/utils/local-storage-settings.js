import { makeVar } from '@apollo/client';

 

/**
 * Crea un objeto al cual se le pueden acceder propiedades que no existen, y al hacerlo, se crea un a ReactVariable
 * para esa propiedad nueva, que, al cambiar su valor, lo guarda en la LocalStorage y al accederse de nuevo toma ese valor.
 */
const createSettingProxy = prefix => {

    var storage = localStorage;

    const _makeVar = ( prop, initialValue ) => {

        let reactiveVar = makeVar( JSON.parse( storage.getItem( prefix+"::"+prop ) ) || initialValue );

        const onReactiveVarChange = (newValue, reListen=true) => {

            storage.setItem(prefix+"::"+prop, JSON.stringify( newValue ) );
            reListen && reactiveVar.onNextChange( onReactiveVarChange );
        }

        if( initialValue )
        {
            onReactiveVarChange( initialValue, false );
        }

        reactiveVar.onNextChange( onReactiveVarChange );

        return reactiveVar;
    }

    return new Proxy( {}, {
        get (target, prop) {

            if( !(prop in target) && typeof prop=='string')
            {
                console.log("WTF", prop, target )
                target[prop] = _makeVar( prop ); //Reactive variable
            }

            return target[prop]; ////storage.getItem( prefix+"::"+prop );

        },

        set (target, prop, value ) {
 
                // lo guardamos en el local storage...
                //storage.setItem(prefix+"::"+prop, JSON.stringify( value ) );

                //console.log("$$ target=", target)
                if( !(prop in target) )
                {
                    target[prop] = _makeVar(prop, value);
                } 
                else 
                {
                    target[prop]( value );
                } 
            
            return true;
        }
    });
}


let DICC = new Map();

/** 
 * Creamos un [Proxy](https://www.sitepoint.com/es6-proxies/) que wrapea un empty object en una mecanica que hace que al intentar acceder o setearle 
 * variables se crea una ReactiveVariable que tambien, al detectar un cambio, guarda su valor en el [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Storage).
 * 
 * Modo de uso:
 * 
 * ```
 *      var foo = getOrCreateSettingsHandler("somePrefix", settingsProxy => {
 *          settingsProxy.pepe = 123;  //--> "pepe" será una ReactVariable que al cambiar guardara sy valor en le localStorage como "somePrefix::pepe"
 *      });
 * ```
 * Despues se la puede usar como una react variable normal: 
 * ```
 *      foo.pepe() //--> devuelve 123 
 *      foo.pepe("abc") //--> setea el valor a "abc"
 *      foo.pepe = "abc" //--> setea el ***default*** value si no hay nada en el localStorage.
 *      foo.pepe //--> devuelve la referencia a la react variable
 * ```
 * 
 * @param  {String} prefix -El prefijo a usar cuando se guarde en la localStorage
 * @param  { (settingsHolder:Proxy)=>void } initializer Callback que sirve para inicializar los valores por default de los settings
 * 
 * @see https://www.apollographql.com/docs/react/local-state/reactive-variables/
 */
export function getOrCreateSettingsHandler( prefix, initializer )
{
    if( !DICC.has(prefix) )
    {
        let proxy = createSettingProxy(prefix);
        DICC.set( prefix, proxy );
        initializer && initializer(proxy);
    }

    return DICC.get( prefix );
}