async function fetchDados(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        return null;
    }
}

async function carregarCozinhas() {
    const data = await fetchDados("http://localhost:8080/v1/toque_gourmet/cozinha");

    if (!data || !data.response || !Array.isArray(data.response.cozinha)) return;

    const cozinhas = data.response.cozinha;
    const grupo = document.querySelector(".filtro-group:nth-of-type(2)");

    const titulo = document.createElement("h3");
    titulo.textContent = "Tipo de Cozinha";

    const elementos = [titulo];

    cozinhas.forEach(cz => {
        const label = document.createElement("label");

        const input = document.createElement("input");
        input.type = "checkbox";
        input.name = "tipo";
        input.value = cz.nome.toLowerCase();

        const texto = document.createTextNode(" " + cz.nome);

        label.appendChild(input);
        label.appendChild(texto);

        elementos.push(label);
    });

    grupo.replaceChildren(...elementos);
}

document.addEventListener("DOMContentLoaded", carregarCozinhas);
