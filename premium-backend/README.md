# Propz Backend

---

## Introdução

---

Esse projeto foi construido pela GoAllfa (Parceiro D1000), no intuito de utilizar ferramenta da propz dentro das lojas de profarma \ rede D1000.

## Links importantes
[Sobre a propz](https://propz.com.br/)
---

### Produção/admin Propz 🛒

---

[Drogasmil](https://drogasmil.myvtex.com/admin/propz)

[Farmalife](https://farmalifebr.myvtex.com/admin/propz)

[Rosario](https://rosario.myvtex.com/admin/propz)

[Tamoio](https://tamoio.myvtex.com/admin/propz)


### Team Work da Rede d1000 🛠️

---

https://teamwork.corebiz.com.br/app/projects/602716/overview/summary


## Comandos iniciais para Iniciar 💻

---

- **No git clone abaixo exemplo**

  `git clone https://gitlab.corebiz.cl:9090/vtex/hub1002/spartans/grupo-profarma/propz/propz-backend.git ou ssh://git@gitlab.corebiz.cl:2224/vtex/hub1002/spartans/grupo-profarma/propz/propz-backend.git`

- **Verificar se esta logado na VTEX do seu cliente**

  `vtex whoami`

  Isso aparecerá na sua tela

  `info: Logged into drogasmil as yourUser@corebiz.ag at production workspace master`

  Caso você não esteja logado na loja, basta rodar o seguinte comando:

  `vtex login [nome-da-loja]`

- **Para instalar os pacotes do node, rodar o seguinte comando:**

  `yarn`

- **Em outro terminal, iremos dar o vtex link**

  `vtex login nomedaloja`

- Nessa etapa abaixo, usamos o código de criação da task que é descrita no team work para criar uma nova branch (ou usar uma que já existe)

  `vtex use feat000000`

  `vtex link`

## Como contribuir ⚙️:

---

- Crie uma nova workspace a partir da branch master com o nome: [tipo-da-branch]/[nome-da-task]-[identificador-teamwork]

- Os tipos de branches são:

  - **feature**: Desenvolvimento de novas funcionalidades

  - **fix**: Desenvolvimento de correções

  - **hotfix**: Apenas para correções de bugs de alto impacto em produção

- Exemplo de branch: feature/logicaschema-31289991

## Boas práticas de desenvolvimento 🔧

---

- Não usar “var” para declarar variáveis

- Sempre usar verbo para criar nomes de funções

- Manter lógica de organização das pastas

- Não subir arquivos para produção com console.log

- Sempre manter a branch da tarefa que esta sendo desenvolvida atualizada com a branch master

## Boas práticas de deploy 🚀

---

- Com exceção de deploys urgentes, evitamos fazer deploys na sexta feira.

- Ao fazer deploy, para evitar conflito com versões anteriores, usar o seguinte padrão para nomeação de ws: [nome-do-dev][data-do-deploy]. Por exemplo, quando o desenvolvedor for fazer deploy no dia 09/03, utilizar nomedodev0903.
