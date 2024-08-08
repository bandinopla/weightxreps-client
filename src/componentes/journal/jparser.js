import { soundCloudMatcher } from "../soundcloud-tag";
import { parsedTags2render } from "../user-text-to-parsed-tags";
import { JLogTextFormatTags } from "./jlog-text-format-tags";
import { TagTokenMatcher } from "./tags";

export const TYPE = {
    TEXT: 0,
    YT: 1,
    TIK: 2,
     IG: 3,
     LINK:4,
     EBLOCK:5,
     NEWLINE:6,
     POSTIMGCC:7,
     BlockWeekDay: 8,
     TAG:9,
     IMG:10,
     UNAME:11, 
     GIPHY:12
}

const _urlTagMatcher = { match:/^(?:http(?:s?):\/\/(?:www\.)?)[\S]+/, block: m=>({ type:TYPE.LINK, url:m[0] }) };
const _imgTagMatcher = {
    match:/^https?:\/\/\S+\.(jpg|png|gif|webp)\S*/gi,
    block: m=>({ type:TYPE.IMG, url: m[0] })
}
const _newlineMatcher = { match:/^\s*$/, block: m=>({ type:TYPE.NEWLINE }) }

const _unameMentionMatcher = { 
    match: /^@([a-z0-9_]{4,})/i,
    block: m=>({ type:TYPE.UNAME, uname: m[1] })
}


const parseErowComment = comment => {
    let tags = [
        _imgTagMatcher,
        _urlTagMatcher,
        _unameMentionMatcher,
        
        //, _newlineMatcher
    ]
 
    return text2tags( comment, tags ); 
};

export const parseUserComment = (comment, fullTags) => {
    if( fullTags )
    {
        return parseJlog(comment)
    }
    else 
    {
        return parseErowComment(comment);
    }
    
}
 

export const previewTextToNode = ( textPreview, utags ) => { 

    return parsedTags2render( text2tags( textPreview, utags? [ TagTokenMatcher( utags.tags, utags.values ) ] : [] )); 
}

export const parseJlog = (text2parse, eblocks, execises, bw, usekg, userTags, utagsValues ) => { 

    
    
    //
    // replace TABS with spaces
    //
    text2parse = text2parse.replace(/\t/g, " ".repeat(4));
   

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
        ,{ match:/^(?:http(?:s?):\/\/(?:www\.)?)?instagram\.com\/p\/(\w+)\/?/, block: m=>({ type:TYPE.IG, ig:m[1] }) }
        ,{ match:/^(?:http(?:s?):\/\/(?:www\.)?)?insta\.gram\/p\/(\w+)\/?/, block: m=>({ type:TYPE.IG, ig:m[1] }) }
    
        //, { match:/^(?:http(?:s?):\/\/(?:www\.)?)[\S]+\b/, block: m=>({ type:TYPE.LINK, url:m[0] }) }
        , {
            match:/^https:\/\/giphy\.com.*-(\S+)\b/,
            block: m=>({ type:TYPE.GIPHY, giphy:m[1] })
        }
        
        ,_unameMentionMatcher
        , ...soundCloudMatcher 
        , _imgTagMatcher
        , _urlTagMatcher
         
        //, _newlineMatcher 

        , { match:/^(?:B(\d+))?W(\d+)D(\d+)\b/, block: m=>({ type:TYPE.BlockWeekDay, B:m[1], W:m[2], D:m[3] }) }
        , ...JLogTextFormatTags
        //<div style="width:480px"><iframe allow="fullscreen" frameBorder="0" height="270" src="https://giphy.com/embed/NPl40igBCxq9FAgyKI/video" width="480"></iframe></div>
        
    ]; 

    if( eblocks )
    {
        let eblockCopy  = eblocks.slice(0); //lo copiamos porque lo vamos a modificar 
        tags.push({ match:/^EBLOCK:(\d+)/, block: m=>_buildEblockData( Number(m[1]), eblockCopy, execises, bw, usekg ) });  
    }

    if( userTags )
    {
        tags.push(TagTokenMatcher( userTags, utagsValues ))
    }

    return text2tags( text2parse, tags ); 
}; 


const text2tags = (text2parse, tags) => {

    let i           = 0;
    let rtrn        = [];
    let lastTextBlock;
    let sol         = true;

    while( i<text2parse.length )
    {
        let oldi = i;

        //ver qué matchea...
        for (let index = 0; index < tags.length; index++) {
            const tag = tags[index];
            
            let m = text2parse.substr(i).match( tag.match );

            if( (!tag.onlyStartOfLine || sol) && m )
            { 
                i += m[0].length;

                if( m[0].length==1 )
                {
                    i-=1;
                }

                rtrn.push( tag.block(m) ); 

                // //
                // // delete spaces
                // //
                // m = text2parse.substr(i).match( /^\s+/ );
                // i += m[0].length ;


                lastTextBlock = null;
                sol = false;
                continue;
            }  
        }

        if(text2parse[i]=="\n")
        {
            sol = true;
        }

        if( oldi!=i )
        { 
            continue;
        }
         
        if( rtrn.length==0 || !lastTextBlock ) {

            lastTextBlock = { type:TYPE.TEXT, text:"" };
            rtrn.push(lastTextBlock);
        }

        lastTextBlock.text += text2parse[i] || "";

        if( text2parse[i]!=" " )
        {
            sol = false;
        }

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