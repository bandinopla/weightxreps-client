import { Chip } from "@material-ui/core";



export const RPEChip = ({value})=>{
    const colors = {
        6:"#219EBC",
        6.5: "#2A9D8F",
        7:"#52B788",
        7.5:"#E9C46A",
        8:"#F4A261",
        8.5:"#FF9100",
        9:"#E76F51",
        9.5:"#F94144",
        10:"#E63946"
    }

    let roundedNum = Math.round( Number(value)  * 2) / 2;  

    if( roundedNum<6 )
    {
        roundedNum = value;
        colors[roundedNum] = '#2E95D3';
    }

    return <Chip size="small" label={ value+ " RPE"} style={{backgroundColor:colors[roundedNum], color:"white", marginLeft:3}}/>;
}