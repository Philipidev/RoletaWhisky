# 🎰 Roleta Numérica

Uma aplicação web moderna para sorteios numéricos com roleta animada, construída com React, TypeScript e Framer Motion.

## ✨ Funcionalidades

- **Configuração flexível**: Defina números por quantidade (1-N) ou por ranges customizados
- **Roleta animada**: SVG com animações fluidas e efeitos visuais
- **Histórico persistente**: Todos os sorteios são salvos no localStorage
- **Controle de repetição**: Opção para permitir ou não números repetidos
- **Exportação CSV**: Exporte o histórico completo dos sorteios
- **Interface responsiva**: Funciona perfeitamente em desktop e mobile
- **Acessibilidade**: Suporte completo a leitores de tela e navegação por teclado

## 🚀 Tecnologias

- **Frontend**: Vite + React 19 + TypeScript
- **Estilos**: Tailwind CSS
- **Animações**: Framer Motion
- **Estado**: Zustand
- **Testes**: Vitest + Testing Library
- **Qualidade**: ESLint + Prettier

## 📦 Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd RoletaWhisky

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Ou execute os testes
npm run test
```

## 🎮 Como usar

### 1. Configurar números

**Modo Quantidade:**
- Digite um número (ex: 500)
- Será gerado um pool de 1 até o número informado

**Modo Ranges:**
- Adicione intervalos personalizados (ex: 10-200, 230-240)
- Os ranges são automaticamente mesclados e duplicatas removidas

### 2. Configurar opções

- **Permitir repetidos**: Se desabilitado, números sorteados não podem ser sorteados novamente
- **Reset geral**: Limpa tudo (números e histórico)
- **Limpar histórico**: Remove apenas o histórico de sorteios

### 3. Sortear

- Clique na roleta ou no botão "Girar Roleta"
- A roleta gira com animação realística
- O número sorteado aparece em destaque
- O resultado é automaticamente salvo no histórico

### 4. Gerenciar histórico

- Visualize todos os sorteios organizados por data
- Remova números específicos da roleta
- Exporte o histórico completo em formato CSV

## 🧪 Testes

```bash
# Executar todos os testes
npm run test

# Executar testes uma vez
npm run test:run

# Executar com interface visual
npm run test:ui

# Executar com coverage
npm run test:coverage
```

## 🏗️ Build para produção

```bash
# Gerar build otimizado
npm run build

# Visualizar build localmente
npm run preview
```

## 📁 Estrutura do projeto

```
src/
├── app/
│   └── App.tsx              # Componente principal
├── components/
│   ├── wheel/               # Componentes da roleta
│   │   ├── Wheel.tsx
│   │   ├── Pointer.tsx
│   │   └── Wheel.svg.utils.ts
│   ├── controls/            # Controles de configuração
│   │   ├── Controls.tsx
│   │   └── RangeEditor.tsx
│   ├── history/             # Histórico de sorteios
│   │   ├── HistoryList.tsx
│   │   └── ExportButton.tsx
│   └── ui/                  # Componentes base
│       ├── Button.tsx
│       ├── Toggle.tsx
│       ├── Field.tsx
│       └── NumberBadge.tsx
├── store/
│   └── useDrawStore.ts      # Estado global (Zustand)
├── lib/
│   ├── types.ts             # Tipos TypeScript
│   ├── rng.ts               # Gerador de números aleatórios
│   ├── persistence.ts       # Persistência localStorage
│   ├── csv.ts               # Exportação CSV
│   └── __tests__/           # Testes dos utilitários
└── test/
    └── setup.ts             # Configuração dos testes
```

## 🎨 Personalização de tema

O projeto foi estruturado para facilitar a personalização visual. Para implementar um tema "whisky":

1. **Cores**: Edite `tailwind.config.js` com a paleta de cores desejada
2. **Texturas**: Adicione assets em `src/assets/` 
3. **Componentes**: Os tokens de tema estão isolados em `src/lib/types.ts`

## 🔧 Configurações avançadas

### Seed para reproduzibilidade

```typescript
// No store, configure um seed fixo para testes
options: {
  allowRepeats: true,
  seed: 12345 // Sempre gerará a mesma sequência
}
```

### Limites personalizados

```typescript
// Ajuste os limites em src/store/useDrawStore.ts
const MAX_QUANTITY = 10000; // Máximo de números
const MAX_RANGES = 50;      // Máximo de ranges
```

## 📱 Responsividade

A aplicação é totalmente responsiva:
- **Desktop**: Layout em 3 colunas (controles | roleta | histórico)
- **Tablet**: Layout adaptativo com roleta centralizada
- **Mobile**: Layout em coluna única com navegação otimizada

## ♿ Acessibilidade

- Todos os botões têm labels ARIA apropriados
- Navegação completa por teclado
- Suporte a leitores de tela
- Contraste adequado para WCAG 2.1
- Animações respeitam `prefers-reduced-motion`

## 🐛 Solução de problemas

### Erro de build
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Problemas de persistência
```bash
# Limpe o localStorage no DevTools
localStorage.clear()
```

### Testes falhando
```bash
# Verifique se todas as dependências estão instaladas
npm install --include=dev
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

Desenvolvido com ❤️ usando React + TypeScript + Framer Motion