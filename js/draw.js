const canvas = document.getElementById('draw');
const ctx = canvas.getContext('2d');

const SETTINGS = {
    debug: false,
    debugColor: 'rgba(255, 0, 0, 0.15)',
    userColor: 'rgb(144, 237, 90)',
    userRadius: 20,
    screenThickness: 5,
    screenColor: 'rgb(0, 255, 0)',
    fovBackground: 'rgba(0, 255, 0, 0.25)',
    fovLines: 'rgb(150, 150, 150)',
    fovLinesThickness: 3,
    fontSize: 22,
    carOpacity: 0.75,
};

function updateDraw(params) {
    const { horizontal, vertical, tripleScreenAngle, screenAmount, screenCurveRadius, distance, carType } = params;    
    const car = carPosition(carType);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if(carType) drawCar(carType.image);

    drawView(
        'Horizontal FOV',
        {
            x: car.x + (carType.offset.horizontal.x * carType.scale),
            y: car.topY - (carType.offset.horizontal.y * carType.scale)
        },
        { x: 10, y: 30 }, 
        horizontal, 
        distance, 
        screenAmount, 
        tripleScreenAngle, 
        screenCurveRadius,
        carType.scale,
        -Math.PI / 2
    );
    
    drawView(
        'Vertical FOV', 
        {
            x: car.x + (carType.offset.vertical.x * carType.scale),
            y: car.bottomY - (carType.offset.vertical.y * carType.scale)
        },
        { x: 10, y: canvas.height /2 + 30 }, 
        vertical, 
        distance, 
        1,
        0,
        undefined,
        carType.scale,
        -Math.PI / 2
    );

    if(SETTINGS.debug) {
        console.log(carType);
        drawCarBox(car);
    }
}

function drawView(label, centerPos, labelPos, fov, dist, amount, angle, radius, scale, rotation) {
    const d = dist * scale;
    const r = radius ? radius * scale : null;
    
    ctx.save();
    ctx.fillStyle = '#FFF';
    ctx.font = `${SETTINGS.fontSize}px Arial`;
    ctx.fillText(label, labelPos.x, labelPos.y);
    ctx.restore();


    ctx.save();
    ctx.translate(centerPos.x, centerPos.y);
    if (rotation) ctx.rotate(rotation);
    
    drawFOV(fov, d);
    drawScreens(amount, angle, d, r, fov, scale);
    drawUserPosition();
    ctx.restore();
}


function drawCar(src) {
    const carImg = new Image();
    carImg.src = src;
    carImg.onload = () => {
        const imgWidth = carImg.naturalWidth;
        const imgHeight = carImg.naturalHeight;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
        
        const x = (canvasWidth - imgWidth * scale) / 2;
        const y = (canvasHeight - imgHeight * scale) / 2;

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); 
        ctx.globalAlpha = SETTINGS.carOpacity;
        ctx.globalCompositeOperation = 'destination-over';
        ctx.drawImage(carImg, x, y, imgWidth * scale, imgHeight * scale);
        ctx.restore();        
    };
}


function drawFOV(fov, d) {
    const rad = (fov * Math.PI) / 180;
    const halfFov = rad / 2;
    const x = d * Math.tan(halfFov);

    ctx.fillStyle = SETTINGS.fovBackground;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-x, -d);
    ctx.lineTo(x, -d);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = SETTINGS.fovLines;
    ctx.lineWidth = SETTINGS.fovLinesThickness;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-x, -d);
    ctx.moveTo(0, 0);
    ctx.lineTo(x, -d);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawScreens(amount, sideAngle, d, r, fov, scale) {
    ctx.strokeStyle = SETTINGS.screenColor;
    ctx.lineWidth = SETTINGS.screenThickness;
    
    if (amount === 3) {
        const radCenter = ((fov / 3) * Math.PI) / 180;
        const screenWidth = 2 * d * Math.tan(radCenter / 2);
        const halfWidth = screenWidth / 2;
        const sideRad = (sideAngle * Math.PI) / 180;
        
        drawScreenSegment(0, -d, screenWidth, r);
        
        ctx.save();
        ctx.translate(-halfWidth, -d);
        ctx.rotate(-sideRad);
        drawScreenSegment(-halfWidth, 0, screenWidth, r);
        ctx.restore();
        
        ctx.save();
        ctx.translate(halfWidth, -d);
        ctx.rotate(sideRad);
        drawScreenSegment(halfWidth, 0, screenWidth, r);
        ctx.restore();
    } else {
        const rad = (fov * Math.PI) / 180;
        const screenWidth = 2 * d * Math.tan(rad / 2);
        drawScreenSegment(0, -d, screenWidth, r);
        
        if(SETTINGS.debug)
            console.log('Screen Size', screenWidth / scale)
    }
}

function drawScreenSegment(xCenter, yCenter, width, r) {
    const halfWidth = width / 2;
    ctx.beginPath();

    if (r && r > halfWidth) {
        const theta = Math.asin(halfWidth / r);
        const startAngle = -Math.PI / 2 - theta;
        const endAngle = -Math.PI / 2 + theta;
        ctx.arc(xCenter, yCenter + r, r, startAngle, endAngle);
    } else {
        ctx.moveTo(xCenter - halfWidth, yCenter);
        ctx.lineTo(xCenter + halfWidth, yCenter);
    }
    ctx.stroke();
}

function drawUserPosition() {
    ctx.fillStyle = SETTINGS.userColor;
    ctx.beginPath();
    ctx.arc(0, 0, SETTINGS.userRadius, 0, Math.PI * 2);
    ctx.fill();
}

function drawCarBox(carPosition) {
    ctx.fillStyle = SETTINGS.debugColor;
    ctx.fillRect(carPosition.x, carPosition.topY - carPosition.width, carPosition.length, carPosition.width);
    ctx.fillRect(carPosition.x, carPosition.bottomY - carPosition.height, carPosition.length, carPosition.height);
}

function carPosition(carType) {
    const width = carType.car.width * carType.scale;
    const height = carType.car.height * carType.scale;
    const length = carType.car.length * carType.scale;
    return {
        x: (canvas.width - length) / 2,
        topY: (canvas.height * 0.25) + (width / 2),
        bottomY: canvas.height * 0.75 + (height / 2),
        width,
        height,
        length,
    }
}