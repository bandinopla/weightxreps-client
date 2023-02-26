import StarRoundedIcon from '@material-ui/icons/StarRounded';
import StarHalfRoundedIcon from '@material-ui/icons/StarHalfRounded';
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';


function TAG_RANK_toView({ value }) {

    const total     = 4;
    const stars     = new Array(total).fill(0); 
    const halfVal   = (1/total)*0.5;

    return <div style={{ whiteSpace:"nowrap", display:"inline-block" }}>{ stars.map((_,i)=> { 
        let starVal = (i+1)/total;

        return value>starVal? <StarRoundedIcon/> 
                :
               value>=starVal-halfVal? <StarHalfRoundedIcon/>
                : 
            <StarBorderRoundedIcon/>
    }) }</div>
}

export default TAG_RANK_toView;