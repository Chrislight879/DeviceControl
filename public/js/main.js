// API base URL
const API_URL = '/api/devices';

// Cargar dispositivos al iniciar
document.addEventListener('DOMContentLoaded', loadDevices);

// Enviar formulario
document.getElementById('deviceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('deviceName').value;
    const description = document.getElementById('deviceDescription').value;
    const status = document.getElementById('deviceStatus').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, status })
        });

        if (response.ok) {
            document.getElementById('deviceForm').reset();
            loadDevices();
            alert('Dispositivo agregado correctamente');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar dispositivo');
    }
});

// Cargar dispositivos
async function loadDevices() {
    try {
        const response = await fetch(API_URL);
        const devices = await response.json();
        
        const devicesList = document.getElementById('devicesList');
        devicesList.innerHTML = '';

        if (devices.length === 0) {
            devicesList.innerHTML = '<p>No hay dispositivos registrados</p>';
            return;
        }

        devices.forEach(device => {
            const deviceCard = document.createElement('div');
            deviceCard.className = 'device-card';
            deviceCard.innerHTML = `
                <h3>${device.name}</h3>
                <p>${device.description}</p>
                <p>
                    <strong>Estado:</strong>
                    <span class="status ${device.status}">${device.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                </p>
                <div class="device-actions">
                    <button class="edit-btn" onclick="editDevice(${device.id})">Editar</button>
                    <button class="delete-btn" onclick="deleteDevice(${device.id})">Eliminar</button>
                </div>
            `;
            devicesList.appendChild(deviceCard);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Eliminar dispositivo
async function deleteDevice(id) {
    if (confirm('¿Está seguro de que desea eliminar este dispositivo?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                loadDevices();
                alert('Dispositivo eliminado');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar dispositivo');
        }
    }
}

// Editar dispositivo (función básica)
function editDevice(id) {
    alert('Funcionalidad de edición aún en desarrollo');
    // Esta función puede implementarse para abrir un formulario de edición
}
