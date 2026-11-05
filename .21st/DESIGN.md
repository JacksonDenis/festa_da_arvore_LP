# Festa da Árvore 2026 — direção e plano

CREATE / PREMIUM. Fontes: seis arquivos .factory, mockup original 935×1683, Hero V2 1200×630, JSONs de camadas e prêmios. Documentos são especificações do projeto; alegações de aprovação e conformidade não são verificações atuais. Originais canônicos preservados; recorte de Jesus é derivado, prêmios ilustrativos.

## Reference DNA
LAYOUT: header creme, eixo textual esquerdo, figura direita, ondas entre superfícies, seção institucional em duas colunas, prêmios navy, captura creme e serviço navy. Mobile não comprovado pelo screenshot: proposta em fluxo texto/cena.
TYPOGRAPHY: serif monumental e sans de serviço. COLOR: navy #002f46, creme #f5edda, dourado #d3922d; dourado sobre claro reservado a ornamento. COMPOSITION: luz e braços abertos, fundo natural, ornamentos de ramo. MOTION: screenshot não comprova movimento; referência web secundária acessível em Chrome, interpretada apenas como profundidade editorial. RHYTHM: paisagem → mensagem → produtos → formulário → serviço. INTERACTION: âncoras e formulário de interesse. REUSABLE PATTERNS: biblioteca, experience-blocks e motion-presets consultados; pastas vazias, sem implementações reutilizáveis. DO NOT COPY: ativos, código, identidade jurídica, mapa ilustrativo, patrocínios e redes inexistentes.

## Art direction
Concept: Presença que Transforma, luz que se torna encontro comunitário.
Visual Anchor: figura de braços abertos e paisagem dourada contra navy.
Art Direction: natureza luminosa, ondas e ramos existentes, marcas originais sem redesenho.
Typography Direction: Georgia serif monumental, títulos de duas escalas; sans do sistema para informações e formulário, sem fonte remota.
Color Language: creme para leitura; navy para acolher cena/prêmios; dourado para ação com texto navy e ornamento.
Composition: grade 1200px, texto/cena no desktop, texto acima da cena mobile; produtos compactos com bicicleta maior.
Visual Rhythm: Hero amplo, pausa institucional, vitrine com destaque, conversão e serviço.
Motion Language: 12px de profundidade máxima, entrada 500ms, foco imediato; nenhum scroll preso.
Signature Moment: ondas douradas saindo da cena e conduzindo ao ramo/frase; versão estática igualmente legível.

## Frontend diagnóstico
As nove perguntas têm decisões concretas: ideia na luz/ondas; hierarquia título→data→CTA; escala 100px/48px/16px; alternância navy/creme; serif participa da composição; duas colunas, vitrine e faixa de serviço variam; ondas são momento memorável; imagens aprovadas contam a história; somente produtos são cards, formulário tem função operacional.

## Component Mapping / Build Plan
Header → nav HTML e disclosure mobile. Hero → picture + gradiente + luz + figura contain + título HTML. Sobre → composição editorial + ramo. Prêmios → bicicleta sticky curta + grade ordenada de nove itens. Como participar → lista de cinco passos. Cadastro → form com labels, validação e status vivo. Patrocinadores → template inerte, sem menu. Local → address e fatos, sem mapa. Footer → marcas originais.
Stack: HTML/CSS/JS e Node nativo, SQLite transacional para leads/fila; sem dependências de execução. 21st consultado: HTTP 401, nenhum componente obtido. Não há necessidade de React/shadcn para primitives HTML nativas nesta página.

## Matriz de motion
Entrance: 500ms ease-out, opacity .85→1 e translateY 12→0, uma vez ao entrar; mobile 6px; reduced estático.
Scroll: bicicleta sticky só dentro da vitrine desktop, sem pin; mobile/reduced estático.
Hover: CTA muda cor em 160ms; foco tem outline, touch recebe estado active.
Transitions: menu e estado do envio imediatos, sem espera narrativa.
Parallax: figura 0→12px, requestAnimationFrame somente desktop enquanto Hero visível; mobile/reduced desativado.
Typography motion: revelação do bloco, sem separar letras, CTA sempre disponível.
Image reveal: mesma entrada curta dos produtos, sem ocultar informação se JS falhar.
Signature interaction: ondas estáticas conectam Hero/Sobre, sem animar geometria; leitura não depende de scroll.
GSAP/Lenis/Three/WebGL não necessários: CSS sticky e IntersectionObserver resolvem a composição.

## Bloqueios
Usuário confirmou ausência de backend, provedores e política e pediu integrações posteriores. Construção local, coleta desligada por padrão. Não publicar antes dos gates do HANDOFF. Política, controlador, retenção, regulamento e provas de recebimento real pendentes.
