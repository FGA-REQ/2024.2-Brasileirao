## Regras de Restrição

- **Acesso ao Aluguel:** Somente clientes aprovados pelo dono do aplicativo podem alugar produtos.
- **Controle de Estoque:** Apenas o dono do aplicativo tem acesso para adicionar, editar ou remover itens no estoque.
- **Quantidade Disponível:** Não é permitido alugar produtos cuja quantidade disponível seja menor do que a solicitada.

## Regras de Diretriz

- **Informação para Todos:** Qualquer usuário pode visualizar a disponibilidade de produtos, mesmo sem aprovação.
- **Notificação de Estoque Baixo:** O aplicativo deve alertar o dono sempre que o estoque de um item ficar abaixo de um determinado limite.

## Regras de Causa e Efeito

- **Bloqueio de Produto Alugado:** Um produto alugado fica indisponível para outros clientes durante o período do aluguel.
- **Devolução:** Quando um cliente devolve um produto, ele é automaticamente adicionado de volta ao estoque.

## Regras Computacionais

- **Cálculo de Período:** O preço do aluguel será calculado com base no número de dias ou no período solicitado pelo cliente.
