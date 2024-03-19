 // Carrega o cabeçalho
 fetch('navbar/index.html')
 .then(response => response.text())
 .then(data => document.getElementById('navbar').innerHTML = data);

// Carrega o cabeçalho
fetch('header/index.html')
 .then(response => response.text())
 .then(data => document.getElementById('header').innerHTML = data);

// Carrega o tabela
fetch('table/index.html')
 .then(response => response.text())
 .then(data => document.getElementById('table').innerHTML = data);
// Carrega o rodapé
fetch('footer/index.html')
 .then(response => response.text())
 .then(data => document.getElementById('footer').innerHTML = data);


// Carrega o tabela
fetch('graficos/grafico_one.html')
 .then(response => response.text())
 .then(data => document.getElementById('grafico_primeiro').innerHTML = data);
// Carrega o rodapé
fetch('graficos/grafico_two.html')
 .then(response => response.text())
 .then(data => document.getElementById('grafico_segundo').innerHTML = data);

 document.addEventListener("DOMContentLoaded", function() {
    // Carregar arquivos JavaScript aqui
    var script1 = document.createElement("script");
    script1.src = "table/main.js";
    document.head.appendChild(script1);

    
    // Adicione mais scripts conforme necessário
});