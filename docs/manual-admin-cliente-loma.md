# Manual da Área Administrativa LOMA

Este guia é para a pessoa que vai operar o site no dia a dia, sem precisar mexer em código.

## 1. Acesso

- Aceda ao painel administrativo pelo endereço: `/admin/login`
- Use apenas o utilizador e senha autorizados.
- Não partilhe a senha por WhatsApp, email ou mensagens abertas.
- Se suspeitar que alguém teve acesso indevido, peça a troca da senha.

## 2. Regra principal antes de alterar

Antes de editar qualquer item, confirme:

- O texto está correto em português.
- A imagem abre normalmente no navegador.
- O preço, duração ou informação comercial está atualizado.
- O item deve ficar visível no site ou apenas guardado no admin.

Quando tiver dúvida entre apagar e esconder, prefira esconder. Assim a informação pode ser reaproveitada depois.

## 3. Produtos

A área de produtos controla a loja/vitrine do site.

Campos principais:

- Nome: nome comercial do produto.
- Descrição: texto curto que aparece no site.
- Preço: valor apresentado ao cliente.
- Categoria: define onde o produto aparece nos filtros da loja.
- Imagem: URL pública da imagem, normalmente vinda do Firebase.
- Visível: mostra ou esconde o produto no site.
- Ordem: ajuda a organizar a posição do produto.

Boas práticas:

- Use fotos limpas, com fundo claro e boa qualidade.
- Preferencialmente use imagens quadradas ou próximas de quadradas.
- Evite nomes genéricos como "Produto 1".
- Se um produto estiver temporariamente indisponível, deixe invisível em vez de apagar.

Importante: a loja não faz checkout online. O carrinho envia uma lista de interesse por email para a equipa confirmar.

## 4. Serviços

A área de serviços controla os tratamentos e opções apresentados no site e usados na marcação.

Campos principais:

- Nome do serviço.
- Descrição.
- Categoria.
- Duração em minutos.
- Preço, quando aplicável.
- Imagem, se existir.
- Visível.
- Ordem.

Boas práticas:

- Mantenha a duração realista, porque ela impacta a agenda.
- Evite descrições longas demais.
- Quando um serviço mudar de nome, edite o item existente em vez de criar outro duplicado.
- Serviços oficiais do salão devem permanecer no banco para aparecerem corretamente no site/admin.

## 5. Profissionais e Espaços

Esta área controla profissionais, cadeiras, salas ou espaços disponíveis.

Use para:

- Mostrar espaços disponíveis para aluguer.
- Atualizar fotos e descrições.
- Indicar benefícios de cada opção.
- Esconder espaços que já não estão disponíveis.

Boas práticas:

- Use fotos verticais ou bem enquadradas do espaço.
- Deixe claro o tipo de profissional indicado para aquele espaço.
- Se a disponibilidade mudar, atualize rapidamente para evitar contactos desnecessários.

## 6. Banners e Promoções

A área de marketing controla o carrossel "Novidades & Promoções" da home.

Campos principais:

- Texto pequeno superior: exemplo "Novidade".
- Título: frase principal do banner.
- Descrição: apoio curto.
- Texto do botão: exemplo "Ver produtos".
- Link do botão: exemplo `/loja`, `/servicos`, `/agendamento`.
- Imagem: URL pública do banner.
- Visível.
- Ordem.

Boas práticas para imagens:

- Use banner horizontal.
- Formato recomendado: 1920x720 ou proporção parecida.
- Evite texto importante muito perto das bordas.
- Teste no telemóvel depois de trocar a imagem.

## 7. Agendamentos

A área de agendamentos mostra as marcações feitas pelo site.

Filtros disponíveis:

- Data.
- Profissional.
- Serviço.
- Status.

Status comuns:

- Pendente: pedido recebido, ainda precisa de análise.
- Confirmado: horário aceite pela equipa.
- Reagendar: precisa alterar data ou hora.
- Cancelado: marcação cancelada.
- Concluído: atendimento finalizado.

Boas práticas:

- Confirme o pedido com o cliente antes de considerar o horário definitivo.
- Verifique serviço, profissional, data, hora, nome, email e telefone.
- Use "Confirmar" quando a equipa aceitar o horário.
- Use "Cancelar" quando o pedido não seguir.
- Para alterar o horário, escolha nova data/hora e guarde. O sistema valida conflitos do mesmo profissional.
- Use "Copiar" para copiar dados principais do cliente.
- Use "WhatsApp" para abrir uma conversa rápida quando o telefone estiver correto.
- Use "Reenviar email" se o cliente pedir nova confirmação.
- Se necessário, use o botão/link de calendário para adicionar o evento à agenda externa.
- Mantenha o status atualizado para a equipa saber o que já foi tratado.
- Consulte o histórico do agendamento para ver criação, mudança de status, reagendamento e reenvio de email.

Importante: o site bloqueia apenas conflito do mesmo profissional. Dois profissionais diferentes
podem atender clientes diferentes no mesmo horário.

## 8. Candidaturas de Profissionais

O formulário "Quero fazer parte" envia uma candidatura por email e guarda o contacto.

Verifique:

- Nome completo.
- Contacto.
- Instagram profissional.
- Área de atuação.
- Experiência.
- Serviços principais.
- Perfil e posicionamento profissional.

Boas práticas:

- Responda por email ou telefone.
- Não apague candidaturas antes de avaliar.
- Guarde apenas dados necessários e evite partilhar informações pessoais fora da equipa.

## 9. Galeria

A galeria pode ser mantida como vitrine visual do salão.

Boas práticas:

- Use fotos reais e bem iluminadas.
- Evite imagens tremidas, cortadas ou com baixa resolução.
- Se uma imagem não combina mais com a estética da marca, deixe invisível ou substitua.

## 10. Imagens no Firebase

Fluxo recomendado:

1. Subir a imagem no Firebase/hosting usado para mídia.
2. Copiar a URL pública.
3. Colar a URL no campo de imagem do admin.
4. Salvar.
5. Abrir o site e conferir se a imagem carregou.

Se a imagem não aparecer:

- Confirme se a URL abre direto no navegador.
- Verifique se o arquivo é `.jpg`, `.png`, `.webp` ou outro formato aceito.
- Evite links privados ou que exigem login.

## 11. Cuidados de Segurança

- Nunca coloque senhas, chaves de API ou dados bancários nos campos do admin.
- Não use imagens de clientes sem autorização.
- Evite expor telefones pessoais sem necessidade.
- Revise preços e serviços antes de publicar.
- Faça alterações importantes em horários de menor movimento.

## 12. Rotina Sugerida

Toda semana:

- Conferir agendamentos pendentes.
- Conferir produtos visíveis.
- Atualizar promoções vencidas.
- Responder candidaturas e contactos.

Todo mês:

- Revisar preços e duração de serviços.
- Atualizar banners.
- Remover ou esconder conteúdos antigos.
- Conferir se links de botões ainda apontam para a página correta.

## 13. Quando pedir suporte técnico

Peça suporte quando:

- O admin não abre.
- Um item foi salvo, mas não aparece no site.
- A imagem não carrega mesmo com URL correta.
- Emails deixarem de chegar.
- O site apresentar erro após uma alteração.
- For necessário criar novas categorias, campos ou regras.
