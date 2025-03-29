# Sistema de Vendas

Este é um sistema de vendas moderno desenvolvido com uma stack de tecnologias atualizadas, incluindo **Vite**, **React**, **TypeScript** e **Tailwind CSS**. O projeto foi refatorado a partir de um sistema de vendas anterior escrito em C, trazendo uma interface mais amigável e funcionalidades aprimoradas.

## 📋 Sobre o Projeto

Este projeto representa a evolução de um Sistema de Vendas originalmente desenvolvido em C como parte de uma atividade acadêmica na disciplina de Linguagem de Programação com C. A versão atual adapta as funcionalidades do sistema original para uma aplicação web moderna com interface gráfica intuitiva.

### Funcionalidades Principais

- **Cadastro de Clientes:** Armazena nome e ID único dos clientes
- **Cadastro de Produtos:** Armazena nome, quantidade, valor e ID único
- **Realização de Vendas:** Solicita dados do cliente, produto e quantidade, validando estoque
- **Consulta de Dados:** Exibe clientes, produtos e histórico de vendas
- **Cancelamento de Vendas:** Permite cancelar vendas e retornar produtos ao estoque

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

## 📂 Estrutura do Projeto

```
sistema-vendas/
├── src/
│   ├── components/  # Componentes React
│   ├── pages/       # Páginas da aplicação
│   ├── styles/      # Estilos globais e utilitários
│   └── App.tsx      # Componente principal
├── public/          # Arquivos estáticos
├── package.json     # Dependências e scripts
└── vite.config.ts   # Configuração do Vite
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