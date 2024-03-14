import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { ImportFromFileToWXR, ImportFromWXR } from "../componentes/importer/import-from-wxr";
import { ImportFromWStrongapp } from "../componentes/importer/import-from-strongapp";
import { Alert } from "@material-ui/lab";
import { ImportFromHevyapp } from "../componentes/importer/import-from-heavyapp";
import { ImportFromProgressionApp } from '../componentes/importer/import-from-progressionapp';
import { Hidden, useMediaQuery, useTheme } from '@material-ui/core';

/**
 * @typedef {Object} Importer
 * @property {string} label The image / icon representative of the importer.
 * @property {JSX.Element} widget The widget in charge of the import
 */
/**
 * @type {Importer[]}
 */
const importers = [
    {
        label:<img src="/logo.png" width={150}/>,
        widget:<ImportFromFileToWXR fileInputLabel='Select the .txt backup file' fileInputFileExtensions='.txt'/>
    },
    {
        label:<a href="https://www.strong.app/" target="_blank" title="Visit competitor's site, grrrrrr..."><img src="/strongapp-logo.jpg" width={150} alt="Strongapp logo"/></a>,
        widget:<div>
                <ImportFromWStrongapp/><br/>
                <Alert severity='info'>
                    Tested on Strongapp version:<br/><b>v2.7.10</b> on <u>Android</u><br/><b>v5.15.23 (7825)</b> on <u>iOS</u>
                </Alert>
            </div>
    },
    {
        label:<a href="https://www.hevyapp.com/" target="_blank" title="Visit competitor's site, grrrrrr..."><img src="/heavyapp-logo.jpg" width={150} alt="Hevyapp logo"/></a>,
        widget:<div>
            <ImportFromHevyapp/><br/>
            <Alert severity='info'>
                    Tested on Hevyapp <b>v1.30.31</b> on <u>Android</u>
                </Alert>
        </div>
    },
    {
        label:<a href="https://play.google.com/store/apps/details/Progression_Workout_Tracker?id=workout.progression.lite" target="_blank" title="Visit competitor's site, grrrrrr..."><img src="/progressionapp-logo.jpg" width={150} alt="Progression App logo"/></a>,
        widget:<div>
            <ImportFromProgressionApp/><br/>
            <Alert severity='info'>
                    Tested on Progression <b>v5.2.1 (2782)</b> on <u>Android</u>
            </Alert>
            <Alert severity='warning'>
                    Their app, when you download a backup, doesn't contain the name of the exercises (only the ones you create) so you will have to complete the missing data on import!
            </Alert>
        </div>
    }
]

export const ImportFromWidget = ({ user })=>{

    const theme             = useTheme();
    const isSmallScreen     = useMediaQuery(theme.breakpoints.down('md'));

    return <div>  
            <Alert severity="info">
                You can DM the admin to code a new parser for some other app you'd like to import data from.
            </Alert>
            <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell width={isSmallScreen?"auto":200}>Import data from...</TableCell>

                    <Hidden smDown>
                        <TableCell >Import</TableCell> 
                    </Hidden>
                </TableRow>
                </TableHead>
                <TableBody> 
                    {
                        importers.map( (importer,i)=>(<TableRow key={i}>

                            <Hidden smDown>
                                <TableCell component="th" scope="row" style={{maxWidth:200}}>
                                    { importer.label }
                                </TableCell>
                            </Hidden>
                            <TableCell >
                                <Hidden mdUp>
                                    { importer.label }
                                </Hidden>
                            { importer.widget }</TableCell> 
                        </TableRow> ) )
                    }
                    
                </TableBody>
            </Table>
            </TableContainer>

    </div>
};