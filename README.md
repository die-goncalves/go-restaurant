<p align="center">
  <picture>
    <source 
      srcset="assets/logo-dark.svg"
      media="(prefers-color-scheme: dark)"
    />
    <source
      srcset="assets/logo-light.svg"
      media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"
    />
    <img src="assets/logo-light.svg" width="200px" alt="gorestaurant" title="GoRestaurant" />
  </picture>
</p>

## Índice

<p align="center">
  <a href="#sobre">Sobre</a> • 
  <a href="#tecnologias">Tecnologias</a> • 
  <a href="#funcionalidades">Funcionalidades</a> • 
  <a href="#instalação">Instalação</a> • 
  <a href="#publicação">Publicação</a> • 
  <a href="#demonstração">Demonstração</a> • 
  <a href="#agradecimento">Agradecimento</a> • 
  <a href="#licença">Licença</a> • 
  <a href="#autor">Autor</a>
</p>

## Sobre

GoRestaurant é uma plataforma de pedidos _online_ que conecta clientes aos estabelecimentos da sua região, com entrega ou retirada no local.

_Este é um projeto pessoal desenvolvido para fins de estudo e portfólio._

O que você pode fazer?

- Informar seu endereço e ver os estabelecimentos disponíveis;
- Navegar pela lista de produtos, adicioná-los ao carrinho e finalizar o pedido;
- Escolher entre entrega no endereço ou retirada no local;
- Acompanhar o status do pedido em tempo real;
- Criar uma conta para acompanhar pedidos e avaliar produtos após o recebimento.

A criação desta plataforma foi inspirada nos serviços de entrega de alimentos _online_ [ifood](https://www.ifood.com.br/), [doordash](https://www.doordash.com/), [foodpanda](https://www.foodpanda.com/) e [rappi](https://www.rappi.com.br/).

As imagens das comidas e dos restaurantes podem ser encontradas em [Unsplash](https://unsplash.com/) e [Pexels](https://www.pexels.com/).

## Tecnologias

**Core**

- [TypeScript](https://www.typescriptlang.org/) — tipagem estática para todo o projeto.
- [Next.js](https://nextjs.org/) — _framework_ React com App Router, rotas de API e renderização híbrida.

**Estilização e UI**

- [Panda CSS](https://panda-css.com/) — CSS-in-JS com tipagem e geração estática de estilos.
- [Zag.js](https://zagjs.com/) — máquinas de estado para componentes de UI acessíveis (ex: combobox, dialog).
- [Radix UI](https://www.radix-ui.com/) — utilizado o `Slot`, para composição de componentes sem adicionar elementos extras ao DOM.
- [GSAP](https://gsap.com/) — animações e transições na interface.

**Dados e formulários**

- [TanStack Query](https://tanstack.com/query) — gerenciamento de estado assíncrono e _cache_ de dados do servidor.
- [TanStack Table](https://tanstack.com/table) — construção de tabelas com ordenação, filtragem e paginação.
- [React Hook Form](https://react-hook-form.com/) — gerenciamento de formulários com baixo custo de renderizações e bom desempenho.
- [Zod](https://zod.dev/) — validação e tipagem de esquemas para formulários.

**Backend e integrações**

- [Supabase](https://supabase.io/) — banco de dados PostgreSQL, autenticação e storage.
- [Stripe](https://stripe.com/br) — processamento de pagamentos e _split_ entre contas conectadas (plataforma e lojas).
- [Mapbox](https://www.mapbox.com/) — geocodificação de endereços e exibição de mapas interativos.
- [Ngeohash](https://www.npmjs.com/package/ngeohash) — codificação/decodificação de coordenadas em geohash para localização entre páginas.
- [Pino](https://getpino.io/) — _logging_ estruturado.

> Veja o arquivo [package.json](/package.json) para a lista completa de dependências e versões.

## Funcionalidades

<details open>
  <summary>Responsividade</summary>

Compatível com as seguintes larguras de tela:

- [x] 320px
- [x] 360px
- [x] 412px
- [x] 640px
- [x] 768px
- [x] 1024px
- [x] 1280px
- [x] 1366px
- [x] 1440px
</details>

<details open>
  <summary>Página inicial</summary>

- [x] Caixa de diálogo com breve apresentação do projeto, contatos pessoais e sites que serviram de inspiração;
- [x] Botão flutuante que abre um diálogo com instruções que orientam o usuário durante o processo de pedido;
- [x] Tour que apresenta o botão de apresentação do projeto e o botão de instruções;
- [x] Cadastro e início/encerramento de sessão na aplicação;
- [x] Definição da localização por meio de um _input_ com _autocomplete_ ou pelo clique em um ponto do mapa, obtendo endereço, região, coordenadas e geohash;
- [x] Ao confirmar a localização, o usuário é redirecionado para a página de listagem de estabelecimentos, filtrada pela região escolhida;
- [x] Utilização do geohash para repassar a localização entre páginas, permitindo recuperar as informações de localização a partir dele;
- [x] Visualização de todos os estabelecimentos em um mapa, com o clique em um estabelecimento exibindo sua posição;
- [x] Seção de depoimentos com avaliações sobre a plataforma;
- [x] Rodapé com links sociais do projeto e quem o construiu.
</details>

<details open>
  <summary>Página dos estabelecimentos</summary>

- [x] Menu lateral onde o usuário pode ordenar e filtrar os estabelecimentos, optar entre entrega ou retirada, e trocar sua localização;
  - A filtragem ocorre pelo preço de entrega (quando essa opção é escolhida) e por categorias de produtos.
  - A ordenação ocorre de forma decrescente, por avaliação geral do estabelecimento ou por tempo de entrega.
- [x] Listagem de todos os estabelecimentos com base nos filtros aplicados e na região do endereço de entrega;
- [x] Cada filtro escolhido é exibido acima da lista de estabelecimentos, facilitando o gerenciamento da filtragem pelo usuário;
- [x] Cada cartão de estabelecimento exibe nome, imagem, algumas categorias de produtos, avaliação geral, tempo de entrega ou retirada, e preço de entrega.
</details>

<details open>
  <summary>Página de um estabelecimento específico</summary>
  
- [x] Visualização do nome, imagem, descrição, telefone e algumas categorias de produtos disponíveis do estabelecimento;
- [x] Horário de funcionamento e status de aberto/fechado;
- [x] Troca de localização do usuário restrita à região do estabelecimento;
- [x] Localização do estabelecimento exibida em um mapa estático;
- [x] Todos os produtos disponíveis, divididos por seção, com navegação entre as seções;
- [x] Adicionar/remover produtos do carrinho;
- [x] No carrinho, também é possível adicionar/remover produtos e iniciar uma sessão de _checkout_ para realizar o pagamento;
- [x] A sessão de _checkout_ utiliza o Stripe. Ao concluir o pagamento, o usuário é redirecionado para a página inicial.
</details>

<details open>
  <summary>Página de login</summary>

- [x] Acesso restrito a usuários não autenticados;
  - [x] Usuários autenticados são redirecionados para a página de conta.
- [x] Entrar na aplicação com e-mail e senha;
- [x] Cadastrar-se com e-mail e senha;
- [x] Redirecionamento automático após login bem-sucedido.
</details>

<details open>
  <summary>Painel do usuário — Conta</summary>

- [x] Acesso restrito a usuários cadastrados;
- [x] Exclusão de conta.
</details>

<details open>
  <summary>Painel do usuário — Pedidos</summary>

- [x] Acesso restrito a usuários cadastrados;
- [x] Visualização das informações dos pedidos realizados;
- [x] Indicação visual do status do _checkout_ e do status de pagamento;
- [x] Filtragem por status do _checkout_ (concluído, pendente ou expirado) e por status de pagamento (pago, não pago ou sem cobrança);
- [x] Ordenação por quantidade de produtos, preço total, preço do frete ou data, em ordem crescente ou decrescente.
</details>

<details open>
  <summary>Painel do usuário — Avaliações</summary>

- [x] Acesso restrito a usuários cadastrados;
- [x] Avaliação de produtos após a conclusão do pagamento;
- [x] Filtragem por presença de comentário (com ou sem) e por nota (com/sem avaliação, ou de 1 a 5 estrelas);
- [x] Ordenação por data, preço ou nota, em ordem crescente ou decrescente.
</details>

## Instalação

### Pré-requisitos

- É **necessário** possuir o **[Git](https://git-scm.com/)** instalado e configurado no computador.
- É **necessário** ter um gerenciador de pacotes instalado, como o **[NPM](https://www.npmjs.com/)**.
- É **necessário** ter uma conta no [Mapbox](https://www.mapbox.com/).
- É **necessário** ter uma conta no [Supabase](https://supabase.com/).
- É **necessário** ter uma conta na [Stripe](https://stripe.com/).

### Clone este repositório

```bash
git clone https://github.com/die-goncalves/go-restaurant.git
```

### Instale as depêndencias

```bash
# Entre no diretório do repositório clonado
$ cd go-restaurant
# Instale as dependências do projeto.
$ npm install
```

### Crie na raiz do projeto o arquivo `.env.local`.

```bash
# .env.local

# MAPBOX
NEXT_PUBLIC_MAPBOX_GL_PUBLISHABLE_KEY=
MAPBOX_REFERER_URL=

# STRIPE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET_KEY=

# SUPABASE
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SECRET_KEY=
```

### Configuração

#### Mapbox

1. Cadastre-se no [Mapbox](https://www.mapbox.com/);
2. Acesse [tokens](https://account.mapbox.com/access-tokens/) na sua conta, crie um novo _token_ ou utilize o _token_ padrão e copie o valor em `NEXT_PUBLIC_MAPBOX_GL_PUBLISHABLE_KEY`.
3. Se o _token_ tiver restrição de URL configurada (`URL restrictions`), adicione a URL da sua aplicação (local e/ou de produção) à lista de permitidas;
4. Defina `MAPBOX_REFERER_URL` com essa mesma URL — ela é enviada no header `Referer` das requisições ao Mapbox Directions API e precisa corresponder a uma das URLs permitidas pelo _token_, ou as requisições serão rejeitadas.

#### Supabase

1. Cadastre-se no [Supabase](https://supabase.com/);
2. Crie um projeto;
3. Acesse o `SQL Editor` no menu lateral, crie uma nova _query_, cole o conteúdo do arquivo [schema.sql](assets/schema.sql) e execute para criar a estrutura do banco de dados;
4. Crie outra _query_ e cole o conteúdo do arquivo [data.sql](assets/data.sql) e execute para popular o banco de dados;
5. Acesse o `Project Settings` no menu lateral para obter as **chaves**:
   1. `NEXT_PUBLIC_SUPABASE_URL`, escolha uma das opções:
      - Acesse `Data API`, aba `Overview`, localize `API URL` e remova `/rest/v1/`;
      - Acesse `General` e localize `Project ID` — a URL deverá ter o formato `https://<project-id>.supabase.co`, onde `<project-id>` é o ID do seu projeto;
   2. Acesse `API Keys`, aba `Publishable and secret API keys`:
      1. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: localize a `Publishable key`;
      2. `SUPABASE_SECRET_KEY`: localize a `Secret keys`.

   Consulte o [guia oficial](https://supabase.com/docs/guides/getting-started/api-keys) para mais detalhes.

6. Diagrama Entidade-Relacionamento do banco de dados (pé de galinha):
   ![Diagrama ER](assets/der.svg)

#### Stripe

1. Cadastre-se na [Stripe](https://stripe.com/);
2. Utilize a **área restrita** - ambiente isolado para criar e testar integrações da Stripe sem movimentação real de dinheiro.
3. Crie **4 contas conectadas** (uma para cada estabelecimento). Esse número corresponde aos estabelecimentos atualmente cadastrados nos dados de exemplo ([data.sql](assets/data.sql)), ajuste a quantidade caso adicione ou remova estabelecimentos. Para cada conta:
   1. Selecione as duas opções do que ela deve fazer:
      1. Aceitar pagamentos de seus próprios clientes;
      2. Receber transferências para o saldo da Stripe;
   2. Preencha o e-mail com um endereço fictício e verifique se as demais configurações estão assim:
      1. Todas as funcionalidades solicitadas
         - card_payments
         - Repasses
         - Transferências
      2. Propriedades da conta
         - Quem paga as tarifas da Stripe - Plataforma
         - Acesso ao Dashboard - Express
         - Responsabilidade por saldo negativo - Plataforma
         - Coleta de requisitos - Stripe
      3. Outros detalhes
         - País - Brasil
         - Tipo de empresa - Pessoa física
   3. Você receberá um link para fornecer informações adicionais necessárias - acesse-o e preencha com dados fictícios. Alguns campos podem ser ignorados usando dados de teste da Stripe.
   4. Após o status se tornar `Ativada` as funções serão habilitadas.
4. Vincule o _id_ de cada uma a uma loja no banco de dados - substitua os valores `acct_test_***` pelo _id_ real no campo `stripe_account_id`;
   - **Para que isso serve?** Ao ocorrer uma compra o valor total irá para a conta principal. Ela desconta suas taxas e repassa o restante para a conta conectada do estabelecimento correspondente.
5. Para obter as **chaves** de API, acesse `Desenvolvedores` na barra inferior e vá em `Chaves de API`:
   1. `STRIPE_SECRET_KEY`: localize `Chave secreta` em `Chaves padrão`;
   2. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: localize `Chave publicável` em `Chaves padrão`;
6. Para obter a **chave** `STRIPE_WEBHOOK_SECRET_KEY` configure um ouvinte local:
   1. [Baixe a Stripe CLI](https://stripe.com/docs/stripe-cli#install) e faça login com sua conta.
      ```bash
        $ stripe login
      ```
   2. Encaminhe eventos ao seu destino.
      ```bash
      $ stripe listen --forward-to localhost:3000/api/stripe/webhooks
      ```
      Sendo que `localhost:3000/api/stripe/webhooks` é a rota do webhook da nossa aplicação. Você receberá a chave no terminal ao executar o comando acima.

### Execute a aplicação

```bash
# Em um terminal
$ npm run dev
# A aplicação iniciará na porta 3000 - acesse <http://localhost:3000>
```

```bash
# Em outro terminal
$ stripe listen --forward-to localhost:3000/api/stripe/webhooks
# Lembrando que a chave STRIPE_WEBHOOK_SECRET_KEY tem que ser a mesma que aparece ao executar este comando.
```

## Publicação

Acesse a aplicação publicada clicando no badge abaixo.

<a href="https://go-restaurant-by-die-goncalves.vercel.app/">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/Vercel-Publicado-86efac?style=flat-square&labelColor=white" />
    <source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/badge/Vercel-Publicado-86efac?style=flat-square&labelColor=black" />
    <img src="https://img.shields.io/badge/Vercel-Publicado-86efac?style=flat-square&labelColor=black" alt="Acessar GoRestaurant" />
  </picture>
</a>

## Demonstração

Veja abaixo vídeos demonstrando as principais funcionalidades da aplicação.

## Agradecimento

Agradeço às pessoas e empresas que contribuíram, direta ou indiretamente, para o aprendizado e desenvolvimento deste projeto.

<table>
  <tr>
    <td align="center"><a href="https://rocketseat.com.br/"><b>Rocketseat</b></a></td>
  </tr>
  <tr>
    <td align="left" valign="top"><img width="150" height="150" src="https://avatars.githubusercontent.com/u/28929274?s=150&v=4"></td>
  </tr>
</table>

## Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Autor

Feito por Diego Gonçalves, contato:

<a href="https://www.linkedin.com/in/diego-goncalves1990">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/Linkedin-Diego_Gonçalves-93c5fd?style=flat-square&labelColor=white" />
      <source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/badge/Linkedin-Diego_Gonçalves-93c5fd?style=flat-square&labelColor=black" />
      <img src="https://img.shields.io/badge/Linkedin-Diego_Gonçalves-93c5fd?style=flat-square&labelColor=black" alt="Acessar o LinkedIn de Diego Gonçalves" />
    </picture>
</a>
&nbsp;
<a href="mailto:die.goncalves1990@gmail.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/Gmail-die.goncalves1990@gmail.com-fca5a5?style=flat-square&labelColor=white" />
      <source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/badge/Gmail-die.goncalves1990@gmail.com-fca5a5?style=flat-square&labelColor=black" />
      <img src="https://img.shields.io/badge/Gmail-die.goncalves1990@gmail.com-fca5a5?style=flat-square&labelColor=black" alt="Acessar o Gmail de Diego Gonçalves" />
    </picture>
</a>
