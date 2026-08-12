# FLIXORA — Web (versão de pré-lançamento)

**Seu universo de entretenimento.**

Esta pasta contém a versão **web 100% funcional** da FLIXORA: navegação completa, busca,
páginas de detalhe, favoritos e **player de vídeo customizado já operante** — pronta para
receber o catálogo licenciado assim que os acordos com distribuidoras forem fechados.

Feita em **HTML + CSS + JavaScript puros** (sem framework, sem etapa de build), para poder
ser publicada em qualquer hospedagem estática hoje mesmo.

---

## 1. Rodando localmente

Como o app usa `import` de módulos JS, ele precisa ser servido por um servidor HTTP (não abra
o `index.html` direto com duplo clique). Qualquer servidor estático simples resolve:

```bash
# Opção 1 — Python (já vem em quase todo sistema)
cd flixora
python3 -m http.server 8080

# Opção 2 — Node
npx serve .

# Opção 3 — VS Code
# extensão "Live Server" -> botão direito em index.html -> "Open with Live Server"
```

Depois acesse `http://localhost:8080`.

---

## 2. Catálogo: modo demo x catálogo real (TMDB)

A plataforma já funciona **sem nenhuma configuração**, em **modo demonstração**: gera
localmente pôsteres, títulos e sinopses de exemplo para que toda a navegação, os cards, a
página de detalhe e o player possam ser testados de ponta a ponta.

Para carregar **capas, sinopses e informações reais** de filmes e séries (fonte pública e de
uso permitido):

1. Crie uma conta gratuita em https://www.themoviedb.org/
2. Gere sua chave de API em https://www.themoviedb.org/settings/api
3. Abra a FLIXORA → menu **Sobre a plataforma** (rodapé ou `#/sobre`) → cole a chave → Salvar

A chave fica salva **apenas no navegador** (localStorage), nunca é enviada a nenhum servidor
próprio. Isso está isolado em `js/core/config.js`.

> O app usa a API do TMDB mas não é endossado ou certificado por ele.

---

## 3. O player de vídeo

`js/core/player.js` implementa um player customizado (play/pause, avançar/voltar 10s, volume,
barra de progresso arrastável, velocidade, picture-in-picture, tela cheia, atalhos de teclado)
sobre a tag `<video>` nativa — sem dependências externas.

Como ainda não há licenciamento de conteúdo, ele exibe um vídeo de demonstração de **licença
pública (Creative Commons — Blender Foundation, "Big Buck Bunny")**, apenas para provar que o
player está pronto para produção.

**Para ativar conteúdo licenciado**, edite `js/views/player-view.js` e troque a chamada:

```js
player.mount(CONFIG.DEMO_VIDEO_URL, { ... })
```

por:

```js
player.mount('https://sua-cdn-licenciada.com/filme.mp4', { ... })
// ou uma URL .m3u8 (HLS) — nesse caso, adicione a lib hls.js (CDN) e
// conecte um MediaSource antes de chamar player.mount().
```

Nenhuma outra parte do app precisa mudar — o restante do fluxo (progresso salvo, título,
sinopse) já está conectado.

---

## 4. Estrutura do projeto

```
flixora/
├── index.html              # shell da SPA (topbar, rodapé, <main id="app">)
├── manifest.json            # metadados PWA (instalar como app)
├── css/
│   ├── style.css            # design system (cores, tipografia, componentes)
│   └── player.css           # estilos do player customizado
└── js/
    ├── app.js                # bootstrap: rotas, busca, menu mobile
    ├── core/
    │   ├── config.js         # chave TMDB, idioma, URLs
    │   ├── tmdb.js            # cliente da API (com fallback automático p/ demo)
    │   ├── mock-data.js       # catálogo de demonstração
    │   ├── poster.js          # gera pôsteres placeholder em SVG local
    │   ├── state.js           # favoritos, "continuar assistindo", toast
    │   ├── router.js          # roteador SPA baseado em hash
    │   ├── player.js          # player de vídeo customizado
    │   └── ui.js              # componentes (cards, trilhos, grids)
    └── views/
        ├── home.js            # início (hero, trilhos)
        ├── catalog.js         # catálogo de filmes/séries + filtros
        ├── lists.js           # gêneros, em alta, favoritos
        ├── detail.js          # página de detalhes
        ├── player-view.js     # página do player
        ├── premium.js         # planos
        └── about.js           # sobre / configuração da chave TMDB
```

## 5. Identidade visual

| Uso            | Cor        |
|-----------------|-----------|
| Fundo           | `#08080C` |
| Roxo principal  | `#7C3AED` |
| Destaque        | `#A855F7` |
| Texto           | `#F5F5F5` |
| Cards           | `#171720` |

Tipografia: **Sora** (com fallback de sistema). Logo: "F" minimalista que também remete a um
botão de play.

---

## 6. Próximos passos (Android, iOS, TV)

Esta base foi pensada para ser reaproveitada:

- **Rápido (semanas):** empacotar esta mesma versão web com **Capacitor** ou **PWA instalável**
  para gerar os apps Android/iOS/TV a partir do mesmo código.
- **Nativo completo (recomendado a médio prazo):** reconstruir as telas em **React Native**
  (Android/iOS) e **Android TV / tvOS / LG webOS / Samsung Tizen** para melhor performance e
  suporte a controle remoto — reaproveitando a mesma API de catálogo (`js/core/tmdb.js` vira o
  contrato de referência) e o mesmo backend de licenciamento/streaming quando estiver pronto.
- **Backend próprio (quando as licenças chegarem):** será necessário um serviço de autenticação,
  catálogo próprio (o que está e não está liberado por território/distribuidora), DRM de vídeo
  (Widevine/FairPlay/PlayReady) e CDN de streaming — isso ainda não está implementado aqui, pois
  depende dos contratos de licenciamento que vocês estão fechando.

---

## 7. Aviso legal / uso de dados

- Metadados e imagens de demonstração podem vir do **TMDB**, mediante chave própria gratuita.
- O vídeo de demonstração do player é distribuído sob licença **Creative Commons** pela Blender
  Foundation e serve apenas para validar o player — troque pela sua fonte licenciada antes de
  publicar em produção.
- A FLIXORA, como está aqui, **não distribui nenhum conteúdo protegido por direitos autorais**.
