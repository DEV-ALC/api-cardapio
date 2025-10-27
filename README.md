# api-cardapio

API em **TypeScript** para gestão empresarial e **PDV (Ponto de Venda)**.  
Inclui autenticação JWT, cadastro de empresas, usuários e produtos, além de operações de venda.  
A API utiliza banco de dados **Cloudflare D1** (SQLite compatível) e foi projetada para rodar em ambiente **serverless**, com alta escalabilidade.

---

## 🚀 Funcionalidades

- Autenticação via **JWT**
- Cadastro e gerenciamento de:
  - Softhouses
  - Empresas
  - Usuários
  - Produtos
  - Grupos de produtos
- Registro de vendas e itens de venda
- Integração com banco **Cloudflare D1**
- Deploy otimizado para **Cloudflare Workers**

---

## 🛠️ Tecnologias

- [TypeScript](https://www.typescriptlang.org/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

---

## 📦 Instalação

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/api-cardapio.git
cd api-cardapio

//comando para inciar a banco 
wrangler d1 migrations apply D1_BANCO  --local

```
