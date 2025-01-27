## US001 - Login na Conta

**Descrição:**

Como usuário, quero logar na minha conta para acessar funcionalidades exclusivas para ter acesso aos serviços.

**Critérios de Aceitação:**

- O sistema deve permitir que o usuário informe um e-mail e uma senha válidos para realizar o login.
- O sistema deve exibir mensagens de erro, como: E-mail ou senha inválidos.
- Após o login bem-sucedido, o usuário deve ser redirecionado para pagina /dashboard
- O email deve estar no formato "nome@email.com"
- Todos os campos devem ser obrigatórios

## US002 - Visualizar Produtos Disponíveis

**Descrição**

Como usuário, quero visualizar todos os produtos disponíveis no estoque para facilitar a visualização dos produtos.

**Critérios de Aceitação**

- O sistema deve exibir uma mensagem caso nenhum produto esteja disponível no momento.
- O sistema deve permitir a busca de produtos pelo nome através de uma barra de pesquisa.

## US003 - Entrar em Contato para Alugar

**Descrição**

Como usuário, quero poder entrar em contato com o responsável pelo produto para solicitar o aluguel e esclarecer dúvidas.

**Critérios de Aceitação**

- O sistema deve disponibilizar um botão "Entrar em Contato" na página de detalhes do produto.
- Ao clicar no botão, o usuário deve ser redirecionado para whatsapp.

## US004 - Média de Preço dos Produtos

**Descrição**

Como usuário, quero visualizar a média do preço dos produtos disponíveis para planejar melhor meu orçamento.

**Critérios de Aceitação**

- O sistema deve calcular e exibir a média do preço dos produtos
- O sistema deve atualizar a média automaticamente sempre que novos produtos forem adicionados, removidos ou tiverem seus preços alterados.
- A média deve ser apresentada com duas casas decimais (ex.: R$ 100,00).

## US005 - Adicionar Produtos ao Estoque

**Descrição**

Como administrador, quero adicionar novos produtos ao estoque para manter o catálogo atualizado.

**Critérios de Aceitação**

- O sistema deve permitir que o administrador adicione um novo produto.
- O sistema deve exibir mensagens de erro caso algum campo obrigatório não seja preenchido.
- Após adicionar o produto, o sistema deve confirmar o sucesso da operação com uma mensagem "Produto adicionado com sucesso".

## US006 - Remover Produtos do Estoque

**Descrição**

Como administrador, quero remover produtos do estoque para retirar itens que não estão mais disponíveis para aluguel.

**Critérios de Aceitação**

- Antes de concluir a remoção, o sistema deve exibir um alerta de confirmação (ex.: "Tem certeza que deseja remover este produto?").
- O sistema deve atualizar o estoque em tempo real após a remoção do produto.

## US007 - Relatório de Produtos Alugados

**Descrição**

Como administrador, quero acessar uma página com a lista de clientes que alugaram meus produtos, incluindo informações sobre o período de aluguel para acompanhar e monitorar os aluguéis realizados.

**Critérios de Aceitação**

- Caso não existam registros de aluguéis, o sistema deve exibir uma mensagem clara (ex.: "Nenhum aluguel registrado no momento").
- O sistema deve oferecer um botão ou link em cada cliente da lista para visualizar os detalhes completos do aluguel.

## US008 - Editar Informações de Produtos

**Descrição**

Como administrador, quero editar as informações dos produtos cadastrados para corrigir ou atualizar os dados conforme necessário.

**Critérios de Aceitação**

- O sistema deve exibir mensagens de erro caso algum campo obrigatório seja removido ou tenha valores inválidos durante a edição.
- Após salvar as alterações, o sistema deve confirmar o sucesso da operação com uma mensagem (ex.: "Produto atualizado com sucesso").
