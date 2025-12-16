let slideIndex = 0;
let slideInterval;
const slides = [
    '../src/assets/img/lasanha.png',
    '../src/assets/img/cassoulet.jpg'
];

function mostrarSlide(index) {
    const heroSection = document.querySelector('.section-hero');
    if (heroSection) {
        heroSection.style.opacity = '0.5';

        setTimeout(() => {
            heroSection.style.backgroundImage = `url("${slides[index]}")`;
            heroSection.style.backgroundPosition = 'center';
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundRepeat = 'no-repeat';

            heroSection.style.opacity = '1';

            atualizarBolinhas(index);
        }, 300); 
    }
}

function atualizarBolinhas(indexAtivo) {
    const bolinhas = document.querySelectorAll('.slide-position');

    bolinhas.forEach(bolinha => {
        bolinha.style.backgroundColor = 'rgba(255, 255, 255, 0.596)';
    });

    if (indexAtivo < bolinhas.length) {
        bolinhas[indexAtivo].style.backgroundColor = '#FF8000';
    }
}

function proximoSlide() {
    slideIndex = (slideIndex + 1) % slides.length;
    mostrarSlide(slideIndex);
}

function iniciarSlide() {
    const heroSection = document.querySelector('.section-hero');
    if (!heroSection) return;

    heroSection.style.transition = 'opacity 0.5s ease-in-out';

    mostrarSlide(0);

    slideInterval = setInterval(proximoSlide, 5000);
}

document.addEventListener('DOMContentLoaded', iniciarSlide);