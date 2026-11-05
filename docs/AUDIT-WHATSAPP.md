# Revisão do contato por WhatsApp

Data: 04/11/2026

Ambiente: `http://127.0.0.1:4173`

Viewports verificados: 390 × 844 e 1440 × 900

## Resultado

**PASS** na revisão anti-genérica. O contato novo preserva a identidade navy/creme/dourado, usa a tipografia editorial existente e não altera a narrativa da página. O envio externo real pela Cloud API continua condicionado às credenciais e ao template aprovado.

## Dez perguntas

1. **Poderia pertencer a qualquer empresa sem a marca?** Não. Ondas, paisagem, ramo, paleta e linguagem “Presença que Transforma” permanecem específicos; o contato usa os mesmos sinais visuais.
2. **O Hero parece um template?** Não. A composição de figura, título bíblico, luz e paisagem é autoral. O botão flutuante não cobre os CTAs do Hero no mobile.
3. **Há seções demais baseadas em cards?** Não. Cards ficam restritos aos prêmios; o contato é uma ação de serviço, não uma nova seção.
4. **Existe ideia visual reconhecível?** Sim. Luz, presença, natureza e encontro continuam conduzindo a experiência.
5. **Existe Signature Moment?** Sim. Hero e ondas seguem como assinatura; no mobile, a entrada breve do atendimento cria impacto sem competir com eles.
6. **Existe mudança de ritmo?** Sim. Hero amplo, pausa institucional, capítulos de prêmios, formulário e serviço final mantêm ritmos distintos.
7. **A tipografia participa da composição?** Sim. O rótulo do WhatsApp combina sans de serviço com serif editorial no nome da ação.
8. **Os assets pertencem à narrativa?** Sim. O novo ícone é funcional e os assets principais continuam específicos do evento.
9. **O motion segue uma linguagem?** Sim. Entrada curta, deslocamento pequeno e easing já usados pelo projeto; sem animação em `prefers-reduced-motion`.
10. **O projeto tem personalidade?** Sim. O novo contato aumenta conversão sem descaracterizar a experiência.

## Motion do contato

| Categoria | Comportamento | Mobile | Movimento reduzido |
| --- | --- | --- | --- |
| Entrance | Opacidade + deslocamento em 300 ms | Entra depois que o CTA do Hero sai da tela | Estado estático, sem animação |
| Scroll | Oculta perto do formulário | Evita cobrir campos e CTA | Mesmo comportamento, sem transição |
| Hover/foco/touch | Elevação de 3 px; foco visível; escala de toque | Escala curta no toque | Sem transição |
| Signature interaction | Sem efeito adicional no desktop | Três ondas de pulso de 1,8 s na entrada | Pulso removido |
| Parallax, typography motion e image reveal | Não utilizados; não agregariam clareza ao contato | Não utilizados | Não aplicável |

## Verificação funcional

- Link público aponta para `5585985741485` com mensagem inicial.
- Formulário monta mensagem com nome, telefone, e-mail, quantidade e observação.
- Teste sintético interceptou a abertura da conversa; nenhuma mensagem real foi enviada.
- Quando a coleta está desligada, a conversa continua disponível e o visitante confirma o envio.
- Quando a Cloud API estiver habilitada, `WHATSAPP_TO` define o destinatário da notificação do backend.
- Sem overflow horizontal nos dois viewports, sem erros de console e com foco/semântica preservados.
- `prefers-reduced-motion: reduce` remove pulso e transições.
