const list = document.getElementById('itemList');
const input = document.getElementById('item');
const addButton = document.getElementById('addButton');
const lastUpdated = document.getElementById('lastUpdated');
const usernameInput = document.getElementById('username');
const loginButton = document.getElementById('loginButton');
const inputSection = document.getElementById('inputSection');
const logoutButton = document.getElementById('logoutButton');

let currentUser = ""; // Guarda o nome do usuário logado
const items = {}; // Objeto para armazenar os itens e suas quantidades

// Carrega dados do localStorage ao iniciar
window.addEventListener('load', () => {
    loadFromLocalStorage();
    displayItems();
    displayLastUpdated();
});

// Função para salvar dados no localStorage
function saveToLocalStorage() {
    localStorage.setItem('items', JSON.stringify(items));
    localStorage.setItem('lastUser', currentUser);
    localStorage.setItem('lastUpdated', new Date().toISOString());
}

// Função para carregar dados do localStorage
function loadFromLocalStorage() {
    const storedItems = JSON.parse(localStorage.getItem('items'));
    const storedUser = localStorage.getItem('lastUser');
    const storedDate = localStorage.getItem('lastUpdated');

    if (storedItems) {
        Object.assign(items, storedItems);
    }

    if (storedUser) {
        currentUser = storedUser;
        usernameInput.value = currentUser;
        usernameInput.disabled = true;
        loginButton.disabled = true;
        inputSection.style.display = "block";
        logoutButton.style.display = "block";
    }

    if (storedDate) {
        const formattedDate = new Date(storedDate).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        lastUpdated.textContent = `Last updated by ${storedUser || "unknown"} on ${formattedDate}`;
    }
}

loginButton.addEventListener('click', () => {
    currentUser = usernameInput.value.trim();
    if (!currentUser) {
        alert("Please enter a username.");
        return;
    }
    usernameInput.disabled = true;
    loginButton.disabled = true;
    inputSection.style.display = "block";
    logoutButton.style.display = "block";
    updateLastUpdated();
});

logoutButton.addEventListener('click', () => {
    // Limpa o usuário atual e atualiza a interface
    currentUser = "";
    usernameInput.disabled = false;
    loginButton.disabled = false;
    usernameInput.value = '';
    inputSection.style.display = "none";
    logoutButton.style.display = "none";

    // Mantém o nome do último usuário na última atualização
    const storedUser = localStorage.getItem('lastUser');
    const storedDate = localStorage.getItem('lastUpdated');
    
    if (storedUser && storedDate) {
        const formattedDate = new Date(storedDate).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        lastUpdated.textContent = `Last updated by ${storedUser} on ${formattedDate}`;
    } else {
        lastUpdated.textContent = "Last updated: never";  // Quando não houver dados de última atualização
    }

    // Remove o usuário do localStorage, mas mantém a data da última atualização
    localStorage.setItem('lastUser', '');  // Pode deixar vazio ou não alterar dependendo do que preferir
});


addButton.addEventListener('click', () => {
    const itemName = input.value.trim();
    if (!itemName) return;
    input.value = '';

    if (items[itemName]) {
        items[itemName].quantity++;
        updateItemDisplay(itemName);
    } else {
        items[itemName] = { quantity: 1 };
        addItemToList(itemName);
    }

    updateLastUpdated();
    saveToLocalStorage(); // Salva após adicionar ou alterar um item
    input.focus();
});

function addItemToList(itemName) {
    const listItem = document.createElement('li');
    listItem.setAttribute('data-item', itemName);

    const itemText = document.createElement('span');
    itemText.textContent = itemName + " ";
    listItem.appendChild(itemText);

    const quantityText = document.createElement('span');
    quantityText.classList.add('quantity');
    quantityText.textContent = items[itemName].quantity;
    listItem.appendChild(quantityText);

   

    const removeButton = document.createElement('button');
    removeButton.textContent = '-';
    removeButton.classList.add('remove'); // Adiciona a classe 'remove' ao botão
    removeButton.addEventListener('click', () => {
        if (items[itemName].quantity > 1) {
            items[itemName].quantity--;
            updateItemDisplay(itemName);
        } else {
            // Aqui a quantidade do item será definida como 0 em vez de removê-lo
            items[itemName].quantity = 0;
            updateItemDisplay(itemName);  // Atualiza a exibição da quantidade como 0
        }
        updateLastUpdated();
        saveToLocalStorage();
    });
    
    listItem.appendChild(removeButton);


    const addButton = document.createElement('button');
    addButton.textContent = '+';
    addButton.addEventListener('click', () => {
        items[itemName].quantity++;
        updateItemDisplay(itemName);
        updateLastUpdated();
        saveToLocalStorage();
    });
    listItem.appendChild(addButton);
    list.appendChild(listItem);
}

function updateItemDisplay(itemName) {
    const listItem = document.querySelector(`li[data-item="${itemName}"]`);
    const quantityText = listItem.querySelector('.quantity');
    
    if (items[itemName].quantity === 0) {
        quantityText.textContent = '0';
        quantityText.style.color = 'gray'; // Muda a cor para indicar que foi removido, por exemplo.
    } else {
        quantityText.textContent = items[itemName].quantity;
        quantityText.style.color = ''; // Reseta a cor
    }
}


function updateLastUpdated() {
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    lastUpdated.textContent = currentUser
        ? `Last updated by ${currentUser} on ${formattedDate}`
        : `Last updated on ${formattedDate}`;

    saveToLocalStorage(); // Salva a última atualização no localStorage
}

function displayItems() {
    for (const itemName in items) {
        addItemToList(itemName);
    }
}

function displayLastUpdated() {
    const storedDate = localStorage.getItem('lastUpdated');
    const storedUser = localStorage.getItem('lastUser');
    
    if (storedDate && storedUser) {
        const formattedDate = new Date(storedDate).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        if (storedUser) {
            lastUpdated.textContent = `Last updated by ${storedUser} on ${formattedDate}`;
        } else {
            lastUpdated.textContent = `Last updated on ${formattedDate}`;
        }
    }
}
