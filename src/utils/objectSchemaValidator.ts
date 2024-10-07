 


type ErrorLogger = (err:string)=>void;
type ValidatorFunction<T> = (path:string, value:T, logError:ErrorLogger )=>true|void|undefined;
 

class Validator<T> {
    protected validationChain: Array<ValidatorFunction<T>> = [];
    private _isOptional:boolean = false;

    /** 
     * @param customValidator Should throw an error if is not valid.
     * @returns 
     */
    andPass( customValidator:(val:T)=>boolean ) { 
        this.validationChain.push((path, value, logError) => {
            try {
                return customValidator(value) || logError(`${path} has an invalid value.`);
            } catch (e: any) { 
                logError(`${path} error: ${e.message}`);
            }
        });
        return this;
    }

    protected simpleTypeValidation(path: string, expected: any, actual: any, logError: ErrorLogger) {
        return typeof actual === typeof expected || logError(`${path} should be <${typeof expected}> but it is <${typeof actual}>`);
    } 

    validate(path: string, target: any, logError: ErrorLogger) { 
        if( this.optional && target==null )
        {
            return true;
        }

        return this.validationChain.every(validator => validator(path, target, logError) === true);
    } 

    get optional() {
        this._isOptional = true;
        return this;
    }

    get isOptional() {
         return this._isOptional;
    }
}

class StringValidator extends Validator<string> {
    constructor(private min: number, private max: number) {
        super();
        this.validationChain.push((path, value, logError) => { 
            if (typeof value !== 'string') return logError(`${path} must be a <string>.`);
            if (value.length < this.min || value.length > this.max) {
                return logError(`${path} must be between ${this.min}-${this.max} chars. It is ${value.length}.`);
            }
            return true;
        });
    } 

    andMatch( reg:RegExp, errorIfNoMatch:string ) {
        this.validationChain.push((path, value, logError) => { 
            if(!reg.test(value)) return logError(errorIfNoMatch);
            return true;
        });
        return this;
    }
}

class ObjectValidator extends Validator<Object> {
    constructor( private schema:Object) { 
        super() 
        this.validationChain.push( this.isValidObject.bind(this) );
    }

    private isValidObject( path:string, val:Object, logError:ErrorLogger ) { 

        if( typeof val != 'object')
        {
            return logError(`${path} should be an object, but it is <${typeof val}>`);
        } 

        let hasErrors = false;

        //
        // check all the keys
        //
        for( const [key, valType] of Object.entries(this.schema) )
        {   
            let propPath = `${path}.${key}`; 

            if( val[key] === undefined && !valType.isOptional )
            { 
                logError(`${propPath} field is missing or empty!`);
                hasErrors = true;
                continue;
            } 

            let propVal = val[key]; 
 
            if( 'validate' in valType )
            { 
                if( valType.validate(propPath, propVal, logError )!==true )
                {
                    hasErrors = true;
                }
            }
            else  
            {
                if(  this.simpleTypeValidation(propPath, valType, propVal, logError ) !==true )
                {
                    hasErrors = true;
                }
            }
        } 

        if( !hasErrors ) return true;

    }
}

class ArrayValidator extends Validator<Array<any>> {
    constructor( private min:number=0, private max:number=0 ) { 
        super() 
        this.validationChain.push( this.isValidArray.bind(this) );
    }

    of( types:Array<any> ) {
        this.validationChain.push( this.validateArrayItems.bind(this, types) );
        return this;
    }

    private isValidArray( path:string, val:Array<any>, logError:ErrorLogger ) {
 
        if( !Array.isArray( val ))
        {
            return logError(`${path} must be a <list>. But it is a <${typeof val}>`);
        }

        let length = val.length;

        if( this.max )
        {
            if( this.min==this.max && length!=this.max) return logError(`${path} should be ${this.max} items long exactly. It is ${length}`);
            else if( length>this.max ) return logError(`${path} should be ${this.max} items long max. It is ${length}`);
        }
        else 
        {
            if( this.min )
            {
                if( length<this.min ) return logError(`${path} should be at least ${this.min} items long. It is ${length}`);
            } 
        } 
        return true;
    }

    private validateArrayItems(types:Array<any>, path:string, value:Array<any>, logError:ErrorLogger )
    { 
        let hasErrors = false;

        for (let i = 0; i < value.length; i++) {
            const element   = value[i];
            const elSchema  = types[ i % types.length ];
            let elPath      = `${path}[${i}]`; 

            if( 'validate' in elSchema )
            {
                if( elSchema.validate(elPath, element, logError) !==true )
                {
                    hasErrors = true;
                }
            }
            else 
            {
                if( this.simpleTypeValidation(elPath, elSchema, element, logError) !==true )
                {
                    hasErrors = true;
                }
            } 
        }

        if(!hasErrors) return true;
    }
}

/**
 * Validate an object's shape...
 * Example:
 * ``` 
        let configSchema = MustBe.Object({
            services: MustBe.Array(0,5).of([
                MustBe.Object({
                    id: MustBe.String(3,80),
                    name:MustBe.String(3,80),
                    redirectUris:MustBe.Array(1,4).of([ 
                        MustBe.String(10,500).andPass(isValidUrl)
                    ]),
                    url:MustBe.String(10,500).andPass(isValidUrl)
                })
            ])
        });   
  shape.validate("pepe",pepe,err=>console.log(err))
 * ```
 */
export const MustBe = { 
    Object: (lookLikeThis:Object) => new ObjectValidator(lookLikeThis),
    String: (min:number, max:number) => new StringValidator(min, max), 
    Array: (min:number=0, max:number=0) => new ArrayValidator(min, max),
}