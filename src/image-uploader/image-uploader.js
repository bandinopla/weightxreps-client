
import { Box, Button, ButtonGroup, Grid, Paper } from '@material-ui/core';
import { useRef, useState } from 'react';
import { Cropper } from 'react-cropper';
import "cropperjs/dist/cropper.css";

import PublishIcon from '@material-ui/icons/Publish';
import CircularProgress from '@material-ui/core/CircularProgress';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import ErrorSnackbar from '../componentes/ErrorSnackbar';
import { parseError } from '../data/db';
import { useCurrentSession } from '../session/session-handler';
/**
 * https://www.apollographql.com/docs/apollo-server/data/file-uploads/
 * https://github.com/jaydenseric/apollo-upload-client 
 * https://github.com/jaydenseric/graphql-upload <--- Upload scalar & handler 
 */
import { $avatarUpdated } from '../utils/useUpdatedAvatarHash';


const MUTATION = gql`
  mutation ($file: Upload!) {
    uploadAvatar(file: $file) 
  }
`;


export const ImageUploadButton = ()=>{

    const session                       = useCurrentSession();
    const [upload]                      = useMutation(MUTATION);
    const [image, setImage]             = useState();
    const cropper                       = useRef();
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError]             = useState();

    const onUserSelectFile = e => {
        e.preventDefault();
        let files;

        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }

        const reader = new FileReader();

        reader.onload = () => {
          setImage(reader.result);
        };

        reader.readAsDataURL(files[0]);
    };

    const cancel = ()=>{
        setImage(null);
        setError(null);
    }

    const startUpload = ()=>{
        
        cropper.current.disable();
        setIsUploading(true);
        setError(null);

        callUpload()

            .then( ()=>{
                setImage(null);
                // -- trigger refresh
                $avatarUpdated( { uid:session.user.id, time:new Date().getTime() } );
            })
        
            .catch(e=>{
                setError( parseError(e) );
            })
            .finally(()=>{
                setIsUploading(false);
            });

    }

    const callUpload = async ()=>{  
        
        var canvas = await cropper.current.getCroppedCanvas({
            width:155*2,
            height:67*2,
            fillColor:"#000000",
            imageSmoothingQuality:"high"
        });
 

        const file = await new Promise( (resolve, reject)=>{
  
            try{
                canvas.toBlob( resolve,"image/jpeg", 0.8 );
            }
            catch(e)
            { 
                reject("Failed to process the image...");
            } 

        });  

        await upload({ variables: { file } });
    }

    return <div style={{maxWidth:"100%"}}>

        <ErrorSnackbar trigger={error} horizontal="center"/>

        {!image && <input type="file" disabled={isUploading} onChange={onUserSelectFile} /> }

        { image != null && <Paper elevation={2}><Box padding={1}>
                <Cropper
                        style={{ height: 400, width: "100%" }}
                        zoomTo={0.5}
                        initialAspectRatio={155/67}
                        aspectRatio={155/67}
                        preview=".img-preview"
                        src={image}
                        viewMode={1}
                        minCropBoxHeight={67/4}
                        minCropBoxWidth={155/4}
                        background={false}
                        responsive={true}
                        movable={false}
                        zoomable={false}
                        autoCropArea={1}
                        checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                        onInitialized={(instance) => { 
                            cropper.current = instance;
                        }}
                        guides={true}
                />

            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={6}>
                    <div
                        className="img-preview sha"
                        style={{ width: 155 , height: 67, margin:"0 auto", overflow:"hidden", marginTop:5 }}
                    />
                </Grid>
                <Grid item xs={6}> 

                    <ButtonGroup>
                        <Button disabled={!image || isUploading} onClick={startUpload} startIcon={<PublishIcon/>} color="primary" variant="contained" size="large">
                            { isUploading? <CircularProgress size={30}/> : "Upload" }    
                        </Button> 

                        <Button disabled={!image || isUploading} size="large" onClick={cancel}>X</Button>
                     </ButtonGroup>
                </Grid>
            </Grid>
        </Box></Paper> }
    </div>
}

 