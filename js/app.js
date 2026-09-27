document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       HEADER
    ===================================================== */

    const header = document.querySelector(".header");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    });


    /* =====================================================
       MENU MOBILE
    ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const nav = document.getElementById("nav");

    if (menuToggle && nav) {

        menuToggle.addEventListener("click", () => {

            menuToggle.classList.toggle("active");
            nav.classList.toggle("active");

            const expanded =
                menuToggle.getAttribute("aria-expanded") === "true";

            menuToggle.setAttribute(
                "aria-expanded",
                String(!expanded)
            );

        });


        nav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                nav.classList.remove("active");
                menuToggle.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }


    /* =====================================================
       COUNTDOWN
    ===================================================== */

    const countdown =
        document.getElementById("countdown");

    if (countdown) {

        const eventDate =
            new Date(countdown.dataset.date);

        const days =
            document.getElementById("days");

        const hours =
            document.getElementById("hours");

        const minutes =
            document.getElementById("minutes");

        const seconds =
            document.getElementById("seconds");


        function updateCountdown() {

            const now = new Date();

            const difference =
                eventDate.getTime() -
                now.getTime();


            if (difference <= 0) {

                days.textContent = "00";
                hours.textContent = "00";
                minutes.textContent = "00";
                seconds.textContent = "00";

                return;
            }


            const totalSeconds =
                Math.floor(
                    difference / 1000
                );


            const remainingDays =
                Math.floor(
                    totalSeconds / 86400
                );


            const remainingHours =
                Math.floor(
                    (totalSeconds % 86400)
                    / 3600
                );


            const remainingMinutes =
                Math.floor(
                    (totalSeconds % 3600)
                    / 60
                );


            const remainingSeconds =
                totalSeconds % 60;


            days.textContent =
                String(remainingDays)
                    .padStart(2, "0");


            hours.textContent =
                String(remainingHours)
                    .padStart(2, "0");


            minutes.textContent =
                String(remainingMinutes)
                    .padStart(2, "0");


            seconds.textContent =
                String(remainingSeconds)
                    .padStart(2, "0");

        }


        updateCountdown();

        setInterval(
            updateCountdown,
            1000
        );

    }


    /* =====================================================
       PLANOS
    ===================================================== */

    const registrationButtons =
        document.querySelectorAll(
            ".registration-button"
        );


    registrationButtons.forEach(button => {

        button.addEventListener("click", () => {

            const plan =
                button.dataset.plan;

            console.log(
                "Plano selecionado:",
                plan
            );

            /*
             * Na próxima etapa:
             *
             * abrir formulário de inscrição
             * e informar automaticamente
             * qual plano foi escolhido.
             */

        });

    });

});