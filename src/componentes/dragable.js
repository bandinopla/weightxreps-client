import { useEffect, useState, useRef } from "react";



export function Draggable({ children, zIndex, disabled }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef();

  function stopDragging() {
    setDragging(false);
  }

  useEffect(()=>{

    let div = ref.current;
 
    
    div.addEventListener("mousedown", handleMouseDown); 
    div.addEventListener("mouseup", handleMouseUp);

    document.body.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mousedown", cancelDrag);


    return ()=>{ 
        div.removeEventListener("mousedown", handleMouseDown);
        document.body.removeEventListener("mousemove", handleMouseMove);
        document.body.removeEventListener("mousedown", cancelDrag);
        div.removeEventListener("mouseup", handleMouseUp);
    }

  },[dragging, offset, disabled])

  const cancelDrag = ()=>dragging && setDragging(false)

  const handleMouseDown = (e) => { 

    if( disabled ) return;
     
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => { 

    if( disabled ) return;
     
    if (dragging) { 

      const newPos = {
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      }

      if (
        e.clientX < 0 ||
        e.clientY < 0 ||
        e.clientY > window.innerHeight ||
        e.clientY > window.innerWidth
      )
      {
        setDragging(false);
      }
      else 
      {
        setPosition(newPos);
      }

      
    }
  };

  const handleMouseUp = () => setDragging(false);

  return (
    <div
      ref={ref} 
      style={{
        position: "absolute",
        left: position.x,
        top: position.y, 
        zIndex: zIndex ?? 9999
      }}
    >{children}</div>
  );
}
 
