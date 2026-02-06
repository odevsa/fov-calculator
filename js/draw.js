const canvas = document.getElementById('draw');
const ctx = canvas.getContext('2d');

const SETTINGS = {
    user: 'rgb(0, 0, 255)',
    screen: 'rgb(0, 255, 0)',
    fovBackground: 'rgba(150, 150, 150, 0.2)',
    fovLines: 'rgb(150, 150, 150)',
    fovLinesThickness: 3,
    screenThickness: 5,
    fontSize: 22,
};

const SCALE = 4;

function updateDraw(params) {
    const { horizontal, vertical, tripleScreenAngle, screenAmount, screenCurveRadius, distance } = params;    
    const halfWidth = canvas.width / 2;
    const halfHeight = canvas.height / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawView(
        'Horizontal FOV', 
        halfWidth, 
        halfHeight - 20, 
        horizontal, 
        distance, 
        screenAmount, 
        tripleScreenAngle, 
        screenCurveRadius,
        true
    );

    drawView(
        'Vertical FOV', 
        halfWidth, 
        canvas.height * 0.75, 
        vertical, 
        distance, 
        1,
        0,
        undefined,
        false
    );
}

function drawView(label, centerX, centerY, fov, dist, amount, angle, radius, isTopView) {
    const d = dist * SCALE;
    const r = radius ? radius * SCALE : null;
    
    ctx.save();
    ctx.translate(centerX, centerY);

    if (!isTopView) {
        ctx.rotate(-Math.PI / 2);
    }

    ctx.fillStyle = '#FFF';
    ctx.font = `${SETTINGS.fontSize}px Arial`;
    
    ctx.save();
    if (isTopView) {
        ctx.fillText(label, -canvas.width / 2 + 20, -canvas.height / 2 + 55);
    } else {
        ctx.rotate(Math.PI / 2);
        ctx.fillText(label, -canvas.width / 2 + 20, -canvas.height / 4 + 20);
    }
    ctx.restore();

    drawFOV(fov, d);
    drawScreens(amount, angle, d, r, fov, isTopView);
    drawUser();
    ctx.restore();
}

function drawUser() {
    ctx.fillStyle = SETTINGS.user;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
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

function drawScreens(amount, sideAngle, d, r, fov, isTopView) {
    ctx.strokeStyle = SETTINGS.screen;
    ctx.lineWidth = SETTINGS.screenThickness;

    if (amount === 3 && isTopView) {
        const radCenter = ((fov / 3) * Math.PI) / 180;
        const screenWidth = 2 * d * Math.tan(radCenter / 2);
        const halfW = screenWidth / 2;
        const sideRad = (sideAngle * Math.PI) / 180;

        drawScreenSegment(0, -d, screenWidth, r);

        ctx.save();
        ctx.translate(-halfW, -d);
        ctx.rotate(-sideRad);
        drawScreenSegment(-halfW, 0, screenWidth, r);
        ctx.restore();

        ctx.save();
        ctx.translate(halfW, -d);
        ctx.rotate(sideRad);
        drawScreenSegment(halfW, 0, screenWidth, r);
        ctx.restore();
    } else {
        const rad = (fov * Math.PI) / 180;
        const screenWidth = 2 * d * Math.tan(rad / 2);
        drawScreenSegment(0, -d, screenWidth, r);
    }
}

function drawScreenSegment(xCenter, yCenter, width, r) {
    const halfW = width / 2;
    ctx.beginPath();

    if (r && r > halfW) {
        const theta = Math.asin(halfW / r);
        const startAngle = -Math.PI / 2 - theta;
        const endAngle = -Math.PI / 2 + theta;
        ctx.arc(xCenter, yCenter + r, r, startAngle, endAngle);
    } else {
        ctx.moveTo(xCenter - halfW, yCenter);
        ctx.lineTo(xCenter + halfW, yCenter);
    }
    ctx.stroke();
}