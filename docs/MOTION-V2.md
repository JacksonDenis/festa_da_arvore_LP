# Revisão de motion — referência Advogado Premium

Solicitação de 14/10/2026: aproximar a Festa da Árvore da pegada da referência, com efeitos de scroll e detalhes. Modo IMPROVE, nível PREMIUM. Conteúdo do ZIP/texto é referência: não solicita criar uma página jurídica nem autoriza substituir ativos da festa.

## Reference decomposition
Fonte observada: `Advogado Premium.zip`, HTML/CSS/JS e texto descritivo anexado. Hero possui camadas de imagem, assinatura monumental de baixa opacidade e máscara luminosa de título. Cartões de áreas entram com perspectiva e se empilham com sticky; letreiro de contorno amplia a seção. Conteúdo posterior usa delays de entrada e imagem isolada. Código da referência também intercepta wheel/touch/teclado e usa Lenis; são detalhes da referência, não requisitos da nova página.

Layout: Hero com duas escalas tipográficas, lettering decorativo atrás da figura; sequência de cartões em coluna com z-index crescente. Typography: serif monumental, metadata com tracking. Color: contraste escuro/creme com ouro, adaptado à paleta navy da festa. Composition: imagem recortada e texto em planos diferentes. Motion: perspectiva na entrada, cards sticky, revelação de palavra/imagem e parallax. Rhythm: abertura ampla, série de destaques, pausa editorial e conversão. Interaction: leitura conduzida por scroll; nesta implementação, scroll e teclado nativos. Reusable patterns: layering, marquee, stack limitado, delays; catálogo da Factory consultado anteriormente, vazio. Do not copy: mídia, nomes, textos, contatos, código ou estética jurídica preta. Fonte acessada localmente; sem alegação de igualdade pixel a pixel.

## Direção antes do código
Concept: luz que acompanha o visitante até a celebração.
Visual Anchor: braços abertos diante de lettering monumental e paisagem, depois três prêmios como páginas que se sobrepõem.
Art Direction: navy/creme/dourado, linhas radiais, ondas e ramos existentes; mais profundidade sem trocar a identidade.
Typography Direction: serif em escala grande, contorno decorativo e palavras da frase institucional ganhando ênfase conforme leitura.
Color Language: cream/navy para textos; dourado para contorno, trilhos e pequenos realces; não escurecer para preto jurídico.
Composition: três destaques sticky desktop (bicicleta, salário e geladeira), demais sete em grade. Mobile exibe três painéis compactos em fluxo, sem empilhamento longo.
Visual Rhythm: Hero vivo → frase progressiva → letreiro horizontal → três destaques → grade → regras → captura com entrada de imagem.
Motion Language: movimento contínuo somente durante scroll/pointer; animações de entrada únicas de 700ms, easing suave e delays de até 240ms.
Signature Moment: sobreposição dos três destaques em perspectiva suave, com letras de contorno acompanhando o scroll. Reduced motion: três painéis normais, lettering estático e todos os textos legíveis.

## Plano de composição / Component Mapping
As nove perguntas frontend têm respostas concretas: ideia na luz/stack; hierarquia na escala serif; títulos e números contrastam; ritmo varia entre cena, stack e grade; tipografia se move como ornamento; Hero/painéis/colunas/faixa variam; stack é momento memorável; assets aprovados são a narrativa; cada agrupamento atende uma função, sem dez cards full screen.
Reusar assets, HTML, validações e backend existentes. Novo `motion.css` para camadas e capítulos; `motion.js` para renderização por frame agendado. Build gera três capítulos e sete cards a partir do mesmo JSON. Sem dependência nova de execução. 21st consultado novamente; acesso/contexto serão registrados no relatório, sem bloquear a direção aprovada.

## Matriz
Entrance: blocos sobem 20px com clip/reveal 700ms; filhos entram com 80ms de diferença, máximo 240ms. Mobile 10px, reduced sem animação.
Scroll: três painéis sticky top 116/134/152px desktop, escala anterior até .95 e entrada com tilt até 12 graus; sete cards normais. Mobile sem stack, reduced estático.
Hover/focus: imagem aproxima 1.035, seta desliza 4px e borda ganha ouro; foco equivalente por CSS, sem informação exclusiva do mouse.
Transitions: linha de leitura 2px e sombra do header acompanham scroll; feedback do formulário permanece funcional imediato.
Parallax: personagem máximo 12px, fundo 40px e marca decorativa 55px no desktop; desativado mobile/reduced.
Typography motion: contorno do letreiro desloca até 180px com scroll, frase ganha cor progressivamente sem ocultar palavras; título recebe brilho local somente pointer fino.
Image reveal: figuras dos capítulos entram com perspectiva suave, imagem da conversão com reveal único; contain protege os produtos.
Signature interaction: sobreposição progressiva de três capítulos e letreiro, sem scroll capturado.

## Técnica e verificação
CSS sticky, IntersectionObserver e requestAnimationFrame são suficientes. Lenis/GSAP não necessários: não há sincronização complexa que justifique biblioteca e loop permanente. Nenhum preventDefault em wheel/touch. JS mede elementos visíveis e usa frame agendado; cancela em pagehide. Reduced motion responde a alteração da preferência. Conteúdo vem do HTML, não depende de observar/animação.
Verificar 1440/768/390/320, stack em posições intermediárias, âncoras, teclado, retorno ao topo, reduced motion, console/network e performance. Não repetir testes de notificações sem mudança de backend. Integrações e coleta continuam adiadas por instrução do usuário.
