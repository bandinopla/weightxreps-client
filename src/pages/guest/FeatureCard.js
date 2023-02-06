 
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    background:"#333",
    
    border:"6px solid rgba(0,0,0,0.2)",
    textAlign:"left",
    // "&:hover .MuiCardMedia-root": {
    //     transform:"scale(1.5) rotate(-10deg)"
    // },
    "& *": {
        color:"white !important",
    }
  },
  media: {
    height: 240,
    transition:"all 1s",
    transform:"scale(1.1) rotate(-10deg)",
    borderBottom:"1px dashed #ccc"
  },
  mediaContainer: {
      height:240,
      overflow:"hidden"
  }
});

export default function FeatureCard({ title, desc, img, children }){
  const classes = useStyles();

  return (
    <Card className={classes.root}  > 
        <div className={classes.mediaContainer}>
            <CardMedia
            className={classes.media}
            image={img}
            title={title}
            />
        </div>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            <strong>{title}</strong>
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {children}
          </Typography>
        </CardContent> 
      {/* <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions> */}
    </Card>
  );
}