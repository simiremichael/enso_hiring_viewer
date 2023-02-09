import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { SineWave } from 'components';

const Container = styled.div`
    position: relative;
`;

// The Overlay is a div that lies on top of the chart to capture mouse events
const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    z-index: 10;
    
`;

// The chart canvas will be the same height/width as the ChartWrapper
// https://www.chartjs.org/docs/3.2.1/configuration/responsive.html#important-note
 const ChartWrapper = styled.div``;

// const SignalView = () => {
//     // Access the height of the chart as chartWrapperRef.current?.clientHeight to determine the height to set on events
//     const chartWrapperRef = useRef();


//   const [divs, setDivs] = useState([]);

//   const handleClick = () => {
//     setDivs([...divs, <ChildDiv key={divs.length} />]);
//   };
  


const ParentDiv = () => {
  const [divs, setDivs] = useState([]);

  const handleClick = () => {
    setDivs([...divs, { id: divs.length, x: 0, y: 0 }]);
  };

  useEffect(() => {
    localStorage.setItem("divs", JSON.stringify(divs));
  }, [divs]);

  return (
    <div onClick={handleClick} style={{ width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap'}}>
      {divs.map(div => (
        <ChildDiv
          key={div.id}
          id={div.id}
          x={div.x}
          y={div.y}
          onUpdateDiv={updatedDiv =>
            setDivs(
              divs.map(div =>
                div.id === updatedDiv.id ? updatedDiv : div
              )
            )
          }
        />
      ))}
    </div>
  );
};

const ChildDiv = ({ id, x, y, onUpdateDiv }) => {
  const [dragging, setDragging] = useState(false);
  const [currentX, setCurrentX] = useState(x);
  const [currentY, setCurrentY] = useState(y);
  const [initialX, setInitialX] = useState(0);
  const [initialY, setInitialY] = useState(0);

  const handleMouseDown = e => {
    setInitialX(e.clientX - currentX);
    setInitialY(e.clientY - currentY);
    setDragging(true);
  };

  const handleMouseUp = () => {
    setDragging(false);
    onUpdateDiv({ id: id, x: currentX, y: currentY });
  };

  const handleMouseMove = e => {
    if (dragging) {
      setCurrentX(e.clientX - initialX);
      setCurrentY(e.clientY - initialY);
    }
  };

  return (
    <div
      style={{
        height: "30px",
        width: "120px",
        transition: "width 3s",
        overflow: "hidden",
        backgroundColor: "lightblue",
        position: "relative",
        left: currentX + "px",
        top: currentY + "px",
        userSelect: "none",
        margin: '5px'
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    />
  );
};

const SignalView  = () => {
  const [divs, setDivs] = useState([]);

  useEffect(() => {
    const storedDivs = localStorage.getItem("divs");
    if (storedDivs) {
      setDivs(JSON.parse(storedDivs));
    }
  }, []);

  return (
    <Container>
             <ChartWrapper>
                 <SineWave samplingRate={50} lowerBound={0} upperBound={10}/>
            </ChartWrapper>
            {/* The overlay covers the same exact area the sine wave chart does */}
           <Overlay>
           
      <ParentDiv />
      {divs.map(div => (
        <ChildDiv
        key={div.id}
        id={div.id}
        x={div.x}
        y={div.y}
        onUpdateDiv={updatedDiv =>
          setDivs(
            divs.map(div =>
              div.id === updatedDiv.id ? updatedDiv : div
            )
          )
        }
      />
    ))}

           </Overlay>
        </Container>
);
    }
export default SignalView;

