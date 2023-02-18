
export const TYPE = {
    TEXT: 0,
    YT: 1,
    TIK: 2,
     IG: 3,
     LINK:4,
     EBLOCK:5,
     NEWLINE:6,
     POSTIMGCC:7,
     BlockWeekDay: 8
}

const _urlTagMatcher = { match:/^(?:http(?:s?):\/\/(?:www\.)?)[\S]+/, block: m=>({ type:TYPE.LINK, url:m[0] }) };
const _newlineMatcher = { match:/^\s*$/, block: m=>({ type:TYPE.NEWLINE }) }


const parseErowComment = comment => {
    let tags = [
        _urlTagMatcher
        //, _newlineMatcher
    ]
 
    return text2tags( comment, tags ); 
};

export const parseUserComment = comment => parseErowComment(comment);
 


export const parseJlog = (text2parse, eblocks, execises, bw, usekg ) => { 

    let eblockCopy  = eblocks.slice(0); //lo copiamos porque lo vamos a modificar

    let tags = [ 
    
        //youtube
        { match:/^(?:http(?:s?):\/\/(?:www\.)?)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(?:\?t=(\d+))?\S*\b/, block: m=>({ type:TYPE.YT, yt:m[1], t:m[2] }) }
        ,{ match:/^(?:http(?:s?):\/\/(?:www\.)?)?youtube\.com\/shorts\/([\w\-\_]*)(?:\?t=(\d+))?\S*\b/, block: m=>({ type:TYPE.YT, yt:m[1], t:m[2] }) }
    
        //remove iframes
        , { match:/^\<iframe.*iframe\>/, block:m=>({ type:"_" }) }

        //https://postimg.cc/   https://postimg.cc/bdTxsFGh
        , { match:/^(?:http(?:s?):\/\/(?:www\.)?)?postimg\.cc\/(\S+)\b/, block: m=>({ type:TYPE.POSTIMGCC, id:m[1] }) }

        // tiktok
        //, { match:/^(?:http(?:s?):\/\/(?:www\.)?)?tiktok\.com\/(\@[\w-_]+)\/video\/(\d+)/, block: m=>({ type:TYPE.TIK, user:m[1], tiktok:m[2] }) }
    
        // instagram  --https://www.instagram.com/p/CR79sLGgRIu/
        ,{ match:/^(?:http(?:s?):\/\/(?:www\.)?)?instagram\.com\/p\/(\w+)\/?.*\b/, block: m=>({ type:TYPE.IG, ig:m[1] }) }
        ,{ match:/^(?:http(?:s?):\/\/(?:www\.)?)?insta\.gram\/p\/(\w+)\/?.*\b/, block: m=>({ type:TYPE.IG, ig:m[1] }) }
    
        //, { match:/^(?:http(?:s?):\/\/(?:www\.)?)[\S]+\b/, block: m=>({ type:TYPE.LINK, url:m[0] }) }
        , _urlTagMatcher
        //, _newlineMatcher
        
        , { match:/^EBLOCK:(\d+)/, block: m=>_buildEblockData( Number(m[1]), eblockCopy, execises, bw, usekg ) }
        , { match:/^(?:B(\d+))?W(\d+)D(\d+)\b/, block: m=>({ type:TYPE.BlockWeekDay, B:m[1], W:m[2], D:m[3] }) }
    ]; 

    return text2tags( text2parse, tags ); 
}; 


const text2tags = (text2parse, tags) => {

    let i           = 0;
    let rtrn        = [];
    let lastTextBlock;

    while( i<text2parse.length )
    {
        //ver qué matchea...
        for (let index = 0; index < tags.length; index++) {
            const tag = tags[index];
            
            let m = text2parse.substr(i).match( tag.match );

            if( m )
            {
                i += m[0].length;
                if( m[0].length==1 )
                {
                    i-=1;
                }
                rtrn.push( tag.block(m) ); 

                lastTextBlock = null;
                continue;
            }  
        }

         
        if( rtrn.length==0 || !lastTextBlock ) {

            lastTextBlock = { type:TYPE.TEXT, text:"" };
            rtrn.push(lastTextBlock);
        }

        lastTextBlock.text += text2parse[i] || "";
        i++; 
    }

    return rtrn; 
};


const _buildEblockData = (eid, eblocks, execises, bw, usekg ) => {

    let blockIndex  = eblocks.findIndex( itm=>itm.eid==eid );
    let exercise    = execises.find( e=>e.exercise.id==eid);

    if( blockIndex<0 ) 
        return { type: TYPE.EBLOCK, missing:true, exerciseRef: exercise };
    
    let eblockData  = eblocks.splice( blockIndex, 1 )[0];
    let stats       = { vol:0, reps:0, sets: 0 };
      
    let block = {
        ...eblockData,

        type          : TYPE.EBLOCK 
        , exerciseRef : exercise
        , stats 
        , sets      : eblockData.sets.map( setData=>{

            let set = { ...setData  };

            //
            // si solo dice que uso BW, el wunit asumimos es el  base del usuario
            //
            if( set.ubw )
            {    
                set.weight  = set.w;
                set.w       = set.w - bw;
            }
            else 
            {
                set.weight = set.w;
            }
 
            if( set.c )
            {
                set.c = parseErowComment(set.c);
            }

            stats.vol  += set.weight * set.r * set.s;
            stats.reps += set.r * set.s;
            stats.sets += set.s; 

            return set;
        }) 
    }

    return block; 
};