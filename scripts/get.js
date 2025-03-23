let allItems = [];

fetch('https://cse341-node-7gqo.onrender.com/users')
  .then(res => res.json())
  .then(data => {
    allItems = data;

    const input = document.getElementById("nomeInput");
    const container = document.getElementById("lista-container");

    function atualizarLista() {
      const termoBusca = input.value.trim().toLowerCase();

      const filtrados = allItems.filter(item =>
        item.nome.toLowerCase().includes(termoBusca)
      );

      container.innerHTML = "";

      if (filtrados.length > 0) {
        filtrados.forEach(item => {
          const card = document.createElement("div");
          card.className = "card";

          card.innerHTML = `
            <h3>${item.nome}</h3>
            <p>Type: ${item.tipo}</p>
            <p>Quantity: <span>${item.quantidade}</span></p>
          `;

          container.appendChild(card);
        });
      } else {
        container.innerHTML = "<p>No items found.</p>";
      }
    }

    // Filtra enquanto digita
    input.addEventListener("input", atualizarLista);
  })
  .catch(err => console.error("Error to fechting data:", err));
