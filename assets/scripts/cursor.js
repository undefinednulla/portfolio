const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);
const lineEq = (y2, y1, x2, x1, currentVal) => {
    let m = (y2 - y1) / (x2 - x1);
    let b = y1 - m * x1;
    return m * currentVal + b;
};
const lerp = (a, b, n) => (1 - n) * a + n * b;
const body = document.body;
const bodyColor = getComputedStyle(body).getPropertyValue('--color-bg').trim() || 'white';
const getMousePos = (e) => {
    let posx = 0;
    let posy = 0;
    if (!e) e = window.event;
    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY) {
        posx = e.clientX + body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + body.scrollTop + document.documentElement.scrollTop;
    }
    return { x: posx, y: posy }
}

let winsize;
const calcWinsize = () => winsize = { width: window.innerWidth, height: window.innerHeight };
calcWinsize();
window.addEventListener('resize', calcWinsize);

class CursorFx {
    constructor(el) {
        this.DOM = { el: el };
        this.DOM.dot = this.DOM.el.querySelector('.cursor__inner--dot');
        this.DOM.circle = this.DOM.el.querySelector('.cursor__inner--circle');
        this.bounds = { dot: this.DOM.dot.getBoundingClientRect(), circle: this.DOM.circle.getBoundingClientRect() };
        this.scale = 1;
        this.opacity = 1;
        this.mousePos = { x: 0, y: 0 };
        this.lastMousePos = { dot: { x: 0, y: 0 }, circle: { x: 0, y: 0 } };
        this.lastScale = 1;
        this.lastOpacity = 1;

        this.initEvents();
        requestAnimationFrame(() => this.render());
    }
    initEvents() {
        window.addEventListener('mousemove', ev => this.mousePos = getMousePos(ev));
    }
    render() {
        this.lastMousePos.dot.x = lerp(this.lastMousePos.dot.x, this.mousePos.x - this.bounds.dot.width / 2, 1);
        this.lastMousePos.dot.y = lerp(this.lastMousePos.dot.y, this.mousePos.y - this.bounds.dot.height / 2, 1);
        this.lastMousePos.circle.x = lerp(this.lastMousePos.circle.x, this.mousePos.x - this.bounds.circle.width / 2, 0.15);
        this.lastMousePos.circle.y = lerp(this.lastMousePos.circle.y, this.mousePos.y - this.bounds.circle.height / 2, 0.15);
        this.lastScale = lerp(this.lastScale, this.scale, 0.15);
        this.lastOpacity = lerp(this.lastOpacity, this.opacity, 0.1);
        this.DOM.dot.style.transform = `translateX(${(this.lastMousePos.dot.x)}px) translateY(${this.lastMousePos.dot.y}px)`;
        this.DOM.circle.style.transform = `translateX(${(this.lastMousePos.circle.x)}px) translateY(${this.lastMousePos.circle.y}px) scale(${this.lastScale})`;
        this.DOM.circle.style.opacity = this.lastOpacity
        requestAnimationFrame(() => this.render());
    }
    enter() {
        cursor.scale = 2.7;
    }
    leave() {
        cursor.scale = 1;
    }
    // click() {
    //     this.lastScale = 1;
    //     this.lastOpacity = 0;
    // }
}

const cursor = new CursorFx(document.querySelector('.cursor'));

[...document.querySelectorAll('[data-hover]')].forEach((link) => {
    link.addEventListener('mouseenter', () => cursor.enter());
    link.addEventListener('mouseleave', () => cursor.leave());
    link.addEventListener('click', () => cursor.click());
});

// loading page
window.addEventListener('load', () => {
    document.querySelector(".lds-roller").classList.add("fade-out");
    setTimeout(() => {
        document.querySelector(".lds-roller").style.display = "none"
        document.getElementById('body-cs').setAttribute('class', 'scrollbar body-grid')
    }, 0)
})
// scrollpy navication
let secsion = document.querySelectorAll("section");
let navLinks = document.querySelectorAll(".navbart .navbart-wappar .navbart-links .navbart-links__item a");

window.onscroll = () => {
    secsion.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 50;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active-scrollpy');
                document.querySelector('.navbart .navbart-wappar .navbart-links .navbart-links__item a[href*=' + id + ']').classList.add('active-scrollpy');
            })
        }

    })
}

const bodyScrollbar = () => {
    document.getElementById('body-cs').setAttribute('class', 'scrollbar body-grid')
}

window.addEventListener('scroll', (e) => {
    if (e.path[1].scrollY >= 6050) {
        // console.log(document.body.offsetWidth)
        if (document.body.offsetWidth <= 1440) {
            document.getElementById('back-to-top').innerHTML = `<a class="white" href="#body-cs"><ion-icon name="chevron-up-outline"></ion-icon></a>`
        } else {
            document.getElementById('back-to-top').innerHTML = `<a href="#body-cs"><ion-icon name="chevron-up-outline"></ion-icon></a>`
        }
    } else {
        document.getElementById('back-to-top').innerHTML = ''
    }
})
