# Project Handoff

## Project
Festa da Árvore 2026 — **Eu Sou Aquele Que Sou** (Êxodo 3:14), realização Grupo de Oração Renascer em Cristo. Versão criativa **Premium Cinematic V2 — Presença que Transforma**. Blueprint `schemaVersion: 1.1`, revisão `v5`. O Handoff é o gate criativo de BLUEPRINT para BUILD, não atesta implantação ou publicação.

## Mode
`CREATE` — landing page original para divulgação de evento e geração de leads.

## Level
`PREMIUM`. Motion editorial, hero em camadas e poucos momentos sticky. Sem vídeo ou WebGL obrigatórios.

## Goal
Comunicar fé, louvor, alegria e comunhão, apresentar os dez prêmios, informar data/horário/local/preço e captar interessados em cartelas para atendimento por vendedor. A inscrição online não vende cartelas, não emite canhoto e não habilita automaticamente o sorteio.

## Audience
Público geral, famílias e comunidade; participação na comunicação não limitada a membros da igreja.

## Primary CTA
**Tenho interesse na cartela** → `#cadastro`. No formulário: **Quero falar com um vendedor**.

## Business / Content Context
- Tema: **Eu Sou Aquele Que Sou**; referência: **Êxodo 3:14**; mensagem: **Um povo plantando vida para um amanhã mais cheio da presença de Deus.**
- Evento: **05/12/2026 às 19h**, **Casa de Missão Renascer em Cristo**, Rua Dr. Procópio, 1154 — Aracapé. **Cidade/UF não informados**: não inventar mapa ou link de rota.
- Cartela: **R$ 10,00**. Dez prêmios, conforme `blueprint.json` e `assets/v2/docs/prizes.json`: bicicleta elétrica; um salário mínimo; geladeira; fogão; televisão; celular; ventilador; liquidificador; cestão; Kit Vida Nova (Bíblia, terço e blusa). As imagens V2 são **ilustrativas**, sem compromisso de marca/modelo/itens exatos.
- Regras informadas: vendedor recolhe o canhoto preenchido no ato da venda; extração física dos canhotos no dia do evento; presença do ganhador não obrigatória; contato posterior possível; cada canhoto premiado é definitivamente retirado e **a mesma cartela não pode ganhar novamente**. Não inferir limite por pessoa que possua mais de uma cartela.
- A organização declarou possuir documentação/validação jurídica, mas **não foi apresentada nem revisada**. O usuário optou por adiar a revisão na preparação criativa. **Não declarar autorização ou conformidade legal verificada**. Publicação de publicidade do sorteio depende de revisão responsável das regras e obrigações aplicáveis.
- Lead: responsável comercial **Maninha**; notificação automática para WhatsApp **+55 85 98574-1485** (`+5585985741485`) e e-mail **jackson.denis@live.com**. O vendedor escolhe o canal do atendimento subsequente.
- Armazenamento, credenciais de envio, política de privacidade, condições completas do sorteio e detalhes de apuração/entrega: dependências reais do Build/publicação.

## Creative Direction
Preservar a **identidade original** enviada: azul profundo, dourado, creme, turquesa/terracota auxiliares, serif editorial e composição de natureza/luz. A V2 adiciona recorte derivado de Jesus em foreground, paisagem limpa e overlay de luz. Marcas originais verificadas em `assets/approved-originals/` prevalecem sobre cópias diferentes de mesmo nome no pacote V2. Não substituir identidade sem aprovação.

## Experience Concept
**Presença que Transforma:** uma passagem da luz e acolhimento do Hero para a vida comunitária, os dez prêmios e um CTA sem fricção. Visual anchor: Jesus de braços abertos com halo, céu e paisagem do pacote em camadas. **Signature Moment:** transição dourada/ondas entre Hero e seção institucional, reforçada por revelação progressiva (sticky moderado) dos prêmios, sem sequestrar a rolagem.

## Required Sections
1. `header`: marca horizontal, navegação, CTA. Sem link de patrocinadores no release 1.
2. `hero`: arte em camadas (fundo, gradiente, luz, personagem), headline HTML, data/horário/local/preço e dois CTAs.
3. `sobre`: Presença que Transforma, Êxodo 3:14 e frase institucional, ondas/ramos da identidade.
4. `premios`: dez itens ordenados; bicicleta elétrica em maior destaque; aviso de imagens ilustrativas; bloco interno **Como participar** com canhotos e regras confirmadas; CTA `#cadastro`.
5. `cadastro`: campos nome, WhatsApp, e-mail opcional, quantidade de cartelas, mensagem opcional, aviso de privacidade/ciência conforme revisão; validações, envio, deduplicação, loading/sucesso/erro e notificações.
6. `patrocinadores`: estrutura preparada, **oculta no release 1**; ativar com logomarcas oficiais na segunda publicação.
7. `local`: data, horário, local, valor e endereço textual; mapa SOMENTE com localização validada.
8. `footer`: realização, marcas, links sociais somente quando confirmados, privacidade/regras publicáveis após revisão.
Não criar uma programação com atrações ou horários não fornecidos.

## Motion
- Referência Advogado Premium: **padrões** de profundidade, tipografia editorial, scroll reveal e cards sticky. Não copiar identidade, mídia, texto ou código.
- No desktop: Hero layered com parallax muito leve, contraste para CTA, transição luminosa; no bloco de prêmios, sticky progressivo **limitado a poucos destaques** + grade legível dos dez itens; não empilhar dez cards de viewport inteira.
- Mobile: personagem sempre visível (`contain`), texto antes da cena quando necessário, sem parallax custoso nem sticky longo. `prefers-reduced-motion` e navegação por teclado obrigatórios; fallback estático funcional.

## Assets
`assets/approved-originals/`: dez materiais originais da conversa (cartela, marca da realização, identidade, fundo nativo, marca principal e secundária, assinatura, post e mockup aprovado).
`assets/v2/`: pacote validado pelo usuário, incluindo `hero/`, `prizes/`, `web/`, `decor/`, `icons/`, `social/` e `docs/`. V2 Hero e prêmios ilustrativos aprovados explicitamente. `asset-manifest.md` lista o uso e conflitos de versões. **Não são necessárias novas imagens ou vídeo antes do Build.**

## References
Primárias: mockup original aprovado `assets/approved-originals/festa_da_árvore_2026_presença_que_transforma.png`; arte original `fundo_sem_texto_nativo.png`; preview de composição V2 `assets/v2/preview/hero_composicao.jpg`; documentação de camadas/prêmios V2.
Secundária: https://advogadopremium.vercel.app/ — inspiração para motion e layering, não réplica. Veja `references.md`.

## Constraints
- Release 1 sem patrocinadores visíveis; liberar na segunda subida com marcas autorizadas.
- O formulário **não** compra/reserva/gera cartela, número ou inscrição automática no sorteio.
- Persistência de lead e notificações por **e-mail E WhatsApp** são requisitos: configurar backend/integrações autorizadas e monitoramento de falhas. Um `wa.me` é apenas atalho para conversa, **não** notificação automática.
- Não expor chaves de API nem dados pessoais no frontend; evitar coleta excessiva; estabelecer política e tratamento LGPD antes da publicação do formulário.
- **REVISÃO JURÍDICA NÃO REALIZADA:** conteúdo e condições oficiais de sorteio precisam de aprovação competente antes de liberar a divulgação pública. Não registrar número de autorização fictício.
- Cidade/UF e rota não confirmados: mostrar endereço textual até validação.
- Imagens dos prêmios são ilustrativas, não afirmar modelos/marcas/valores não confirmados (especialmente salário mínimo).
- Respeitar responsividade, Core Web Vitals e acessibilidade; elementos de motion não podem obstruir CTA ou formulário.

## What Must Not Change
- Tema e identidade visual **Eu Sou Aquele Que Sou** / **Presença que Transforma**, logos originais e o mockup aprovado como hierarquia visual.
- Hero Premium V2 com fundo limpo, Jesus recortado, luz e profundidade; prêmios V2 e aviso de ilustração.
- Dez prêmios na ordem confirmada, valor de R$ 10,00, data/horário/local e mecânica conhecida do canhoto.
- CTA de captação (não venda); Maninha como destinatária de WhatsApp e e-mail; patrocinadores ocultos no release 1.

## Success Criteria
- Site responsivo em desktop e mobile (incl. 390px) sem overflow, Hero legível sem corte de rosto, navegação/CTA corretos; reduced motion acessível.
- Dez prêmios corretos, com ilustrações indicadas; Como participar coerente com regras informadas.
- Formulário registra lead uma vez e indica status correto; e-mail + WhatsApp para Maninha efetivamente enviados em testes end-to-end, com erros e reenvios administráveis.
- Patrocinadores e menu correspondentes ocultos no release 1; placeholders nunca publicados como marcas reais.
- Endereço textual fiel; mapa apenas se validado; links sociais apenas se fornecidos.
- SEO, Open Graph, favicon, performance, segurança, privacidade e testes de acessibilidade concluídos; nenhuma falha crítica em audit.
- **Gate de publicação:** documentos/afirmações do sorteio e obrigações legais aplicáveis analisados/validados fora do Handoff criativo; política de privacidade e notificações operacionais em conformidade.
