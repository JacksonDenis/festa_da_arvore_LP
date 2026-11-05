# Auditoria — Festa da Árvore 2026

**Atualização:** para o estado atual do formulário, frase e mapa, consultar [Ajustes finais](AUDIT-REFINEMENTS.md). A [Auditoria Hero líquido](AUDIT-HERO-FLUID.md) e a [Auditoria Motion V2](AUDIT-MOTION-V2.md) registram as etapas anteriores. O relatório abaixo registra a implementação inicial; backend e bloqueios de publicação continuam válidos.

Data: 14/10/2026, America/Fortaleza. Escopo autorizado atualizado: construir site e preparar integrações, que o usuário conectará depois. Sem publicação, coleta real ou envio de mensagens externas. Base_LP consultada, site criado fora dela em repositório Git independente.

Ambiente: Windows, Node 22.22.3, Chrome DevTools MCP; http://127.0.0.1:4173 (coleta desligada) e fixture http://127.0.0.1:4174 (loopback, banco temporário, dados sintéticos, transporte simulado). Viewports emulados: desktop 1440×1000, tablet 768×1024, mobile 390×844 e 320×740. Sem dispositivo físico.

## Anti-generic-review — PASS

| Pergunta | Evidência / impacto |
| --- | --- |
| 1. Sem logo/personagem, serviria para qualquer empresa? | Não: ondas navy/dourado, ramos, serif e narrativa de fé/vida permanecem específicos. |
| 2. Hero parece template? | Composição em camadas da arte fornecida, tipografia em dois níveis e informações de evento; não depende de card central genérico. |
| 3. Cards em excesso? | Cards restritos à coleção dos prêmios; Sobre editorial, regras em lista, conversão e serviço variam a composição. |
| 4. Ideia reconhecível? | Luz da paisagem conduz a ondas e frase sobre plantar vida. |
| 5. Signature Moment? | Passagem visual contínua entre cena e superfície creme; compreensível sem motion. |
| 6. Mudança de ritmo? | Hero paisagístico → institucional breve → vitrine e regras → formulário claro → serviço navy. |
| 7. Tipografia participa? | Eu/Sou monumental, títulos serifados e informações pequenas criam hierarquia. |
| 8. Assets pertencem ao projeto? | Originais canônicos e Hero/prêmios V2 fornecidos, sem stock ou ativos jurídicos. |
| 9. Motion coerente? | Reveals curtos, profundidade máxima 12px e sticky só no destaque. Mobile estático; reduced remove movimentos. |
| 10. Personalidade? | Continuidade navy/creme, dourado, natureza e tema bíblico no conteúdo e composição. |

Correções realizadas: ondas inicialmente centralizadas pela geometria intrínseca foram adaptadas para largura total; contraste do título dourado sobre creme passou a marrom escuro; espaços em títulos mobile corrigidos; prêmios migrados para HTML estático para continuarem disponíveis sem JS. Originais mantidos sem alteração.

Capturas finais: [desktop](screenshots/desktop-1440.jpg) e [mobile](screenshots/mobile-390.jpg). São capturas de página inteira, após carregamento das imagens lazy; a inspeção também incluiu a primeira dobra e o formulário.

## Site-auditor

| Item | Estado | Evidência / limite |
| --- | --- | --- |
| Desktop | Verificado | Página inteira inspecionada, Hero legível e hierarquia preservada. |
| Mobile / responsividade | Verificado em emulação | 320/390/768/1440 sem overflow horizontal; nenhum título excedeu viewport em 320; figura contain e rosto visível; sticky desativado mobile. Dispositivo real pendente. |
| Navegação / links / CTA | Verificado | Todas as âncoras têm destino; menu abre e fecha, Escape devolve foco; CTA aponta cadastro. |
| Patrocinadores | Verificado | Template inerte; nenhum elemento #patrocinadores no DOM ativo e nenhum link no menu. |
| WhatsApp público | Não aplicável | Não foi criado link wa.me como substituto da notificação. |
| Formulário padrão | Verificado | API retorna leadsEnabled=false; fieldset desabilitado e mensagem de indisponibilidade. POST direto retorna 503 e não persiste. |
| Validações do formulário | Verificado no fixture | Submissão vazia apresenta erros, foco no nome; campos, telefone, quantidade e consentimento validados no cliente e servidor. |
| Sucesso do formulário | Verificado no fixture | Preenchimento via Chrome DevTools, envio e mensagem de recebimento com foco no status. Consulta independente ao SQLite confirmou um lead e dois canais em accepted, ambos simulados. |
| Duplicação / persistência | Verificado | Mesma chave ou mesmo payload geram um registro; chave reutilizada com outro payload retorna 409; leitura em segunda conexão confirmou persistência. |
| E-mail e WhatsApp reais | Não verificado / bloqueio | Usuário não possui provedores/credenciais e pediu integração posterior. Adaptadores preparados; nenhum envio externo. Aceite simulado não prova entrega real. |
| Fila / falha parcial | Verificado com mocks | E-mail aceito não repete quando WhatsApp falha. Backoff, limite de cinco tentativas, falha definitiva e entrega incerta sem reenvio automático testados. Webhooks de entrega/alertas reais ainda pendentes. |
| Loading / erro | Verificado no browser | Transporte de teste retido mostrou aria-busy=true, campos desabilitados e texto de envio; resposta 503 simulada mostrou erro e reabilitou o formulário. |
| Console | Verificado com observação | Sem erro JS próprio observado. Chrome registrou issue de dimensões de imagens lazy apesar dos atributos explícitos; CLS medido 0.00. Verificar novamente em navegador limpo. |
| Network | Verificado | Imagens e recursos locais responderam; após decode, zero imagens quebradas. Antivírus Kaspersky da máquina injeta tráfego externo que não pertence ao código do projeto. |
| Imagens | Verificado | WebP, dimensões e contain; dez prêmios ordenados e aviso ilustrativo. Marcas otimizadas a partir dos originais, realização legível no navy. |
| Vídeos / WebGL | Não aplicável | Não necessários ao briefing. |
| Performance | Medida de laboratório | Chrome mobile 390×844, loopback, CPU 1×, rede sem throttling: LCP 277ms, TTFB 36ms, CLS 0.00. Cache/antivírus local influenciam; não representa produção ou dados de campo. INP não medido. Compressão gzip adicionada ao servidor para texto depois dessa medição. |
| Acessibilidade básica | Verificado parcialmente | Um h1, regiões semânticas, zero campos sem labels e zero imagens sem atributo alt; skip link, foco e aria-live. Contraste de texto principal revisado. Não é auditoria WCAG completa com leitor de tela. |
| Reduced motion | Verificado por simulação | MatchMedia interceptado só no teste e regra CSS reduced aplicada: sticky static, animation none, scroll auto. Não alterado SO. Teste de preferência real em dispositivo ainda pendente. |
| SEO / metadata | Verificado para prévia | Title, description, OG 1200×630, pt-BR, favicon. Noindex no HTML e header intencional. Canonical, og:url e OG absoluto aguardam domínio validado. |
| Tracking | Não aplicável | Nenhuma ferramenta de tracking solicitada ou instalada. |
| Segurança básica | Verificado em testes | Corpo máximo 8KB, validação backend, origem estrita, honeypot, rate limit em memória, CSP, arquivos privados inacessíveis, payload cifrado. HTTPS, backup, acesso operacional, retenção e análise de produção pendentes. |
| Privacidade / regulamento | Não verificado / bloqueio | Aviso completo e regulamento não fornecidos. Página de privacidade informa indisponibilidade; coleta bloqueada. Não há declaração de autorização jurídica. |

Resultado para a etapa local solicitada: **PASS WITH WARNINGS**, com testes sintéticos aprovados e itens adiados identificados.

Resultado de prontidão para publicação: **FAIL / BLOQUEADO**. O fluxo real de conversão permanece indisponível de propósito, conforme orientação do usuário; não há recebimento real comprovado, política ou documentação revisada. Não interpretar a aprovação visual ou os mocks como aprovação de publicação.

## Verificação automatizada

`npm.cmd run build`: passou. `npm.cmd test`: 8/8 passaram. Sintaxe Node dos módulos de servidor, provedor e operação verificada. `npm install`: zero vulnerabilidades reportadas no momento da instalação. `21st review`: três observações informativas sobre cores literais, sem erro funcional; cores são decisões da identidade e contraste. Busca de inspiração 21st: HTTP 401, nenhum código externo obtido.

## Próxima integração

Seguir [README](../README.md): definir hospedagem persistente, provedores e template, aviso/política e retenção aprovados, conciliar/monitorar entregas, testar os destinatários reais e repetir auditoria em HTTPS antes de remover bloqueios. Cidade/UF é necessária apenas para eventual mapa; redes, programação e patrocinadores continuam opcionais conforme handoff.
