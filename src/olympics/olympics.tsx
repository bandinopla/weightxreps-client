import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, Typography } from "@material-ui/core";
import { AsciiSpinner } from "../componentes/ascii-spinner";

const dataUrl = "https://sph-s-api.olympics.com/summer/schedules/api/ENG/schedule/discipline/WLF";

interface DataNode {
    eventName: string;
    extraData?: { detailUrl?: string };
    genderCode: "M" | "W";
    startDate: string;
    locationDescription: string;
    olympicDay: string
}

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    visor: {
        margin: 3,
        border: "5px solid rgb(2, 35, 102)",
        background: 'linear-gradient(270deg, rgb(0, 156, 224) 27.86%, rgb(2, 35, 102) 103.89%)',

    },
    visorHeader: {

        color: "white",
        padding: 10
    },
    content: {
        display: "flex",
        alignItems: "center",
        "&>a": {
            padding: 20
        }
    },
    countdown: {
        fontSize: "1.3em"
    },
    spinner: {
        flexGrow: 1, textAlign: "center"
    }
});


export default function OlympicsVisor() {
    const [data, setData] = useState<DataNode[]>();
    const [ignore, setIgnore] = useState(false);

    const classes = useStyles();
    useEffect(() => {

        let now = new Date();
        let end = new Date(2024, 8, 15) //new Date(2024, 7, 15); 

        if (now > end) {
            setIgnore(true)
        }
        else {
            fetch(dataUrl).then(resp => resp.json()).then(r => setData(r.units))
        }



    }, []);

    if (ignore) return "";

    return <><div className={classes.visor + " sha rounded"}>

        {data &&
            <div className={classes.visorHeader}>

                <Typography>OLYMPIC WEIGHTLIFTING SCHEDULE & RESULTS 2024</Typography>
            </div>}

        <div className={classes.content}>
            <a href="https://olympics.com/en/paris-2024/schedule/weightlifting" target="_blank"><img src="https://gstatic.olympics.com/s1/f_auto/static/srm/paris-2024/topic-assets/paris-2024/emblem-oly.svg" alt="Olympic Games Paris 2024" loading="lazy" /></a>

            {data &&
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="Schedule" size="small">
                        <Schedule title="Men" data={data.filter(node => node.genderCode === 'M')} />
                        <Schedule title="Women" data={data.filter(node => node.genderCode === 'W')} />
                    </Table>
                </TableContainer>
            }

            {!data &&
                <div className={classes.spinner}>
                    <AsciiSpinner label={"LOADING WEIGHTLIFTING SCHEDULE..."} styles={{ color: "white" }} />
                </div>}
        </div>

    </div>
    </>
}



function Schedule({ title, data }: { title: string, data: DataNode[] }) {
    const buildLink = (item: DataNode) => "https://olympics.com" + item.extraData?.detailUrl;

    return <>

        <TableHead>
            <TableRow>
                {
                    data.map((row, i) => <TableCell key={i} align="center">
                        <a href={buildLink(row)} target="_blank">{row.eventName}</a></TableCell>)
                }
            </TableRow>
        </TableHead>
        <TableBody>

            <TableRow>
                {
                    data.map((row, i) => <TableCell key={i} align="center">
                        <Countdown to={new Date(row.startDate)} onClick={() => window.open(buildLink(row), "_blank")} />
                    </TableCell>)
                }
            </TableRow>

        </TableBody>
    </>

}

function Countdown({ to, onClick }: { to: Date, onClick: () => void }) {
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [results, setResults] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = to.getTime() - now.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / (1000 * 60)) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setTimeLeft(`${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);


            } else {
                setTimeLeft('00:00:00:00');
                setResults(true);
                clearInterval(timer);
            }
        };

        const timer = setInterval(() => {
            calculateTimeLeft();
        }, 1000);

        return () => clearInterval(timer);
    }, [to]);

    if (results) {
        return <Button variant="outlined" onClick={() => onClick()}>See results</Button>
    }

    return (
        <div>
            <Typography> {to.toLocaleString('default', { weekday: 'long' })} {to.getDate()}, {to.toLocaleString('default', { month: 'long' })}</Typography>
            <p className={classes.countdown}>{timeLeft}</p>
        </div>
    );
}