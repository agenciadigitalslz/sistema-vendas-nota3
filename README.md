# Sistema de Vendas

Este é um sistema de vendas moderno desenvolvido com uma stack de tecnologias atualizadas, incluindo **Vite**, **React**, **TypeScript** e **Tailwind CSS**. O projeto foi refatorado a partir de um sistema de vendas anterior escrito em C, trazendo uma interface mais amigável e funcionalidades aprimoradas.

## 📋 Sobre o Projeto

Este projeto representa a evolução de um Sistema de Vendas originalmente desenvolvido em C como parte de uma atividade acadêmica na disciplina de Linguagem de Programação com C. A versão atual adapta as funcionalidades do sistema original para uma aplicação web moderna com interface gráfica intuitiva.

### Funcionalidades Principais

- **Cadastro de Clientes:** Criar, editar, excluir e listar clientes com controle de vendas ativas
- **Cadastro de Produtos:** Gerenciar estoque, valor unitário e informações do produto
- **Realização de Vendas:** Registrar vendas com cálculo automático, data/hora e verificação de estoque
- **Cancelamento de Vendas:** Altera status para cancelada e devolve o produto ao estoque
- **Exclusão de Vendas:** Remoção definitiva da venda do banco de dados
- **Visualização Detalhada:** Painel com dados relacionados entre clientes, produtos e vendas

## ☁️ Integração com Supabase

O Supabase é usado como backend para armazenar e consultar dados em tempo real. Todas as operações CRUD são feitas diretamente via Supabase, incluindo:

- `clientes`: armazenamento dos dados dos clientes
- `produtos`: estoque e valores dos produtos
- `vendas`: histórico e controle de vendas com status e data/hora

### Políticas RLS (Row Level Security)

Todas as tabelas possuem políticas ativas que permitem:
- Leitura (`SELECT`)
- Escrita (`INSERT`)
- Atualização (`UPDATE`)
- Exclusão (`DELETE`)

## 🧠 Gerenciamento de Estado com Zustand

A aplicação utiliza Zustand para centralizar o estado da aplicação:

- Armazena listas de clientes, produtos e vendas detalhadas
- Controla estado de carregamento e mensagens de erro
- Inclui funções assíncronas para interação com Supabase
- Suporte a ações: `addClient`, `updateProduct`, `cancelSale`, entre outras

## 💡 Componentes e UI

A interface é construída com **Tailwind CSS** e **shadcn/ui**, oferecendo:

- Interface clara e responsiva
- Tema escuro/claro com alternância dinâmica
- Formulários com validação
- Modais de confirmação e edição
- Botões com ícones (`edit`, `delete`, `refresh`)
- Toasts personalizados para feedback visual

### Componentes principais

- `ClientForm`: Formulário para adicionar e editar clientes
- `ClientList`: Lista de clientes com ações inline
- `DeleteConfirmation`: Modal de confirmação para exclusão
- `ClientDetails`: Exibição de dados individuais
- `ProductForm` e `SaleForm`: Interfaces para produtos e vendas

## 🧪 Hooks Customizados

- `useClientForm`: Gerencia o estado e validação de formulário de cliente
- `useClientSearch`: Aplica busca e filtro na lista de clientes

## 🚀 Como Executar o Projeto

Siga os passos abaixo para rodar o projeto localmente:

1. **Clone o Repositório**
   ```bash
   git clone https://github.com/agenciadigitalslz/sistema-vendas.git
   cd sistema-vendas
   ```

2. **Instale as Dependências**
   ```bash
   npm install
   ```
   ou
   ```bash
   yarn install
   ```

3. **Inicie o Servidor de Desenvolvimento**
   ```bash
   npm run dev
   ```
   ou
   ```bash
   yarn dev
   ```

4. **Acesse a Aplicação**
   Abra o navegador e acesse `http://localhost:3000`.

## 🛠️ Tecnologias Utilizadas

- **Vite**: Build tool rápida e moderna
- **React**: Biblioteca JavaScript para construção de interfaces
- **TypeScript**: Adiciona tipagem estática ao JavaScript
- **Tailwind CSS**: Framework CSS utilitário para estilização
- **shadcn-ui**: Biblioteca de componentes UI moderna
- **Zustand**: Gerenciamento de estado leve e poderoso
- **Supabase**: Backend como serviço com banco de dados PostgreSQL

## 📂 Estrutura do Projeto

```

## 🧠 Da Versão C ao Web: Processo de Evolução

Este projeto representa a evolução de um sistema de vendas inicialmente desenvolvido em C para uma aplicação web moderna. A migração manteve as funcionalidades essenciais:

- Registro completo dos dados de compra
- Cálculo preciso do valor total das vendas
- Validação eficiente do estoque disponível
- Geração de relatórios detalhados de vendas

A versão web adiciona melhorias significativas:
- Interface gráfica intuitiva e responsiva
- Experiência de usuário aprimorada
- Organização visual clara dos dados
- Navegação simplificada entre as funcionalidades

## 📝 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes. Você é livre para usar, modificar e distribuir este software, desde que mantenha os direitos autorais originais.

## 🤝 Contribuição

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas alterações (`git commit -m 'Adiciona nova feature'`).
4. Faça push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

## 📧 Contato

Para dúvidas ou sugestões, entre em contato com a equipe de desenvolvimento.

---
**Nota:** Este projeto foi gerador por vibe coding [André Lopes](https://github.com/agenciadigitalslz).

**Nota Educacional:** Este projeto foi gerado por lovable.dev para fins educativos e não sofreu alterações em seu código gerado original. O projeto foi criado com base em uma atividade acadêmica de Linguagem de Programação em C, transformando o Sistema de Vendas original em uma aplicação web moderna com interface gráfica.