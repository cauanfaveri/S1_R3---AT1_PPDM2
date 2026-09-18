# Pokédex Mobile — Aplicação Mobile com Consumo de API

Atividade prática: aplicativo em **React Native + Expo (TypeScript)** que consome a API pública **PokéAPI** (https://pokeapi.co) e exibe os dados em três telas com navegação em pilha.

## Estrutura do projeto

```
s2-r1-api-pokedex/
├── assets/
│   └── icon.png
├── src/
│   ├── screens/
│   │   ├── Home/index.tsx        # Tela inicial (título, descrição, botão)
│   │   ├── Lista/index.tsx       # Tela de listagem (FlatList + fetch)
│   │   ├── Detalhes/index.tsx    # Tela de detalhes do item selecionado
│   │   └── pics/pokeball.png     # Imagens usadas nas telas
│   ├── services/
│   │   └── api.ts                # Funções de requisição à PokéAPI
│   └── types/
│       └── index.ts              # Tipagens da navegação e da API
├── App.tsx                       # Configuração do NavigationContainer/Stack
├── index.ts
├── app.json
├── package.json
└── tsconfig.json
```

## Como executar

```bash
cd s2-r1-api-pokedex
npm install
npx expo start
```

Abra no **Expo Go** (QR Code) ou pressione `a` para rodar no emulador do Android Studio.

> Se preferir criar o projeto do zero antes de colar os arquivos:
> ```bash
> npx create-expo-app s2-r1-api-pokedex --template blank-typescript
> cd s2-r1-api-pokedex
> npx expo install react-native-screens react-native-safe-area-context
> npm install @react-navigation/native @react-navigation/native-stack
> ```

## Requisitos atendidos

| Requisito | Onde está implementado |
|---|---|
| 1. Tela inicial com nome, descrição e botão | `src/screens/Home/index.tsx` |
| 2. Tela de listagem com requisição à API | `src/screens/Lista/index.tsx` + `src/services/api.ts` (`GET /pokemon?limit=60`) |
| 3. Tela de detalhes com dados adicionais | `src/screens/Detalhes/index.tsx` (`GET /pokemon/{id}`) |
| 4. Navegação funcional entre telas | `App.tsx` com `createNativeStackNavigator` |

## Endpoints utilizados

| Uso | Endpoint |
|---|---|
| Listagem | `https://pokeapi.co/api/v2/pokemon?limit=60&offset=0` |
| Detalhes | `https://pokeapi.co/api/v2/pokemon/{id}` |
| Imagem | `raw.githubusercontent.com/PokeAPI/sprites/.../official-artwork/{id}.png` |

## Extras implementados

- Campo de busca por nome na listagem.
- Indicador de carregamento (`ActivityIndicator`) e tratamento de erro com botão "Tentar novamente".
- Barras de progresso para os status base na tela de detalhes.
- Tipagem completa em TypeScript (rotas e respostas da API).
