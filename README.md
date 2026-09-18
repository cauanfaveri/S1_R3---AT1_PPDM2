# PokéMatch

PokéMatch é uma experiência de descoberta de Pokémon inspirada em aplicativos de match. Em vez de navegar por uma lista tradicional, a pessoa usuária avalia um Pokémon por vez: arrasta o card para a direita para curtir ou para a esquerda para passar.

O aplicativo foi desenvolvido com React Native, Expo e TypeScript, consumindo dados públicos da [PokéAPI](https://pokeapi.co/).

## Funcionalidades

- Descoberta de Pokémon em cards, no estilo Tinder.
- Gesto de swipe para a direita (curtir) e esquerda (passar).
- Card com rotação, indicadores visuais de ação e retorno elástico quando o gesto não atinge o limite.
- Botões para passar, super match e curtir.
- Animação de celebração ao criar um match.
- Tela com os Pokémon curtidos durante a sessão.
- Perfil detalhado com tipos, medidas, habilidades e atributos base.
- Estados de carregamento e tratamento de falha de rede.

> Os matches ficam somente em memória e são reiniciados ao fechar o aplicativo.

## Tecnologias

- Expo SDK 57
- React 19
- React Native 0.86
- TypeScript
- React Navigation Native Stack
- React Native Safe Area Context
- PokéAPI

## Pré-requisitos

- Node.js `22.13.0` ou superior
- npm
- Expo Go no celular, ou um emulador Android/iOS

## Instalação e execução

```bash
npm install
npx expo start --lan
```

Leia o QR Code com o Expo Go. O computador e o celular devem estar na mesma rede Wi-Fi.

Outros comandos disponíveis:

```bash
npm run android
npm run ios
npm run web
```

## Problemas de instalação

Se o projeto foi atualizado de uma versão anterior do Expo e ocorrer conflito de dependências, faça uma instalação limpa:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npx expo start -c --lan
```

## Como usar

| Ação | Resultado |
|---|---|
| Arrastar card para a direita | Curte o Pokémon e cria um match. |
| Arrastar card para a esquerda | Passa para o próximo Pokémon. |
| Botão `×` | Passa o Pokémon. |
| Botão `★` | Cria um super match. |
| Botão `♥` | Cria um match. |
| Tocar no card | Abre o perfil completo. |
| Ícone de matches no topo | Abre a coleção de Pokémon curtidos. |

## Estrutura

```text
src/
├── context/
│   └── PokemonMatches.tsx  # Estado compartilhado dos matches
├── screens/
│   ├── Home/               # Descoberta e gesto de swipe
│   ├── Lista/              # Pokémon curtidos
│   └── Detalhes/           # Perfil do Pokémon
├── services/
│   └── api.ts              # Comunicação com a PokéAPI
├── theme.ts                # Cores e utilitários visuais
└── types/
    └── index.ts            # Tipagens da navegação e API
```

## Endpoints utilizados

| Uso | Endpoint |
|---|---|
| Perfil por nome ou ID | `https://pokeapi.co/api/v2/pokemon/{name-or-id}` |
| Perfil por URL | URL retornada pela PokéAPI |
| Arte oficial | `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png` |

## Validação

Para verificar os tipos sem iniciar o aplicativo:

```bash
npx tsc --noEmit
```
