
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ==========================================
  // CONFIGURAÇÕES
  // ==========================================

  
const phoneInput = document.getElementById("telefone1");

if (phoneInput) {
  phoneInput.setAttribute("inputmode", "numeric");
  phoneInput.setAttribute("maxlength", "15");
  phoneInput.setAttribute("placeholder", "(81) 99999-9999");

  phoneInput.addEventListener("input", () => {
    phoneInput.value = formatPhone(phoneInput.value);
    phoneInput.setCustomValidity("");
  });

  phoneInput.addEventListener("blur", () => {
    if (phoneInput.value && !isValidMobilePhone(phoneInput.value)) {
      phoneInput.setCustomValidity(
        "Informe um celular válido com DDD e 9 dígitos."
      );
      phoneInput.reportValidity();
    }
  });
}


  const API_URL =
    "https://script.google.com/macros/s/AKfycbzbBF7RMsasqi2FJOc0NxSzh6oyKCfRUmEugjDPIygmMmKXsU9ctBJM9I44kRWtSwBd9Q/exec";

  const PAYMENT_LINKS = Object.freeze({
    normal:
      "https://payment-link-v3.stone.com.br/pl_GJrE38wPApM1mpmtwEH0yo5vxl0j9B7Q",

    promocional:
      "https://www.mercadopago.com.br/checkout/v1/payment/redirect/37363745-3719-4702-b1b3-a6362da2a5b3/payment-option-form/?source=link&router-request-id=e7387fcd-2460-4567-b634-f1af02746217&preference-id=114279379-fb5dfd96-92de-4a69-8f99-44fc3053c813&p=8dc4c8e65d9eb4d96d7dc08da4834478"
  });

  const PRECO_NORMAL = 87;
  const PRECO_PROMOCIONAL = 79;
  const DESCONTO = 8;
  const TAXA_ADMINISTRATIVA = 7;
  const LIMITE_VAGAS = 200;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  // ==========================================
  // CUPONS DOS DIVULGADORES
  // ==========================================

  const CUPONS = Object.freeze({
    disparajack: "Aqueline",
    disparaadri: "Adriele",
    diaparalet: "Lethicia",
    disparafran: "Francielly",
    disparamalu: "Malu",
    disparapaloma: "Paloma",
    disparaleo: "Léo",
    disparajulio: "Júlio",
    disparaanderson: "Anderson",
    dispararafa: "Rafa",
    disparasasa: "Samantha",
    diaparamari: "Mari",
    disparabruno: "Bruno",
    disparabeca: "Rebeca",
    disparajunior: "Júnior",
    disparabeto: "Alberto",
    disparaulisses: "Ulisses",
    disparadarla: "Darla",
    disparawanessa: "Wanessa",
    disparatati: "Tati",
    disparatavares: "Tavares",
    disparatati: "Tati",
    bazzi10: "Bazzi"
  });

  // ==========================================
  // ELEMENTOS DA INTERFACE
  // ==========================================

  const $ = id => document.getElementById(id);

  const wrapper = $("registrationFormWrapper");
  const form = $("registrationForm");
  const success = $("registrationSuccess");

  const selectedPlan = $("selectedPlan");
  const selectedPlanTitle = $("selectedPlanTitle");

  const couponInput = $("couponCode");
  const couponButton = $("applyCoupon");
  const couponFeedback = $("couponFeedback");

  const receipt = $("paymentReceipt");
  const selectedFile = $("selectedFile");

  const stoneButton = $("stonePaymentButton");
  const finishButton = $("finishRegistration");

  // ==========================================
  // ESTADO DA INSCRIÇÃO
  // ==========================================

  let currentStep = 1;
  let cupomAplicado = "";
  let pagamentoIniciado = false;
  let inscricaoCriada = null;
  let enviandoInscricao = false;

  if (!form || !wrapper) {
    console.error(
      "Dispara TechFit: formulário de inscrição não encontrado."
    );
    return;
  }

  // ==========================================
  // UTILITÁRIOS
  // ==========================================

  function formatBRL(value) {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function normalizePhone(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function normalizeCoupon(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getCouponOwner(code) {
    return Object.prototype.hasOwnProperty.call(CUPONS, code)
      ? CUPONS[code]
      : "";
  }

  function getCurrentPrice() {
    return cupomAplicado
      ? PRECO_PROMOCIONAL
      : PRECO_NORMAL;
  }

  function getChecked(name) {
    return form.querySelector(
      `input[name="${name}"]:checked`
    );
  }

  function getValue(id) {
    return String($(id)?.value || "").trim();
  }

  function showMessage(message) {
    window.alert(message);
  }

  // ==========================================
  // COMUNICAÇÃO COM GOOGLE APPS SCRIPT
  // ==========================================

  async function postAPI(payload) {
    let response;

    try {
      response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload),
        redirect: "follow"
      });
    } catch (error) {
      console.error("Erro de conexão:", error);

      throw new Error(
        "Não foi possível conectar ao servidor. " +
        "Verifique sua internet e tente novamente."
      );
    }

    if (!response.ok) {
      throw new Error(
        `Erro de comunicação com o servidor (${response.status}).`
      );
    }

    let result;

    try {
      result = await response.json();
    } catch (error) {
      throw new Error(
        "O servidor retornou uma resposta inválida."
      );
    }

    if (!result || result.success !== true) {
      throw new Error(
        result?.message ||
        "Não foi possível concluir a operação."
      );
    }

    return result;
  }

  // FIM DA PARTE 1

  // ==========================================
  // CONFIGURAÇÃO DO PLANO
  // ==========================================

  function configurePlan() {
    if (selectedPlan) {
      selectedPlan.value = "individual";
    }

    if (selectedPlanTitle) {
      selectedPlanTitle.textContent = "Inscrição Individual";
    }

    updateSummary();
  }

  // ==========================================
  // ABRIR FORMULÁRIO
  // ==========================================

  document
    .querySelectorAll(".registration-button")
    .forEach(button => {
      button.addEventListener("click", () => {
        configurePlan();

        wrapper.classList.add("active");
        showStep(1);
      });
    });

  // ==========================================
  // FECHAR FORMULÁRIO
  // ==========================================

  $("closeRegistration")?.addEventListener("click", () => {
    wrapper.classList.remove("active");
  });

  // ==========================================
  // NAVEGAÇÃO ENTRE ETAPAS
  // ==========================================

  function showStep(step) {
    if (step < 1 || step > 4) return;

    currentStep = step;

    document.querySelectorAll(".form-step").forEach(element => {
      const numero = Number(element.dataset.formStep);

      element.classList.toggle("active", numero === step);
      element.style.display = numero === step ? "block" : "none";
    });

    document.querySelectorAll(".progress-step").forEach(element => {
      const numero = Number(element.dataset.step);

      element.classList.toggle("active", numero === step);
      element.classList.toggle("completed", numero < step);
    });

    if (step === 3) {
      updateSummary();
      updateCouponUI();
    }

    wrapper.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  // ==========================================
  // BOTÕES AVANÇAR
  // ==========================================

  document.querySelectorAll("[data-next]").forEach(button => {
    button.addEventListener("click", () => {
      const destino = Number(button.dataset.next);

      if (!validateStep(currentStep)) {
        return;
      }

      if (destino !== currentStep + 1) {
        return;
      }

      showStep(destino);
    });
  });

  // ==========================================
  // BOTÕES VOLTAR
  // ==========================================

  document.querySelectorAll("[data-prev]").forEach(button => {
    button.addEventListener("click", () => {
      const destino = Number(button.dataset.prev);

      if (destino >= 1 && destino < currentStep) {
        showStep(destino);
      }
    });
  });

  // ==========================================
  // VALIDAÇÕES
  // ==========================================

  function validateStep(step) {

    // ETAPA 1 — DADOS DO ATLETA
    if (step === 1) {
      const nome = getValue("nome1");
      const telefone = normalizePhone(getValue("telefone1"));
      const nascimento = getValue("nascimento1");
      const distancia = getChecked("distancia");

      if (nome.length < 3) {
        showMessage("Informe o nome completo do atleta.");
        $("nome1")?.focus();
        return false;
      }

      if (telefone.length < 10 || telefone.length > 11) {
        showMessage("Informe um telefone válido com DDD.");
        $("telefone1")?.focus();
        return false;
      }

      if (!nascimento) {
        showMessage("Informe a data de nascimento.");
        $("nascimento1")?.focus();
        return false;
      }

      const dataNascimento = new Date(`${nascimento}T12:00:00`);
      const hoje = new Date();

      if (
        Number.isNaN(dataNascimento.getTime()) ||
        dataNascimento > hoje
      ) {
        showMessage("Informe uma data de nascimento válida.");
        $("nascimento1")?.focus();
        return false;
      }

      if (!distancia) {
        showMessage(
          "Selecione a distância: 3 KM, 5 KM ou 10 KM."
        );
        return false;
      }

      if (!["3KM", "5KM", "10KM"].includes(distancia.value)) {
        showMessage("A distância selecionada é inválida.");
        return false;
      }
    }

    // ETAPA 2 — MODELO E TAMANHO
    if (step === 2) {
      const modelo = getChecked("modelo1");
      const tamanho = getChecked("tamanho1");

      if (!modelo) {
        showMessage("Selecione Camisa ou Top.");
        return false;
      }

      if (!["Camisa", "Top"].includes(modelo.value)) {
        showMessage("O modelo selecionado é inválido.");
        return false;
      }

      if (!tamanho) {
        showMessage("Selecione o tamanho do kit.");
        return false;
      }

      if (
        !["PP", "P", "M", "G", "GG", "XG"].includes(tamanho.value)
      ) {
        showMessage("O tamanho selecionado é inválido.");
        return false;
      }
    }

    // ETAPA 3 — PAGAMENTO
    if (step === 3) {
      const pagamento = getChecked("pagamento");

      if (!pagamento || pagamento.value !== "cartao") {
        showMessage("Selecione o pagamento via Stone.");
        return false;
      }

      if (
        couponInput?.value.trim() &&
        normalizeCoupon(couponInput.value) !== cupomAplicado
      ) {
        showMessage(
          "Aplique um cupom válido ou remova o código informado."
        );
        return false;
      }

      if (!pagamentoIniciado) {
        showMessage(
          "Antes de continuar, abra o link de pagamento da Stone."
        );
        return false;
      }
    }

    return true;
  }

  // ==========================================
  // RESUMO DA INSCRIÇÃO
  // ==========================================

  function updateSummary() {
    const distancia = getChecked("distancia");
    const modelo = getChecked("modelo1");
    const tamanho = getChecked("tamanho1");

    if ($("summaryPlan")) {
      $("summaryPlan").textContent = "Individual";
    }

    if ($("summaryAthletes")) {
      $("summaryAthletes").textContent = "1";
    }

    if ($("summaryPrice")) {
      $("summaryPrice").textContent = formatBRL(getCurrentPrice());
    }

    // Detalhes opcionais, caso existam no HTML
    if ($("summaryDistance")) {
      $("summaryDistance").textContent =
        distancia?.value || "Não selecionada";
    }

    if ($("summaryModel")) {
      $("summaryModel").textContent =
        modelo?.value || "Não selecionado";
    }

    if ($("summarySize")) {
      $("summarySize").textContent =
        tamanho?.value || "Não selecionado";
    }
  }

  // ==========================================
  // ATUALIZAÇÃO DA ESCOLHA DO KIT
  // ==========================================

  document
    .querySelectorAll(
      'input[name="distancia"], input[name="modelo1"], input[name="tamanho1"]'
    )
    .forEach(input => {
      input.addEventListener("change", updateSummary);
    });

  // ==========================================
  // MÁSCARA DE TELEFONE
  // ==========================================

  $("telefone1")?.addEventListener("input", event => {
    const digits = normalizePhone(event.target.value).slice(0, 11);

    if (digits.length <= 2) {
      event.target.value = digits;
    } else if (digits.length <= 6) {
      event.target.value =
        `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 10) {
      event.target.value =
        `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else {
      event.target.value =
        `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
  });

  // FIM DA PARTE 2

  // ==========================================
  // CUPONS PROMOCIONAIS
  // ==========================================

  function setCouponFeedback(message, state = "") {
    if (!couponFeedback) return;

    couponFeedback.textContent = message;
    couponFeedback.dataset.state = state;

    couponFeedback.style.color =
      state === "success"
        ? "#22c55e"
        : state === "error"
          ? "#ef4444"
          : "";
  }

  function updateCouponUI() {
    const preco = getCurrentPrice();

    if ($("summaryPrice")) {
      $("summaryPrice").textContent = formatBRL(preco);
    }

    if ($("couponBasePrice")) {
      $("couponBasePrice").textContent =
        formatBRL(preco - TAXA_ADMINISTRATIVA);
    }

    if ($("couponFee")) {
      $("couponFee").textContent =
        formatBRL(TAXA_ADMINISTRATIVA);
    }

    if ($("couponFinalPrice")) {
      $("couponFinalPrice").textContent = formatBRL(preco);
    }

    if ($("couponBreakdown")) {
      $("couponBreakdown").hidden = !cupomAplicado;
    }

    updateStonePaymentLink();
  }

  function applyCoupon() {
    if (!couponInput) return false;

    // Impede mudanças depois de iniciar o pagamento.
    // Não apaga um cupom já aplicado.
    if (pagamentoIniciado) {
      setCouponFeedback(
        "O pagamento já foi iniciado. Não é possível alterar o cupom.",
        "error"
      );
      return false;
    }

    const code = normalizeCoupon(couponInput.value);
    const owner = getCouponOwner(code);

    if (!code) {
      cupomAplicado = "";

      setCouponFeedback(
        "Digite um cupom ou continue sem desconto."
      );

      updateCouponUI();
      return false;
    }

    if (!owner) {
      cupomAplicado = "";

      setCouponFeedback(
        "Cupom inválido. Confira o código informado.",
        "error"
      );

      updateCouponUI();
      return false;
    }

    cupomAplicado = code;
    couponInput.value = code;

    setCouponFeedback(
      `Cupom aplicado! Divulgador: ${owner}. ` +
      `Desconto: ${formatBRL(DESCONTO)}. ` +
      `Total: ${formatBRL(PRECO_PROMOCIONAL)}.`,
      "success"
    );

    updateCouponUI();
    return true;
  }

  couponButton?.addEventListener("click", applyCoupon);

  couponInput?.addEventListener("input", () => {
    if (pagamentoIniciado) return;

    cupomAplicado = "";
    setCouponFeedback("");
    updateCouponUI();
  });

  // ==========================================
  // PAGAMENTO STONE
  // ==========================================

  
function updateStonePaymentLink() {
  if (!stoneButton) return;

  // O mesmo link Stone será utilizado
  // para cartão de crédito e PIX.
  const url = cupomAplicado
    ? PAYMENT_LINKS.promocional
    : PAYMENT_LINKS.normal;

  stoneButton.href = url;

  stoneButton.textContent =
    `PAGAR INSCRIÇÃO — ${formatBRL(getCurrentPrice())}`;

  stoneButton.target = "_blank";
  stoneButton.rel = "noopener noreferrer";
}

stoneButton?.addEventListener("click", event => {

  // Validar etapas obrigatórias
  if (
    !validateStep(1) ||
    !validateStep(2)
  ) {
    event.preventDefault();
    return;
  }

  const pagamento = getChecked("pagamento");

  // Aceitar cartão e PIX
  const formasPermitidas = ["cartao", "pix"];

  if (
    !pagamento ||
    !formasPermitidas.includes(pagamento.value)
  ) {
    event.preventDefault();

    showMessage(
      "Selecione uma forma de pagamento: cartão ou PIX."
    );

    return;
  }

  // Verificar cupom promocional
  if (
    couponInput?.value.trim() &&
    normalizeCoupon(couponInput.value) !== cupomAplicado
  ) {
    event.preventDefault();

    showMessage(
      "Aplique um cupom válido ou remova o código informado."
    );

    return;
  }

  // Atualizar link conforme o preço
  updateStonePaymentLink();

  pagamentoIniciado = true;

  // Bloquear alterações do cupom
  if (couponInput) {
    couponInput.readOnly = true;
  }

  if (couponButton) {
    couponButton.disabled = true;
  }

  setCouponFeedback(
    "Link de pagamento aberto. Após pagar, retorne para enviar o comprovante.",
    "success"
  );
});

  // ==========================================
  // COMPROVANTE DE PAGAMENTO
  // ==========================================

  function validateReceipt(file) {
    if (!file) {
      throw new Error(
        "Selecione o comprovante de pagamento."
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf"
    ];

    const allowedExtensions = /\.(jpe?g|png|pdf)$/i;

    if (
      !allowedTypes.includes(file.type) ||
      !allowedExtensions.test(file.name)
    ) {
      throw new Error(
        "Formato inválido. Envie um arquivo JPG, PNG ou PDF."
      );
    }

    if (file.size <= 0) {
      throw new Error("O arquivo selecionado está vazio.");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        "O comprovante deve ter no máximo 5 MB."
      );
    }

    return true;
  }

  receipt?.addEventListener("change", () => {
    const file = receipt.files?.[0];

    if (!file) {
      if (selectedFile) {
        selectedFile.textContent = "";
      }
      return;
    }

    try {
      validateReceipt(file);

      if (selectedFile) {
        selectedFile.textContent =
          `Arquivo selecionado: ${file.name}`;
      }
    } catch (error) {
      receipt.value = "";

      if (selectedFile) {
        selectedFile.textContent = "";
      }

      showMessage(error.message);
    }
  });

  // ==========================================
  // CONVERTER ARQUIVO PARA BASE64
  // ==========================================

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = String(reader.result || "");
        const commaIndex = result.indexOf(",");

        if (commaIndex === -1) {
          reject(
            new Error("Não foi possível ler o comprovante.")
          );
          return;
        }

        resolve(result.slice(commaIndex + 1));
      };

      reader.onerror = () => {
        reject(
          new Error("Erro ao ler o arquivo selecionado.")
        );
      };

      reader.readAsDataURL(file);
    });
  }

  
  // ==========================================
  // ENVIAR COMPROVANTE PARA O GOOGLE APPS SCRIPT
  // ==========================================

  
async function uploadReceipt(registrationId, phone, file) {
  validateReceipt(file);

  const base64 = await fileToBase64(file);

  return await postAPI({
    action: "uploadComprovante",
    registrationId: String(registrationId),
    telefone: normalizePhone(phone),
    file: {
      name: file.name,
      mimeType: file.type,
      base64: base64
    }
  });
}


  // FIM DA PARTE 3

  // ==========================================
  // MONTAR DADOS DA INSCRIÇÃO
  // ==========================================

  function buildRegistrationData() {
    const distancia = getChecked("distancia");
    const modelo = getChecked("modelo1");
    const tamanho = getChecked("tamanho1");
    const pagamento = getChecked("pagamento");

    if (!distancia || !modelo || !tamanho || !pagamento) {
      throw new Error(
        "Existem informações obrigatórias não preenchidas."
      );
    }

    return {
      plano: "individual",
      nome1: getValue("nome1"),
      telefone1: normalizePhone(getValue("telefone1")),
      nascimento1: getValue("nascimento1"),
      distancia1: distancia.value,
      modelo1: modelo.value,
      tamanho1: tamanho.value,
      formaPagamento: pagamento.value.toUpperCase(),
      regulamentoAceito: true,
      cupom: cupomAplicado,
      divulgador: getCouponOwner(cupomAplicado),
      desconto: cupomAplicado ? DESCONTO : 0,
      valor: getCurrentPrice()
    };
  }

  // ==========================================
  // FINALIZAR INSCRIÇÃO
  // ==========================================

  form.addEventListener("submit", async event => {
    event.preventDefault();

    if (enviandoInscricao) return;

    if (
      !validateStep(1) ||
      !validateStep(2) ||
      !validateStep(3)
    ) {
      return;
    }

    if (!$("regulationAccept")?.checked) {
      showMessage(
        "É necessário aceitar o regulamento do evento."
      );
      return;
    }

    const file = receipt?.files?.[0];

    try {
      validateReceipt(file);
    } catch (error) {
      showMessage(error.message);
      return;
    }

    let data;

    try {
      data = buildRegistrationData();
    } catch (error) {
      showMessage(error.message);
      return;
    }

    enviandoInscricao = true;

    const originalText =
      finishButton?.textContent || "FINALIZAR INSCRIÇÃO";

    if (finishButton) {
      finishButton.disabled = true;
      finishButton.textContent = "PROCESSANDO...";
    }

    try {
      let registrationId = inscricaoCriada;

      // ======================================
      // 1. CRIAR INSCRIÇÃO
      // ======================================

      if (!registrationId) {
        if (finishButton) {
          finishButton.textContent =
            "REGISTRANDO INSCRIÇÃO...";
        }

        const result = await postAPI({
          action: "createRegistration",
          ...data
        });

        registrationId =
          result.registrationId ||
          result.inscricaoId ||
          result.id;

        if (!registrationId) {
          throw new Error(
            "O servidor não retornou o número da inscrição."
          );
        }

        inscricaoCriada = String(registrationId);

        if (result.vacancies) {
          updateVacancies(result.vacancies);
        }
      }

      // ======================================
      // 2. ENVIAR COMPROVANTE
      // ======================================

      if (finishButton) {
        finishButton.textContent =
          "ENVIANDO COMPROVANTE...";
      }

      await uploadReceipt(
        inscricaoCriada,
        data.telefone1,
        file
      );

      // ======================================
      // 3. EXIBIR CONFIRMAÇÃO
      // ======================================

      form.style.display = "none";

      if (success) {
        success.classList.add("active");
        success.style.display = "block";
      }

      if ($("registrationNumber")) {
        $("registrationNumber").textContent =
          inscricaoCriada;
      }

      success?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      // ======================================
      // 4. ATUALIZAR VAGAS
      // ======================================

      loadVacancies();

    } catch (error) {
      console.error(
        "Erro ao finalizar inscrição:",
        error
      );

      if (inscricaoCriada) {
        showMessage(
          `Sua inscrição foi criada com o número ` +
          `${inscricaoCriada}, mas não foi possível ` +
          `concluir o envio do comprovante. ` +
          `Não faça outra inscrição. ` +
          `Tente enviar novamente. ` +
          `Detalhes: ${error.message}`
        );
      } else {
        showMessage(
          error.message ||
          "Não foi possível concluir a inscrição. Tente novamente."
        );
      }

    } finally {
      enviandoInscricao = false;

      if (finishButton) {
        finishButton.disabled = false;
        finishButton.textContent = originalText;
      }
    }
  });

  // ==========================================
  // CONTROLE DE VAGAS
  // ==========================================

  function updateVacancies(data) {
    const vacanciesText = $("vacanciesText");
    const progress = $("vacanciesProgress");

    if (!data || !vacanciesText || !progress) {
      return;
    }

    const total = Number(
      data.vagasTotal ??
      data.total ??
      data.totalSlots ??
      LIMITE_VAGAS
    );

    const occupied = Number(
      data.vagasOcupadas ??
      data.occupied ??
      data.occupiedSlots ??
      data.totalAtletas ??
      0
    );

    const available = Number(
      data.vagasDisponiveis ??
      data.available ??
      data.availableSlots ??
      total - occupied
    );

    if (
      !Number.isFinite(total) ||
      !Number.isFinite(occupied) ||
      !Number.isFinite(available) ||
      total <= 0
    ) {
      console.warn(
        "Dados de vagas inválidos:",
        data
      );
      return;
    }

    const percentage = Math.min(
      100,
      Math.max(0, (occupied / total) * 100)
    );

    progress.style.width = `${percentage}%`;

    if (available <= 0) {
      vacanciesText.textContent =
        "INSCRIÇÕES ESGOTADAS";
    } else if (available <= 10) {
      vacanciesText.textContent =
        `🔥 ÚLTIMAS ${available} VAGAS`;
    } else {
      vacanciesText.textContent =
        `${available} vagas disponíveis`;
    }

    document
      .querySelectorAll(".registration-button")
      .forEach(button => {
        button.disabled = available <= 0;

        button.textContent =
          available <= 0
            ? "ESGOTADO"
            : "QUERO PARTICIPAR";
      });
  }

  // ==========================================
  // CONSULTAR VAGAS NA API
  // ==========================================

  async function loadVacancies() {
    try {
      const response = await fetch(
        `${API_URL}?action=vagas`
      );

      if (!response.ok) {
        throw new Error(
          `Erro HTTP ${response.status}`
        );
      }

      const data = await response.json();

      if (data.success === false) {
        throw new Error(
          data.message || "Erro ao consultar vagas."
        );
      }

      updateVacancies(data.vacancies || data);

    } catch (error) {
      console.warn(
        "Não foi possível consultar as vagas:",
        error
      );

      const vacanciesText = $("vacanciesText");

      if (
        vacanciesText &&
        vacanciesText.textContent.includes("Consultando")
      ) {
        vacanciesText.textContent =
          "Disponibilidade sob consulta";
      }
    }
  }

  // ==========================================
  // INICIALIZAÇÃO
  // ==========================================

  configurePlan();

  updateCouponUI();

  showStep(1);

  // Oculta o formulário até o atleta clicar
  // em QUERO PARTICIPAR.
  wrapper.classList.remove("active");

  // Mantém a tela de confirmação oculta.
  if (success) {
    success.classList.remove("active");
    success.style.display = "none";
  }

  // Consulta a disponibilidade.
  loadVacancies();

  console.info(
    "Dispara TechFit Ano III — módulo de inscrições inicializado."
  );

  
function formatPhone(value) {
  const digits = String(value || "")
    .replace(/\D/g, "")
    .slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function isValidMobilePhone(value) {
  const digits = String(value || "").replace(/\D/g, "");

  return /^[1-9][0-9]9[0-9]{8}$/.test(digits);
}


});


