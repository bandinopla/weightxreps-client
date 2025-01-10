import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';



const GoalPlannerCanvas = forwardRef(({ width = 400, height = 400, plannedPoints, resolution = 12, externalPoints = [], cursor, canvasStyles}, ref) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState(plannedPoints ?? Array.from({ length: resolution }, (_, i) => (i === resolution - 1 ? 1 : 0)));

  useImperativeHandle(ref, () => points);

  useEffect(() => {
    drawChart();
  }, [points, externalPoints, width, height]);


  const handlePointerEvent = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    let x = e.clientX !== undefined ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
    let y = e.clientY !== undefined ? e.clientY - rect.top : e.touches[0].clientY - rect.top;

    x = x * scaleX / canvasRef.current.width;
    y = 1 - y * scaleY / canvasRef.current.height;

    x = Math.min(Math.max(x, 0), 1);
    y = Math.min(Math.max(y, 0), 1);

    switch (e.type) {
      case 'pointerdown':
        handleMouseDown(x, y);
        break;
      case 'pointermove':
        handleMouseMove(x, y);
        break;
      case 'pointerup':
      case 'pointerleave':
        handleMouseUp(x, y);
        break;
      default:
        break;
    }
  };

 
  // const getMousePosition = (e) => {
  //   const rect = canvasRef.current.getBoundingClientRect();
  //   const scaleX = canvasRef.current.width / rect.width;
  //   const scaleY = canvasRef.current.height / rect.height;
  
  //   const x = (e.clientX - rect.left) * scaleX / canvasRef.current.width;
  //   const y = 1 - (e.clientY - rect.top) * scaleY / canvasRef.current.height;
  
  //   return { x: Math.min(Math.max(x, 0), 1), y: Math.min(Math.max(y, 0), 1) };
  // };

  const handleMouseDown = (x, y) => {
    if( plannedPoints ) return;
    setIsDrawing(true);
    handleMouseMove(x,y);
  };

  const handleMouseMove = (x,y) => {
    if (!isDrawing) return; 
    const index = Math.floor(x * resolution);
    setPoints((prevPoints) => {
      const updatedPoints = [...prevPoints];
      if( index<resolution-1 )
        updatedPoints[index] = y;
      // Linear interpolation to the end
      for (let i = index + 1; i < resolution ; i++) {
        const t = (i - index) / (resolution - index - 1);
        updatedPoints[i] = y + (updatedPoints[resolution - 1] - y) * t;
      }
      return updatedPoints;
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  

  const drawChart = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const _resolution = plannedPoints?.length ?? resolution;

    function drawFilledCircle(x, y, radius, color) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2); // Full circle
      ctx.fillStyle = color; // Set fill color
      ctx.fill(); // Fill the circle
      ctx.closePath();
    }

    ctx.clearRect(0, 0, width, height);

    // mark the start "intensity" of the planned progression
    // ctx.beginPath();
    // ctx.setLineDash([]);
    // drawFilledCircle(0, height * (1 - points[0]), 2, "blue");
    // ctx.stroke();  
 
    ctx.strokeStyle = 'blue';
    ctx.setLineDash([3, 1]); 
    ctx.moveTo(0, height * (1 - points[0]));

    //
    // planned intensity progression line....
    //
    for (let i = 0; i < _resolution ; i++) {
        const x = (i / (_resolution -1)) * width  ;
        const y = height * (1 - points[i]);
        ctx.lineTo(x, y);
    }
    
    ctx.stroke();


    //
    // current cursor location
    //
    if( cursor )
    { 
      ctx.strokeStyle = 'blue';
      // vertical line to visually see the current position
      ctx.beginPath();
      ctx.setLineDash([]);
      
      ctx.lineWidth = 1; 

      const x = (cursor / (_resolution - 1)) * width; 

      ctx.moveTo(x,0);
      ctx.lineTo(x, height);
      ctx.stroke();
    } 

    //
    // Draw the actual intensity done by the user... (because things might not go as planned...)
    //
    if (externalPoints?.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.setLineDash([]); 
      for (let i = 0; i < externalPoints.length; i++) {

        if(!externalPoints[i]) {
          if( i==0 ) {
            ctx.moveTo(0,height);
          }
          continue;
        }

        const x = (i / (_resolution - 1)) * width;
        const y = height * (1 - externalPoints[i]);
        if( i==0 )
            ctx.moveTo(x, y);
            else
        ctx.lineTo(x, y);
 
      }
      ctx.stroke();
 
      // draw a point in every workout
      for (let i = 0; i < externalPoints.length; i++){
        const x = (i / (_resolution - 1)) * width;
        const y = height * (1 - externalPoints[i]);
        if( !externalPoints[i] ) continue;
        drawFilledCircle(x, y,2, "red");
        drawFilledCircle(x, y,1, "white");
      }
      ctx.stroke();


    }

    //
    // reference lines to see the days on the X axis
    //
    for (let i = 0; i < _resolution ; i++) {
      const x = (i / (_resolution -1)) * width  ;
      const y = height ;
      const hasValue = externalPoints?.[i]>0;
      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.strokeStyle = hasValue?'black':'#ccc';
      ctx.lineWidth = hasValue ? 3 : 1; 
      ctx.moveTo(x, y-3);
      ctx.lineTo(x, y);

      if( i%7==0) {
        ctx.setLineDash([1,2]); 
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1; 
        ctx.moveTo(x, 0);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    } 
  };

  return (<> 
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handlePointerEvent}
      onMouseMove={handlePointerEvent}
      onMouseUp={handlePointerEvent}
      onMouseLeave={handlePointerEvent}

      onPointerDown={handlePointerEvent}
      onPointerMove={handlePointerEvent}
      onPointerUp={handlePointerEvent}
      onPointerLeave={handlePointerEvent}

      style={{ border: '1px dotted #444', background:"#fff", touchAction: 'none', ...canvasStyles}}
    /> 
    </>
  );
});

export default GoalPlannerCanvas;
