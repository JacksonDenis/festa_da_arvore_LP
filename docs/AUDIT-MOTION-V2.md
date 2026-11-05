# Auditoria da revisão de scroll e detalhes

14/10/2026 — atualização solicitada após a primeira entrega. Este relatório substitui as observações de composição/motion da auditoria inicial. O backend e o fluxo de dados não foram alterados.

## Resultado

**Anti-generic-review: PASS.** A composição mantém identidade navy/creme/dourado e os assets da Festa da Árvore, agora com leitura editorial e sobreposição dos três primeiros prêmios. A referência jurídica foi analisada localmente no ZIP/texto, sem copiar seus ativos, nomes, contatos ou código.

**Site-auditor para a revisão local: PASS WITH WARNINGS.** Viewports emulados e efeitos funcionam; preferência reduced foi simulada, não configurada no SO; testes em hardware mobile e rede de produção continuam pendentes. Publicação e coleta real permanecem bloqueadas como na primeira entrega, por decisão do usuário de integrar depois.

## Revisão visual fundamentada

| Critério anti-generic | Evidência |
| --- | --- |
| Sem logo/personagem, seria genérico? | Ondas, ramos, lettering e sequência fé/celebração continuam reconhecíveis. |
| Hero de template? | Marca monumental em plano posterior, texto e figura em camadas distintas, brilho localizado e informações práticas. |
| Cards em excesso? | Apenas três destaques narrativos; sete itens escaneáveis, regras em lista e conversão editorial. Não há dez cards full screen. |
| Ideia reconhecível? | Luz → vida → celebração, com paleta e elementos aprovados. |
| Signature Moment? | Três painéis sobrepostos, com escala do anterior e perspectiva de entrada do seguinte. |
| Mudança de ritmo? | Paisagem ampla, frase progressiva, letreiro, três capítulos, grade curta, passos e formulário. |
| Tipografia ativa? | Contorno monumental acompanha scroll, título tem brilho, frase ganha ênfase por palavra. Texto permanece legível e acessível. |
| Imagens do projeto? | Mesmos Hero/prêmios V2 e marcas originais; nenhum ativo da advocacia. |
| Motion coerente? | Entradas suaves, profundidade e deslocamentos curtos, com scroll nativo e redução em mobile. |
| Personalidade? | Linguagem mais cinematográfica, vinculada à festa e à mensagem institucional. |

## Execução no Chrome DevTools MCP

- Desktop 1440×1000: Hero e painéis inspecionados; scroll em 2100 e 2700px confirmou top sticky 116/134/152px, matrizes de perspectiva, escala do painel anterior e letreiro horizontal.
- Tablet 768×1024: sem overflow; primeiro painel 470px de altura, legível abaixo do header.
- Mobile 390×844 e 320×740: sem overflow; 3 capítulos em `position:relative`, superfícies sem transform, figuras contain e rosto preservado; títulos sem cortes. Grade contém os outros sete itens.
- Reduced simulado via matchMedia de teste e aplicação da regra CSS correspondente: três painéis static, transform none, animações none, linha de progresso escondida; 13/13 palavras da frase ativas. Sem alteração persistida no código ou SO.
- Brilho de título: evento pointer sintético atualizou coordenadas para 60%/40%; camadas decorativas aria-hidden. Snapshot acessível contém somente um título “Eu Sou AQUELE QUE SOU”. Números puramente decorativos têm alternativa CSS vazia.
- Todos os links de âncora possuem destino. Formulário permanece desabilitado pela resposta do backend; patrocinadores não existem no DOM ativo.
- Recursos locais carregaram, 0 imagens quebradas após decode. Console sem errors/warnings próprios na inspeção. Scripts passaram na checagem de sintaxe.
- Build repetido sem duplicar capítulos: HTML contém exatamente 3 destaques + 7 cards na ordem do JSON. Conteúdo dos prêmios existe sem JS.

## Performance e limites

Chrome em loopback, desktop 1440×1000, CPU 1× e sem throttling de rede: LCP 353ms, CLS 0.00. Não há dados de campo e a máquina injeta scripts do antivírus Kaspersky, que interferem nas medições.

Amostra automatizada de 70 posições de scroll: p95 de intervalo de frame 33,3ms e máximo 66,8ms após organização das leituras antes das escritas de CSS. Isso não comprova 60fps em todos os dispositivos. Uma amostra anterior registrou zero long tasks. A inicialização do trace apontou forced reflow; leituras geométricas do render foram agrupadas antes das mutações para mitigar esse padrão. Camadas de composição só são promovidas enquanto os capítulos estão visíveis. Não existe loop requestAnimationFrame permanente, captura de wheel/touch, Lenis, GSAP ou WebGL.

`21st search` continuou sem acesso (HTTP 401); contexto local teve BOM removido. `21st review` apontou cinco informações sobre cores literais, sem erro funcional; são variações intencionais dos tokens da marca. Nenhuma dependência nova de execução foi instalada.

## Evidências

- [Hero desktop](screenshots/motion-hero.jpg)
- [Scroll entre os capítulos 2 e 3](screenshots/motion-stack.jpg)
- [Página completa em mobile](screenshots/motion-mobile.jpg)
- [Direção e especificação dos efeitos](MOTION-V2.md)

Integrações, política de privacidade, revisão do regulamento e confirmação real de recebimento continuam na etapa posterior, conforme [README](../README.md). A revisão visual não libera publicação.
