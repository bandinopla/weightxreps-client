import { useEffect, useState, useRef } from "react";

export function Draggable({ children, zIndex, disabled }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef();

  const handleMouseDown = (e) => {
    if (disabled) return;
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (disabled || !dragging) return;

    const newPos = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    };

    if (
      e.clientX < 0 ||
      e.clientY < 0 ||
      e.clientX > window.innerWidth ||
      e.clientY > window.innerHeight
    ) {
      stopDragging();
    } else {
      setPosition(newPos);
    }
  };

  const stopDragging = () => setDragging(false);

  useEffect(() => {
    const div = ref.current;
    if (!div) return;

    div.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopDragging);

    return () => {
      div.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopDragging);
    };
  }, [dragging, offset, disabled]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        zIndex: zIndex ?? 9999,
        cursor: disabled ? "default" : "move",
      }}
    >
      {children}
    </div>
  );
}
