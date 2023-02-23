import { TYPES } from "./data-types";
 


export class UTagValue {


    constructor({ type, value, ymd, tagid, id })
    {
        this.id         = id; //<--- id of the record in the DB that holds this value
        this.tagid      = tagid; //<---- ID of the tag that holds the name of this value.
        this.type       = type;
        this.$type      = TYPES[ type ];  
        this.baseType   = this.$type.kindOf ?? type ;
        this.ymd        = ymd;  
        this.value      = value; 
        this.numValue   = this.$type.canBeCharted? this.toNumber() : Number.NaN 
    }

    canBeCharted() {
        return this.$type.canBeCharted;
    }
    
    toView() {
        return this.$type.value2view( this.value );
    }

    toEditor() {
        return this.$type.value2editor( this.value );
    }

    toNumber() {
        return this.$type.value2number( this.value );
    }

    add( other, asType ) {
        return this._mathWith( other, 'addComponents', asType )
    }

    sub( other, asType ) {
        return this._mathWith( other, 'subComponents', asType )
    }

    div( other, asType ) {
        return this._mathWith( other, 'divComponents', asType )
    }

    /** 
     * @param {Number|UTagValue} other 
     * @param {String} operationMethod 
     * @returns {UTagValue}
     */
    _mathWith( other, operationMethod, asType )
    {
        const ok = !isNaN(other) || this.baseType == other.baseType;

        if( !ok )
        {
            throw new TypeError(`Tag values are incompatible, no operation is allowed between them.`);
        } 

        let utag1       = this.$type;
        let getComp1    = utag1.value2components ?? utag1.value2number;
        let comp1       = getComp1( this.value ) ;
        let comp2       = other;

        //
        // this is the case were comp2 is a number. 
        //
        if( isNaN(comp2) )
        {
            let utag2       = other.$type; 
            let getComp2    = utag2.value2components ?? utag2.value2number; 

            comp2           = getComp2( comp2.value ) ;
        } 
        else 
        {
            asType = this.type;
        }

        //
        // do the operation
        //
        const utagBaseType  = TYPES[ this.baseType ];
        let result          = utagBaseType[operationMethod]( comp1, comp2 );

        //
        // i assume asType is the same kind....
        //
        asType = asType ?? utagBaseType.key;

        return new UTagValue({
            type    : asType,
            value   : TYPES[asType].components2value( result )
        });

    }

}
   