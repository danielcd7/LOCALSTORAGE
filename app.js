const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser) {
    window.location.href = 'index.html';
}

document.getElementById('userNameDisplay').textContent = currentUser.username;

document.getElementById('btnLogout').addEventListener('click', () => {
    const confirmLogout = confirm('¿Estás seguro de que deseas salir?');
    if (confirmLogout) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
});

const crudForm = document.getElementById('crudForm');
const itemName = document.getElementById('itemName');
const itemPhone = document.getElementById('itemPhone');
const itemEmail = document.getElementById('itemEmail');
const btnSave = document.getElementById('btnSave');
const btnCancel = document.getElementById('btnCancel');
const editIndexInput = document.getElementById('editIndex');
const searchInput = document.getElementById('searchInput');
const tableBody = document.getElementById('tableBody');

const nameError = document.getElementById('itemNameError');
const phoneError = document.getElementById('itemPhoneError');
const mailError = document.getElementById('itemEmailError');

let records = JSON.parse(localStorage.getItem('records')) || [];

const validateCRUD = () => {
    let isValid = true;

    if (itemName.value.trim() === '') {
        nameError.textContent = "Campo requerido";
        itemName.classList.add('invalid');
        isValid = false;
    } else {
        nameError.textContent = "";
        itemName.classList.remove('invalid');
        itemName.classList.add('valid');
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(itemPhone.value)) {
        phoneError.textContent = "Debe tener 10 dígitos numéricos";
        itemPhone.classList.add('invalid');
        isValid = false;
    } else {
        phoneError.textContent = "";
        itemPhone.classList.remove('invalid');
        itemPhone.classList.add('valid');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(itemEmail.value)) {
        mailError.textContent = "Correo inválido";
        itemEmail.classList.add('invalid');
        isValid = false;
    } else {
        mailError.textContent = "";
        itemEmail.classList.remove('invalid');
        itemEmail.classList.add('valid');
    }

    btnSave.disabled = !isValid;
};

[itemName, itemPhone, itemEmail].forEach(input => {
    input.addEventListener('input', validateCRUD);
});

const renderTable = (data = records) => {
    tableBody.innerHTML = '';
    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.phone}</td>
            <td>${item.email}</td>
            <td>
                <button onclick="editRecord(${index})" class="action-btn edit-btn">Editar</button>
                <button onclick="deleteRecord(${index})" class="action-btn delete-btn">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
};

crudForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newRecord = {
        name: itemName.value,
        phone: itemPhone.value,
        email: itemEmail.value
    };

    const index = editIndexInput.value;

    if (index === '') {
        records.push(newRecord);
    } else {
        records[index] = newRecord;
        editIndexInput.value = '';
        btnSave.textContent = 'Guardar Registro';
        btnCancel.classList.add('hidden');
    }

    localStorage.setItem('records', JSON.stringify(records));
    crudForm.reset();
    [itemName, itemPhone, itemEmail].forEach(i => i.classList.remove('valid'));
    btnSave.disabled = true;
    renderTable();
});

window.editRecord = (index) => {
    const item = records[index];
    itemName.value = item.name;
    itemPhone.value = item.phone;
    itemEmail.value = item.email;
    editIndexInput.value = index;
    
    btnSave.textContent = 'Actualizar';
    btnSave.disabled = false;
    btnCancel.classList.remove('hidden');
    
    [itemName, itemPhone, itemEmail].forEach(i => {
        i.classList.add('valid');
        i.classList.remove('invalid');
    });
};

window.deleteRecord = (index) => {
    if (confirm('¿Seguro que deseas eliminar este registro?')) {
        records.splice(index, 1);
        localStorage.setItem('records', JSON.stringify(records));
        renderTable();
    }
};

btnCancel.addEventListener('click', () => {
    crudForm.reset();
    editIndexInput.value = '';
    btnSave.textContent = 'Guardar Registro';
    btnCancel.classList.add('hidden');
    [itemName, itemPhone, itemEmail].forEach(i => {
        i.classList.remove('valid');
        i.classList.remove('invalid');
    });
    btnSave.disabled = true;
});

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = records.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.email.toLowerCase().includes(term)
    );
    renderTable(filtered);
});

renderTable();