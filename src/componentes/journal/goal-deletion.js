import { Button } from "@material-ui/core"
import { $openModal, OpenConfirmModal } from "../Dialog"
import { useDeleteGoalMutation } from "../../data/generated---db-types-and-hooks"
import OperationBackdrop from "../backdrop";
import ErrorSnackbar from "../ErrorSnackbar";
import { parseError } from "../../data/db";

export const DeleteGoalButton = ({ goalid }) => {

    const [delGoal, { data, loading, error }] = useDeleteGoalMutation({ variables:{ goalId:goalid }});

    const deleteGoal = ()=>{

        OpenConfirmModal({
                        title: "Delete goal",
                        open: true,
                        onConfirm: () => delGoal().then(res=>window.location.reload()).catch(e=>{}), 
                        canCancel: true,
                        verb: "Yes, DELETE this goal", 
                        info: "Are you sure you want to delete this goal? This can't be undone.",
                    });

    }



    return <> 
        <OperationBackdrop open={loading}/>
        { error && <ErrorSnackbar trigger={ parseError(error)}/> }
        <Button fullWidth variant="contained" color="secondary" onClick={deleteGoal}>Delete</Button>
        </>
}