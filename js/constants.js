const LOCALES = ['en','pt-BR','es','fr','de','it','ja','zh-CN','ru','ko'];

const INCH_TO_CM = 2.54;

const GAMES = {
    horizontal: [
        { name: 'Euro Truck Simulator', factor: 1, digits: 0, unit: '°' },
        { name: 'RaceRoom Racing Experience', factor: 1, digits: 1, unit: '°' },
    ],
    vertical: [
        { name: 'Assetto Corsa', factor: 1, digits: 1, unit: '°' },
        { name: 'Assetto Corsa Competizione', factor: 1, digits: 1, unit: '°' },
        { name: 'rFactor', factor: 1, digits: 0, unit: '°' },
    ]
}

const CARS = {
    drift: {
        ref: 'drift',
        image: `img/drift.png`,
        car: { width: 169, height: 129, length: 452 },
        scale: 1.75,
        offset: {
            horizontal: { x: 250, y: 140 },
            vertical: { x: 250, y: 105 },
        },
    },
    gt3: {
        ref: 'gt3',
        image: `img/gt3.png`,
        car: { width: 185.2, height: 127.9, length: 457.3 },
        scale: 1.725,
        offset: {
            horizontal: { x: 240, y: 65 },
            vertical: { x: 240, y: 105 },
        },
    },
    f1: {
        ref: 'f1',
        image: `img/f1.png`,
        scale: 1.45,
        car: { width: 190, height: 110, length: 545.0 },
        offset: {
            horizontal: { x: 270, y: 100 },
            vertical: { x: 270, y: 85 },
        },
    },
}