var lista_one = [];
var lista_two = [];
var lista_titulo = [];
function salvar() {
    var descricao = document.getElementById("descricao").value;
    var quantidade = document.getElementById("quantidade").value;
    var valor = document.getElementById("valor").value;
  
    // Verifica se os campos de entrada não são nulos e maiores ou iguais a 1
    if (
      !descricao ||
      !quantidade ||
      !valor 
    ) {
      alert(
        "Por favor, preencha todos os campos e insira valores maiores ou iguais a 1."
      );
      return;
    } else {
      // Cria o objeto compra
      var cripto = {
        descricao: descricao,
        quantidade: quantidade,
        valor: valor,
      };
  
      var criptomoedas = JSON.parse(localStorage.getItem("criptomoedas")) || [];
      criptomoedas.push(cripto);
      localStorage.setItem("criptomoedas", JSON.stringify(criptomoedas));
  
      renderizarLista();
    }
  }
  
function dolar(number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
}

function calcularPercentual(valor1, valor2) {
    // Verifica se os valores são válidos e não são zero para evitar divisão por zero
    if (isNaN(valor1) || isNaN(valor2) || valor1 === 0 || valor2 === 0) {
        return "##";
    }
    
    // Calcula o percentual
    const percentual = ((valor2 - valor1) / valor1) * 100;

    // Formata o percentual com duas casas decimais e o símbolo de percentagem (%)
    const percentualFormatado = percentual.toFixed(1);

    return percentualFormatado;
}
async function fetchCryptoPrice(crypto) {
    try {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${crypto}USDT`);
        if (!response.ok) {
            return false; // Retorna false se a solicitação não for bem-sucedida
        }
        const data = await response.json();
        return data.price;
    } catch (error) {
        console.error("Erro ao buscar preço da criptomoeda:", error);
        return false; // Retorna false em caso de erro
    }
}
async function renderizarLista() {
    limparFormulario();
    mostrarTabela();
    var lista = document.getElementById("lista");
    lista.innerHTML = "";
  
    let total_geral_empregado = 0;
    let total_geral_atualizado = 0;
    let lucro_total = 0;

    var criptomoedas = JSON.parse(localStorage.getItem("criptomoedas")) || [];
    for (let index = 0; index < criptomoedas.length; index++) {
        const cripto = criptomoedas[index];
        const preco_atual = await fetchCryptoPrice(cripto.descricao); // Espera a resposta assíncrona
        const total_compra = cripto.valor * cripto.quantidade
        const total_atual = preco_atual * cripto.quantidade
        const lucro = total_atual - total_compra

        total_geral_empregado +=total_compra;
        total_geral_atualizado +=total_atual;
        lucro_total +=lucro;

        var tr = document.createElement("tr");
        var td0 = document.createElement("td"); // Nova célula para a data de compra
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var td4 = document.createElement("td");
        var td5 = document.createElement("td");
        var td6 = document.createElement("td");
        var td7 = document.createElement("td");
        var td8 = document.createElement("td");

        var botaoAlterar = document.createElement("button");
        botaoAlterar.textContent = "Alterar";
        botaoAlterar.id = `alterar${index}`; // Adiciona um id único ao botão
        botaoAlterar.onclick = function () {
            alterar(index);
        }; // Define a função a ser chamada quando o botão for clicado

        td0.appendChild(botaoAlterar);
        td1.textContent = `${cripto.descricao}`;
        td2.textContent = `${cripto.quantidade}`; 
        td3.textContent = `${dolar(cripto.valor)}`; 
        td4.textContent = `${dolar(total_compra)}`; 
        td5.textContent = `${dolar(preco_atual)}`; 
        td6.textContent = `${dolar(total_atual)}`; 
        td7.textContent = `${dolar(lucro)}`; 
        td8.textContent = `${calcularPercentual(total_compra,total_atual)}%`; 

        tr.appendChild(td0); // Adiciona a nova célula à linha
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);
        tr.appendChild(td8);

        lista.appendChild(tr);
        lista_titulo.push(cripto.descricao)
        lista_one.push(total_compra.toFixed(2));
        lista_two.push(total_atual.toFixed(2));
    }
    salvarValor("total_geral_empregado", total_geral_empregado)
    salvarValor("total_geral_atualizado", total_geral_atualizado)
    salvarValor("lucro_total", lucro_total)
    atualizarValorInvestimento('investimento_total', dolar(total_geral_empregado))
    atualizarValorInvestimento('capital_total', dolar(total_geral_atualizado))
    atualizarValorInvestimento('lucro_total', dolar(lucro_total))
    atualizarValorInvestimento('percento', `${calcularPercentual(total_geral_empregado,total_geral_atualizado)}%`)
    // Renderiza o gráfico com a lista de dados
    const rotulo1 = recuperarValor("total_geral_empregado")
    const rotulo2 = recuperarValor("total_geral_atualizado")
    renderizarGrafico("grafico_one", lista_one, "bar",real(rotulo1));
    renderizarGrafico("grafico_two", lista_two, "bar",real(rotulo2));
}

function real(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value*5);
}

function atualizarValorInvestimento(elementId, novoValor) {
    // Seleciona o elemento HTML pelo ID
    var investimentoTotalElement = document.getElementById(elementId);

    // Verifica se o elemento foi encontrado
    if (investimentoTotalElement) {
        // Atualiza o conteúdo do elemento com o novo valor
        investimentoTotalElement.textContent = (novoValor);
    } else {
        console.error("Elemento com o ID '" + elementId + "' não encontrado.");
    }
}

  // Função para salvar um valor com um título no localStorage
function salvarValor(titulo, valor) {
    // Verifica se o localStorage está disponível no navegador
    if (typeof(Storage) !== "undefined") {
        // Converte o valor para uma string antes de salvar
        localStorage.setItem(titulo, JSON.stringify(valor));
        // console.log(`Valor "${valor}" salvo com o título "${titulo}" no localStorage.`);
    } else {
        console.error("Desculpe, o localStorage não é suportado neste navegador.");
    }
}

// Função para recuperar um valor do localStorage pelo título
function recuperarValor(titulo) {
    // Verifica se o localStorage está disponível no navegador
    if (typeof(Storage) !== "undefined") {
        // Recupera o valor do localStorage
        const valorSalvo = localStorage.getItem(titulo);
        // Verifica se o valor foi encontrado
        if (valorSalvo !== null) {
            // Converte a string de volta para o formato original e retorna o valor
            return JSON.parse(valorSalvo);
        } else {
            console.error(`Nenhum valor encontrado com o título "${titulo}" no localStorage.`);
            return null;
        }
    } else {
        console.error("Desculpe, o localStorage não é suportado neste navegador.");
        return null;
    }
}

  document.addEventListener("DOMContentLoaded", function () {
    renderizarLista();
  });
  
  function limparLocalStorage() {
    localStorage.removeItem("criptomoedas");
    renderizarLista();
  }
  function alterar(index) {
    var criptomoedas = JSON.parse(localStorage.getItem("criptomoedas")) || [];
    var cripto = criptomoedas[index];
  
    // Preenche os campos do formulário com os dados da compra selecionada
    document.getElementById("descricao").value = cripto.descricao;
    document.getElementById("quantidade").value = cripto.quantidade;
    document.getElementById("valor").value = cripto.valor;
  
    // Remove a compra do array de pendências
    criptomoedas.splice(index, 1);
  
    // Atualiza o localStorage com o novo array de pendências
    localStorage.setItem("criptomoedas", JSON.stringify(criptomoedas));
  
    // Renderiza a lista de compras atualizada
    // renderizarListaCompras();
  
    mostrarFormulario();
}

  function mostrarFormulario() {
    document.getElementById("formulario").style.display = "block";
    document.getElementById("tabela").style.display = "none";
  }
  
  function mostrarTabela() {
    document.getElementById("formulario").style.display = "none";
    document.getElementById("tabela").style.display = "block";
  }
  
  function limparFormulario() {
    document.getElementById("descricao").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("valor").value = "";
  }

   // Função para renderizar o gráfico
   function renderizarGrafico(nomeGrafico, listaDados, tipo, rotulo) {
    // Obtém o elemento canvas
    var canvas = document.getElementById(nomeGrafico);
    // console.log(listaDados);

    // Verifica se o elemento canvas foi encontrado
    if (canvas) {
        // Cria um contexto de desenho no elemento canvas
        var ctx = canvas.getContext("2d");

        // Cria o gráfico usando Chart.js
        var myChart = new Chart(ctx, {
            type: tipo, // Tipo de gráfico: linha
            data: {
                labels: lista_titulo, // Rótulos para o eixo X
                datasets: [{
                    label: rotulo, // Rótulo da linha de dados
                    data: listaDados, // Dados para o gráfico
                    borderColor: 'rgba(75, 192, 192, 1)', // Cor da linha
                    borderWidth: 1 // Largura da linha
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true // Começa o eixo Y a partir de zero
                    }
                }
            }
        });
    } else {
        console.error("Elemento com o ID '" + nomeGrafico + "' não encontrado.");
    }
}


mostrarTabela();
renderizarLista()
  