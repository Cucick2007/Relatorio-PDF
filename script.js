function gerarRelatorio() {
    // 1. Coletar dados dos inputs principais
    const nomeEmpresa = document.getElementById('nome').value;
    const dataEmissao = document.getElementById('data').value;
    const valorTotal = document.getElementById('valorT').value;
    const assContratante = document.getElementById('assC').value;
    const assAprovador = document.getElementById('assA').value;
    const observacao = document.getElementById('obs').value;

    // Arrays para coletar dados dos itens múltiplos
    const itensComprados = [];
    const quantidades = [];
    const valoresUnitarios = [];

    for (let i = 0; i < 5; i++) { // Loop para 5 itens (0 a 4)
        const item = document.getElementById(`itens${i}`).value;
        const qtd = document.getElementById(`qtd${i}`).value;
        const valorU = document.getElementById(`valorU${i}`).value;

        // Adiciona apenas se o campo não estiver vazio para evitar lixo no relatório
        if (item) itensComprados.push(item);
        if (qtd) quantidades.push(qtd);
        if (valorU) valoresUnitarios.push(valorU);
    }

    // 3. Preencher o relatório com os dados coletados nos spans de saída
    document.getElementById('nomeE').textContent = nomeEmpresa;
    document.getElementById('dataE').textContent = dataEmissao;
    document.getElementById('valorTotal').textContent = `R$ ${parseFloat(valorTotal || 0).toFixed(2)}`;

    document.getElementById('assinatura').textContent = `${assContratante} / ${assAprovador}`;
    document.getElementById('observacao').textContent = observacao;

    // --- Parte específica para os múltiplos itens, quantidades e valores unitários ---

    // a) Preencher Itens de Compra (lista detalhada)
    const outputItensCompraSpan = document.getElementById('itensCompra');
    outputItensCompraSpan.innerHTML = ''; // Limpa o conteúdo

    const ulElement = document.createElement('ul');
    outputItensCompraSpan.appendChild(ulElement);

    let temItensPreenchidos = false; // Flag para verificar se há pelo menos um item válido
    for (let i = 0; i < 5; i++) {
        const item = document.getElementById(`itens${i}`).value;
        const qtd = document.getElementById(`qtd${i}`).value;
        const valorU = document.getElementById(`valorU${i}`).value;

        if (item || qtd || valorU) { // Adiciona o item à lista se QUALQUER um dos campos estiver preenchido
            const li = document.createElement('li');
            let itemText = item ? item : 'N/A'; // Se o item estiver vazio, mostra N/A
            let qtdText = qtd ? `Qtd: ${qtd}` : 'Qtd: N/A';
            let valorUText = valorU ? `V. Unit: R$ ${parseFloat(valorU).toFixed(2)}` : 'V. Unit: N/A';
            
            let totalItem = 0;
            if (qtd && valorU) {
                totalItem = parseFloat(qtd) * parseFloat(valorU);
                li.textContent = `${itemText} - ${qtdText} - ${valorUText} - Total do Item: R$ ${totalItem.toFixed(2)}`;
            } else {
                li.textContent = `${itemText} - ${qtdText} - ${valorUText}`;
            }
            
            ulElement.appendChild(li);
            temItensPreenchidos = true;
        }
    }
    // Se não houver itens preenchidos, exibe uma mensagem
    if (!temItensPreenchidos) {
        ulElement.innerHTML = '<li>Nenhum item informado.</li>';
    }


    // b) Preencher Quantidade (concatenando todos os valores)
    // Filtra para remover entradas vazias e junta com vírgula e espaço
    document.getElementById('quantidade').textContent = quantidades.filter(q => q !== '').join(', ');
    if (document.getElementById('quantidade').textContent === '') {
        document.getElementById('quantidade').textContent = 'N/A';
    }

    // c) Preencher Valor Unitário (concatenando todos os valores)
    // Filtra para remover entradas vazias, formata como moeda e junta
    document.getElementById('valorUnitario').textContent = valoresUnitarios
        .filter(v => v !== '')
        .map(v => `R$ ${parseFloat(v).toFixed(2)}`)
        .join(', ');
    if (document.getElementById('valorUnitario').textContent === '') {
        document.getElementById('valorUnitario').textContent = 'N/A';
    }
    
    // --- Fim da parte específica ---


    // 4. Tornar o relatório visível
    const relatorioDiv = document.getElementById('relatorio');
    relatorioDiv.style.visibility = 'visible';
    relatorioDiv.style.position = 'static';
    relatorioDiv.scrollIntoView({ behavior: 'smooth' });
}

// Funções gerarPDF e imprimirRelatorio permanecem inalteradas
function gerarPDF() {
    gerarRelatorio();
    const element = document.getElementById('relatorio');
    const botoesDiv = document.querySelector('.botoes');
    botoesDiv.style.display = 'none';

    html2pdf(element, {
        margin: 10,
        filename: 'relatorio.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).then(() => {
        botoesDiv.style.display = 'flex';
    });
}

function imprimirRelatorio() {
    gerarRelatorio();
    const element = document.getElementById('relatorio');
    const botoesDiv = document.querySelector('.botoes');
    botoesDiv.style.display = 'none';

    window.print();

    botoesDiv.style.display = 'flex';
}