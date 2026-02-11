function parseRatio(ratio) {
    if (!ratio) return null;

    const parts = ratio.trim().split(':');
    if (parts.length !== 2) return;

    const h = parseFloat(parts[0]);
    const v = parseFloat(parts[1]);
    
    if(isNaN(h) || isNaN(v) || h <= 0 || v <= 0) return;

    return { h, v };
}

function getDistance(distance, unit) {
    if (!distance || isNaN(distance)) return;
    
    return unit === 'inch' ? distance * INCH_TO_CM : distance;
}

function calculateFOV() {
    const form = getForm();
    const ratio = parseRatio(form.ratio);
    const distance = getDistance(form.distance, form.distanceUnit);
    
    const fov = FOV.calculate({
        ratio,
        size: form.size,
        distance,
        screens: form.screens,
        curved: form.curved,
        radius: form.radius / 10,
        bezel: form.bezel / 10,
    });

    updateForm(form);
    updateResults(fov);
    updateDraw({
        ratio,
        size: form.size,
        width: fov.width, 
        height: fov.height,
        horizontal: fov.horizontal, 
        vertical: fov.vertical,
        screenAmount: form.screens,
        tripleScreenAngle: fov.angle,
        curvedScreenRadius: form.curved ? form.radius / 10 : undefined,
        distance: distance,
        unit: form.distanceUnit,
        carType: CARS[form.car],
    });
}

function getForm() {
    return {
        ratio: document.querySelector('input[name="screenRatio"]:checked').value,
        size: parseFloat(document.getElementById('screenSize').value),
        distanceUnit: document.getElementById('distanceUnit').value,
        distance: parseFloat(document.getElementById('distance').value),
        screens: parseInt(document.querySelector('input[name="screenType"]:checked').value),
        curved: parseInt(document.getElementById('curvedScreenRadius').value) >= 500,
        radius: parseInt(document.getElementById('curvedScreenRadius').value),
        bezel: parseInt(document.getElementById('bezelThickness').value),
        car: document.querySelector('input[name="carType"]:checked').value,
    };
}

function updateForm(form) {
    document.getElementById('screenSizeOutput').textContent = form.size.toFixed(1);
    document.getElementById('distanceOutput').textContent = form.distance;
    document.getElementById('curvedScreenRadiusOutput').textContent = form.radius;
    document.getElementById('bezelThicknessOutput').textContent = form.bezel;

    document.getElementById('curvedScreenRadiusOutput').style = `display: ${form.radius >= 500 ? 'inline' : 'none'};`;
    document.getElementById('curvedScreenRadiusOutputFlat').style = `display: ${form.radius < 500 ? 'inline' : 'none'};`;        
}

function gameHtml(label, value) {
    const divContainer = document.createElement('div');
    divContainer.className = 'result-item';

    const divLabel = document.createElement('div');
    divLabel.className = 'result-label';
    divLabel.textContent = label;
    
    const divValue = document.createElement('div');
    divValue.className = 'result-value';
    divValue.textContent = value;

    divContainer.appendChild(divLabel);
    divContainer.appendChild(divValue);
    return divContainer;
}

function updateResults(fov) {
    const voidSimbol = '∞';
    document.getElementById('horizontalFOV').textContent = isNaN(fov.horizontal) ? voidSimbol: Math.round(fov.horizontal) + '°';
    document.getElementById('verticalFOV').textContent = isNaN(fov.vertical) ? voidSimbol: Math.round(fov.vertical) + '°';
    document.getElementById('tripleScreenAngle').textContent =  isNaN(fov.angle) ? voidSimbol: fov.angle.toFixed(2) + '°';


    const horizontalGamesDiv = document.getElementById('horizontal-games');
    horizontalGamesDiv.innerHTML = '';
    GAMES.horizontal.forEach(game => {
        const value = isNaN(fov.horizontal) ? voidSimbol : fovValue(game.type, fov.horizontal, game.factor ?? 1, game.digits ?? 1) + (game.unit ?? '');
        horizontalGamesDiv.appendChild(gameHtml(game.name, value));
    });

    const verticalGamesDiv = document.getElementById('vertical-games');
    verticalGamesDiv.innerHTML = '';
    GAMES.vertical.forEach(game => {
        const value = isNaN(fov.vertical) ? voidSimbol : fovValue(game.type, fov.vertical, game.factor ?? 1, game.digits ?? 1) + (game.unit ?? '');
        verticalGamesDiv.appendChild(gameHtml(game.name, value));
    });
}

function fovValue(type, fov, factor, digits) {
    switch(type){
        case 'divider':
            return fovDivider(fov, factor, digits);
        case 'radian':
            return fovRadian(fov, factor, digits);
        case 'dirt':
            return fovDirt(fov, factor, digits);
        case 'f1':
            return fovF1(fov, factor, digits);
        default:
            return fovMultiplier(fov, factor, digits);
    }
}

const fovMultiplier = (fov, factor, digits) => (fov * factor).toFixed(digits);
const fovDivider = (fov, factor, digits) => (fov / factor).toFixed(digits);
const fovRadian = (fov, factor, digits) => ((fov / 180 * Math.PI) * factor).toFixed(digits);
const fovDirt = (fov, factor, digits) => Math.ceil(((fov - 30) / 5) * factor).toFixed(digits);
const fovF1 = (fov, factor, digits) => ((fov - 77) / 2 * factor).toFixed(digits);

function toggleBezel() {
    const isTriple = document.getElementById('tripleScreen').checked;
    document.getElementById('bezelGroup').classList.toggle('hidden', !isTriple);
}

function convertDistanceUnit() {
    const distanceInput = document.getElementById('distance');
    const unitSelect = document.getElementById('distanceUnit');
    
    const currentValue = parseFloat(distanceInput.value);
    if (!currentValue || isNaN(currentValue)) return;
    
    const newUnit = unitSelect.value;
    let convertedValue;
    
    if (newUnit === 'inch') {
        convertedValue = currentValue / INCH_TO_CM;
        distanceInput.min = 10;
        distanceInput.max = 80;
    } else {
        distanceInput.min = 25;
        distanceInput.max = 200;
        convertedValue = currentValue * INCH_TO_CM;
    }
    
    distanceInput.value = Math.round(convertedValue);
    calculateFOV();
}

function increase(id) {
    const range = document.getElementById(id);
    range.value = parseFloat(range.value) + parseFloat(range.step ?? 1);

    const event = new Event('input', { bubbles: true });
    range.dispatchEvent(event);
}

function decrease(id) {
    const range = document.getElementById(id);
    range.value = parseFloat(range.value) - parseFloat(range.step ?? 1);

    const event = new Event('input', { bubbles: true });
    range.dispatchEvent(event);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[name="screenRatio"]').forEach(radio => {
        radio.addEventListener('change', calculateFOV);
    });
    document.querySelectorAll('input[name="screenType"]').forEach(radio => {
        radio.addEventListener('change', toggleBezel);
        radio.addEventListener('change', calculateFOV);
    });
    document.querySelectorAll('input[name="carType"]').forEach(radio => {
        radio.addEventListener('change', calculateFOV);
    });

    document.getElementById('distanceUnit').addEventListener('change', convertDistanceUnit);

    document.getElementById('screenSize').addEventListener('input', calculateFOV);
    document.getElementById('distance').addEventListener('input', calculateFOV);
    document.getElementById('curvedScreenRadius').addEventListener('input', calculateFOV);
    document.getElementById('bezelThickness').addEventListener('input', calculateFOV);

    calculateFOV();
});
