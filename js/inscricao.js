document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       API
    ===================================================== */

    const API_URL =
        "https://script.google.com/macros/s/AKfycbzbBF7RMsasqi2FJOc0NxSzh6oyKCfRUmEugjDPIygmMmKXsU9ctBJM9I44kRWtSwBd9Q/exec";


    /* =====================================================
       LINKS DE PAGAMENTO STONE
    ===================================================== */

    const PAYMENT_LINKS = {

        individual:
            "https://payment-link-v3.stone.com.br/pl_GJrE38wPApM1mpmtwEH0yo5vxl0j9B7Q",

        casadinha:
            "https://payment-link-v3.stone.com.br/pl_6EalRdKxVeyg8xGsLaI0EgQb1zmnkYGw"

    };


    const wrapper =
        document.getElementById(
            "registrationFormWrapper"
        );

    const form =
        document.getElementById(
            "registrationForm"
        );

    const success =
        document.getElementById(
            "registrationSuccess"
        );

    const selectedPlan =
        document.getElementById(
            "selectedPlan"
        );

    const selectedPlanTitle =
        document.getElementById(
            "selectedPlanTitle"
        );

    const secondAthlete =
        document.getElementById(
            "secondAthlete"
        );

    const secondAthleteKit =
        document.getElementById(
            "secondAthleteKit"
        );

    


    /* =====================================================
       ABRIR INSCRIÇÃO
    ===================================================== */

    document
        .querySelectorAll(".registration-button")
        .forEach(button => {

            button.addEventListener("click", () => {

                const plan = button.dataset.plan;

                selectedPlan.value = plan;

                configurePlan(plan);

                wrapper.classList.add("active");

                showStep(1);

                setTimeout(() => {

                    wrapper.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }, 100);

            });

        });


    /* =====================================================
       CONFIGURAR PLANO
    ===================================================== */

    function configurePlan(plan) {

        const isCouple =
            plan === "casadinha";

        selectedPlanTitle.textContent =
            isCouple
                ? "Inscrição Casadinha"
                : "Inscrição Individual";


        secondAthlete.classList.toggle(
            "active",
            isCouple
        );

        secondAthleteKit.classList.toggle(
            "active",
            isCouple
        );


        document.getElementById(
            "summaryPlan"
        ).textContent =
            isCouple
                ? "Casadinha"
                : "Individual";


        document.getElementById(
            "summaryAthletes"
        ).textContent =
            isCouple ? "2" : "1";


        document.getElementById(
            "summaryPrice"
        ).textContent =
            isCouple
                ? "R$ 139,90"
                : "A confirmar";


        /*
         * Campos do segundo atleta só
         * são obrigatórios na Casadinha.
         */

        [
            "nome2",
            "telefone2",
            "nascimento2"
        ].forEach(id => {

            document
                .getElementById(id)
                .required = isCouple;

        });

    }


    /* =====================================================
       FECHAR
    ===================================================== */

    document
        .getElementById("closeRegistration")
        .addEventListener("click", () => {

            wrapper.classList.remove("active");

        });


    /* =====================================================
       NAVEGAÇÃO
    ===================================================== */

    document
        .querySelectorAll(".next-step")
        .forEach(button => {

            button.addEventListener("click", () => {

                const current =
                    Number(
                        button.closest(".form-step")
                            .dataset.formStep
                    );

                const next =
                    Number(button.dataset.next);


                if (!validateStep(current)) {
                    return;
                }


                showStep(next);

            });

        });


    document
        .querySelectorAll(".prev-step")
        .forEach(button => {

            button.addEventListener("click", () => {

                showStep(
                    Number(button.dataset.prev)
                );

            });

        });


    function showStep(step) {

        document
            .querySelectorAll(".form-step")
            .forEach(element => {

                element.classList.remove("active");

            });


        const target =
            document.querySelector(
                `[data-form-step="${step}"]`
            );


        if (target) {
            target.classList.add("active");
        }


        document
            .querySelectorAll(".progress-step")
            .forEach(element => {

                const number =
                    Number(element.dataset.step);

                element.classList.remove(
                    "active",
                    "completed"
                );


                if (number < step) {
                    element.classList.add("completed");
                }

                if (number === step) {
                    element.classList.add("active");
                }

            });


        wrapper.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /* =====================================================
       VALIDAÇÃO
    ===================================================== */

    function validateStep(step) {

        if (step === 1) {

            const required =
                document.querySelectorAll(
                    '[data-form-step="1"] input[required]'
                );


            for (const input of required) {

                if (!input.value.trim()) {

                    input.focus();

                    input.classList.add("error");

                    return false;
                }

                input.classList.remove("error");

            }


            const phone1 =
                normalizePhone(
                    document.getElementById(
                        "telefone1"
                    ).value
                );


            if (phone1.length < 10) {

                alert(
                    "Informe um telefone válido."
                );

                return false;
            }


            /*
             * Casadinha:
             * não permitimos o mesmo telefone
             * para os dois atletas.
             */

            if (
                selectedPlan.value === "casadinha"
            ) {

                const phone2 =
                    normalizePhone(
                        document.getElementById(
                            "telefone2"
                        ).value
                    );


                if (phone2.length < 10) {

                    alert(
                        "Informe um telefone válido para o segundo atleta."
                    );

                    return false;
                }


                if (phone1 === phone2) {

                    alert(
                        "Os dois atletas precisam utilizar telefones diferentes."
                    );

                    return false;
                }

            }

        }


        if (step === 2) {

            if (
                !document.querySelector(
                    'input[name="modelo1"]:checked'
                ) ||
                !document.querySelector(
                    'input[name="tamanho1"]:checked'
                )
            ) {

                alert(
                    "Escolha o modelo e o tamanho do atleta 01."
                );

                return false;
            }


            if (
                selectedPlan.value === "casadinha"
            ) {

                if (
                    !document.querySelector(
                        'input[name="modelo2"]:checked'
                    ) ||
                    !document.querySelector(
                        'input[name="tamanho2"]:checked'
                    )
                ) {

                    alert(
                        "Escolha o modelo e o tamanho do atleta 02."
                    );

                    return false;
                }

            }

        }


        if (step === 3) {

            const payment =
                document.querySelector(
                    'input[name="pagamento"]:checked'
                );


            if (!payment) {

                alert(
                    "Escolha uma forma de pagamento."
                );

                return false;
            }

        }


        return true;
    }


    /* =====================================================
       TELEFONE
    ===================================================== */

    function normalizePhone(value) {

        return value.replace(/\D/g, "");

    }


    function formatPhone(input) {

        let value =
            normalizePhone(input.value)
                .slice(0, 11);


        if (value.length > 10) {

            value = value.replace(
                /(\d{2})(\d{5})(\d{4})/,
                "($1) $2-$3"
            );

        } else if (value.length > 6) {

            value = value.replace(
                /(\d{2})(\d{4})(\d{0,4})/,
                "($1) $2-$3"
            );

        }


        input.value = value;

    }


    [
        "telefone1",
        "telefone2"
    ].forEach(id => {

        const input =
            document.getElementById(id);

        input.addEventListener(
            "input",
            () => formatPhone(input)
        );

    });


    /* =====================================================
       IDADE NO DIA DO EVENTO
    ===================================================== */

    const EVENT_DATE =
        new Date("2026-12-06T05:00:00-03:00");


    function calculateAge(dateValue) {

        if (!dateValue) {
            return null;
        }


        const birth =
            new Date(
                dateValue + "T12:00:00"
            );


        let age =
            EVENT_DATE.getFullYear()
            - birth.getFullYear();


        const month =
            EVENT_DATE.getMonth()
            - birth.getMonth();


        if (
            month < 0 ||
            (
                month === 0 &&
                EVENT_DATE.getDate()
                < birth.getDate()
            )
        ) {

            age--;

        }


        return age;
    }


    function ageHandler(inputId, outputId) {

        const input =
            document.getElementById(inputId);

        const output =
            document.getElementById(outputId);


        input.addEventListener(
            "change",
            () => {

                const age =
                    calculateAge(input.value);


                if (
                    age === null ||
                    age < 0
                ) {

                    output.textContent =
                        "Informe uma data válida.";

                    return;
                }


                output.textContent =
                    `Idade no dia do evento: ${age} anos`;

            }
        );

    }


    ageHandler(
        "nascimento1",
        "idade1"
    );

    ageHandler(
        "nascimento2",
        "idade2"
    );


   /* =====================================================
   PAGAMENTO
   Única forma disponível: Stone
   PIX ou cartão de crédito
===================================================== */

const cardPayment =
    document.getElementById("cardPayment");

const paymentInput =
    document.querySelector(
        'input[name="pagamento"][value="cartao"]'
    );


/*
 * Como Stone é a única forma de pagamento,
 * deixa a opção selecionada e o conteúdo
 * visível automaticamente.
 */

if (paymentInput) {
    paymentInput.checked = true;
}

if (cardPayment) {
    cardPayment.classList.add("active");
}
   /* =====================================================
   LINK DE PAGAMENTO STONE
===================================================== */

const stonePaymentButton =
    document.getElementById(
        "stonePaymentButton"
    );


if (stonePaymentButton) {

    stonePaymentButton.addEventListener(
        "click",
        () => {

            /*
             * Recupera o plano escolhido
             * anteriormente pelo participante.
             */

            const plan =
                String(
                    selectedPlan.value || ""
                )
                    .trim()
                    .toLowerCase();


            /*
             * Localiza automaticamente
             * o checkout correspondente.
             */

            const paymentUrl =
                PAYMENT_LINKS[plan];


            /*
             * Segurança:
             * não abre nenhum checkout caso
             * o plano não tenha sido identificado.
             */

            if (!paymentUrl) {

                alert(
                    "Não foi possível identificar o plano selecionado."
                );

                return;
            }


            /*
             * Abre o checkout Stone
             * em uma nova aba.
             */

            window.open(
                paymentUrl,
                "_blank",
                "noopener,noreferrer"
            );

        }
    );

}


    

    /* =====================================================
       UPLOAD
    ===================================================== */

    const receipt =
        document.getElementById(
            "paymentReceipt"
        );

    const selectedFile =
        document.getElementById(
            "selectedFile"
        );


    receipt.addEventListener(
        "change",
        () => {

            const file =
                receipt.files[0];


            if (!file) {

                selectedFile.textContent = "";

                return;
            }


            const maxSize =
                5 * 1024 * 1024;


            if (file.size > maxSize) {

                alert(
                    "O comprovante deve ter no máximo 5 MB."
                );

                receipt.value = "";

                return;
            }


            selectedFile.textContent =
                `✓ ${file.name}`;

        }
    );

    /* =====================================================
       ARQUIVO → BASE64
    ===================================================== */

    function fileToBase64(file) {

        return new Promise(
            (resolve, reject) => {

                const reader =
                    new FileReader();


                reader.onload = () => {

                    const result =
                        String(
                            reader.result
                        );


                    /*
                     * Remove:
                     *
                     * data:image/jpeg;base64,
                     */

                    const base64 =
                        result.includes(",")
                            ? result.split(",")[1]
                            : result;


                    resolve(base64);

                };


                reader.onerror = () => {

                    reject(
                        new Error(
                            "Não foi possível ler o comprovante."
                        )
                    );

                };


                reader.readAsDataURL(
                    file
                );

            }
        );

    }

    /* =====================================================
      /* =====================================================
   ENVIAR COMPROVANTE
===================================================== */

async function uploadReceipt(
    registrationId,
    telefone,
    file
) 
{

    /* ===============================================
       VALIDAÇÕES BÁSICAS
    =============================================== */

    if (!registrationId) {

        throw new Error(
            "Número da inscrição não informado."
        );

    }


    if (!telefone) {

        throw new Error(
            "Telefone da inscrição não informado."
        );

    }


    if (!file) {

        throw new Error(
            "Selecione um comprovante."
        );

    }


    /* ===============================================
       TAMANHO - 5 MB

       É apenas uma validação antecipada.
       O backend também valida.
    =============================================== */

    const MAX_FILE_SIZE =
        5 * 1024 * 1024;


    if (
        file.size >
        MAX_FILE_SIZE
    ) {

        throw new Error(
            "O comprovante deve ter no máximo 5 MB."
        );

    }


    /* ===============================================
       TIPOS PERMITIDOS

       O backend continuará sendo a autoridade.
    =============================================== */

    const allowedTypes = [

        "image/jpeg",
        "image/png",
        "application/pdf"

    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        throw new Error(
            "Formato inválido. Envie JPG, PNG ou PDF."
        );

    }


    /* ===============================================
       CONVERTER PARA BASE64
    =============================================== */

    const base64 =
        await fileToBase64(
            file
        );


    /* ===============================================
       PAYLOAD

       IMPORTANTE:
       agora enviamos também o telefone.
    =============================================== */

    const payload = {

        action:
            "uploadComprovante",

        registrationId:
            String(
                registrationId
            )
            .trim()
            .toUpperCase(),

        telefone:
            String(
                telefone
            )
            .replace(
                /\D/g,
                ""
            ),

        file: {

            name:
                file.name,

            mimeType:
                file.type,

            base64:
                base64

        }

    };


    /* ===============================================
       REQUISIÇÃO
    =============================================== */

    const response =
        await fetch(
            API_URL,
            {

                method:
                    "POST",

                headers: {

                    "Content-Type":
                        "text/plain;charset=utf-8"

                },

                body:
                    JSON.stringify(
                        payload
                    )

            }
        );


    /* ===============================================
       RESPOSTA HTTP
    =============================================== */

    if (!response.ok) {

        throw new Error(
            "Falha ao comunicar com o servidor."
        );

    }


    /* ===============================================
       JSON
    =============================================== */

    let result;


    try {

        result =
            await response.json();

    }

    catch (error) {

        throw new Error(
            "Resposta inválida do servidor."
        );

    }


    /* ===============================================
       ERRO DO BACKEND
    =============================================== */

    if (
        !result.success
    ) {

        throw new Error(
            result.message ||
            "Não foi possível salvar o comprovante."
        );

    }


    /* ===============================================
       SUCESSO
    =============================================== */

    return result;


    }
    /* =====================================================
   ENVIAR INSCRIÇÃO
===================================================== */

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const finishButton =
                document.getElementById(
                    "finishRegistration"
                );

            const regulation =
                document.getElementById(
                    "regulationAccept"
                );


            /* =============================================
               COMPROVANTE
               Upload real entra na próxima etapa
            ============================================== */

            if (!receipt.files.length) {

                alert(
                    "Envie o comprovante do pagamento."
                );

                return;
            }


            if (!regulation.checked) {

                alert(
                    "É necessário aceitar o regulamento."
                );

                return;
            }


            /* =============================================
               PAGAMENTO
            ============================================== */

            const payment =
                document.querySelector(
                    'input[name="pagamento"]:checked'
                );


            if (!payment) {

                alert(
                    "Escolha a forma de pagamento."
                );

                return;
            }


            /* =============================================
               KIT ATLETA 1
            ============================================== */

            const modelo1 =
                document.querySelector(
                    'input[name="modelo1"]:checked'
                );

            const tamanho1 =
                document.querySelector(
                    'input[name="tamanho1"]:checked'
                );


            if (!modelo1 || !tamanho1) {

                alert(
                    "Selecione o modelo e tamanho do atleta."
                );

                return;
            }

/* =============================================
   DADOS
============================================== */

/*
 * Distância do primeiro atleta.
 * Obrigatória tanto no Individual
 * quanto na Casadinha.
 */

const distancia1 =
    document.querySelector(
        'input[name="distancia"]:checked'
    );


if (!distancia1) {

    alert(
        "Selecione a distância do primeiro atleta: 3 KM ou 5 KM."
    );

    return;
}


const data = {

    plano:
        selectedPlan.value,

    nome1:
        document.getElementById(
            "nome1"
        ).value.trim(),

    telefone1:
        normalizePhone(
            document.getElementById(
                "telefone1"
            ).value
        ),

    nascimento1:
        document.getElementById(
            "nascimento1"
        ).value,

    /* NOVO */
    distancia1:
        distancia1.value,

    modelo1:
        modelo1.value,

    tamanho1:
        tamanho1.value,

    formaPagamento:
        payment.value.toUpperCase(),

    regulamentoAceito:
        regulation.checked

};


/* =============================================
   CASADINHA
============================================== */

if (
    selectedPlan.value ===
    "casadinha"
) {

    const distancia2 =
        document.querySelector(
            'input[name="distancia2"]:checked'
        );


    const modelo2 =
        document.querySelector(
            'input[name="modelo2"]:checked'
        );


    const tamanho2 =
        document.querySelector(
            'input[name="tamanho2"]:checked'
        );


    /*
     * Distância obrigatória
     * somente para Casadinha.
     */

    if (!distancia2) {

        alert(
            "Selecione a distância do segundo atleta: 3 KM ou 5 KM."
        );

        return;
    }


    if (!modelo2 || !tamanho2) {

        alert(
            "Selecione o kit do segundo atleta."
        );

        return;
    }


    data.nome2 =
        document.getElementById(
            "nome2"
        ).value.trim();


    data.telefone2 =
        normalizePhone(
            document.getElementById(
                "telefone2"
            ).value
        );


    data.nascimento2 =
        document.getElementById(
            "nascimento2"
        ).value;


    /* NOVO */

    data.distancia2 =
        distancia2.value;


    data.modelo2 =
        modelo2.value;


    data.tamanho2 =
        tamanho2.value;

}


            /* =============================================
               VALOR
            ============================================== */

            if (
                selectedPlan.value ===
                "casadinha"
            ) {

                data.valor = 139.90;

            } else {

                /*
                 * Alteraremos quando você confirmar
                 * o preço individual.
                 */

                data.valor = 0;

            }


            /* =============================================
               ESTADO DO BOTÃO
            ============================================== */

            const originalText =
                finishButton.textContent;


            finishButton.disabled = true;

            finishButton.textContent =
                "ENVIANDO INSCRIÇÃO...";


            try {

                const response =
                    await fetch(
                        API_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "text/plain;charset=utf-8"
                            },

                            body:
                                JSON.stringify({
                                    action: "createRegistration",
                                    ...data
                        })
            }
        );
                    


                if (!response.ok) {

                    throw new Error(
                        "Não foi possível comunicar com o servidor."
                    );

                }


                const result =
                    await response.json();


                /* =============================================
                   ERRO RETORNADO PELO APPS SCRIPT
                ============================================== */

                if (!result.success) {

                    throw new Error(
                        result.message ||
                        "Não foi possível concluir a inscrição."
                    );

                }
                /* =============================================
                   ENVIAR COMPROVANTE
                ============================================== */

                finishButton.textContent =
                    "ENVIANDO COMPROVANTE...";


                const receiptFile =
                    receipt.files[0];


                await uploadReceipt(
                    result.registrationId,
                    data.telefone1,
                    receiptFile
                );

                /* =============================================
                   SUCESSO
                ============================================== */

                form.style.display =
                    "none";


                success.classList.add(
                    "active"
                );


                document.getElementById(
                    "registrationNumber"
                ).textContent =
                    result.registrationId;


                /* Atualiza vagas */

                if (result.vacancies) {

                    updateVacancies(
                        result.vacancies
                    );

                }


                success.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });


            } catch (error) {

                console.error(
                    "Erro na inscrição:",
                    error
                );


                alert(
                    error.message ||
                    "Ocorreu um erro ao realizar a inscrição."
                );


            } finally {

                finishButton.disabled =
                    false;


                finishButton.textContent =
                    originalText;

            }

        }
    );

    /* =====================================================
       CONTROLE DE VAGAS
    ===================================================== */

    async function loadVacancies() {

        try {

            const response =
                await fetch(
                    `${API_URL}?action=vagas`
                );


            if (!response.ok) {
                return;
            }


            const data =
                await response.json();


            updateVacancies(data);


        } catch (error) {

            console.warn(
                "Não foi possível consultar as vagas.",
                error
            );

        }

    }


    /* =====================================================
   ATUALIZAR INTERFACE DE VAGAS
===================================================== */

function updateVacancies(data) {

    const vacanciesText =
        document.getElementById(
            "vacanciesText"
        );

    const progress =
        document.getElementById(
            "vacanciesProgress"
        );


    if (!vacanciesText || !progress) {
        return;
    }


    /* =================================================
       DADOS DE VAGAS

       Compatível tanto com:
       vagasTotal / vagasOcupadas / vagasDisponiveis

       quanto com:
       total / occupied / available
    ================================================= */

    const total =
        Number(
            data.vagasTotal ??
            data.total ??
            data.totalSlots ??
            200
        );


    const occupied =
        Number(
            data.vagasOcupadas ??
            data.occupied ??
            data.occupiedSlots ??
            data.totalAtletas ??
            0
        );


    const available =
        Number(
            data.vagasDisponiveis ??
            data.available ??
            data.availableSlots ??
            (total - occupied)
        );


    console.log(
        "Controle de vagas:",
        {
            total,
            occupied,
            available,
            dadosBackend: data
        }
    );


    /* =================================================
       TEXTO DE VAGAS
    ================================================= */

    vacanciesText.textContent =
        `${available} vagas disponíveis`;


    /* =================================================
       BARRA DE PROGRESSO
    ================================================= */

    const percentage =
        total > 0
            ? Math.min(
                100,
                (occupied / total) * 100
            )
            : 0;


    progress.style.width =
        `${percentage}%`;


    /* =================================================
       ÚLTIMAS VAGAS
    ================================================= */

    if (
        available > 0 &&
        available <= 10
    ) {

        vacanciesText.textContent =
            `🔥 ÚLTIMAS ${available} VAGAS`;

    }


    /* =================================================
       BOTÕES DE INSCRIÇÃO
    ================================================= */

    const registrationButtons =
        document.querySelectorAll(
            ".registration-button"
        );


    registrationButtons.forEach(
        (button) => {

            const plan =
                String(
                    button.dataset.plan || ""
                )
                    .trim()
                    .toLowerCase();


            /*
             * Nenhuma vaga disponível.
             */

            if (available <= 0) {

                button.disabled = true;
                button.textContent =
                    "ESGOTADO";

                return;
            }


            /*
             * Casadinha ocupa duas vagas.
             *
             * Se existir somente uma vaga,
             * Individual continua disponível
             * e Casadinha é bloqueada.
             */

            if (
                plan === "casadinha" &&
                available < 2
            ) {

                button.disabled = true;

                button.textContent =
                    "SEM VAGAS PARA CASADINHA";

                return;
            }


            /*
             * Plano disponível.
             */

            button.disabled = false;
            button.textContent =
                "INSCREVA-SE";

        }
    );


    /* =================================================
       EVENTO ESGOTADO
    ================================================= */

    if (available <= 0) {

        vacanciesText.textContent =
            "INSCRIÇÕES ESGOTADAS";

    }

}


/* =====================================================
   CARREGAR VAGAS AO ABRIR O SITE
===================================================== */

loadVacancies();


/* =====================================================
   FIM DOMContentLoaded
===================================================== */

});