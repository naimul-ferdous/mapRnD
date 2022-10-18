import React, { useEffect, useRef, useState } from 'react';
import './index.css';

var Marker = function () {
    this.Sprite = new Image();
    this.Sprite.src = "http://www.clker.com/cliparts/w/O/e/P/x/i/map-marker-hi.png"
    this.Width = 12;
    this.Height = 20;
    this.XPos = 0;
    this.YPos = 0;
}

// var Markers = new Array();


const MyMap = () => {
    const canvasRef = useRef(null);
    const [movXAmount, setMovXAmount] = useState(0);
    const [moveYAmount, setMoveYAmount] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [prevX, setPrevX] = useState(0);
    const [prevY, setPrevY] = useState(0);

    const [markersArray, setMarkersArray] = useState([]);

    const [mapImage, setMapImage] = useState(null);
    const mapImageRef = useRef(mapImage);


    useEffect(() => {
        buildcanvas();
    }, [markersArray.length]);

    const buildcanvas = () => {
        var canvas = canvasRef;
        var context = canvas.current.getContext("2d");
        var img = new Image();
        img.src = "https://i.pinimg.com/originals/bd/a5/be/bda5be61177acdb5fd46c3219f8b81a0.jpg";
        img.ref = mapImageRef;
        img.onload = function () {
            var im_width = parseInt(img.width);
            var im_height = parseInt(img.height);
            setMapImage(img);
            // context.drawImage(img, -600 / 2 + movXAmount, -600 / 2 + moveYAmount, im_width, im_height);
            context.drawImage(img, movXAmount, moveYAmount, im_width, im_height);
        };
    };

    useEffect(() => {
        drawMarkers();
    })
    

    const drawMarkers=()=> {
        //draw markers
        // Draw markers

        var canvas = canvasRef;
        var context = canvas.current.getContext("2d");
        for (var i = 0; i < markersArray.length; i++) {
            var tempMarker = markersArray[i];
            // Draw marker
            context.drawImage(tempMarker.Sprite, tempMarker.XPos+movXAmount, tempMarker.YPos+moveYAmount, tempMarker.Width, tempMarker.Height);

            // Calculate postion text
            var markerText = "Postion (X:" + (tempMarker.XPos+movXAmount) + ", Y:" + (tempMarker.YPos+moveYAmount);

            // Draw a simple box so you can see the position
            var textMeasurements = context.measureText(markerText);
            context.fillStyle = "#666";
            context.globalAlpha = 0.7;
            context.fillRect(tempMarker.XPos - (textMeasurements.width / 2)+movXAmount, tempMarker.YPos - 15+ moveYAmount, textMeasurements.width, 20);
            context.globalAlpha = 1;

            // Draw position above
            context.fillStyle = "#000";
            context.fillText(markerText, tempMarker.XPos+movXAmount, tempMarker.YPos+moveYAmount);
        }
    }



    const handleMouseDown = () => {
        setIsDragging(true);
        setPrevX(0);
        setPrevY(0);
        console.log("mouse downed", isDragging);
    };

    const handleMouseUp = () => {
        console.log("Mouse uped");
        setIsDragging(false);
        setPrevX(0);
        setPrevY(0);
    };

    const handleMouseMove = (event) => {

        console.log("mouse is moving", isDragging);
        console.log("event page X", event.pageX);
        console.log("previous X", prevX);
        console.log(movXAmount);
        console.log(moveYAmount);
        if (isDragging == true) {
            console.log("is dragging");
            if (prevX > 0 || prevY > 0) {
                console.log("prevoius X check", prevX);
                setMovXAmount(movXAmount + event.pageX - prevX);
                setMoveYAmount(moveYAmount + event.pageY - prevY);
                buildcanvas();
                drawMarkers();
            }

            setPrevX(event.pageX);
            setPrevY(event.pageY);
        }
    };

    // useEffect(() => {
    //     window.onmouseup = handleMouseUp;
    // }, []);

    // useEffect(() => {
    //     window.onmousemove = handleMouseMove;
    // }, []);

    const handleOnCanvasClick = (mouse) => {
        // canvasRef.current.getContext("2d").getImageData()

        var canvas = mouse.target;

        // Get corrent mouse coords
        var rect = canvas.getBoundingClientRect();

        console.log("clicked on", mouse.pageX);

        var mouseXPos = (mouse.pageX - rect.left)+ movXAmount;
        var mouseYPos = (mouse.pageY - rect.top)+ moveYAmount;

        console.log("Marker added, (x,y)=", mouseXPos, mouseYPos);

        // Move the marker when placed to a better location
        var marker = new Marker();
        marker.XPos = mouseXPos - (marker.Width / 2);
        marker.YPos = mouseYPos - marker.Height;

        // Markers.push(marker);
        setMarkersArray([...markersArray, marker])
    }

    console.log("Markers length", markersArray.length);

    return (
        <canvas ref={canvasRef} id="canvas" onClick={handleOnCanvasClick} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} width="600" height="600">
            Your browser does not support HTML5 Canvas
        </canvas>
    );
}

export default MyMap