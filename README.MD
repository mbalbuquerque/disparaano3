# 🏃 Dispara TechFit 2026

Plataforma web desenvolvida para gerenciamento de inscrições do **Dispara TechFit 2026**, contemplando inscrição de atletas, controle automático de vagas, pagamentos, comprovantes e painel administrativo.

O sistema utiliza uma arquitetura leve baseada em **HTML, CSS e JavaScript no front-end**, com **Google Apps Script e Google Sheets no back-end**.

---

## 🚀 Funcionalidades

### 👤 Inscrição Individual

- Cadastro de 1 atleta
- Valor: **R$ 87,00**
- Dados pessoais
- Telefone
- Data de nascimento
- Escolha do kit
- Escolha de tamanho
- Aceite do regulamento
- Pagamento via PIX ou cartão
- Envio de comprovante

### 👫 Inscrição Casadinha

- Cadastro de 2 atletas
- Valor: **R$ 139,90**
- Dados individuais dos participantes
- Escolha de kit para cada atleta
- Controle de duas vagas por inscrição
- Pagamento via PIX ou cartão
- Envio de comprovante

---

## 🎟️ Controle de vagas

O evento possui capacidade configurada para:

```text
200 atletas
```

O controle de vagas é realizado dinamicamente pelo back-end.

A API retorna:

```json
{
  "success": true,
  "total": 200,
  "occupied": 11,
  "available": 189,
  "soldOut": false
}
```

> Os números acima são apenas um exemplo do estado da API durante o desenvolvimento. A quantidade disponível é atualizada conforme as inscrições e cancelamentos.

### Regras

- Individual ocupa **1 vaga**
- Casadinha ocupa **2 vagas**
- Casadinha é bloqueada quando resta somente 1 vaga
- Inscrições são bloqueadas quando não existem mais vagas
- Cancelamentos devolvem vagas ao evento

---

## 💳 Pagamentos

O projeto possui integração com links de pagamento da **Stone**.

Cada modalidade possui seu próprio checkout:

- Individual → checkout específico
- Casadinha → checkout específico

Por segurança e organização, o sistema identifica o plano escolhido antes de direcionar o participante ao checkout correspondente.

Também existe suporte para pagamento via PIX.

---

## 🧾 Comprovantes

O participante pode enviar comprovante de pagamento.

Formatos aceitos:

```text
JPG
PNG
PDF
```

Tamanho máximo:

```text
5 MB
```

O comprovante fica associado ao número da inscrição.

---

## 🛡️ Painel Administrativo

O projeto possui painel administrativo independente do site público.

Principais recursos:

- Dashboard
- Total de inscrições
- Total de atletas
- Vagas ocupadas
- Vagas disponíveis
- Pagamentos aguardando confirmação
- Comprovantes recebidos
- Pagamentos confirmados
- Inscrições canceladas
- Inscrições individuais
- Inscrições Casadinha
- Visualização de comprovantes
- Confirmação de pagamento
- Cancelamento de inscrição
- Registro de ações administrativas

O acesso administrativo utiliza autenticação e validação no back-end.

---

## 📊 Status das inscrições

O sistema trabalha com estados de pagamento/inscrição, permitindo acompanhar o fluxo desde o cadastro até a confirmação administrativa.

Exemplo:

```text
Inscrição
   ↓
Aguardando pagamento
   ↓
Comprovante enviado
   ↓
Pagamento confirmado
```

Também existe suporte ao cancelamento administrativo.

---

## 🔐 Segurança

Algumas medidas implementadas:

- Validação de ações no back-end
- Separação entre API pública e área administrativa
- Lista de ações GET/POST permitidas
- Validação administrativa
- Registro de eventos de segurança
- Validação de arquivos enviados
- Normalização de telefone
- Validação de dados antes do envio
- Links externos abertos com proteção `noopener/noreferrer`

Credenciais, tokens e arquivos secretos não devem ser versionados no GitHub.

---

## 🖼️ Galeria

O site possui galeria com imagens da edição anterior do evento.

Estrutura:

```text
assets/
└── images/
    └── edicao-anterior/
        ├── 01.png
        ├── 02.png
        ├── ...
        └── 010.png
```

O carrossel possui:

- navegação anterior/próxima
- indicadores
- adaptação para imagens em diferentes proporções
- layout responsivo

---

## 🏗️ Arquitetura

```text
Usuário
   │
   ▼
Front-end
HTML + CSS + JavaScript
   │
   │ HTTPS
   ▼
Google Apps Script
   │
   ├── API de inscrições
   ├── Controle de vagas
   ├── Comprovantes
   ├── Administração
   └── Segurança
   │
   ▼
Google Sheets
```

Pagamentos:

```text
Front-end
   │
   ├── PIX
   │
   └── Stone
        │
        ▼
   Checkout externo
```

---

## 🛠️ Tecnologias

### Front-end

- HTML5
- CSS3
- JavaScript
- Design responsivo

### Back-end

- Google Apps Script
- Google Sheets

### Pagamentos

- PIX
- Stone

### Hospedagem

Planejada:

- GitHub
- Netlify

---

## 📁 Estrutura do projeto

```text
dispara/
│
├── index.html
├── README.md
├── .gitignore
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   ├── inscricao.js
│   ├── consulta.js
│   └── carousel.js
│
└── assets/
    └── images/
```

A estrutura pode variar conforme a evolução do projeto.

---

## 🌐 API

O front-end se comunica com um Web App desenvolvido em Google Apps Script.

Exemplo de consulta pública de vagas:

```text
GET /exec?action=vagas
```

Resposta:

```json
{
  "success": true,
  "total": 200,
  "occupied": 11,
  "available": 189,
  "soldOut": false
}
```

---

## 📱 Responsividade

A interface foi preparada para utilização em:

- Desktop
- Notebook
- Tablet
- Smartphone

---

## ⚠️ Pendências conhecidas

A versão atual possui uma funcionalidade que ainda será revisada:

### Consulta "Já me inscrevi"

O módulo de consulta pública da inscrição precisa passar por nova validação antes de ser considerado concluído.

Essa pendência não interfere no controle de vagas, painel administrativo ou cadastro principal.

---

## 📌 Status do projeto

### Versão atual

```text
Versão 1.0 — Pré-produção
```

### Implementado

- [x] Landing page
- [x] Layout responsivo
- [x] Inscrição Individual
- [x] Inscrição Casadinha
- [x] Seleção de kit
- [x] Controle automático de vagas
- [x] API de vagas
- [x] Google Sheets
- [x] Google Apps Script
- [x] Pagamento PIX
- [x] Links Stone
- [x] Upload de comprovante
- [x] Painel administrativo
- [x] Visualização de comprovante
- [x] Confirmação de pagamento
- [x] Cancelamento de inscrição
- [x] Controle de vagas após cancelamento
- [x] Galeria da edição anterior
- [x] Segurança básica da API
- [ ] Revisão da consulta "Já me inscrevi"
- [ ] Deploy de produção no Netlify

---

## 🧪 Testes antes da produção

Antes da publicação definitiva, recomenda-se validar:

```text
Inscrição Individual
        ↓
Pagamento
        ↓
Comprovante
        ↓
Painel Administrativo
        ↓
Confirmação
        ↓
Atualização das vagas
```

E:

```text
Inscrição Casadinha
        ↓
2 vagas ocupadas
        ↓
Cancelamento
        ↓
2 vagas devolvidas
```

---

## 👨‍💻 Desenvolvimento

Projeto desenvolvido para gerenciamento digital do evento **Dispara TechFit 2026**.

Repositório:

`mbalbuquerque/disparaano3`

---

## 📄 Licença

Projeto desenvolvido para uso do evento Dispara TechFit.

O código, identidade visual, imagens e demais materiais devem respeitar as autorizações e direitos de seus respectivos proprietários.