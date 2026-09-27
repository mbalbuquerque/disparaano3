document.addEventListener("DOMContentLoaded", () => {

    const slides =
        document.querySelectorAll(
            ".gallery-slide"
        );

    const prev =
        document.getElementById(
            "carouselPrev"
        );

    const next =
        document.getElementById(
            "carouselNext"
        );

    const dotsContainer =
        document.getElementById(
            "carouselDots"
        );


    if (!slides.length) {
        return;
    }


    let currentSlide = 0;

    let autoplay;


    /* =====================================================
       DOTS
    ===================================================== */

    slides.forEach((slide, index) => {

        const dot =
            document.createElement(
                "button"
            );

        dot.classList.add(
            "carousel-dot"
        );

        dot.setAttribute(
            "aria-label",
            `Ir para foto ${index + 1}`
        );


        if (index === 0) {
            dot.classList.add("active");
        }


        dot.addEventListener(
            "click",
            () => {

                showSlide(index);

                restartAutoplay();

            }
        );


        dotsContainer.appendChild(dot);

    });


    const dots =
        dotsContainer.querySelectorAll(
            ".carousel-dot"
        );


    /* =====================================================
       EXIBIR SLIDE
    ===================================================== */

    function showSlide(index) {

        slides.forEach(
            slide =>
                slide.classList.remove(
                    "active"
                )
        );


        dots.forEach(
            dot =>
                dot.classList.remove(
                    "active"
                )
        );


        currentSlide =
            (index + slides.length)
            % slides.length;


        slides[
            currentSlide
        ].classList.add(
            "active"
        );


        dots[
            currentSlide
        ].classList.add(
            "active"
        );

    }


    /* =====================================================
       CONTROLES
    ===================================================== */

    next.addEventListener(
        "click",
        () => {

            showSlide(
                currentSlide + 1
            );

            restartAutoplay();

        }
    );


    prev.addEventListener(
        "click",
        () => {

            showSlide(
                currentSlide - 1
            );

            restartAutoplay();

        }
    );


    /* =====================================================
       AUTOPLAY
    ===================================================== */

    function startAutoplay() {

        autoplay =
            setInterval(
                () => {

                    showSlide(
                        currentSlide + 1
                    );

                },
                5000
            );

    }


    function restartAutoplay() {

        clearInterval(
            autoplay
        );

        startAutoplay();

    }


    startAutoplay();

});