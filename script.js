/**
 * Configurações
 */
var tipos = ["Estagiario", "Junior", "Pleno", "Senior"];
var probabilidades = {
    "Estagiario": {
        "Driver": 40,
        "Navegadores": {
            "Estagiario": 0,
            "Junior": 20,
            "Pleno": 40,
            "Senior": 40
        }
    },

    "Junior": {
        "Driver": 40,
        "Navegadores": {
            "Estagiario": 5,
            "Junior": 5,
            "Pleno": 15,
            "Senior": 75
        }
    },

    "Pleno": {
        "Driver": 10,    
        "Navegadores": {
            "Estagiario": 40,
            "Junior": 30,
            "Pleno": 10,
            "Senior": 20
        }
    },

    "Senior": {
        "Driver": 10,    
        "Navegadores": {
            "Estagiario": 20,
            "Junior": 60,
            "Pleno": 15,
            "Senior": 5
        }
    },
};

var ultimoPar = {};
var desenvolvedores = {};

/**
 * Preenchendo combobox com os tipos cadastrados
 */
var selectTipo = document.getElementById("tipo");

for (var i = 0; i < tipos.length; i++) {
    var option = document.createElement("option");
    option.innerText = tipos[i];
    selectTipo.appendChild(option);
}

/**
 * Evento de submit do formulário de cadastro de desenvolvedores
 */
function adicionarSubmit() {
    var nome = document.getElementById("nome").value;
    var tipoDesenvolvedor = document.getElementById("tipo").value;

    // Verifica nomes em branco
    if (nome.trim().length === 0) {
        alert("Nome não pode ser em branco");

        return;
    }

    // Verifica se o desenvolvedor já está cadastrado
    for (var t in window.desenvolvedores) {
        if (window.desenvolvedores[t] && window.desenvolvedores[t].indexOf(nome) > -1) {
            alert("Desenvolvedor já cadastrado");

            return;
        }
    }

    if (window.desenvolvedores.hasOwnProperty(tipoDesenvolvedor) === false) {
        window.desenvolvedores[tipoDesenvolvedor] = [];
    }

    // Adicionado o desenvolvedor a sua respectiva lista
    window.desenvolvedores[tipoDesenvolvedor].push(nome);

    // Limpa o nome do desenvolvedor do formulário'
    document.getElementById("nome").value = "";

    // Adiciona o desenvolvedor na lista de cadastrados
    var option = document.createElement("option");
    option.innerHTML = tipoDesenvolvedor + " - " + nome;
    document.getElementById("cadastrados").appendChild(option);
}

/**
 * Função chamado no sorteio
 */
function sortearClick() {
    // Geramos todas as possibilidades
    var probabilidadeGeral = gerarProbabilidades();

    // Iteramos até as possibilidades acabarem
    while(probabilidadeGeral.length > 0) {

        // Escolhendo uma hipotese
        var random = Math.floor(Math.random() * probabilidadeGeral.length);
        var hipotese = probabilidadeGeral.splice(random, 1)[0];

        // Pego o primeiro driver e navigator disponivel
        var driver = window.desenvolvedores[hipotese.Driver].splice(0,1)[0];
        var navigator = window.desenvolvedores[hipotese.Navigator].splice(0,1)[0];

        // Jogo eles de volta para o final da lista
        window.desenvolvedores[hipotese.Driver].push(driver);
        window.desenvolvedores[hipotese.Navigator].push(navigator);

        // Caso a dupla sorteada seja igual a anterior, pular para a proxima probabilidade
        if ((window.ultimoPar.Driver === driver && window.ultimoPar.Navigator == navigator) ||
            (window.ultimoPar.Driver === navigator && window.ultimoPar.Navigator === driver)) {
            continue;
        }

        // Atualizando a tela com os dados
        document.getElementById("driverTipo").innerText = hipotese.Driver;
        document.getElementById("navigatorTipo").innerText = hipotese.Navigator;

        document.getElementById("driverNome").innerText = driver;
        document.getElementById("navigatorNome").innerText = navigator;

        // Atualizando os dados de último par selecionado
        window.ultimoPar.Driver = driver;
        window.ultimoPar.Navigator = navigator;

        // Encerra a execução da função
        return;
    }

    // Quando todas as possibilidades se esgotaram
    if (probabilidadeGeral.length === 0) {
        alert("Não existem possibilidades de sorteio");
    }
}

/**
 * Função geradora de todas as possibilidades
 */
function gerarProbabilidades() {
    var probabilidadeGeral = [];

    // Crio as possibilidades apenas para cada tipo de desenvolvedor com registro
    for (var tipoDriver in window.desenvolvedores) {

        // Calculando as probabilidades de navegadores para o tipo do driver
        var probabilidadesNavegadores = [];
        for (var tipoNavegador in window.probabilidades[tipoDriver].Navegadores) {

            // Só considerar os tipos de navegadores que tiverem cadastrado
            if (window.desenvolvedores[tipoNavegador] && window.desenvolvedores[tipoNavegador].length > 0) {

                // Quando o tipo do driver e o tipo do navegador forem iguais, preciso verificar se tem pelo menos 2 desenvolvedores cadastrados
                // Se não tiver, eu pulo para a próxima iteração do loop de navegadores
                // Ex.: Senior e Senior
                if (tipoDriver === tipoNavegador && window.desenvolvedores[tipoNavegador].length < 2) {
                    continue;
                }

                // Gera as combinações possíveis entre driver e navegador de acordo com as configurações
                for (var i = 0; i < window.probabilidades[tipoDriver].Navegadores[tipoNavegador]; i++ ) {
                    probabilidadesNavegadores.push({Driver: tipoDriver, Navigator: tipoNavegador});
                }
            }
        }

        // Adicionando nas probabilidadesGeral de acordo com a probabilidade do driver ser selecionado
        for (var j = 0; j < window.probabilidades[tipoDriver].Driver; j++) {
            probabilidadeGeral = probabilidadeGeral.concat(probabilidadesNavegadores); 
        }
    }

    return probabilidadeGeral;
}