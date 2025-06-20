async function executeQuery(query) {
    try {
        const response = await fetch("http://localhost:3000/api/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

function createActionButtons(row) {
    const deleteBtn = document.createElement('button');
    const editBtn = document.createElement('button');
    deleteBtn.textContent = "Delete";
    editBtn.textContent = "Edit";

    deleteBtn.className = 'delete';
    editBtn.className = 'edit';

    deleteBtn.addEventListener('click', async () => {
        const rowId = document.querySelector('#table th:first-child').innerText;
        const tableName = document.querySelector('.table span').innerText;
        const query = `DELETE FROM ${tableName} WHERE ${rowId} = ${row[rowId]}`;

        try {
            const result = await executeQuery(query);
            if (result) {
                console.log(`Row with ${rowId}: ${row[rowId]} deleted`);
                const updatedData = await executeQuery(`SELECT * FROM ${tableName}`);
                const table = document.getElementById('table');
                displayTable(updatedData, table);
            }
        } catch (error) {
            displayError(error.details.message);
        }
    });

    editBtn.addEventListener('click', () => addAndEditRow(row, 'Edit'));

    return { deleteBtn, editBtn };
}

function displayTable(data, table, flag = true) {
    table.innerHTML = '';

    const header = document.createElement('tr');
    Object.keys(data[0]).forEach(key => {
        const tableHeader = document.createElement('th');
        tableHeader.innerText = key;
        header.appendChild(tableHeader);
    });

    if(flag){
        const actionHeader = document.createElement('th');
        actionHeader.innerText = "Actions";
        header.appendChild(actionHeader);
    }

    table.appendChild(header);

    data.forEach(row => {
        const tableRow = document.createElement('tr');

        Object.values(row).forEach(value => {
            const tableData = document.createElement('td');
            tableData.innerHTML = value === null ? "Null" : value;
            tableRow.appendChild(tableData);
        });

        if(flag){
            const actions = createActionButtons(row);
            const actionCell = document.createElement('td');
            actionCell.appendChild(actions.editBtn);
            actionCell.appendChild(actions.deleteBtn);
            tableRow.appendChild(actionCell);
        }

        table.appendChild(tableRow);
    });
}

function selectTable() {
    const dropdown = document.getElementById('tables');

    dropdown.addEventListener('change', async () => {
        const tableName = dropdown.value;
        const query = `SELECT * FROM ${tableName}`;
        const addBtn = document.querySelector('.add');
        addBtn.disabled = false; 
        try {
            const resultDiv = document.getElementById("result");
            const table = document.getElementById('table');
            const result = await executeQuery(query);
            const tableNameSpan = document.querySelector('.table span');

            resultDiv.innerHTML = '';
            tableNameSpan.innerText = tableName;
            displayTable(result, table);
            prepareAddRow(result);
        } catch (error) {
            displayError(error.details.message);
        }
    });
}

function addAndEditRow(row, type) {
    const popup = document.querySelector('.popup');
    document.getElementById('overlay').classList.add('active');
    popup.innerHTML = '';
    popup.style.display = 'block';

    const form = createRowForm(row, type);
    popup.appendChild(form);
}

function createRowForm(row, type) {
    const form = document.createElement('form');
    form.className = 'row-form';

    const title = document.createElement('h1');
    title.textContent = type;
    form.appendChild(title);

    const rowId = document.querySelector('#table th:first-child').innerText;

    Object.keys(row).forEach(key => {
        if (key !== rowId || type === 'Add') {
            const fieldContainer = document.createElement('div');
            fieldContainer.className = 'form-group';

            const label = document.createElement('label');
            label.innerText = `${key}: `;
            label.setAttribute('for', key);

            const input = document.createElement('input');
            input.id = key;
            input.name = key;
            input.type = 'text';
            input.value = row[key] == false || row[key] ? row[key] : '';

            fieldContainer.appendChild(label);
            fieldContainer.appendChild(input);
            form.appendChild(fieldContainer);
        }
    });

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.innerText = 'Submit';
    submitButton.className = 'submit-button';
    form.appendChild(submitButton);

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.innerText = 'Close';
    closeButton.className = 'close-button';
    closeButton.addEventListener('click', () => {
        const popup = document.querySelector('.popup');
        popup.style.display = 'none';
        document.getElementById('overlay').classList.remove('active');
    });
    form.appendChild(closeButton);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const newRowData = getFormData(form);
        document.getElementById('overlay').classList.remove('active');
        handleRowSubmit(row, newRowData, type, rowId);
    });

    return form;
}

function getFormData(form) {
    const formData = {};
    form.querySelectorAll('input').forEach(input => {
        formData[input.name] = input.value;
    });
    return formData;
}

async function handleRowSubmit(originalRow, newRowData, type, rowId) {
    try {
        const tableName = document.querySelector('.table span').innerText;
        let query;

        if (type === 'Edit') {
            const setClause = Object.entries(newRowData)
                .map(([key, value]) => `${key} = ${isNaN(value) ? `'${value}'` : value}`)
                .join(', ');
            query = `UPDATE ${tableName} SET ${setClause} WHERE ${rowId} = '${originalRow[rowId]}'`;
        } else {
            const columns = Object.keys(newRowData).join(', ');
            const values = Object.values(newRowData)
                .map(value => (isNaN(value) ? `'${value}'` : value))
                .join(', ');
            query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
        }

        const result = await executeQuery(query);
        if (result) {
            const table = document.getElementById('table');
            const updatedData = await executeQuery(`SELECT * FROM ${tableName}`);
            displayTable(updatedData, table);
            document.getElementById("result").innerHTML = '';
            document.querySelector('.popup').style.display = 'none';
        }
    } catch (error) {
        displayError(error.details.message);
    }
}

function displayError(message) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `<p style="color: red;">Error: ${message}</p>`;
}

function prepareAddRow(sampleRow) {
    document.querySelector('.add').addEventListener('click', () => {
        const primaryKey = document.querySelector('#table th:first-child').innerText;
        const emptyRow = Object.fromEntries(Object.keys(sampleRow[0]).map(key => [key, '']));
        delete emptyRow[primaryKey];
        addAndEditRow({ ...emptyRow}, 'Add');
    });
}

document.getElementById("queryForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = document.getElementById("query").value;

    try {
        const tableName = document.querySelector('.table span');
        const addBtn = document.querySelector('.add');
        addBtn.disabled = true; 
        tableName.textContent = '';
        const result = await executeQuery(query);
        const table = document.getElementById('table');
        displayTable(result, table, false);
    } catch (error) {
        displayError(error.details.message);
    }
});

selectTable();
