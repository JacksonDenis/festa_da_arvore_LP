# Auditoria — Hero líquido, mensagem e carrossel

14/10/2026. Atualiza a revisão Motion V2 por solicitação do usuário. Projeto local, sem integração real de leads ou publicação.

## Alterações verificadas

- Subtexto “Prêmios divulgados na cartela / da edição 2026.” removido do HTML e da página renderizada.
- Faixa de mensagens convertida em carrossel contínuo com trilhas idênticas. Pausa e retomada testadas: `animationPlayState` paused/running e `aria-pressed` true/false coerentes. Mouse sobre o letreiro pausa; foco de teclado no controle pausa; reduced motion apresenta frases estáticas sem grupo duplicado.
- Mensagem lateral: creme sobre painel navy quase opaco, serif 21px desktop, 18px tablet, 19px mobile. Não depende de luz/cor da foto. No mobile é exibida abaixo da figura, sem palavras coladas ou rosto coberto.
- WebGL 1 implementa splat, divergência, 16 passos de pressão Jacobi, subtração de gradiente, advecção de velocidade/campo e renderização dos dois assets existentes com UVs cover/contain. Não há distorção de texto ou navegação.

## Anti-generic-review — PASS

Os dez critérios da skill continuam atendidos: identidade preservada sem depender só da marca; Hero específico em camadas; cards restritos à narrativa dos prêmios; ideia de luz/presença reconhecível; fluido local é o momento novo; ritmo entre cena, carrossel, destaques e grade; serif participa; assets exclusivos da festa; motion coerente e delimitado; composição tem personalidade. O painel da mensagem corrige uma falha local de legibilidade sem reconstruir a identidade. A referência FLUX não substituiu a marca ou o restante da página.

## Site-auditor — PASS WITH WARNINGS para esta etapa local

Ferramenta: Chrome DevTools MCP em Windows, http://127.0.0.1:4173. Viewports emulados 1440×1000, 768×1024, 390×844 e 320×740. Não equivale a teste em aparelho físico.

| Item | Resultado / evidência |
| --- | --- |
| Responsividade | Verificado: nenhum overflow nos quatro tamanhos; frase exibida em mobile (284px de largura em viewport 320px); dez prêmios preservados. |
| Inicialização GPU | Verificado: float framebuffers completos, canvas ready 1400×892 no desktop. Console final sem errors/warnings próprios. |
| Interação líquida | Verificado com instrumentação temporária do draw e leitura de amostra RGBA: checksum inicial 2755659867; movimento do pointer alterou pixels; após 212 frames de dissipação, checksum voltou exatamente ao inicial e número de draws parou de crescer. Instrumentação removida no reload seguinte. |
| Controles protegidos | Verificado: um h1 acessível, âncoras com destinos válidos; canvas aria-hidden e pointer-events none. Links e texto ficam no plano superior. |
| Recursos e proporção | Verificado visualmente: mesmo fundo/recorte do Hero, imagem contain sem corte de rosto, nenhuma mídia FLUX importada. Upload RGBA linear/clamp; FBOs float com amostragem bilinear manual. |
| Falha de extensão GPU | Teste com OES_texture_float indisponível: estado fallback, canvas não ativo, fundo e personagem visíveis. Warning de fallback esperado, sem quebra da página. |
| Perda de contexto | WEBGL_lose_context simulado: estado context-lost, fundo/figura/título visíveis. |
| Resize | Desktop → mobile → tablet → desktop: canvas desativado em mobile, reativado e reconstruído ao voltar a pointer fino desktop; sem overflow. |
| Reduced motion | Preferência e CSS simulados: canvas display none, sem classe fluid-ready; carrossel sem animação, segundo grupo e controle ocultos. Sem alteração do SO. |
| Energia / loop | Verificado: loop termina após dissipar, não roda continuamente em repouso; offscreen/aba oculta interrompem. Simulação 192px de altura; draw buffer limitado a 1400px de largura; um quad reutilizado. |
| Performance | Laboratório local, CPU 1×, rede sem throttling: LCP 568ms e CLS 0.00. Amostra de 70 frames com pointer em movimento: p95 17ms, máximo 17ms. Não comprova resultado em outros dispositivos; antivírus da máquina injeta scripts e pode influenciar. |
| Formulário / backend | Código do backend não alterado; coleta continua desabilitada, conforme decisão do usuário. Testes reais de recebimento continuam pendentes. |
| SEO / publicação | Title, metadata e noindex preservados. Gates de publicação da etapa anterior continuam válidos; nenhuma publicação executada. |

`npm run build` e sintaxe dos JS passaram. `21st review` apresentou uma observação informativa de cor literal do painel, intencional para contraste. Nenhuma dependência de execução adicionada. Scroll e touch não são interceptados pelo efeito.

Capturas: [desktop](screenshots/hero-fluid-desktop.jpg), [carrossel](screenshots/carousel-desktop.jpg), [frase mobile](screenshots/hero-quote-mobile.jpg).

Pendências da publicação não mudaram: política de privacidade, regulamento revisado, provedores e teste de recebimento real. Ver [README](../README.md).
