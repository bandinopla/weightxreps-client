import { makeVar, useReactiveVar } from "@apollo/client";
import { Button, Dialog, DialogContent, IconButton, LinearProgress, TablePagination } from "@material-ui/core";
import { useContext, useMemo, useRef, useState } from "react";
import { BulkMode, useExecBulkExercisesMutation, useExecExerciseMutation, useGetExercisesQuery } from "../../data/generated---db-types-and-hooks";
import { JOwnerContext } from "../../pages/journal-context";
import { makeStyles } from '@material-ui/core/styles';
import UnameTag from "../uname";
//---
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Ename from "../ename";
import { TableSortLabel } from "@material-ui/core";
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close'; 
import Checkbox from '@material-ui/core/Checkbox';
import { ActionChipButton } from "../action-chip-button";
import MergeTypeIcon from '@material-ui/icons/MergeType';
import ConfirmationPrompt from "../confirmation-prompt";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import EditIcon from '@material-ui/icons/Edit';
import { Alert } from "@material-ui/lab";
import DeleteSharpIcon from '@material-ui/icons/DeleteSharp';
import OperationBackdrop from "../backdrop";
import { parseError } from "../../data/db";
import { DialogTitleWithCloseBtn } from "../DialogTitleWithCloseBtn";
import { useGetSession } from "../../session/session-handler";
import { useHistory } from "react-router-dom";
function Alert2(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const $open = makeVar(false);

const useStyles = makeStyles ((theme) => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center', 
      marginBottom:5
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },

 

    isOFF: {
        "& *": {
            color:"#ccc",
            fontStyle:"italic"
        }
    },

    bulkActionsBar: {
        "& .MuiChip-root": {
            color:"white",
            borderColor:"white",
            margin:"0px 2px"
        },
        "& .MuiChip-icon": {
            color:"white"
        }
    }
  }));


export const openExercisesModal = what =>{
    $open( what );
}

export const EditExerciseButton = ({ exercise, owner, ...rest })=>{

    const open          = useReactiveVar($open);
    const jowner        = useContext(JOwnerContext);
    const user   = useGetSession();

    if( (owner && (owner?.id!=user.session?.user.id)) || (!owner && jowner?.id!=user.session?.user.id) ) return "";

    return <Button disabled={!!open} color="secondary" variant="outlined" {...rest} startIcon={<EditIcon/>} onClick={ ()=>$open(exercise) }>Edit Exercise</Button>
}

export const ExercisesModal = ()=>{
    const open          = useReactiveVar($open); 
    const jowner        = useContext(JOwnerContext);
    const { session }   = useGetSession();
    const myId          = session?.user.id;

    const handleClose   = ()=>$open(false);

    //
    // si es >0 es un EID
    //
    if( open?.id>0 )
    {
        return <BulkActions closeOnBlur selection={[open]} onClose={handleClose}/> 
    }

    const listParams = open?.onSelected? { onExerciseSelected: exercise=>{
                                                                                    open.onSelected(exercise);
                                                                                    handleClose(); 
                                                                                }} 
                                                : null;

    const showList = open===0 || listParams; 

    return <Dialog
                    open={ !!showList }
                    onClose={ handleClose }
                    scroll="body"  
                    maxWidth="sm"
                    fullWidth
                >
                    { showList && <ExercisesListView jowner={jowner || session.user} myId={myId} onClose={handleClose} {...listParams}/>} 
                    
                </Dialog>;
}

const ExercisesListView = ({ jowner, myId, onClose, onExerciseSelected })=> {

    const history       = useHistory();
    const classes       = useStyles(); 
    const imTheOwner    = myId == jowner.id;
    const canBulkSelect = imTheOwner && !onExerciseSelected;

    const [rowsPerPage, setRowsPerPage]                 = useState(25); 
    const [page, setPage]                               = useState(0);

    const [selectedExercises, setSelectedExercises]     = useState([])
    const [filterTerm, setFilterTerm ]                  = useState();
    const {data, loading, error}                        = useGetExercisesQuery({
        variables: {
            uid: jowner.id
        }
    });

    const [sortBy, setSortBy]   = useState(2);
    const columnIsActive        = i=>Math.abs(sortBy)==i+1;

    const sortableColumns = useMemo(()=>[
            { label:"Name"    , sort:(a,b)=>(b.e.name.toLowerCase()<a.e.name.toLowerCase()? -1 : b.e.name==a.e.name? 0 : 1) }
        ,   { label:"Days"    , width:30 , sort:(a,b)=>b.days-a.days }
    ],[]);


    const setSortHandler = i=>()=>{
        if( columnIsActive(i) )
        {
            setSortBy( sortBy*-1 ); //<-- toggle direction
        }
        else 
        {
            setSortBy(i+1);
        }
    }

    const filterList = str => {
        setFilterTerm(str?.toLowerCase());
        setPage(0); //por las dudas de que hayamos estado en medio de una paginacion
        setSortBy(1);
    };

    const filteredList = useMemo(()=>data?.getExercises?.slice(0)

                                                    //
                                                    // isON = si no hay filter term o matchea el filter term.
                                                    //
                                                    .map( itm=>{
                                                        
                                                        var n               = itm.e.name.toLowerCase(); 
                                                        var matchPercent    = filterTerm?.length>0? 
                                                                                    n.indexOf(filterTerm)>-1? (filterTerm.length / n.length)*100 : 0 
                                                                                    : 1;

                                                        return {...itm, 
                                                                isON: matchPercent //!filterTerm || n.indexOf(filterTerm)>-1 
                                                            };
                                                    })

                                                    //
                                                    // sort
                                                    //
                                                    .sort( (a,b)=>{

                                                        if( a.isON && !b.isON ) return -1;
                                                        if( b.isON && !a.isON ) return 1;

                                                        //
                                                        // hay un search term
                                                        //
                                                        if( filterTerm?.length && Math.abs(sortBy)==1 && a.isON && b.isON )
                                                        { 
                                                            return sortBy>0? b.isON-a.isON : a.isON-b.isON;
                                                        }

                                                        return sortableColumns[ Math.abs(sortBy)-1 ].sort( sortBy>0?a:b,sortBy>0?b:a);

                                                    } ) //<--- SORT
    ,[data, filterTerm, sortBy]);


    const onSelectExercise = ex=>{ 
        if( !imTheOwner ) return;

        selectedExercises.find(e=>e.id==ex.id)==null ? // no esta selected...
              setSelectedExercises([...selectedExercises,ex]) // add new selection
            : setSelectedExercises( selectedExercises.filter(e=>e.id!=ex.id) ); // remove from selection
    }

    const closeBulkMenu = ()=>{
        setSelectedExercises([]);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        //setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const onClickOn = exercise => ()=>{
        if( onExerciseSelected )
        {
            onExerciseSelected( exercise );
            return true;
        }
        onClose();
    }

    return <>
        <DialogTitleWithCloseBtn onClose={onClose}>
            { loading ? <LinearProgress/> : <>Exercises of <UnameTag inline {...jowner}/> </>}
        </DialogTitleWithCloseBtn>

        {data && !data.getExercises?.length>0 && <Alert severity="warning">
            No exercises found... 
            </Alert>}

            {imTheOwner && !data?.getExercises?.length && <Alert severity="info">To create exercises you must log a workout. Exercises are created on the fly as you log. Click on the <strong>Edit</strong> button and start logging!</Alert> }

        { filteredList?.length>0 && 
            (<DialogContent>

                    <FilterByTermInput onChange={filterList} showClear={filterTerm!=null}/>

                    {/*selectedExercises.length>1 && <BulkActions selection={selectedExercises}/> */}

                    { canBulkSelect && <BulkActions selection={selectedExercises} onClose={closeBulkMenu}/>  }


                    <TablePagination
                        rowsPerPageOptions={[25, 50, 100]}
                        component="div"
                        count={data?.getExercises?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        />

                    <TableContainer component={Paper}>
                        <Table style={{maxWidth:"100%"}} stickyHeader padding="none" size="small">
                            <TableHead>
                            <TableRow>

                                {canBulkSelect && <TableCell padding="checkbox"> </TableCell>}

                            { sortableColumns.map( (col,i)=>(<TableCell key={col.label} 
                                                                    align={i>0?"center":"left"}
                                                                    style={{width:col.width || "auto" }}>
                                                                    <TableSortLabel active={ columnIsActive(i) }
                                                                                    direction={ sortBy<0?"asc":"desc" } 
                                                                                    onClick={ setSortHandler(i) } >{ col.label }</TableSortLabel>
                                                            </TableCell>))}
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            { 
                                filteredList 


                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

                                //
                                // render list
                                //
                                .map((row) => {
                                        
                                        const isSelected = selectedExercises.find(e=>e.id==row.e.id)?.id>0;

                                        return <TableRow key={row.e.id} className={ !row.isON ? classes.isOFF : "" } 
                                                hover
                                                selected={isSelected}
                                            >

                                            {canBulkSelect && <TableCell  padding="checkbox" onClick={(event) => onSelectExercise(row.e)}>
                                                                <Checkbox checked={isSelected} /> 
                                                            </TableCell>}

                                            <TableCell  component="th" scope="row" style={{paddingLeft:5}}>
                                                <Ename {...row.e} uname={jowner.uname} onClick={ onClickOn(row.e) }/>
                                            </TableCell>
                                            <TableCell align="center">{row.days}</TableCell>
                                        </TableRow>
                                        })}
                            </TableBody>
                        </Table>
                        </TableContainer>
            </DialogContent>)
        }
    </>;
}

const FilterByTermInput = ({onChange, showClear})=>{
    const classes   = useStyles();
    const inputRef  = useRef();
    const interval  = useRef();

    const handleClear = ev=>{
        inputRef.current.value="";
        onChange();
    }

    const callChange = str => {
        clearInterval( interval.current );
        interval.current = setTimeout( onChange, 200, str );
    }

    return <Paper component="form" className={classes.root}>
                <IconButton className={classes.iconButton}>
                    <SearchIcon />
                </IconButton>
                <InputBase
                    className={classes.input}
                    placeholder="Filter by name" 
                    onChange={ ev=>callChange(ev.target.value) }
                    inputRef={inputRef} 
                /> 

                { showClear && <>
                    <Divider className={classes.divider} orientation="vertical" />
                    <IconButton onClick={handleClear} color="primary" className={classes.iconButton} aria-label="directions">
                        <CloseIcon />
                    </IconButton></>}
            </Paper>
}


const BulkActions = ({ selection, closeOnBlur, onClose })=>{

    const classes   = useStyles();
    const {session}                           = useGetSession();

    const [renameAction, setRenameAction]   = useState(); 
    const [mergeAction, setMergeAction]     = useState(); 
    const [deleteAction, setDeleteAction]   = useState(); 
    const [confirmAction, setConfirmAction] = useState();
    const hayAlgoAbierto                    = useRef(false);

    const [busy, setBusy]                   = useState(false);
    const [error, setError]                 = useState();
    const [success, setSuccessMessage]      = useState();
    const [execBulk, {client}]              = useExecBulkExercisesMutation();
    const [rename]                          = useExecExerciseMutation();
    const inputRef                          = useRef(); 


    /**
     * exec devuelve una función que usan los <ActionChipButton> para obtener una promesa que indica si la operacion que ese chip debía hacer se completó o no. 
     * La función devuelta devuelve una promesa. Esta promesa la usa el boton para mostrar un spinner indicator y saber cuando terminó de ejecutarse la accion.
     * --
     * A su vez, "confirmThis" es un setState que guarda un { executer } que usan los componentes <ConfirmationPrompt> para saber que hay una accion aguardando
     * ejecución pero requiere que el usuario esté de acuerdo, pero eso, "executer" debe ser una función que espera un boolean, que indica si el usuario está o no de acuerdo.
     * --
     * El <ConfirmationPrompt> será visible cuando haya una acción pendiente para confirmar por el usuario.
     * El <ActionChipButton> queda en estado loading spinner hasta que se resuelva la promesa (finally).
     */
    const exec = ( execAction, confirmThis ) => {

        const eids = selection.map(e=>e.id);

        return ()=>{

            hayAlgoAbierto.current = true;

            //
            // esta promesa la usa el <ActionChipButton> para mostrar un spinner...
            //
            return new Promise( (resolve, reject)=>{

                const __taskCompleted = ()=>{

                    hayAlgoAbierto.current = false;

                    // quitar el sponer del chip
                    resolve();

                    // cerrar el confirmation prompt
                    confirmThis(null); 

                    // cerrar el snackbar de acciones...
                    setTimeout( onClose, 0 );

                }

                //
                // setear el state correspondiente a la accion que queremos confirmar antes de ejecutar...
                //
                confirmThis({

                    //
                    // el usuario está de acuerdo con ejecutar la acción...
                    //
                    executer( ok ) { 
                        
                        if( ok )
                        {
                            //
                            // backdrop para que el usuario espere...
                            //
                            setBusy(true);

                            //
                            // flag. Porque puede ser que se cancele pero querramos dejar el prompt activo...
                            //
                            var closeConfirmation = true;

                            //
                            // ejecutar acción pertinente...
                            //
                            execAction(eids)
                            

                                //
                                // si resuelve al flag "stay-here": no cerrar el prompt.
                                //
                                .then( resp => {
                                    if( resp=='stay-there' )
                                    {
                                        closeConfirmation = false;
                                    }
                                    else 
                                    {
                                        setSuccessMessage("Done!");
                                    }
                                })

                                //
                                // si hay error, setear el error state
                                //
                                .catch( err=>setError(err) )

                                //
                                // siempre...
                                //
                                .finally( ()=>{ 

                                    //
                                    // quitar el busy state...
                                    //
                                    setBusy(false);  
                                    
                                    if( closeConfirmation )
                                    {
                                        __taskCompleted();
                                    }  
                                    
                                }); 
                        }

                        //
                        // nope. Abort...
                        //
                        else 
                        { 
                            __taskCompleted();
                        }
                    }
                });

            });
        }
    }

    const execMerge = eids =>{
        return execBulk({
            variables: {
                eids,
                mode: BulkMode.Merge
            },

            update: __updateCacheAfterBulk(eids, BulkMode.Merge, session.user.id)
        })
        .finally( onClose )
        ;
    }

    const execDelete = eids =>{
 
        return execBulk({
            variables: {
                eids,
                mode: BulkMode.Delete
            },

            update: __updateCacheAfterBulk(eids, BulkMode.Delete, session.user.id)
        })
        .finally( onClose )
        ;
 
    }

    const execRename = (eids, confirms) => {
        //...
        const original  = selection[0].name;
        const newName   = inputRef.current.value;

        //if( newName.trim().length==0 || original==newName ) throw new Error("Nothing to rename..."); 

        return rename({
            variables: {
                eid     : eids[0],
                ename   : newName,
                confirms
            }

            ,update: __updateCacheAfterBulk(eids, BulkMode.Merge, session.user.id)
        })

        //
        // si hay un conflicto con el ename nuevo, puede ser que se requiera que el usuario confirme...
        //
        .then( ({ data:{ execExercise } }) => {
            
            //
            // el server puede pedir confirmacion a una accion...
            //
            if( execExercise.__typename=='ConfirmAction' )
            {
                //
                // esperar a que se confirme la accion...
                //
                return new Promise( (resolve, reject)=>{

                    //
                    // trigger confirmation prompt UI
                    //
                    setConfirmAction({ 

                        //
                        // le pego la respuesta para que la use el UI para mostrar el texto...
                        //
                        ...execExercise,

                        //
                        // cuando el usuario de su feedback...
                        //
                        executer: (yes) => {

                            //
                            // cierra el confirm window 
                            //
                            setConfirmAction(null); 
                           
                            if( yes )
                            {
                                //
                                // rename exercise...
                                // loop-back con el ID de la confirmación...
                                //
                                return execRename( eids, execExercise.id )
                                       .finally( resolve );
                            }
                            else 
                            {
                                //
                                // flag para no cerrar el promp de rename exercise...
                                //
                                resolve("stay-there");
                            } 
                        }
                    }); 
                });
            } 
        }); 
    }

    return <>  

            {
                //
                // ERROR snackbar
                //
            }
            <Snackbar anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }} 
                autoHideDuration={2000}

                onClose={  (ev,reason)=>( reason !== 'clickaway' && setError(null) ) }

                open={error}>
                    <Alert2 severity="error" className={classes.bulkActionsBar}>
                        {error && parseError(error)}
                    </Alert2>
            </Snackbar>

            {
                //
                // SUCCESS snackbar
                //
            }
            <Snackbar anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }} 
                autoHideDuration={2000}
                onClose={  (ev,reason)=>reason !== 'clickaway' && setSuccessMessage(null)  }
                open={success!=null}>
                    <Alert2 severity="success" className={classes.bulkActionsBar}>
                        {success}
                    </Alert2>
            </Snackbar>

            {
                //
                // ACTIONS MENU
                //
            }
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={ selection.length>0 }
                disableWindowBlurListener 
                onClose={  (ev,reason)=>!busy && closeOnBlur && !hayAlgoAbierto.current && onClose()  }
            >
                <Alert2 className={classes.bulkActionsBar} severity="info" action={
                        <>

                            {selection.length==1 && <ActionChipButton IconClass={EditIcon} label="Rename" labelWhenSending="Renaming..." executeAction={exec(execRename,setRenameAction)}/>}
                            {selection.length>1 && <ActionChipButton IconClass={MergeTypeIcon} label="Merge" labelWhenSending="Merging..." executeAction={exec(execMerge,setMergeAction)}/>}
                            <ActionChipButton IconClass={DeleteSharpIcon} label="Delete" labelWhenSending="Deleting..." executeAction={exec(execDelete,setDeleteAction)}/>

                            <IconButton size="small" aria-label="close" color="inherit" onClick={ onClose }>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </>
                        }>

                        { selection.length==1? selection[0].name.trim().substr(0,12)+"..." : <><strong>{selection.length}</strong> items</>}
                </Alert2>
            </Snackbar>  

            <OperationBackdrop open={busy}/>

            {
                //
                // MERGE confirmation
                //
            }
            <ConfirmationPrompt title={<div>Merge <strong>{selection.length}</strong> into 1.</div>} confirmActionVerb="Yes, Merge them!" actionExecutioner={mergeAction?.executer}>
                Merging means they will all be combined into the <strong>last</strong> exercise you selected.
                In this case the receiver will be: <strong>{selection[selection.length-1]?.name}</strong>
            </ConfirmationPrompt> 

            {
                //
                // DELETE confirmation
                //
            }
            <ConfirmationPrompt title={<div>Delete <strong>permanently</strong></div>} confirmActionVerb="Delete forever!" actionExecutioner={deleteAction?.executer}>
                Delete permanently the <strong>{selection.length}</strong> selected exercise{selection.length>1?"s":""} . This will delete {selection.length>1?"them":"it"} also from the journals referencing {selection.length>1?"them":"it"} (but it will not delete the journals) 
            </ConfirmationPrompt>  

            {
                //
                // RENAME confirm MERGE
                //
            }
            <ConfirmationPrompt title={<div>Confirm this:</div>} confirmActionVerb={confirmAction?.id} actionExecutioner={confirmAction?.executer}>
                {confirmAction?.message}
            </ConfirmationPrompt> 


            {
                //
                // RENAME prompt
                //
            }
            <ConfirmationPrompt title={<div>Rename <strong>{selection[0]?.name}</strong></div>} 
                                confirmActionVerb="Rename it!" 
                                actionExecutioner={renameAction?.executer}
                                onEntered={ ()=>{

                                    inputRef.current.value = selection[0]?.name;
                                    inputRef.current.focus() ;
                                }}>
                <Paper component="form" className={classes.root}>
                    <IconButton className={classes.iconButton}>
                        <EditIcon />
                    </IconButton>
                    <InputBase
                        className={classes.input}
                        placeholder="Rename..."  
                        inputRef={inputRef}  
                        inputProps={{
                            maxlength: 80
                        }}
                    />  
                </Paper>
            </ConfirmationPrompt> 
    </>;
}



/**
 * Basicamente eliminamos de la cache todo lo que haga referencia a alguno de los EIDs que fueron modificados/borrados
 * Eso hace que Apollo haga refetch y baje data actualizada.
 */
const __updateCacheAfterBulk = (eids, mode, myId) => 
                                    (cache, {data} ) => {

                                if( data.execBulkExercises )
                                {
                                        //
                                        // delete todos lados donde se hayan referenciado a estos eids.
                                        //
                                        cache.modify({
                                            fields: (val, options)=>{

                                                switch( options.fieldName )
                                                {   
                                                    case "getPRsOf":
                                                        if( eids.indexOf( options.readField("id", val.exercise) )>-1 )
                                                        {
                                                            return options.DELETE;
                                                        }
                                                        break;

                                                    case "getExercises":
                                                        return mode==BulkMode.Delete? 
                                                                  val.filter(estat=>eids.indexOf( options.readField("id",estat.e) ) == -1 ) 
                                                                : options.DELETE ; 

                                                    case "jday":
                                                        const exercises = options.readField("exercises", val);

                                                        if( exercises?.find( e=> eids.indexOf( options.readField("id", e.exercise))>-1  )) 
                                                        { 
                                                            return options.DELETE;
                                                        } 
                                                        break;

                                                    case "jrange":
                                                        if( val?.exercises.find(ex=>eids.indexOf(options.readField("id", ex))>-1 ))
                                                        {
                                                            return options.DELETE;
                                                        }
                                                        break;

                                                    case "getActivityFeed":
                                                        if( val.find( ucard=>
                                                                            options.readField("id", ucard.user)==myId 
                                                                        && ucard.workoutPreview.find(exref=>eids.indexOf(options.readField("id", exref.e))>-1 ) 
                                                                    ))
                                                        {
                                                            return options.DELETE;
                                                        }
                                                        break;

                                                    case "userInfo":
                                                        if( options.readField("id", val.user)==myId && val.best3.find(estat=>eids.indexOf(options.readField("id", estat.e))>-1) )
                                                        {
                                                            return options.DELETE;
                                                        }
                                                        break;
                                                }  

                                                return val;
                                            }
                                        });
                                }
                            }