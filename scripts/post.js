document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formAdicionar");
    const mensagem = document.getElementById("mensagem");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const tipo = document.getElementById("tipo").value.trim();
      const nome = document.getElementById("nome").value.trim();
      const quantidade = parseInt(document.getElementById("quantidade").value);
  
      if (!tipo || !nome || isNaN(quantidade)) {
        mensagem.textContent = "Please fill in all fields correctly.";
        return;
      }
  
      const novoItem = { tipo, nome, quantidade };
  
      try {
        const response = await fetch('https://cse341-node-7gqo.onrender.com/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(novoItem)
        });
  
        const data = await response.json();
  
        if (response.ok) {
          mensagem.textContent = "Item added successfully!";
          form.reset();
        } else {
          mensagem.textContent = `Erro: ${data.message || "Could not add the item."}`;
        }
      } catch (err) {
        console.error("Error to add item:", err);
        mensagem.textContent = "Error to conect to the server.";
      }
    });
  });
  