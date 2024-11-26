import { useTheme } from "@material-ui/core";
import { useLayoutEffect, useRef, useState } from "react";

/**
 * Available plates.
 * @type { [w, width, heightPercent, color][] }
 */
const normalPlates = [
    [25, 5,.9,"#ff0000"],
    [20, 5,.9,"#0033CC"],
    [15, 4,.8,"#FFCC00"],
    [10, 4,.6,"#339900"],
    [5, 3,.53,"#CCCCCC"],
    [2.5, 3,.45,"#666"],
    [1.25, 2,.25,"#000"]
]

const bigPlates = [
    [50, 6,.9,"#00ff00"],
    ...normalPlates
];

/**
 * Draws a line form x,y to tx,ty and mirrors it to the other half of the canvas using the center X as pivot.
 * @param {CanvasRenderingContext2D} ctx 
 * @param {canvasMetrics} metrics 
 */
const drawLine = (ctx, metrics, x,y,tx,ty)=>{
    var path = new Path2D();
        path.moveTo(x, y);
        path.lineTo(tx, ty); 
        path.closePath();

        ctx.stroke(path);

        // Mirror the path
        ctx.save(); // Save the current transformation matrix
        ctx.translate(metrics.halfW, metrics.halfH); // Translate to the pivot point
        ctx.scale(-1, 1); // Scale on the x-axis to mirror
        ctx.translate(-metrics.halfW, -metrics.halfH); // Translate back to the original position
        ctx.stroke(path); // Stroke the mirrored path
        ctx.restore(); // Restore the previous transformation matrix
} 

/**
 * Draws a plate
 * @param {CanvasRenderingContext2D} ctx 
 * @param {canvasMetrics} metrics 
 * @param {Array<any>} info 
 * @param {number} scale scale to apply to the width of the plate
 */
const plate = (ctx, metrics, info, scale) => {

    const width = info[1] * scale;
    const plateW = width+.5;
    const halfW = plateW/2;

    const x = metrics.plateX - halfW ;
    const T = metrics.H*info[2];

    ctx.lineWidth = width;   

    const gradient = ctx.createLinearGradient(x-3, metrics.halfH, x+6, metrics.halfH+8);
    gradient.addColorStop(0, info[3]); 
    gradient.addColorStop(1, "black");
    ctx.strokeStyle = gradient; //info[2];

    drawLine(ctx, metrics, x, (metrics.H-T)/2, x, metrics.H - (metrics.H-T)/2);
     
    return x - halfW;
}

/**
 * Draws plates on the canvas representing `w`
 * @param {CanvasRenderingContext2D} ctx 
 * @param {canvasMetrics} metrics 
 * @param {number} w 
 * @returns 
 */
const drawPlatesForWeight = (ctx, metrics, w, customBarColor ) => {

    const plates = w>=400? bigPlates : normalPlates;

    ctx.clearRect(0,0,metrics.W,metrics.H);

    // background color of the bar
    const   gradient = ctx.createLinearGradient(0, metrics.halfH-2, 0, metrics.halfH+2);
            gradient.addColorStop(0, "#ccc");  
            gradient.addColorStop(1, "#aaa");

    //#region bar
    ctx.strokeStyle = customBarColor ?? gradient; 
    ctx.lineWidth = 3;  

    drawLine(ctx, metrics, 0,metrics.halfH, metrics.halfW, metrics.halfH);//bar

    ctx.lineWidth = 6;
    drawLine(ctx, metrics, metrics.barStart, metrics.halfH-4, metrics.barStart, metrics.halfH+4);//bar
    //#endregion

    w -= 20; //bar

    if(w<0) 
    {  
        return false;
    } 
 
    
    let platesToDraw = [];

    plates.forEach( p => 
        {
        const plateW = p[0];
        let pw = plateW * 2; //one each side...
        let t = Math.floor( w / pw ); 

        if( t>0 )
        {
            for (let i = 0; i < t; i++) 
            { 
                platesToDraw.push(p);
            }
        } 

        w -= pw*t; 
    }) 


    // drawplates but modify width to make sure we fit in...
    const availSpace = metrics.plateX*.9;
    const platesWidth = platesToDraw.reduce( (t, p)=>t+p[1], 0 );
    let scale = 1;

    if( platesWidth>availSpace )
    {
        scale = availSpace / platesWidth; 
    }

    //draw
    platesToDraw.forEach(p=>{
        metrics.plateX = plate(ctx, metrics, p, scale);
    });

}

/**
 * @typedef {Object} canvasMetrics
 * @property {number} H height
 * @property {number} W width
 * @property {number} halfH H/2
 * @property {number} halfW W/2
 * @property {number} barStart position at which the portion available for plates ends.
 * @property {number} plateX current position to start putting plates
 */


export function CanvasBar({ weight, reps, FallbackTo }) {

    const ref = useRef(); 
    const [fallback, setFallback] = useState(false);
    const theme = useTheme();

    useLayoutEffect(()=>{  

        const isDarkMode = theme.palette.type=='dark';
        
        /**
         * @type {CanvasRenderingContext2D}
         */
        const ctx = ref.current?.getContext("2d");

        if( !ctx )
        {
            setFallback(true);
            return; 
        }

        

        /**
         * @type {canvasMetrics}
         */
        const metrics = {
            H: ref.current.height,
            W: ref.current.width,
            halfH: ref.current.height/2,
            halfW: ref.current.width/2,
            barStart: ref.current.width/2 * .65,  
        }

        metrics.plateX = metrics.barStart;  

        drawPlatesForWeight(ctx, metrics, weight, isDarkMode? "#666" : reps===0? "#f00" : null );

        //#region Reps Label
        const lbl = reps===0? ":(" : reps>1? "x"+reps.toString() : null;
        if( lbl )
        {
            ctx.textAlign = "center"; 
            //halfW
            ctx.font = "bold 15px arial";
            ctx.textBaseline = "middle";
  
            ctx.strokeStyle = "rgb(255 255 255 / 90%)"
            ctx.strokeText(lbl, metrics.halfW, metrics.halfH);

            ctx.fillStyle = "rgb(0 0 0)"
            ctx.fillText( lbl, metrics.halfW, metrics.halfH);  
        } 
        //#endregion 


    }, [weight, reps, theme.palette.type]); 

    if( fallback )
    {
        return <FallbackTo weight={weight} reps={reps}/>
    }

    return <canvas width="138" height="25" ref={ref} style={{maxWidth:"100%", opacity:!weight || weight<20?0.3:1}}></canvas>;
}