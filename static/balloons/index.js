const BALLOON_RADIUS = 50;
const TARGET_RADIUS = 100;
const DEFAULT_HEALTH = 2000; // ms

const canvas = document.getElementById('canvas');
const balloonTemplate = document.getElementById('balloon-template');

/**
 * @type {{
 *  lastTick: number,
 *  balloon: Balloon,
 *  ticker: number,
 *  x: number,
 *  y: number
 * }}
 */
const state = {
    x: 0,
    y: 0,
    lastTick: Date.now(),
    balloon: null,
    ticker: 0,
};

class Balloon {
    constructor() {
        this.centerX = 0;
        this.centerY = 0;
        this.poped = false;
        this.node = null;
        this.targetNode = null;
        this.health = DEFAULT_HEALTH;

        this.createNode();
    }

    createNode() {
        const b = balloonTemplate.content.querySelector('.balloon').cloneNode(true);
        this.node = b;
        this.targetNode = b.querySelector('.target');

        const left = randomInt(window.innerWidth - 2 * BALLOON_RADIUS);
        b.style.left = left + 'px';
        this.centerX = left + BALLOON_RADIUS;

        const top = randomInt(window.innerHeight - 2 * BALLOON_RADIUS);
        b.style.top = top + 'px';
        this.centerY = top + BALLOON_RADIUS;

        canvas.append(b);
        this.node = b;
    }

    isTargeted() {
        const x = Math.abs(this.centerX - state.x);
        const y = Math.abs(this.centerY - state.y);
        const distance = Math.sqrt(x**2 + y**2);
        // console.log(distance, TARGET_RADIUS - distance > 0);

        return TARGET_RADIUS - distance > 0;
    }

    alterHealth(value) {
        this.health += value;
        if (this.health < 0) {
            this.pop();
            return;
        }

        this.health = Math.min(this.health, DEFAULT_HEALTH);
        const opacity = 1 - (this.health / DEFAULT_HEALTH);
        this.targetNode.style.opacity = `${opacity}`;
    }

    pop() {
        if (this.poped) {
            return;
        }
        this.node.parentElement.removeChild(this.node);
        this.poped = true;
    }
}

function mouseMoveHandler(e) {
    state.x = e.x;
    state.y = e.y;
}

function nextTick() {
    const now = Date.now();
    const tickValue = now - state.lastTick;
    state.lastTick = now;

    if (state.balloon.isTargeted()) {
        state.balloon.alterHealth(-tickValue);
    } else {
        state.balloon.alterHealth(tickValue);
    }

    if (state.balloon.poped) {
        state.balloon = new Balloon();
    }
}

function start() {
    console.log('start');
    canvas.style.display = 'block';
    state.balloon = new Balloon();
    window.addEventListener('mousemove', mouseMoveHandler);
    state.ticker = setInterval(nextTick, 20);
}
function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}