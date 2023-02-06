import { Box, Paper } from '@material-ui/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export const RepsOfChart = ({ data })=><div style={{ width: "100%", height:300, padding:"10px 0", marginBottom:-40 }}>
    <ResponsiveContainer>
        <LineChart   
                
                margin={{
                    top: 5,
                    right: 5,
                    left: 5,
                    bottom: 5,
                }}
                >
                    <CartesianGrid strokeDasharray="1 1" />
                    <XAxis dataKey="r" type="category" allowDuplicatedCategory={false} />
                    <YAxis yAxisId="left"/>
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip  content={<CustomTooltip />}/>
                    <Legend />
                    <Line connectNulls dot={false} yAxisId="left" strokeWidth={4} dataKey="count" data={data[0].data} name={"Total sets"} type="monotone" stroke="#8884d8"  /> 
                    <Line connectNulls dot={false} yAxisId="right" strokeDasharray="3 3" strokeWidth={2} dataKey="volume" data={data[0].data} name={"Total reps"} type="monotone" stroke="blue"  /> 
                </LineChart>
    </ResponsiveContainer>
</div>;

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload ) {

        console.log( payload)
      return (
        <Paper elevation={2} style={{background:"#eee", color:"#000"}}>
            <Box padding={1}>
                <p className="label">
                    {`${payload[0]?.value} sets of ${label} reps`}
                    <br/> <strong>{payload[1]?.value}</strong> total reps.
                    </p>    
            </Box>
        </Paper>
      );
    }
  
    return null;
  }; 