// Pega as referências dos elementos HTML
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');

// Função para atualizar o preview
function updatePreview() {
    // 1. Pega o texto do editor
    const markdownText = editor.value;
    
    // 2. Converte o texto para HTML usando a biblioteca marked()
    const htmlText = marked.parse(markdownText);
    
    // 3. Coloca o HTML gerado dentro da div de preview
    preview.innerHTML = htmlText;
}

// Adiciona um "escutador de eventos" no editor.
// O evento 'input' é acionado toda vez que o usuário digita algo.
editor.addEventListener('input', updatePreview);

// Adiciona um texto inicial para demonstração
editor.value = `# Olá, Mundo!

Este é um preview de **Markdown** em tempo real.

## Recursos

- Listas
- *Itálico* e **Negrito**
- \`código inline\`

\`\`\`javascript
// Bloco de código
function hello() {
  console.log("Bem-vindo!");
}
\`\`\`
`;

// Chama a função uma vez no início para renderizar o texto inicial
updatePreview();