import { Box, Button, IconButton, LinearProgress, Paper, Typography } from "@material-ui/core";
import { Fragment, useEffect, useRef, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionActions from '@material-ui/core/AccordionActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import Fuse from 'fuse.js';
import { Alert } from "@material-ui/lab";
import { exampleLog } from "../componentes/journal/editor-tutorial";
import { StaticLogHighlighter } from "../codemirror/LogTextEditor";
import { getExampleUTagsLog } from "../codemirror/tag-parsing";
import { ContentPage } from "../componentes/ContentPageWrapper";
import LinkIcon from '@material-ui/icons/Link';
import { slugify } from "../utils/slugify";

const useStyles = makeStyles((theme) => ({
    root: {
      display:"flex", 
      justifyContent:"center",
      marginBottom:30
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightBold,
    },
    searchBox: {
        padding: '0px 4px',
        display: 'flex',
        alignItems: 'center',
        maxWidth: 400,
        width:"100%",
        backgroundColor: theme.palette.background.paper
      }, 
      input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        
      }

  }));

var faq_json;

/**
 * Load `/faq.json` which is an array of questions and answers.
 * The answers can have tags that are used to inject content:
 *  
 *  `@[shortcut:question_alias:label]` if you omit `question_alias`, then the label will be used as alias replaceing \s with -
 *  `@[url:the_url:label]` a link to a url. If you omit the `label` then `the_url` will be used as it.
 * 
 * if "a" is just a tag in this format `"[something]""` then `tag2component` will be called.
 */  

const HelpPage = ({ location })=>{ 

    const [ qs, setQs ]=useState([]);
    const [ filteredQs, setFilteredQs ]=useState([]);
    const classes = useStyles();
    const filterInterval = useRef();
    const searchInput = useRef();
    const haveSearchTerm = searchInput.current?.value.length>0;
    const mounted = useRef(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const removeHash = useRef(false);

    /**
     * @type {{ current: Fuse}}
     */
    const fuse = useRef();

    useEffect(()=>{
  
        faq_json = faq_json ?? fetch("/faq.json").then( resp=>resp.text() )
                                                 .then( txt=>JSON.parse(txt) )
                                                 .catch( e=>false );

        mounted.current = true;
        setLoading(true);

        faq_json        .then( json=>{  

                            if( mounted.current )
                            {
                                if( json===false)
                                {
                                    setError(true);
                                    return;
                                }

                                fuse.current = new Fuse(json, {
                                    findAllMatches:true,
                                    includeScore: true,
                                    keys: [
                                        {
                                        name: 'q',
                                        weight: 0.7
                                        },
                                        {
                                        name: 'a',
                                        weight: 0.3
                                        }
                                    ]
                                });

                                setQs(json); 
                                setLoading(false);

                                if( location.hash ) 
                                {
                                    searchInput.current.value = location.hash;
                                    removeHash.current = true;
                                    setFilteredQs( json.filter(q=>location.hash.indexOf(q.alias)==1 || location.hash.indexOf(slugify(q.q))==1 ) )
                                }
                            }

                    });

        return ()=>{
            mounted.current = false;
        }

    },[]);

    const delayedFilter = ev => {
        clearInterval(filterInterval.current);
        filterInterval.current = setTimeout(()=>{

            execRemoveHash();
            setFilteredQs( fuse.current?.search(ev.target.value ).map(itm=>itm.item) )

        }, 300)
    }

    const execRemoveHash = ()=>{
        
        if( removeHash.current )
        {
            removeHash.current = false;
            window.history.replaceState({}, document.title, window.location.pathname );
        }
        
    }
  
    const tag2component = tag => {
        switch( tag )
        {
            case "[LOG_TUTORIAL]":
                return <div>
                    <Typography variant="body1">
                        A Log is just text that has a particular format. Not everything has to follow this format, but if it does, it will be tracked. Here you can see a sample log, showing all possible variations:<br/><br/>
                    </Typography>
                    <StaticLogHighlighter
								initialValue={exampleLog}
								tags={["#sq", "#bp"]}
								exercises={[{ id: 1, name: "Squat", type: "sq" }]}
                                utags={[]}
                                lines={20}
							/>
                </div>;

            case "[USER_TAGS]":
                return <div>
                    <Typography variant="body1">
                        The usual way of logging expects an exercise then weight x reps x sets. But if you wan't to track another aspect of your training (like time on the static bike, or duration of the workout...), you can do so in the following ways: <br/><br/>
                    </Typography>
                    <StaticLogHighlighter
								initialValue={getExampleUTagsLog()}
								tags={[]}
								exercises={[]}
                                utags={[]}
                                lines={20}
							/>
                </div>;
            default:
                return "???"
        }
    }

    const inlineTagToComponents = str => {
        return str.split("@[").map( (chunk,i)=>{

            const value = chunk.substr(0, chunk.indexOf("]") );
            let Injected = "";

            if( value!="" )
            {
                Injected = <strong>???</strong>;
                const params = value.split(":");
                let label = params[ params.length-1 ]; // let's make it so labels is always at the end...

                chunk = chunk.substr(value.length+1);

                //
                // SHORTCUT TO ANOTHER QUESTION
                //
                if( value.indexOf("shortcut:")==0 )
                { 
                    Injected = <a href="#" onClick={shortcutClick(params[1])}><strong>{label}</strong></a>;
                } 
                //
                // LINK TO A URL
                //
                else if( value.indexOf("url:")==0 )
                { 
                    let target = "_self";

                    if( params[1].indexOf('http')==0 )
                    {
                        params[1] += ":" + params[2];
                        label = params[3] ?? params[1];
                        target = "_blank";
                    }

                    Injected = <a href={params[1]} target={target}>{label}</a>;
                } 
            } 

            return <Fragment key={i}>{ Injected } <span dangerouslySetInnerHTML={{__html:chunk}}></span></Fragment>

        } )
    }

    const shortcutClick = alias => ev => {
        ev.preventDefault();
        alias = alias.replace(/\s+/,"-");

        const q = qs.find( itm=>itm.alias==alias );
 
        if(!q) 
        {
            alert("Oops! can't find location of this link...");
        }
        else 
        {
            searchInput.current.value = alias;
            setFilteredQs( [q] );
        }
    }

    const clear = ()=>{
        execRemoveHash()
        searchInput.current.value = "";
        setFilteredQs([]);
    }

    const copyLinkToQuestion = q => {
        const key = slugify(q.q);
        const loc = window.location;
        window.prompt("Copy this link:", `${loc.origin+loc.pathname}#${key}`);
    }

    if( error )
    {
        return <Box padding={3}>
            <Alert severity="error">Failed to load contents of this page... :/</Alert>
        </Box>
    }

    return <Box padding={3}>


        <Box className={classes.root}>
            <Paper component="form" className={classes.searchBox}> 
                <InputBase
                    className={classes.input}
                    placeholder="Filter terms" 
                    onKeyUp={delayedFilter}
                    inputRef={searchInput}
                />
                <IconButton type="button" onClick={ haveSearchTerm?clear:delayedFilter} className={classes.iconButton}>
                    { haveSearchTerm? <CloseIcon /> : <SearchIcon /> }
                </IconButton> 
            </Paper>
        </Box>
        
        { (haveSearchTerm? filteredQs : qs).map( (itm,i)=><Accordion key={itm.q}>

                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />} 
                    >
                    <Typography className={classes.heading}>{itm.q}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography component="div">
                        {
                            itm.a[0]=="[" ? tag2component(itm.a) : inlineTagToComponents(itm.a)
                        }
                    </Typography>
                    </AccordionDetails> 
                    <AccordionActions>
                        <Button size="small" variant="outlined" endIcon={<LinkIcon/>} onClick={()=>copyLinkToQuestion(itm)}>Copy permalink</Button>
                    </AccordionActions>

            </Accordion> )}

            { loading && <LinearProgress/> }

        <br/><Alert severity="info">If you still can't find your answer, send me a DM!</Alert>
        

    </Box>
} 


export default function (props) {
    return <ContentPage Child={HelpPage} {...props}/>
}
