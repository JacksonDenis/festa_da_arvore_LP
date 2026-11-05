# Ajustes finais solicitados — 14/10/2026

Esta atualização substitui o estado do formulário e a posição da mensagem nos relatórios anteriores.

- Rodapé: “Alegria do Senhor é a nossa força.”, verificado no DOM renderizado.
- Formulário: campos e botão habilitados, com validação e aviso de prévia. Sem backend habilitado, a submissão apresenta “O envio ainda não está habilitado. Nenhum dado foi enviado.” e mantém os campos preenchidos. Nenhum dado vai para armazenamento, fila ou provedor. Se a configuração segura for habilitada futuramente, o caminho real preparado continua disponível.
- Mensagem institucional: removida a cópia sobre a imagem do Hero; a frase aparece integralmente no bloco institucional logo abaixo, com texto navy/marrom sobre creme. Isso impede a sobreposição à figura em qualquer proporção de viewport, sem depender de offsets específicos.
- Google Maps: botão no bloco Local, com URL completo fornecido pelo usuário, target _blank e rel noopener noreferrer. Fortaleza — CE agora consta do endereço, confirmado no link fornecido. Não foi criado mapa incorporado ou geocodificação especulativa.

Chrome DevTools MCP, localhost: verificados 320×740, 390×844, 1440×1000, 1920×1080 e 2560×1440. Nenhum overflow horizontal; mensagem fora do Hero e formulário ativo nos cinco tamanhos. Em submissão com dados sintéticos válidos, interceptação temporária de fetch confirmou **zero POSTs para /api/leads** e feedback de prévia correto. Botão Maps tem href e destino corretos; link externo não foi aberto durante o teste. Console sem errors/warnings próprios. Build e sintaxe do JS passaram. Inspeção visual desktop e mobile concluída.

Anti-generic-review: **PASS**, mantendo a composição aprovada e eliminando a sobreposição da mensagem. Site-auditor para os ajustes locais: **PASS WITH WARNINGS**, pois há apenas emulação e envio real continua intencionalmente adiado. Backend não foi alterado; não foram repetidos os testes de notificações, já que esta revisão trata de conteúdo, layout e prévia do formulário. Publicação continua sem aprovação de prontidão; política, regulamento e integrações reais permanecem pendentes. A pendência de link do mapa está resolvida.
