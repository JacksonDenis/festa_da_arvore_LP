# Festa da Árvore 2026 — Assets V2

Estado: ASSETS • Modo: CREATE • Nível: PREMIUM • Direção: Premium Cinematic V2.

Pacote de assets e documentação para Handoff. Não é um site publicado nem uma aprovação de layout novo.

## 1. Existing Assets

`existing/`: fundo nativo, assinaturas, marcas, logo original do Grupo de Oração Renascer em Cristo e post 2160px, preservados byte a byte. `brand/`: vetores originais V1; textos em curvas. `references/`: identidade escolhida e preview V1, somente referências.

O arquivo `docs/PROCEDENCIA_V1.txt` explica a reconstrução original: os desenhos e a tipografia V1 não são arquivos nativos extraídos da prancha inicial. Esses assets V1 são reutilizados sem novo redesenho.

## 2. Edited Assets

`hero/hero_jesus_recorte.png`: figura isolada com alpha, sem halo; derivação por IA da arte aprovada, não uma extração idêntica pixel a pixel. Bordas de cabelos e tecido verificadas sobre fundo claro e escuro.

`hero/hero_background_clean.png`: paisagem desktop 16:9, sem Jesus, com região azul à esquerda para texto. Fundo, personagem, texto e luz são arquivos independentes.

`hero/hero_light_overlay.svg` e PNG: luz opcional independente. Não sobrecarregar a imagem com uma segunda fonte de luz intensa.

## 3. New Assets

`prizes/`: dez PNGs transparentes individuais, na ordem solicitada. Todos são IMAGENS ILUSTRATIVAS geradas, sem promessa de marca, modelo, dimensões ou capacidade. Não são fotografias reais dos bens do sorteio. Kit e cestão mostram composição ilustrativa; confirmar itens com a organização.

`prize_highlight_bicicleta.png`: canvas 4:5 com o mesmo produto do card, sem divergência entre visual principal e destaque. Não foi aumentado o objeto além de sua resolução nativa.

O asset de salário mínimo é simbólico, sem valor em reais; não usar esta imagem como comprovação do valor do prêmio.

`social/`: OG exato 1200×630 em JPG e PNG. `icons/`: SVG, ICO, PNG 16/32/48/180/192/512 e webmanifest. O ícone é um ramo com luz dourada, não uma substituição da logo do realizador.

`decor/sponsor_placeholder.svg`: slot marcado como apoio a confirmar. Não apresentar como patrocinador real. O CSS em `docs/tokens.css` oferece a mesma solução em código.

## Handoff e uso web

`asset-manifest.json`: caminhos, dimensões, origem, função, status, transparência, hash e indicação de imagem ilustrativa. `docs/prizes.json`: nomes, ordem, caminhos e alt text. `docs/hero-layers.json`: ordem de camadas, posicionamento inicial, mobile e movimento reduzido.

`web/`: WebP 480/960 para prêmios, tamanhos de marcas e Hero para telas menores; nunca há upscaling nestas versões. As dimensões reais constam no manifesto. PNGs novos usam resolução nativa da geração. Logos existentes podem ser maiores; a arte original V1 do fundo tem 1254×1254 pixels. Não confundir metadados de DPI ou exportação ampliada com detalhe novo.

Para navbar, preferir SVG ou WebP de marca horizontal com contraste suficiente; sobre fundo escuro, a assinatura clara é a opção pronta. A logo original do realizador tem partes claras: usar sobre superfície navy e verificar legibilidade; mantivemos o original, sem redesenhar o emblema.

O fundo do Hero é decorativo (`alt=""`); se a imagem de Jesus for decorativa e a informação estiver no texto, também usar `alt=""`. Manter título do evento em HTML acessível ou com texto equivalente, mesmo quando assinatura em imagem. Evitar carregar marcas em resolução 4000px na navbar.

No desktop, texto à esquerda e figura à direita. No mobile, usar fluxo em duas áreas: título acima, cena abaixo; não reduzir tudo em uma única tela nem recortar o rosto. Apenas o fundo pode usar cover; personagem usa contain. Consultar JSON e a prévia de camadas, que é um ponto de partida técnico.

Prévia local: abrir `preview/index.html` depois de extrair TODO o ZIP. É catálogo de assets com controles de camadas, não uma proposta aprovada de site. `preview/contato_premios.jpg` mostra a coleção para revisão rápida.

## Pendências externas

1. `cartela.jpeg` não localizada nem fornecida neste pedido. `cartela_clean_mockup.png` não foi inventado; faltam a foto real e a validação dos campos do canhoto. A pendência é opcional para o Handoff técnico.
2. `festa_da_árvore_2026_presença_que_transforma.png` não localizado com esse nome. A identidade disponível foi preservada, mas nenhum outro mockup foi rotulado como esse arquivo aprovado.
3. Referência visual específica de Advogado Premium não fornecida/localizada. A direção segue o briefing declarado (camadas, respiro editorial, navy/dourado, luz e profundidade), sem afirmar cópia fiel dessa referência.
4. Patrocinadores ainda pendentes; slots preparados.
5. Fotos reais, marcas/modelos e especificações dos dez prêmios pendentes. Substituir as ilustrações quando chegarem.

Não acrescentamos preço de cartela, datas, horário, endereço, quantidade de números, regras de sorteio ou canais de compra sem fonte fornecida.
