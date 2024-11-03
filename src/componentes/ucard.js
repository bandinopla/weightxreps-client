import { Box, Chip } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LockIcon from '@material-ui/icons/Lock';
import React, { useMemo } from 'react';
import { useHistory } from "react-router-dom";
import Barra from "./barras";
import Ename from './ename';
import { previewTextToNode } from './journal/jparser';
import TimeAgoDisplay, { date2timeago } from './TimeAgoDisplay';
import UAvatar from './uavatar';
import { SocialLinks } from './ucard-social-links';
import Uname from "./uname";
import WeightValue from './weight-value';
import FlareRoundedIcon from '@material-ui/icons/FlareRounded';
import { useHasGivenFeedback } from '../utils/useHasGivenFeedback';
import StarOutlineRoundedIcon from '@material-ui/icons/StarOutlineRounded';
import { OpenConfirmModal } from './Dialog';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles( theme => ({
     
    media: {
      height: 80,
      //borderRadius: 5
    },

    supporterBG: theme.supporterUcard.gold,
    private: { opacity:"50%" },

    root: {
        margin:5,
        marginBottom:5,
        backgroundColor: theme.ucardBgColor,
        position:"relative" 
        

        ,"& .ustats": {
            margin:"5px 0",
            fontSize:"0.9em",
            "& > div": {
                borderBottom:"1px dotted "+theme.referenceLineColor,
                overflow:"hidden",
                fontSize:"1em",
                padding:"2px 0"
            },
            "& b": {
                float:"right"
            }
        },

        "& .textPreview": {
            ...theme.dataCell, 
            padding:"5px !important", 
            marginBottom:10,
            "& .MuiTypography-root": {
                fontSize:"0.6rem"
            }
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
    { u.age>0 && <div><b>{u.age}</b>Years on earth:</div> }
    { u.bw>0 && <div><b> <WeightValue value={u.bw} inkg={u.usekg}/> </b>Bodyweight:</div> }
    { extraRows && extraRows.map((row,i)=>(<div key={i}><b>{row[1]}</b>{row[0]}:</div>)) }
</div>);



export default function({ data:{ user, media, text, when, utags }, url, extraRows=[], ymd, injournal, minimal, children, noClickable=false }) {
 
    const classes           = useStyles();
    const history           = useHistory(); 
    const isSupporter       = user.slvl>0; 
    const breve             = injournal;
    const joined            = user.joined instanceof Date? user.joined : new Date(user.joined);
    const years             = Math.floor((new Date().valueOf() - joined.valueOf()) / 31557600000 ); 
    const collabs           = useHasGivenFeedback();
    const collabedIn        = useMemo(()=>{

        return collabs && collabs(user.uname);

    },[collabs])

    var statsExtraRows = useMemo(()=>{

        let rows = [ 
            ["Joined", <JoinedTag label={date2timeago(joined, null, 3)} years={years}/>  ], 
            ...extraRows
        ];

        if( collabedIn?.length )
        {
            rows.push(["Collabed", <CollabbedLabel user={user} versions={collabedIn}/> ]);
        }

        return rows;

    },[ collabedIn ]);
 
    //const extraRow = user.private? ["Private Mode", "ON"] : ["Posted", posted];
 
    let Wrapper = (props)=> (minimal || noClickable)? <div>{props.children}</div> : <CardActionArea {...props} />;
    
    const onClick = ()=>!minimal && history.push( url || `/journal/${user.uname}/${ymd}`);
    
 
    return <Card className={classes.root+" "
                            +(isSupporter && user.sok && classes.supporterBG) 
                            +" "
                            +(user.private && !minimal && classes.private)
                            } square={true}> 
                <Wrapper onClick={ onClick }>  
                    
                   
                    <UAvatar uid={user.id} cc={user.cc} hash={user.avatarhash} slvl={ user.slvl } sactive={user.sok} height={80} width={"100%"} /> 
                    <CardContent>
                        <Uname ymd={ymd} {...user} />

                         {!minimal && <div>
                            
                            <MiniUserStats userdata={user} extraRows={ statsExtraRows }/> 

                            { !breve && <>
                            
                                { media && <img className="rounded" src={media}/> }
                                { text && <CardPreviewText value={text} utags={utags}/>} 

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

const CardPreviewText = ({ value, utags })=> (<Paper className="textPreview"><Typography variant="body2" component="div">{ previewTextToNode(value, utags) }</Typography></Paper>);

const JoinedTag = ({ label, years}) => {

    if( years>5 )
    {
        const isOG = years >= ((new Date().getFullYear()-2011)-1);
        const goldie = years>=10;
        return <><span className={"rainbow1 "+ (years>=10?"gold":"silver") }>{label}</span>{goldie && <OGSeal sinceDay1={isOG}/>}</>;
    }
    return <>{label}</>;
}

const OGSeal = ({sinceDay1})=>{
    //return <div style={{ position:"absolute", top:45, right:0, transform:"scale(0.7)"}}><img src="/og.png" title='Member since year 1'/></div>
    return <span className='og' title={sinceDay1?"Member since year 1 of the site":"Long time member"}>{sinceDay1?"OG":<FlareRoundedIcon/>}</span>
}

const CollabbedLabel = ( { user, versions }) => {

    const showExplanation = ()=>{
        OpenConfirmModal({ open:true
            , title:<><Uname nolink inline {...user} /> has collabed with the site</>
            , info: <div>
                        <Alert severity='info'>This user has given valuable feedback, either by reporting a bug or suggesting a new feature that has lead to improvements in the site.</Alert>
                        <br/> <a href="/changelog">Changelog</a> entries:<br/>
                        {
                            versions.map( v => <Paper style={{marginBottom:5}} key={v} elevation={2}><Box padding={2}><Typography variant='caption'>{v}</Typography></Box></Paper>)
                        }
                    </div>
            , verb: "Ok, got it" 
            , canCancel: false
        });
    }

    return <>
        <a href="#" onClick={e=>e.preventDefault() || showExplanation()}><StarOutlineRoundedIcon style={{fontSize:"1em"}}/>{ versions.length } Time{ versions.length>1 && "s" }</a>
        </>
}