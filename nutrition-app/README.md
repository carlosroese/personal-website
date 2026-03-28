# NutriTrack — App de Rastreamento Nutricional

App móbile desenvolvido com React Native (Expo) para análise nutricional inteligente via chat e reconhecimento de imagem.

## Funcionalidades

- **Chat nutricional** — descreva o que está comendo e receba carboidratos, proteínas, gorduras e calorias
- **Análise por foto** — tire uma foto ou envie da galeria e o app identifica os alimentos automaticamente
- **Login social** — cadastre-se com Google ou Facebook (dados do perfil preenchidos automaticamente)
- **Cadastro manual** — cadastro com e-mail e senha
- **Perfil do usuário** — idade, altura, peso e gênero com cálculo do IMC
- **Design escuro** — interface moderna com tema dark

## Pré-requisitos

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Conta na [Anthropic](https://console.anthropic.com/) para obter a API Key

## Instalação

```bash
cd nutrition-app
npm install
```

## Configuração

### 1. Chave da API Anthropic (obrigatório)

Abra o arquivo `app.json` e adicione sua chave no campo `extra.ANTHROPIC_API_KEY`:

```json
{
  "expo": {
    "extra": {
      "ANTHROPIC_API_KEY": "sk-ant-sua-chave-aqui"
    }
  }
}
```

Obtenha sua chave em: https://console.anthropic.com/settings/keys

### 2. Google OAuth (opcional)

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto → Credenciais → Criar credencial → ID do cliente OAuth 2.0
3. Tipo: Aplicativo para iOS/Android ou Web
4. Adicione o Client ID em `app.json > extra.GOOGLE_CLIENT_ID`

### 3. Facebook OAuth (opcional)

1. Acesse o [Facebook for Developers](https://developers.facebook.com/)
2. Crie um app → Adicionar produto → Facebook Login
3. Adicione o App ID em `app.json > extra.FACEBOOK_APP_ID`

> **Nota:** Os botões de Google e Facebook exibirão uma mensagem de configuração se os IDs não estiverem preenchidos.

## Rodando o app

```bash
# Iniciar o servidor Expo
npm start

# Android
npm run android

# iOS
npm run ios

# Web (para testar rapidamente, sem câmera)
npm run web
```

## Estrutura do projeto

```
nutrition-app/
├── App.tsx                          # Entrada do app
├── app.json                         # Configuração Expo (API keys aqui)
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx          # Tela de login (Google, Facebook, E-mail)
│   │   ├── RegisterScreen.tsx       # Cadastro manual
│   │   ├── ProfileSetupScreen.tsx   # Perfil: idade, altura, peso, gênero
│   │   └── ChatScreen.tsx           # Chat principal + análise de fotos
│   ├── services/
│   │   ├── nutritionService.ts      # Integração Claude API (texto + imagem)
│   │   └── authService.ts           # Google, Facebook, e-mail auth
│   ├── context/
│   │   └── AuthContext.tsx          # Estado global de autenticação
│   ├── navigation/
│   │   └── AppNavigator.tsx         # Rotas do app
│   ├── theme/
│   │   └── colors.ts                # Paleta de cores
│   └── types/
│       └── index.ts                 # Tipagens TypeScript
```

## Como usar o chat

**Por texto:**
```
"100g de frango grelhado e 150g de arroz branco cozido"
"1 banana prata (120g) e 30g de aveia"
"200ml de leite integral e 2 ovos inteiros"
```

**Por foto:**
1. Toque no ícone 📷 no chat
2. Tire uma foto do prato ou escolha da galeria
3. O app identifica os alimentos e estima os pesos automaticamente

## Tecnologias

| Tecnologia | Uso |
|---|---|
| React Native + Expo | Framework móbile |
| TypeScript | Tipagem estática |
| React Navigation | Navegação entre telas |
| Claude API (claude-sonnet-4-6) | Análise nutricional por texto e imagem |
| expo-image-picker | Câmera e galeria |
| expo-auth-session | OAuth Google e Facebook |
| AsyncStorage | Persistência local do usuário |
| expo-linear-gradient | Gradientes na UI |

## Notas de segurança

> ⚠️ Esta implementação armazena a API key no `app.json` para fins de desenvolvimento. Em produção, as chamadas à API da Anthropic devem ser feitas através de um backend seguro para proteger a chave.

## Licença

MIT
