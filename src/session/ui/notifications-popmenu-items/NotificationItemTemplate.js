import { Chip, ListItem, ListItemAvatar, ListItemText, makeStyles, Typography, withStyles } from "@material-ui/core";
import { TimeAgo } from "../../../componentes/time-ago";
import { date2timeago } from "../../../componentes/TimeAgoDisplay";

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%', 
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
    typeIcon: { 
        color:"#333"
        , backgroundColor:"#eee" 
      },
    msgCountChip: {
        float:"right",
        fontSize:"0.7em"
    },

      SystemMessage: {
          "&.info *": { color:"blue" } ,
          "&.error *": { color:"red" } ,
          "&.warning *": { color:"yellow" } 
      },

      onWhichLog: {
          color:"#000", 
      },

      whenLine: {
          marginTop: theme.spacing(2)
      }
 
}));




const NotificationListItem = withStyles( theme=>({  
    root: {
        backgroundColor: theme.notifItemBgColor 
        , borderBottom:"1px dotted "+theme.notifItemBorderColor 

        , "& .iconAvatar > div": {
            background:"#eee"
            , color:"#555"
        }
    } 
}))(ListItem);



export const NotificationItemTemplate = ({ itemAvatar, count, title, when, message,children, whenExtra, onClick }) => {

    const classes = useStyles();

    return <>   
            <NotificationListItem button alignItems="flex-start" onClick={onClick}>
                <ListItemAvatar>
                    {/*msg.by? <Avatar alt="Remy Sharp" src={ uid2avatarurl(msg.by.id) } /> : "???"*/} 
                    <div className="iconAvatar">{ itemAvatar }</div>
                    
                </ListItemAvatar>


                <ListItemText
                
                primary={ <div>{count>0 && <Chip  className={classes.msgCountChip} label={"+"+count} color="primary"/> }{ title }</div> } 
                secondary={
                            <>  
                            {children} { message } 
                            <Typography
                                component="span"
                                variant="caption"
                                className={classes.inline}
                                color="textPrimary"
                                noWrap
                            > 
                            <span className="oneline">— { date2timeago(when) }{whenExtra}</span>
                            </Typography>
                            </>
                        }
                />
            </NotificationListItem> 

        </>;
}

export const DirectMessageItem = ({ title, children, when, whenExtra })=> {
    const classes = useStyles();
    //{count>0 && <Chip  className={classes.msgCountChip} label={"+"+count} color="primary"/> }

    //classes.inline+" "+
    return <>   
            <NotificationListItem alignItems="flex-start" > 
                <ListItemText
                primary={ <div>{ title }</div> }
                secondary={
                            <>  
                            {children}  
                            <Typography
                                component="div"
                                variant="caption"
                                className={classes.whenLine}
                                color="textPrimary"
                                noWrap
                            > 
                            <div className="oneline">— <TimeAgo when={when}/> {whenExtra}</div>
                            </Typography>
                            </>
                        }
                />
            </NotificationListItem> 

        </>;
}

