async function fetchDados(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        return null;
    }
}

async function carregarCategorias() {
    const data = await fetchDados("http://localhost:8080/v1/toque_gourmet/categoria");
    console.log(data)

    if (!data || !data.response || !Array.isArray(data.response.categoria)) return;

    const categorias = data.response.categoria;
    const grupo = document.querySelector(".filtro-group:nth-of-type(3)");

    const titulo = document.createElement("h3");
    titulo.textContent = "Categoria";

    const elementos = [titulo];

    categorias.forEach(cat => {
        const label = document.createElement("label");

        const input = document.createElement("input");
        input.type = "checkbox";
        input.name = "categoria";
        input.value = cat.nome;

        const texto = document.createTextNode(" " + cat.nome.replaceAll("_", " "));

        label.appendChild(input);
        label.appendChild(texto);

        elementos.push(label);
    });

    grupo.replaceChildren(...elementos);
}

document.addEventListener("DOMContentLoaded", carregarCategorias);
