import { ActionChipButton } from "./action-chip-button"
import AttachmentIcon from '@material-ui/icons/Attachment';

/**
 * Represents a local file selector button.
 * @typedef {Object} LocalFileSelectorButtonParams
 * @property {string} label - The label text for the button.
 * @property {string} only - File types to restrict the selection separated by comma.
 * @property {(file:File, statusInform:(string)=>void)=>Promise} onFileSelected - A callback function invoked when a file is selected. It should resolve when the file is finally processed or fail with an error if something went wrong.
 */

/**
 * Creates a local file selector button. On click it will trigger a file selection to the user.
 * @param {LocalFileSelectorButtonParams} params - The parameters for the button.
 */
export const LocalFileSelectorButton = ({ label, only, onFileSelected })=>
{
    const selectFile = ( logStatus )=>{

        return new Promise( (resolve, reject)=>{

            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.multiple = false;
            fileInput.accept = only; //".png, .jpg, .jpeg";
            fileInput.style.display = "none";
            document.body.appendChild(fileInput);

            fileInput.addEventListener("change", (event) => {

                const file = fileInput.files[0];
                fileInput.remove();
                
                //
                // wait for the handler to do it's thing
                //
                onFileSelected( file, logStatus ).then(resolve, reject); 
            });

            fileInput.addEventListener("cancel", (event) =>{
                fileInput.remove()
                reject("You canceled the file selection");
            } ); 


            fileInput.click(); 
        });
        
    }

    return <ActionChipButton IconClass={AttachmentIcon} label={label} labelWhenSending="Please wait..." executeAction={selectFile} size="medium"/>
}