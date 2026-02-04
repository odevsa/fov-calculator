# 🎮 FOV Calculator

Uma aplicação web moderna para calcular o campo de visão ideal para simuladores de corrida.

## 📋 Sobre

O FOV Calculator ajuda você a determinar o FOV (Field of View) perfeito para sua configuração de tela, considerando fatores como:

- Tamanho e proporção da tela
- Distância até a tela
- Configuração single ou triple screen
- Telas curvas

## ✨ Funcionalidades

- ✅ Cálculo preciso de FOV horizontal e vertical
- ✅ Suporte para múltiplas razões de aspecto (16:9, 16:10, 21:9, 32:9, 4:3)
- ✅ Conversão automática de unidades (cm/polegadas)
- ✅ Detecção e cálculo para telas curvas
- ✅ FOV específico para diferentes simuladores:
  - Project CARS
  - Assetto Corsa
  - rFactor 2
  - iRacing
  - F1 2023
- ✅ Interface responsiva e moderna
- ✅ Modo triple screen com suporte a bezel

## 📁 Estrutura de Arquivos

```
fov-calculator/
├── index.html          # Arquivo HTML principal
├── css/
│   └── style.css       # Estilos CSS
├── js/
│   └── script.js       # Lógica JavaScript
└── README.md           # Este arquivo
```

## 🚀 Como Usar

1. Abra `index.html` em um navegador web
2. Preencha os dados:
   - **Proporção da Tela**: Selecione sua razão de aspecto
   - **Tamanho da Tela**: Insira o tamanho diagonal em polegadas
   - **Distância até a Tela**: Insira a distância em cm ou polegadas
   - **Tipo de Configuração**: Single ou Triple Screen
   - **Tela Curva**: Marque se sua tela é curva
   - **Raio da Curvatura**: Se curva, insira o raio em mm
   - **Espessura do Moldura**: Para triple screen, insira a espessura do bezel

3. Clique em **"Calcular FOV"** para obter os resultados

## 🧮 Cálculos Realizados

### FOV Base

- **Horizontal FOV**: Calculado usando trigonometria arctangente
- **Vertical FOV**: Derivado da proporção da tela e FOV horizontal

### Correções

- **Telas Curvas**: Usa arcseno (asin) para cálculos de curvatura
- **Triple Screen**: Expande o FOV horizontal considerando o ângulo das telas laterais

### Simuladores

Cada simulador usa uma fórmula específica:

- **Project CARS**: Usa FOV horizontal direto
- **Assetto Corsa**: Usa FOV vertical
- **rFactor 2**: Usa FOV vertical
- **iRacing**: FOV horizontal × 1.0047
- **F1 2023**: FOV horizontal - 70

## 🎨 Design

- Interface moderna com gradiente roxo/azul
- Totalmente responsivo (mobile, tablet, desktop)
- Animações suaves e transições agradáveis
- Tema claro com feedback visual claro

## 🔧 Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos e responsivos
- **JavaScript (Vanilla)**: Lógica de cálculo e interatividade

## 📝 Notas Importantes

- Os cálculos assumem uma configuração ideal sem obstruções
- A distância deve ser medida do olho até o centro da tela
- Para telas curvas, o raio é inserido em milímetros
- Os valores de FOV para cada simulador são baseados em conversões padrão

## 📱 Compatibilidade

- ✅ Chrome/Edge (versão 90+)
- ✅ Firefox (versão 88+)
- ✅ Safari (versão 14+)
- ✅ Navegadores mobile modernos

## 🤝 Contribuições

Sinta-se livre para enviar sugestões e melhorias!

## 📄 Licença

Projeto livre para uso pessoal e educacional.
