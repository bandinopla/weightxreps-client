import { Chip } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LockIcon from '@material-ui/icons/Lock';
import React from 'react';
import { useHistory } from "react-router-dom";
import Barra from "./barras";
import Ename from './ename';
import TimeAgoDisplay, { date2timeago } from './TimeAgoDisplay';
import UAvatar from './uavatar';
import { SocialLinks } from './ucard-social-links';
import Uname from "./uname";
import WeightValue from './weight-value';


const randomImg = ()=>`https://weightxreps.net/root/useravatar/u_${ Math.round(1+Math.random()*6000) }.jpg`;  

const useStyles = makeStyles( theme => ({
     
    media: {
      height: 80,
      //borderRadius: 5
    },

    supporterBG: theme.supporterUcard.gold,
    private: { opacity:"50%" },

    root: {
        margin:5,
        marginBottom:5

        ,"& .ustats": {
            margin:"5px 0",
            fontSize:"0.9em",
            "& > div": {
                borderBottom:"1px dotted #ccc",
                overflow:"hidden",
                fontSize:"1em",
                padding:"2px 0"
            },
            "& b": {
                float:"right"
            }
        },

        "& .textPreview": {
            backgroundColor:"#333",
            padding:"5px !important",
            color:"white", 
            marginBottom:10
        },

        "& .private": {
            padding:20
        },

        "& img": {
            width:"100%"
        }
    }
  }));


const MiniUserStats = ({ userdata:u, extraRows } ) => (<div className="ustats">
    { u.age>0 && <div><b>{u.age}</b>Age:</div> }
    { u.bw>0 && <div><b> <WeightValue value={u.bw} inkg={u.usekg}/> </b>Bodyweight:</div> }
    { extraRows && extraRows.map((row,i)=>(<div key={i}><b>{row[1]}</b>{row[0]}:</div>)) }
</div>);



export default function({ data:{ user, media, text, when }, url, extraRows=[], ymd, injournal, minimal, children, noClickable=false }) {
 
    const classes           = useStyles();
    const history           = useHistory(); 
    const isSupporter       = user.slvl>0; 
    const breve             = injournal;
    const joined            = user.joined instanceof Date? user.joined : new Date(user.joined);
    const years             = Math.floor((new Date().valueOf() - joined.valueOf()) / 31557600000 ); 

    var statsExtraRows = [ 
        ["Joined", <JoinedTag label={date2timeago(joined, null, 3)} years={years}/>  ], 
        ...extraRows
         //user.private? ["Private Mode", "ON"] : ["Days Logged", posted]
    ];
 
    //const extraRow = user.private? ["Private Mode", "ON"] : ["Posted", posted];
 
    let Wrapper = (props)=> (minimal || noClickable)? <div>{props.children}</div> : <CardActionArea {...props} />;
    
    const onClick = ()=>!minimal && history.push( url || `/journal/${user.uname}/${ymd}`);
    
 
    return <Card className={classes.root+" "
                            +(isSupporter && user.sok && classes.supporterBG) 
                            +" "
                            +(user.private && !minimal && classes.private)
                            } square={true}> 
                <Wrapper onClick={ onClick }>  
                    
                   
                    <UAvatar uid={user.id} hash={user.avatarhash} slvl={ user.slvl } sactive={user.sok} height={80} width={"100%"} /> 
                    <CardContent>
                        <Uname ymd={ymd} {...user} />

                         {!minimal && <div>
                            
                            <MiniUserStats userdata={user} extraRows={ statsExtraRows }/> 

                            { !breve && <>
                            
                                { media && <img className="rounded" src={media}/> }
                                { text && <CardPreviewText value={text} />} 

                            </>}

                            { children }
                            
                        </div> } 
                    </CardContent> 

                    {minimal && children }


                </Wrapper>

                { !breve && !minimal && (<CardActions>
                     { user.private? <Chip
                                            icon={<LockIcon />}
                                            label="Private" 
                                            variant="outlined"
                                        /> : <TimeAgoDisplay time={when} /> }
                </CardActions>)  } 
                
                {breve && <SocialLinks user={user} urls={user.socialLinks}/> }
                
            </Card>;
}

export const UcardErow = ({ type, ename, weight, reps}) => (<div>
      
        <Ename type={type} name={ename} variant="subtitle2"/>
        <div style={{textAlign:"center"}}><Barra weight={weight} reps={reps}/></div>
</div>);

const CardPreviewText = ({ value })=> (<Paper className="textPreview"><Typography variant="body2">{value}</Typography></Paper>);

const JoinedTag = ({ label, years}) => {

    if( years>5 )
    {
        return <span className={"rainbow1 "+ (years>=10?"gold":"silver") }>{label}</span>;
    }
    return <>{label}</>;
}

