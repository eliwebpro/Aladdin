(() => {
    let allItems = [];
  
    fetch('https://cse341-node-7gqo.onrender.com/users')
      .then(res => res.json())
      .then(data => {
        allItems = data;
  
        const inputDelete = document.getElementById("nomeDelete");
        const deleteContainer = document.getElementById("delete-container");
  
        function atualizarListaDelete() {
          const termo = inputDelete.value.trim().toLowerCase();
  
          const filtrados = allItems.filter(item =>
            item.nome.toLowerCase().includes(termo)
          );
  
          deleteContainer.innerHTML = "";
  
          if (filtrados.length > 0) {
            filtrados.forEach(item => {
              const card = document.createElement("div");
              card.className = "card";
  
              card.innerHTML = `
                <h3>${item.nome}</h3>
                <p>Tipo: ${item.tipo}</p>
                <p>Quantidade: ${item.quantidade}</p>
                <button class="delete-btn" data-id="${item._id}">🗑️ Delete</button>
              `;
  
              deleteContainer.appendChild(card);
            });
  
            // Evento de delete
            deleteContainer.querySelectorAll(".delete-btn").forEach(button => {
              button.addEventListener("click", () => {
                const id = button.dataset.id;
                const confirmacao = confirm("Are you sure you want to delete this item?");
                if (!confirmacao) return;
  
                fetch(`https://cse341-node-7gqo.onrender.com/users/${id}`, {
                  method: 'DELETE'
                })
                .then(res => {
                  if (!res.ok) throw new Error("Error to delete");
  
                  // Remove da lista local e atualiza visual
                  allItems = allItems.filter(item => item._id !== id);
                  atualizarListaDelete();
                })
                .catch(err => {
                  console.error("Error to delete:", err);
                  alert("Error to delete");
                });
              });
            });
  
          } else {
            deleteContainer.innerHTML = "<p>No items found.</p>";
          }
        }
  
        inputDelete.addEventListener("input", atualizarListaDelete);
      })
      .catch(err => console.error("Error to fechting data to delete:", err));
  })();
  