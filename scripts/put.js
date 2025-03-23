(() => {
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
              <p>Quantity: <span id="quantidade-${item._id}">${item.quantidade}</span></p>
              <div class="botoes">
                <button data-id="${item._id}" data-acao="incrementar">+</button>
                <button data-id="${item._id}" data-acao="diminuir">–</button>
              </div>
              <p class="timestamp" id="timestamp-${item._id}">Last updated: never</p>
            `;
            container.appendChild(card);
          });

          container.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", () => {
              const id = button.dataset.id;
              const acao = button.dataset.acao;
              const itemIndex = allItems.findIndex(i => i._id === id);
              if (itemIndex === -1) return;

              const item = allItems[itemIndex];
              let novaQuantidade = item.quantidade;

              if (acao === "incrementar") {
                novaQuantidade++;
              } else if (acao === "diminuir" && novaQuantidade > 0) {
                novaQuantidade--;
              }

              allItems[itemIndex].quantidade = novaQuantidade;
              document.getElementById(`quantidade-${id}`).textContent = novaQuantidade;

              fetch(`https://cse341-node-7gqo.onrender.com/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantidade: novaQuantidade })
              })
                .then(res => {
                  if (!res.ok) throw new Error("Error server");
                  return res.json();
                })
                .then(data => {
                  console.log("Success update:", data);

                  // ✅ Atualiza o timestamp visual
                  const timestamp = new Date().toLocaleString();
                  const tsElement = document.getElementById(`timestamp-${id}`);
                  if (tsElement) {
                    tsElement.textContent = `Last updated: ${timestamp}`;
                  }
                })
                .catch(err => console.error("Error to update:", err));
            });
          });
        } else {
          container.innerHTML = "<p>No items found.</p>";
        }
      }

      input.addEventListener("input", atualizarLista);
    })
    .catch(err => console.error("Error fetching data:", err));
})();
