/* =========================================================
   DISPARA TECHFIT 2026
   CONSULTA DE INSCRIÇÃO + COMPROVANTE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       API
    ===================================================== */

    const API_URL =
        "https://script.google.com/macros/s/AKfycbzbBF7RMsasqi2FJOc0NxSzh6oyKCfRUmEugjDPIygmMmKXsU9ctBJM9I44kRWtSwBd9Q/exec";


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const form =
        document.getElementById("consultationForm");

    const registrationInput =
        document.getElementById("consultRegistrationId");

    const phoneInput =
        document.getElementById("consultPhone");

    const submitButton =
        document.getElementById("consultationSubmit");

    const message =
        document.getElementById("consultationMessage");


    /* =====================================================
       RESULTADO
    ===================================================== */

    const resultBox =
        document.getElementById("consultationResult");

    const resultId =
        document.getElementById("consultResultId");

    const resultName =
        document.getElementById("consultResultName");

    const resultPlan =
        document.getElementById("consultResultPlan");

    const resultKit =
        document.getElementById("consultResultKit");

    const resultStatus =
        document.getElementById("consultResultStatus");


    /* =====================================================
       COMPROVANTE
    ===================================================== */

    const receiptBox =
        document.getElementById("receiptReupload");

    const receiptHelp =
        document.getElementById("receiptHelpText");

    const receiptInput =
        document.getElementById("consultReceipt");

    const receiptFileName =
        document.getElementById("consultFileName");

    const sendReceiptButton =
        document.getElementById("sendConsultReceipt");

    const newSearchButton =
        document.getElementById("consultationNewSearch");


    /* =====================================================
       VERIFICAÇÃO DA PÁGINA
    ===================================================== */

    if (!form) {

        console.warn(
            "Área de consulta não encontrada."
        );

        return;

    }


    /* =====================================================
       ESTADO LOCAL
    ===================================================== */

    let currentRegistrationId = "";

    /*
     * Guardamos apenas durante esta página/sessão.
     * Não usamos localStorage.
     */

    let currentPhone = "";


    /* =====================================================
       UTILITÁRIOS
    ===================================================== */

    function onlyDigits(value) {

        return String(value || "")
            .replace(/\D/g, "");

    }


    /* =====================================================
       TELEFONE
    ===================================================== */

    function formatPhone(value) {

        const digits =
            onlyDigits(value)
                .slice(0, 11);


        if (digits.length <= 2) {
            return digits;
        }


        if (digits.length <= 6) {

            return (
                "(" +
                digits.slice(0, 2) +
                ") " +
                digits.slice(2)
            );

        }


        if (digits.length <= 10) {

            return (
                "(" +
                digits.slice(0, 2) +
                ") " +
                digits.slice(2, 6) +
                "-" +
                digits.slice(6)
            );

        }


        return (
            "(" +
            digits.slice(0, 2) +
            ") " +
            digits.slice(2, 7) +
            "-" +
            digits.slice(7)
        );

    }


    /* =====================================================
       ID DA INSCRIÇÃO
    ===================================================== */

    function normalizeRegistrationId(value) {

        let clean =
            String(value || "")
                .trim()
                .toUpperCase()
                .replace(/\s+/g, "");


        /*
         * Permite o atleta digitar:
         *
         * 4
         *
         * e transforma em:
         *
         * DISP-0004
         */

        if (/^\d+$/.test(clean)) {

            clean =
                "DISP-" +
                clean.padStart(4, "0");

        }


        return clean;

    }


    /* =====================================================
       MENSAGENS
    ===================================================== */

    function setMessage(
        text = "",
        isError = false
    ) {

        if (!message) {
            return;
        }


        message.textContent = text;


        message.classList.toggle(
            "error",
            isError
        );

    }


    /* =====================================================
       STATUS
    ===================================================== */

    function friendlyStatus(status) {

        const normalized =
            String(status || "")
                .trim()
                .toUpperCase();


        const statusMap = {

            AGUARDANDO_PAGAMENTO:
                "AGUARDANDO PAGAMENTO",

            PAGAMENTO_ENVIADO:
                "PAGAMENTO ENVIADO",

            PAGO:
                "PAGAMENTO CONFIRMADO",

            CANCELADO:
                "INSCRIÇÃO CANCELADA"

        };


        return (
            statusMap[normalized] ||
            normalized.replaceAll("_", " ") ||
            "—"
        );

    }


    /* =====================================================
       CONFIGURAR STATUS
    ===================================================== */

    function configureStatus(
        status,
        hasReceipt
    ) {

        const normalizedStatus =
            String(status || "")
                .trim()
                .toUpperCase();


        resultStatus.className =
            "consultation-status";


        const strong =
            resultStatus.querySelector("strong");


        if (strong) {

            strong.textContent =
                friendlyStatus(
                    normalizedStatus
                );

        }


        /* =================================================
           PAGAMENTO ENVIADO
        ================================================= */

        if (
            normalizedStatus ===
            "PAGAMENTO_ENVIADO"
        ) {

            resultStatus.classList.add(
                "status-sent"
            );

        }


        /* =================================================
           PAGO
        ================================================= */

        else if (
            normalizedStatus ===
            "PAGO"
        ) {

            resultStatus.classList.add(
                "status-paid"
            );

        }


        /* =================================================
           CANCELADO
        ================================================= */

        else if (
            normalizedStatus ===
            "CANCELADO"
        ) {

            resultStatus.classList.add(
                "status-cancelled"
            );

        }


        /* =================================================
           PERMISSÃO DE UPLOAD
        ================================================= */

        const canUpload =
            normalizedStatus !== "PAGO" &&
            normalizedStatus !== "CANCELADO";


        if (receiptBox) {

            receiptBox.hidden =
                !canUpload;

        }


        if (
            canUpload &&
            receiptHelp
        ) {

            if (hasReceipt) {

                receiptHelp.textContent =
                    "Seu comprovante já foi recebido e está aguardando validação. " +
                    "Se necessário, você pode enviar um novo arquivo.";

            }

            else {

                receiptHelp.textContent =
                    "Nenhum comprovante foi recebido. " +
                    "Envie seu comprovante abaixo para análise da organização.";

            }

        }

    }


    /* =====================================================
       ARQUIVO PARA BASE64
    ===================================================== */

    function fileToBase64(file) {

        return new Promise(
            (resolve, reject) => {

                const reader =
                    new FileReader();


                reader.onload = () => {

                    const result =
                        String(
                            reader.result || ""
                        );


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


                reader.readAsDataURL(file);

            }
        );

    }


    /* =====================================================
       UPLOAD SEGURO DO COMPROVANTE
    ===================================================== */

    async function uploadReceipt(
        registrationId,
        phone,
        file
    ) {

        const base64 =
            await fileToBase64(file);


        /*
         * IMPORTANTE:
         *
         * Agora enviamos:
         *
         * - número da inscrição
         * - telefone autenticado
         * - arquivo
         *
         * O Apps Script validará novamente.
         */

        const payload = {

            action:
                "uploadComprovante",

            registrationId:
                registrationId,

            telefone:
                onlyDigits(phone),

            file: {

                /*
                 * O backend NÃO confia neste nome.
                 * Mantemos apenas por compatibilidade.
                 */

                name:
                    file.name,

                mimeType:
                    file.type,

                base64:
                    base64

            }

        };


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
                        JSON.stringify(payload)

                }
            );


        if (!response.ok) {

            throw new Error(
                "Falha na comunicação com o servidor."
            );

        }


        let data;


        try {

            data =
                await response.json();

        }

        catch (error) {

            throw new Error(
                "O servidor retornou uma resposta inválida."
            );

        }


        if (!data.success) {

            throw new Error(

                data.message ||
                "Não foi possível salvar o comprovante."

            );

        }


        return data;

    }


    /* =====================================================
       MÁSCARA DO TELEFONE
    ===================================================== */

    if (phoneInput) {

        phoneInput.addEventListener(
            "input",
            () => {

                phoneInput.value =
                    formatPhone(
                        phoneInput.value
                    );

            }
        );

    }


    /* =====================================================
       NORMALIZAR ID AO SAIR DO CAMPO
    ===================================================== */

    if (registrationInput) {

        registrationInput.addEventListener(
            "blur",
            () => {

                registrationInput.value =
                    normalizeRegistrationId(
                        registrationInput.value
                    );

            }
        );

    }


    /* =====================================================
       CONSULTAR INSCRIÇÃO
    ===================================================== */

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const registrationId =
                normalizeRegistrationId(
                    registrationInput.value
                );


            const phone =
                onlyDigits(
                    phoneInput.value
                );


            /* =================================================
               VALIDAR ID
            ================================================= */

            if (
                !/^DISP-\d{4,6}$/.test(
                    registrationId
                )
            ) {

                setMessage(
                    "Informe um número de inscrição válido.",
                    true
                );

                return;

            }


            /* =================================================
               VALIDAR TELEFONE
            ================================================= */

            if (
                phone.length !== 10 &&
                phone.length !== 11
            ) {

                setMessage(
                    "Informe um telefone válido.",
                    true
                );

                return;

            }


            /* =================================================
               BOTÃO
            ================================================= */

            submitButton.disabled =
                true;


            submitButton.textContent =
                "CONSULTANDO...";


            setMessage(
                "Consultando sua inscrição..."
            );


            try {

                /* =================================================
                   CONSULTA

                   Mantemos exatamente o formato da API
                   que já foi testado anteriormente.
                ================================================= */

                const url =

                    API_URL +

                    "?action=consultar" +

                    "&id=" +
                    encodeURIComponent(
                        registrationId
                    ) +

                    "&telefone=" +
                    encodeURIComponent(
                        phone
                    );


                const response =
                    await fetch(url);


                if (!response.ok) {

                    throw new Error(
                        "Não foi possível consultar a inscrição."
                    );

                }


                let data;


                try {

                    data =
                        await response.json();

                }

                catch (error) {

                    throw new Error(
                        "O servidor retornou uma resposta inválida."
                    );

                }


                if (!data.success) {

                    throw new Error(

                        data.message ||
                        "Inscrição não encontrada."

                    );

                }


                /* =================================================
                   AUTENTICAÇÃO LOCAL TEMPORÁRIA

                   Só guardamos o telefone após o backend
                   confirmar ID + telefone.
                ================================================= */

                currentRegistrationId =
                    String(
                        data.registrationId ||
                        registrationId
                    )
                        .trim()
                        .toUpperCase();


                currentPhone =
                    phone;


                /* =================================================
                   RESULTADO
                ================================================= */

                resultId.textContent =
                    currentRegistrationId;


                resultName.textContent =
                    data.nome ||
                    "Atleta";


                resultPlan.textContent =
                    data.plano ||
                    "—";


                resultKit.textContent =

                    [
                        data.modelo,
                        data.tamanho
                    ]

                        .filter(Boolean)

                        .join(" • ")

                    || "—";


                /* =================================================
                   STATUS
                ================================================= */

                configureStatus(

                    data.status,

                    Boolean(
                        data.possuiComprovante
                    )

                );


                /* =================================================
                   MOSTRAR RESULTADO
                ================================================= */

                form.hidden =
                    true;


                resultBox.hidden =
                    false;


                setMessage("");


            }

            catch (error) {

                console.error(
                    "Erro na consulta:",
                    error
                );


                /*
                 * Limpar eventual autenticação anterior.
                 */

                currentRegistrationId =
                    "";


                currentPhone =
                    "";


                setMessage(

                    error.message ||
                    "Não foi possível realizar a consulta.",

                    true

                );

            }

            finally {

                submitButton.disabled =
                    false;


                submitButton.textContent =
                    "CONSULTAR INSCRIÇÃO";

            }

        }
    );


    /* =====================================================
       SELECIONAR COMPROVANTE
    ===================================================== */

    if (receiptInput) {

        receiptInput.addEventListener(
            "change",
            () => {

                const file =
                    receiptInput.files[0];


                /* =================================================
                   SEM ARQUIVO
                ================================================= */

                if (!file) {

                    receiptFileName.textContent =
                        "";


                    sendReceiptButton.disabled =
                        true;


                    return;

                }


                /* =================================================
                   MIME PERMITIDO
                ================================================= */

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

                    receiptInput.value =
                        "";


                    receiptFileName.textContent =
                        "Formato inválido. Use JPG, PNG ou PDF.";


                    sendReceiptButton.disabled =
                        true;


                    return;

                }


                /* =================================================
                   LIMITE 5 MB

                   O backend verifica novamente.
                ================================================= */

                const MAX_SIZE =
                    5 * 1024 * 1024;


                if (
                    file.size >
                    MAX_SIZE
                ) {

                    receiptInput.value =
                        "";


                    receiptFileName.textContent =
                        "O arquivo deve possuir no máximo 5 MB.";


                    sendReceiptButton.disabled =
                        true;


                    return;

                }


                /* =================================================
                   ARQUIVO VAZIO
                ================================================= */

                if (
                    file.size <= 0
                ) {

                    receiptInput.value =
                        "";


                    receiptFileName.textContent =
                        "O arquivo selecionado está vazio.";


                    sendReceiptButton.disabled =
                        true;


                    return;

                }


                /* =================================================
                   OK
                ================================================= */

                receiptFileName.textContent =
                    "Selecionado: " +
                    file.name;


                sendReceiptButton.disabled =
                    false;

            }
        );

    }


    /* =====================================================
       ENVIAR COMPROVANTE
    ===================================================== */

    if (sendReceiptButton) {

        sendReceiptButton.addEventListener(
            "click",
            async () => {

                const file =
                    receiptInput.files[0];


                /* =================================================
                   SEGURANÇA LOCAL
                ================================================= */

                if (
                    !currentRegistrationId ||
                    !currentPhone
                ) {

                    receiptFileName.textContent =
                        "Faça uma nova consulta antes de enviar o comprovante.";


                    return;

                }


                if (!file) {

                    receiptFileName.textContent =
                        "Selecione um comprovante.";


                    return;

                }


                /* =================================================
                   BOTÃO
                ================================================= */

                sendReceiptButton.disabled =
                    true;


                sendReceiptButton.textContent =
                    "ENVIANDO...";


                receiptFileName.textContent =
                    "Enviando comprovante...";


                try {

                    /*
                     * Agora enviamos também o telefone
                     * validado durante a consulta.
                     */

                    const response =
                        await uploadReceipt(

                            currentRegistrationId,

                            currentPhone,

                            file

                        );


                    /* =================================================
                       STATUS VISUAL
                    ================================================= */

                    resultStatus.className =
                        "consultation-status status-sent";


                    const strong =
                        resultStatus.querySelector(
                            "strong"
                        );


                    if (strong) {

                        strong.textContent =
                            "PAGAMENTO ENVIADO";

                    }


                    /* =================================================
                       MENSAGEM
                    ================================================= */

                    receiptHelp.textContent =
                        "Comprovante recebido com sucesso. " +
                        "O pagamento agora aguarda validação da organização.";


                    receiptInput.value =
                        "";


                    receiptFileName.textContent =
                        "✓ Comprovante enviado com sucesso.";


                    /* =================================================
                       ESCONDER ÁREA DE NOVO UPLOAD

                       O usuário pode fazer nova consulta caso
                       realmente precise reenviar.
                    ================================================= */

                    const uploadArea =
                        receiptBox.querySelector(
                            ".consult-upload"
                        );


                    if (uploadArea) {

                        uploadArea.style.display =
                            "none";

                    }


                    sendReceiptButton.style.display =
                        "none";


                    console.log(
                        "Comprovante enviado:",
                        response.registrationId
                    );


                }

                catch (error) {

                    console.error(
                        "Erro no upload:",
                        error
                    );


                    receiptFileName.textContent =

                        error.message ||

                        "Erro ao enviar o comprovante.";


                    sendReceiptButton.disabled =
                        false;


                    sendReceiptButton.textContent =
                        "ENVIAR COMPROVANTE";

                }

            }
        );

    }


    /* =====================================================
       NOVA CONSULTA
    ===================================================== */

    if (newSearchButton) {

        newSearchButton.addEventListener(
            "click",
            () => {

                /*
                 * Remove os dados temporários.
                 */

                currentRegistrationId =
                    "";


                currentPhone =
                    "";


                /* =================================================
                   RESULTADO
                ================================================= */

                resultBox.hidden =
                    true;


                /* =================================================
                   FORMULÁRIO
                ================================================= */

                form.hidden =
                    false;


                form.reset();


                setMessage("");


                /* =================================================
                   COMPROVANTE
                ================================================= */

                if (receiptInput) {

                    receiptInput.value =
                        "";

                }


                if (receiptFileName) {

                    receiptFileName.textContent =
                        "";

                }


                if (sendReceiptButton) {

                    sendReceiptButton.disabled =
                        true;


                    sendReceiptButton.textContent =
                        "ENVIAR COMPROVANTE";


                    sendReceiptButton.style.display =
                        "";

                }


                if (receiptBox) {

                    const uploadArea =
                        receiptBox.querySelector(
                            ".consult-upload"
                        );


                    if (uploadArea) {

                        uploadArea.style.display =
                            "";

                    }

                }


                /* =================================================
                   FOCO
                ================================================= */

                if (registrationInput) {

                    registrationInput.focus();

                }

            }
        );

    }

});