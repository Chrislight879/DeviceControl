const API_BASE_URL = '/api/devices';
const AUTH_TOKEN_KEY = 'devicecontrol_auth_token';
const AUTH_USER_KEY = 'devicecontrol_auth_user';

const authState = {
    token: localStorage.getItem(AUTH_TOKEN_KEY) || '',
    user: JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null'),
};

// Definición de accesos por tipo de usuario
const roleAccess = {
    admin: ['productos', 'compra', 'ticket', 'mantenimiento', 'usuarios', 'proveedores', 'categorias', 'ubicaciones', 'estados', 'trabajador'],
    jefe_sucursal: ['compra', 'ticket'],
    trabajador: ['ticket', 'mantenimiento'],
    usuario_comun: ['ticket'],
};

// Helper para obtener módulos permitidos según el rol
function getAccessibleModules(userRole) {
    const allowedKeys = roleAccess[userRole] || roleAccess.usuario_comun;
    return modules.filter(m => allowedKeys.includes(m.key));
}

const modules = [
    {
        key: 'productos',
        label: 'Productos',
        subtitle: 'Inventario de productos disponibles',
        endpoint: '/productos',
        idField: 'Id_producto',
        titleField: 'nombre_producto',
        fields: [
            { name: 'Id_producto', label: 'ID', type: 'number', required: false },
            { name: 'nombre_producto', label: 'Nombre', type: 'text', required: true },
            { name: 'precio', label: 'Precio', type: 'number', step: 'any', required: true },
            { name: 'Id_categoria', label: 'Categoría ID', type: 'number', required: true },
            { name: 'Id_proveedor', label: 'Proveedor ID', type: 'number', required: true },
        ],
        columns: ['Id_producto', 'nombre_producto', 'precio', 'Id_categoria', 'Id_proveedor'],
    },
    {
        key: 'compra',
        label: 'Compras',
        subtitle: 'Registro de compras y garantías',
        endpoint: '/compra',
        idField: 'Id_compra',
        titleField: 'producto',
        fields: [
            { name: 'Id_compra', label: 'ID', type: 'number', required: false },
            { name: 'fecha_compra', label: 'Fecha compra', type: 'date', required: true },
            { name: 'producto', label: 'Producto', type: 'text', required: true },
            { name: 'Id_proveedor', label: 'Proveedor ID', type: 'number', required: true },
            { name: 'precio', label: 'Precio', type: 'number', step: 'any', required: true },
            { name: 'fin_garantia', label: 'Fin garantía', type: 'date', required: true },
            { name: 'Id_trabajador', label: 'Trabajador ID', type: 'number', required: true },
            { name: 'serial_number', label: 'Serial number', type: 'text', required: true },
        ],
        columns: ['Id_compra', 'fecha_compra', 'producto', 'nombre_proveedor', 'precio', 'fin_garantia', 'nombre_trabajador', 'nombre_ubicacion', 'serial_number'],
        columnLabels: ['ID', 'Fecha compra', 'Equipo', 'Proveedor', 'Precio', 'Fin garantía', 'Trabajador', 'Sucursal', 'Serial number'],
    },
    {
        key: 'ticket',
        label: 'Tickets',
        subtitle: 'Incidencias reportadas por usuarios',
        endpoint: '/ticket',
        idField: 'Id_ticket',
        titleField: 'nombre_compra',
        fields: [
            { name: 'Id_ticket', label: 'ID', type: 'number', required: false },
            { name: 'fecha_emision', label: 'Fecha emisión', type: 'date', required: true },
            { name: 'fecha_salida', label: 'Fecha salida', type: 'date', required: true },
            { name: 'fecha_entrada', label: 'Fecha entrada', type: 'date', required: true },
            { name: 'Id_compra', label: 'Compra', type: 'number', required: true },
            { name: 'Id_usuario_comun', label: 'Usuario emisor', type: 'number', required: true },
            { name: 'Id_usuario_it', label: 'Usuario IT', type: 'number', required: true },
            { name: 'Id_estado_ticket', label: 'Estado del ticket', type: 'number', required: true },
            { name: 'problema_presentado', label: 'Problema presentado', type: 'textarea', required: true },
        ],
        columns: ['Id_ticket', 'fecha_emision', 'fecha_salida', 'fecha_entrada', 'nombre_compra', 'nombre_usuario_comun', 'nombre_usuario_it', 'nombre_estado_ticket'],
        columnLabels: ['ID', 'Emisión', 'Salida', 'Entrada', 'Compra', 'Emisor', 'IT', 'Estado'],
    },
    {
        key: 'mantenimiento',
        label: 'Mantenimientos',
        subtitle: 'Seguimiento de recepción y salida de equipos',
        endpoint: '/mantenimiento',
        idField: 'Id_mantenimiento',
        titleField: 'diagnostico',
        fields: [
            { name: 'Id_mantenimiento', label: 'ID', type: 'number', required: false },
            { name: 'recibio_equipo', label: 'Recibió equipo', type: 'date', required: true },
            { name: 'salio_equipo', label: 'Salió equipo', type: 'date', required: true },
            { name: 'Id_ticket', label: 'Ticket ID', type: 'number', required: true },
            { name: 'observaciones', label: 'Observaciones', type: 'textarea', required: true },
            { name: 'diagnostico', label: 'Diagnóstico', type: 'textarea', required: true },
        ],
        columns: ['Id_mantenimiento', 'recibio_equipo', 'salio_equipo', 'Id_ticket', 'diagnostico'],
    },
    {
        key: 'usuarios',
        label: 'Usuarios',
        subtitle: 'Credenciales y permisos de acceso',
        endpoint: '/usuarios',
        idField: 'Id_usuario',
        titleField: 'username',
        fields: [
            { name: 'Id_usuario', label: 'ID', type: 'number', required: false },
            { name: 'Id_trabajador', label: 'Trabajador ID', type: 'number', required: true },
            { name: 'username', label: 'Usuario', type: 'text', required: true },
            { name: 'password', label: 'Contraseña', type: 'text', required: true },
            { name: 'usuario_admin', label: '¿Es admin?', type: 'boolean', required: true },
        ],
        columns: ['Id_usuario', 'Id_trabajador', 'username', 'usuario_admin'],
    },
    {
        key: 'proveedores',
        label: 'Proveedores',
        subtitle: 'Catálogo de proveedores',
        endpoint: '/proveedores',
        idField: 'Id_proveedor',
        titleField: 'nombre_proveedor',
        fields: [
            { name: 'Id_proveedor', label: 'ID', type: 'number', required: false },
            { name: 'nombre_proveedor', label: 'Nombre', type: 'text', required: true },
            { name: 'contacto', label: 'Contacto', type: 'text', required: true },
        ],
        columns: ['Id_proveedor', 'nombre_proveedor', 'contacto'],
    },
    {
        key: 'categorias',
        label: 'Categorías',
        subtitle: 'Clasificación de productos',
        endpoint: '/categorias',
        idField: 'Id_categoria',
        titleField: 'nombre_categoria',
        fields: [
            { name: 'Id_categoria', label: 'ID', type: 'number', required: false },
            { name: 'nombre_categoria', label: 'Nombre', type: 'text', required: true },
        ],
        columns: ['Id_categoria', 'nombre_categoria'],
    },
    {
        key: 'ubicaciones',
        label: 'Ubicaciones',
        subtitle: 'Ubicaciones de trabajo',
        endpoint: '/ubicaciones',
        idField: 'Id_ubicacion',
        titleField: 'nombre_ubicacion',
        fields: [
            { name: 'Id_ubicacion', label: 'ID', type: 'number', required: false },
            { name: 'nombre_ubicacion', label: 'Nombre', type: 'text', required: true },
        ],
        columns: ['Id_ubicacion', 'nombre_ubicacion'],
    },
    {
        key: 'estados',
        label: 'Estados',
        subtitle: 'Estados posibles de tickets',
        endpoint: '/estados',
        idField: 'Id_estado_ticket',
        titleField: 'nombre_estado_ticket',
        fields: [
            { name: 'Id_estado_ticket', label: 'ID', type: 'number', required: false },
            { name: 'nombre_estado_ticket', label: 'Nombre', type: 'text', required: true },
        ],
        columns: ['Id_estado_ticket', 'nombre_estado_ticket'],
    },
    {
        key: 'trabajador',
        label: 'Trabajadores',
        subtitle: 'Personal asociado a ubicaciones',
        endpoint: '/trabajador',
        idField: 'Id_trabajador',
        titleField: 'nombre_trabajador',
        fields: [
            { name: 'Id_trabajador', label: 'ID', type: 'number', required: false },
            { name: 'nombre_trabajador', label: 'Nombre', type: 'text', required: true },
            { name: 'Id_ubicacion', label: 'Ubicación ID', type: 'number', required: true },
        ],
        columns: ['Id_trabajador', 'nombre_trabajador', 'Id_ubicacion'],
    },
];

function getCurrentUserRole() {
    return authState.user?.tipo_usuario || 'usuario_comun';
}

function getModuleDisplayLabel(module, userRole = getCurrentUserRole()) {
    if (module.key === 'compra' && userRole === 'jefe_sucursal') {
        return 'Equipos';
    }

    return module.label;
}

function getModuleSingularLabel(module, userRole = getCurrentUserRole()) {
    const displayLabel = getModuleDisplayLabel(module, userRole);
    return displayLabel.endsWith('s') ? displayLabel.slice(0, -1).toLowerCase() : displayLabel.toLowerCase();
}

function canModifyModule(moduleKey = state.activeModule?.key, userRole = getCurrentUserRole()) {
    if (moduleKey === 'compra' && userRole === 'jefe_sucursal') {
        return false;
    }

    return true;
}

function canCreateRecord(moduleKey = state.activeModule?.key, userRole = getCurrentUserRole()) {
    if (moduleKey === 'compra' && userRole === 'jefe_sucursal') {
        return false;
    }

    if (moduleKey === 'ticket' && userRole === 'trabajador') {
        return false;
    }

    return true;
}

function canEditRecord(moduleKey = state.activeModule?.key, userRole = getCurrentUserRole()) {
    if (moduleKey === 'compra' && userRole === 'jefe_sucursal') {
        return false;
    }

    if (moduleKey === 'ticket' && userRole === 'trabajador') {
        return true;
    }

    return true;
}

function canDeleteRecord(moduleKey = state.activeModule?.key, userRole = getCurrentUserRole()) {
    if (moduleKey === 'compra' && userRole === 'jefe_sucursal') {
        return false;
    }

    if (moduleKey === 'ticket') {
        return userRole === 'admin' || userRole === 'jefe_sucursal';
    }

    return true;
}

function getNextAutoId(module) {
    if (!state.records.length) {
        return 1;
    }

    const values = state.records
        .map((record) => Number(record[module.idField]))
        .filter((value) => Number.isFinite(value));

    if (!values.length) {
        return 1;
    }

    return Math.max(...values) + 1;
}

function isAutoIdField(field) {
    return field.name.startsWith('Id_');
}

function getEditingRecord(module = state.activeModule) {
    if (state.editId === null) {
        return null;
    }

    return state.records.find((item) => String(item[module.idField]) === String(state.editId)) || null;
}

function getFieldValueForForm(field, module = state.activeModule) {
    const record = getEditingRecord(module);
    if (record && record[field.name] !== undefined && record[field.name] !== null) {
        return record[field.name];
    }

    // No retornar ID predicho para nuevos registros; la BD genera autoincrement
    if (isAutoIdField(field)) {
        return '';
    }

    return '';
}

function formatTicketPurchaseLabel(record) {
    const pieces = [record.producto, record.nombre_proveedor, record.serial_number].filter(Boolean);
    return pieces.join(' · ') || `Compra ${record.Id_compra}`;
}

function formatTicketUserLabel(record) {
    return [record.username, record.nombre_ubicacion].filter(Boolean).join(' · ') || `Usuario ${record.Id_usuario}`;
}

const ticketLookups = {
    compras: [],
    usuarios: [],
    estados: [],
    loaded: false,
};

async function ensureTicketLookups() {
    if (ticketLookups.loaded) {
        return;
    }

    try {
        const results = await Promise.allSettled([
            apiFetch(`${API_BASE_URL}/compra`),
            apiFetch(`${API_BASE_URL}/usuarios`),
            apiFetch(`${API_BASE_URL}/estados`),
        ]);

        ticketLookups.compras = (results[0].status === 'fulfilled' && Array.isArray(results[0].value)) ? results[0].value : [];
        ticketLookups.usuarios = (results[1].status === 'fulfilled' && Array.isArray(results[1].value)) ? results[1].value : [];
        ticketLookups.estados = (results[2].status === 'fulfilled' && Array.isArray(results[2].value)) ? results[2].value : [];
        ticketLookups.loaded = true;
    } catch (err) {
        console.error('Error cargando lookups de tickets:', err);
        ticketLookups.compras = [];
        ticketLookups.usuarios = [];
        ticketLookups.estados = [];
        ticketLookups.loaded = true;
    }
}

const state = {
    activeModule: modules[0],
    records: [],
    filteredRecords: [],
    loading: false,
    editId: null,
    stats: new Map(),
    appInitialized: false,
};

const elements = {
    loginView: document.getElementById('loginView'),
    loginForm: document.getElementById('loginForm'),
    loginUsername: document.getElementById('loginUsername'),
    loginPassword: document.getElementById('loginPassword'),
    loginMessage: document.getElementById('loginMessage'),
    appShell: document.querySelector('.app-shell'),
    moduleNav: document.getElementById('moduleNav'),
    pageTitle: document.getElementById('pageTitle'),
    pageSubtitle: document.getElementById('pageSubtitle'),
    tableTitle: document.getElementById('tableTitle'),
    tableMeta: document.getElementById('tableMeta'),
    tableHead: document.getElementById('tableHead'),
    tableBody: document.getElementById('tableBody'),
    recordForm: document.getElementById('recordForm'),
    formTitle: document.getElementById('formTitle'),
    formHint: document.getElementById('formHint'),
    feedbackMessage: document.getElementById('feedbackMessage'),
    searchInput: document.getElementById('searchInput'),
    statsGrid: document.getElementById('statsGrid'),
    connectionState: document.getElementById('connectionState'),
    refreshBtn: document.getElementById('refreshBtn'),
    newRecordBtn: document.getElementById('newRecordBtn'),
    cancelEditBtn: document.getElementById('cancelEditBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    userChip: document.getElementById('userChip'),
    togglePasswordBtn: document.getElementById('togglePasswordBtn'),
};

document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    bindAuthEvents();
    updateUserChip();
    bootSession();
}

function bindAuthEvents() {
    elements.loginForm.addEventListener('submit', handleLogin);
    elements.logoutBtn.addEventListener('click', handleLogout);
    elements.togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
}

function togglePasswordVisibility() {
    const isPasswordHidden = elements.loginPassword.type === 'password';
    elements.loginPassword.type = isPasswordHidden ? 'text' : 'password';
    elements.togglePasswordBtn.textContent = isPasswordHidden ? '' : '👁';
    elements.togglePasswordBtn.setAttribute('aria-label', isPasswordHidden ? 'Ocultar contraseña' : 'Mostrar contraseña');
}

async function bootSession() {
    if (!authState.token) {
        showLoginView();
        return;
    }

    try {
        const response = await apiFetch('/api/auth/me', { authRequired: true });
        authState.user = response.user;
        persistAuth();
        showAppView();
        if (state.appInitialized) {
            updateUserChip();
            await refreshActiveModule();
        } else {
            startApp();
        }
    } catch (error) {
        console.error(error);
        clearAuth();
        showLoginView('Tu sesión expiró. Ingresa nuevamente.');
    }
}

function startApp() {
    if (state.appInitialized) {
        return;
    }

    state.appInitialized = true;
    renderModuleNav();
    bindEvents();
    loadModule(state.activeModule.key);
    loadStats();
}

async function handleLogin(event) {
    event.preventDefault();
    setLoginMessage('Validando credenciales…', false);

    const username = elements.loginUsername.value.trim();
    const password = elements.loginPassword.value.trim();

    try {
        const response = await apiFetch('/api/auth/login', {
            method: 'POST',
            authRequired: false,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        authState.token = response.token;
        authState.user = response.user;
        persistAuth();
        updateUserChip();
        showAppView();
        if (state.appInitialized) {
            await refreshActiveModule();
        } else {
            startApp();
        }
        setLoginMessage('', false);
    } catch (error) {
        console.error(error);
        setLoginMessage('Credenciales inválidas o sesión no disponible.', true);
    }
}

async function handleLogout() {
    try {
        await apiFetch('/api/auth/logout', { method: 'POST', authRequired: true });
    } catch (error) {
        console.error(error);
    } finally {
        clearAuth();
        showLoginView();
        elements.loginForm.reset();
        setLoginMessage('', false);
    }
}

function showLoginView(message = '') {
    elements.loginView.classList.remove('is-hidden');
    elements.appShell.classList.add('is-hidden');
    if (message) {
        setLoginMessage(message, true);
    }
}

function showAppView() {
    elements.loginView.classList.add('is-hidden');
    elements.appShell.classList.remove('is-hidden');
}

function updateUserChip() {
    if (!elements.userChip) {
        return;
    }

    const username = authState.user?.username || 'Sin sesión';
    const tipoUsuario = getCurrentUserRole();
    const branchLabel = authState.user?.nombre_ubicacion ? ` · ${authState.user.nombre_ubicacion}` : '';

    const rolLabels = {
        admin: 'Administrador',
        jefe_sucursal: 'Jefe de Sucursal',
        trabajador: 'Trabajador',
        usuario_comun: 'Usuario',
    };

    const rolLabel = rolLabels[tipoUsuario] || tipoUsuario;
    elements.userChip.textContent = `${username} · ${rolLabel}${branchLabel}`;
}

function persistAuth() {
    localStorage.setItem(AUTH_TOKEN_KEY, authState.token || '');
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authState.user || null));
}

function clearAuth() {
    authState.token = '';
    authState.user = null;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    updateUserChip();
}

function setLoginMessage(message, isError) {
    if (!elements.loginMessage) {
        return;
    }

    elements.loginMessage.textContent = message;
    elements.loginMessage.classList.toggle('error', Boolean(isError));
}

async function apiFetch(path, options = {}) {
    const { authRequired = true, headers = {}, ...rest } = options;
    const requestHeaders = new Headers(headers);

    if (authRequired && authState.token) {
        requestHeaders.set('Authorization', `Bearer ${authState.token}`);
    }

    const response = await fetch(`${path}`, {
        ...rest,
        headers: requestHeaders,
    });

    if (response.status === 401 && authRequired) {
        clearAuth();
        showLoginView('Tu sesión expiró. Ingresa nuevamente.');
        throw new Error('Unauthorized');
    }

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json() : await response.text();

    if (!response.ok) {
        const error = new Error(typeof payload === 'string' ? payload : payload?.message || 'Error de API');
        error.payload = payload;
        throw error;
    }

    return payload;
}

function bindEvents() {
    elements.searchInput.addEventListener('input', () => {
        filterRecords(elements.searchInput.value);
    });

    elements.recordForm.addEventListener('submit', handleFormSubmit);
    elements.refreshBtn.addEventListener('click', () => refreshActiveModule());
    elements.newRecordBtn.addEventListener('click', () => startCreateMode());
    elements.cancelEditBtn.addEventListener('click', () => resetForm());
}

function renderModuleNav() {
    const userRole = getCurrentUserRole();
    const accessibleModules = getAccessibleModules(userRole);

    elements.moduleNav.innerHTML = accessibleModules
        .map(
            (module) => `
                <button type="button" data-module="${module.key}">
                    <strong>${getModuleDisplayLabel(module, userRole)}</strong>
                    <span>${module.subtitle}</span>
                </button>
            `,
        )
        .join('');

    elements.moduleNav.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', () => loadModule(button.dataset.module));
    });
    if (accessibleModules.length > 0) {
        state.activeModule = accessibleModules[0];
    }
}

async function loadModule(moduleKey) {
    const userRole = getCurrentUserRole();
    const accessibleModules = getAccessibleModules(userRole);

    const module = accessibleModules.find((item) => item.key === moduleKey);
    if (!module) {
        console.warn(`Acceso denegado al módulo: ${moduleKey}`);
        return;
    }

    state.activeModule = module;
    state.editId = null;
    setActiveNavButton(module.key);
    updateModuleHeader(module);
    resetFeedback();
    await buildForm(module);
    await fetchRecords();
}

function setActiveNavButton(moduleKey) {
    elements.moduleNav.querySelectorAll('button').forEach((button) => {
        button.classList.toggle('active', button.dataset.module === moduleKey);
    });
}

function updateModuleHeader(module) {
    const displayLabel = getModuleDisplayLabel(module);
    elements.pageTitle.textContent = displayLabel;
    elements.pageSubtitle.textContent = module.subtitle;
    const userRole = getCurrentUserRole();
    if (module.key === 'ticket' && userRole === 'trabajador') {
        elements.tableTitle.textContent = 'Tickets activos';
    } else {
        elements.tableTitle.textContent = `${displayLabel} registrados`;
    }
    elements.formTitle.textContent = state.editId ? `Editar ${getModuleSingularLabel(module)}` : `Nuevo ${getModuleSingularLabel(module)}`;
    elements.formHint.textContent = `API: ${API_BASE_URL}${module.endpoint}`;
    elements.searchInput.value = '';
    elements.newRecordBtn.classList.toggle('is-hidden', !canCreateRecord(module.key));
}

async function buildForm(module) {
    const userRole = getCurrentUserRole();
    const canCreate = canCreateRecord(module.key, userRole);
    const canEdit = canEditRecord(module.key, userRole);

    if (!canCreate && !canEdit) {
        elements.recordForm.innerHTML = `
            <div class="empty-state">Solo tienes permiso para ver el listado de ${getModuleDisplayLabel(module).toLowerCase()}.</div>
        `;
        elements.formTitle.textContent = `Vista de ${getModuleDisplayLabel(module)}`;
        elements.formHint.textContent = 'Este módulo está en modo solo lectura para tu rol.';
        return;
    }

    if (module.key === 'ticket') {
        try {
            await ensureTicketLookups();
        } catch (err) {
            console.error('Error al cargar datos de tickets:', err);
            showFeedback('Error al cargar los datos. Recarga la página.', 'error');
            return;
        }
    }

    elements.recordForm.innerHTML = module.fields
        .map((field) => renderField(field, module))
        .join('')
        + `
            <div class="form-actions">
                <button class="btn btn-primary" type="submit">${state.editId ? 'Guardar cambios' : (module.key === 'ticket' ? 'Generar ticket' : 'Crear registro')}</button>
                <button class="btn btn-secondary" type="button" id="clearFormBtn">Limpiar formulario</button>
            </div>
        `;

    elements.recordForm.querySelector('#clearFormBtn').addEventListener('click', resetForm);
}

function renderField(field, module = state.activeModule) {
    const userRole = getCurrentUserRole();
    const value = getFieldValueForForm(field, module);

    if (module.key === 'ticket') {
        if (field.name === 'Id_compra') {
            const purchaseOptions = ticketLookups.compras
                .map((purchase) => `<option value="${purchase.Id_compra}">${formatTicketPurchaseLabel(purchase)}</option>`)
                .join('');

            return `
                <div class="field-group">
                    <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                    <select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
                        <option value="">Selecciona una compra</option>
                        ${purchaseOptions}
                    </select>
                </div>
            `;
        }

        if (field.name === 'Id_usuario_comun') {
            const currentUserName = authState.user?.username || 'Sin sesión';
            return `
                <div class="field-group">
                    <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                    <input id="${field.name}_display" type="text" value="${currentUserName}" readonly />
                    <input type="hidden" id="${field.name}" name="${field.name}" value="${authState.user?.Id_usuario ?? ''}" />
                </div>
            `;
        }

        if (field.name === 'Id_usuario_it') {
            const currentUserId = authState.user?.Id_usuario ?? '';
            const currentUserName = authState.user?.username || 'Pendiente de IT';
            if (userRole === 'jefe_sucursal') {
                return `
                    <input type="hidden" id="${field.name}" name="${field.name}" value="" />
                `;
            }

            return `
                <div class="field-group">
                    <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                    <input id="${field.name}_display" type="text" value="${currentUserName}" readonly />
                    <input type="hidden" id="${field.name}" name="${field.name}" value="${currentUserId}" />
                </div>
            `;
        }

        if (field.name === 'Id_estado_ticket') {
            const stateOptions = ticketLookups.estados
                .map((status) => `<option value="${status.Id_estado_ticket}">${status.nombre_estado_ticket}</option>`)
                .join('');

            return `
                <div class="field-group">
                    <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                    <select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} ${userRole === 'jefe_sucursal' ? 'disabled' : ''}>
                        <option value="">Selecciona un estado</option>
                        ${stateOptions}
                    </select>
                </div>
            `;
        }

        if (field.name === 'problema_presentado' && userRole === 'jefe_sucursal') {
            return `
                <div class="field-group">
                    <label>${field.label}</label>
                    <div class="empty-state">IT completará el diagnóstico y el problema presentado.</div>
                </div>
            `;
        }

        if ((field.name === 'fecha_entrada' || field.name === 'fecha_salida') && userRole === 'jefe_sucursal') {
            return '';
        }

        if (field.name === 'fecha_emision') {
            const today = new Date().toISOString().slice(0, 10);
            return `
                <div class="field-group">
                    <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                    <input id="${field.name}" name="${field.name}" type="date" value="${value || today}" readonly />
                </div>
            `;
        }
    }

    if (isAutoIdField(field)) {
        const isEditing = state.editId !== null;
        if (isEditing) {
            // En edición, mostrar ID actual como readonly
            return `
                <div class="field-group">
                    <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                    <input
                        id="${field.name}"
                        name="${field.name}"
                        type="number"
                        value="${value}"
                        readonly
                    />
                </div>
            `;
        } else {
            // En creación, ocultar el campo (BD genera autoincrement)
            return `<input type="hidden" id="${field.name}" name="${field.name}" value="" />`;
        }
    }

    if (field.type === 'textarea') {
        return `
            <div class="field-group">
                <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                <textarea id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} placeholder="Escribe ${field.label.toLowerCase()}">${value}</textarea>
            </div>
        `;
    }

    if (field.type === 'boolean') {
        return `
            <div class="field-group">
                <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                <select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
                    <option value="">Selecciona una opción</option>
                    <option value="1">Sí</option>
                    <option value="0">No</option>
                </select>
            </div>
        `;
    }

    const stepAttribute = field.step ? `step="${field.step}"` : '';
    return `
        <div class="field-group">
            <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
            <input
                id="${field.name}"
                name="${field.name}"
                type="${field.type}"
                ${stepAttribute}
                ${field.required ? 'required' : ''}
                placeholder="${field.label}"
            />
        </div>
    `;
}

async function fetchRecords() {
    const { endpoint } = state.activeModule;
    setLoading(true);
    try {
        const data = await apiFetch(`${API_BASE_URL}${endpoint}`);
        state.records = Array.isArray(data) ? data : [];
        state.filteredRecords = [...state.records];
        renderTable();
        updateConnectionState(true);
        showFeedback(`${state.records.length} registros cargados.`, 'success');
    } catch (error) {
        console.error(error);
        state.records = [];
        state.filteredRecords = [];
        renderTable();
        updateConnectionState(false);
        showFeedback('No fue posible cargar los registros del módulo.', 'error');
    } finally {
        setLoading(false);
    }
}

async function loadStats() {
    const limitedModules = getAccessibleModules(getCurrentUserRole()).slice(0, 4);
    const promises = limitedModules.map(async (module) => {
        try {
            const data = await apiFetch(`${API_BASE_URL}${module.endpoint}`);
            state.stats.set(module.key, Array.isArray(data) ? data.length : 0);
        } catch {
            state.stats.set(module.key, 0);
        }
    });

    await Promise.all(promises);
    renderStats();
}

function renderStats() {
    const userRole = getCurrentUserRole();
    const cards = getAccessibleModules(userRole)
        .slice(0, 4)
        .map((module) => ({
            key: module.key,
            label: getModuleDisplayLabel(module, userRole),
        }));

    elements.statsGrid.innerHTML = cards
        .map((card) => {
            const value = state.stats.get(card.key) ?? '—';
            return `
                <article class="stat-card">
                    <p class="stat-label">${card.label}</p>
                    <div class="stat-value">${value}</div>
                    <div class="stat-footer">Registros disponibles en la API</div>
                </article>
            `;
        })
        .join('');
}

function renderTable() {
    const module = state.activeModule;
    const userRole = getCurrentUserRole();
    const canCreate = canCreateRecord(module.key, userRole);
    const canEdit = canEditRecord(module.key, userRole);
    const canDelete = canDeleteRecord(module.key, userRole);
    const headers = module.columnLabels || module.columns;
    const columns = (canEdit || canDelete) ? [...headers, 'Acciones'] : headers;

    elements.tableHead.innerHTML = `<tr>${columns.map((column) => `<th>${column}</th>`).join('')}</tr>`;

    if (!state.filteredRecords.length) {
        elements.tableBody.innerHTML = `
            <tr>
                <td colspan="${columns.length}">
                    <div class="empty-state">No hay registros para mostrar en este módulo.</div>
                </td>
            </tr>
        `;
        elements.tableMeta.textContent = `Mostrando 0 de ${state.records.length} registros.`;
        return;
    }

    elements.tableBody.innerHTML = state.filteredRecords
        .map((record) => {
            const cells = module.columns
                .map((column) => `<td>${formatCellValue(record[column])}</td>`)
                .join('');

            if (!canEdit && !canDelete) {
                return `<tr>${cells}</tr>`;
            }

            return `
                <tr>
                    ${cells}
                    <td>
                        <div class="row-actions">
                            ${canEdit ? `<button type="button" class="action-edit" data-action="edit" data-id="${record[module.idField]}">Editar</button>` : ''}
                            ${canDelete ? `<button type="button" class="action-delete" data-action="delete" data-id="${record[module.idField]}">Eliminar</button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        })
        .join('');

    elements.tableMeta.textContent = `Mostrando ${state.filteredRecords.length} de ${state.records.length} registros.`;

    if (canEdit) {
        elements.tableBody.querySelectorAll('[data-action="edit"]').forEach((button) => {
            button.addEventListener('click', () => startEditMode(button.dataset.id));
        });
    }

    if (canDelete) {
        elements.tableBody.querySelectorAll('[data-action="delete"]').forEach((button) => {
            button.addEventListener('click', () => removeRecord(button.dataset.id));
        });
    }
}

function formatCellValue(value) {
    if (value === null || value === undefined || value === '') {
        return '<span class="muted">—</span>';
    }

    if (typeof value === 'boolean') {
        return value ? 'Sí' : 'No';
    }

    return String(value);
}

function filterRecords(query) {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
        state.filteredRecords = [...state.records];
        renderTable();
        return;
    }

    state.filteredRecords = state.records.filter((record) =>
        Object.values(record).some((value) => String(value ?? '').toLowerCase().includes(normalized)),
    );

    renderTable();
}

async function startCreateMode() {
    if (!canCreateRecord()) {
        showFeedback('Este módulo es de solo lectura para tu rol.', 'error');
        return;
    }

    state.editId = null;
    elements.recordForm.reset();
    elements.formTitle.textContent = `Nuevo ${getModuleSingularLabel(state.activeModule)}`;
    resetFeedback();

    // Rebuild the form to ensure default values and lookups are available
    await buildForm(state.activeModule);

    // Focus the first visible input/select in the form to indicate action
    const firstField = elements.recordForm.querySelector('input:not([type=hidden]):not([disabled]), select:not([disabled]), textarea:not([disabled])');
    if (firstField) {
        firstField.focus();
    }
}

function startEditMode(id) {
    if (!canEditRecord()) {
        showFeedback('Este módulo es de solo lectura para tu rol.', 'error');
        return;
    }

    const record = state.records.find((item) => String(item[state.activeModule.idField]) === String(id));
    if (!record) {
        showFeedback('No se encontró el registro para editar.', 'error');
        return;
    }

    state.editId = id;
    elements.formTitle.textContent = `Editar ${getModuleSingularLabel(state.activeModule)}`;
    state.activeModule.fields.forEach((field) => {
        const input = elements.recordForm.elements[field.name];
        if (!input) {
            return;
        }

        if (field.type === 'boolean') {
            const booleanValue = record[field.name] === 1 || record[field.name] === '1' || record[field.name] === true;
            input.value = record[field.name] === null || record[field.name] === undefined ? '' : (booleanValue ? '1' : '0');
            return;
        }

        if (field.type === 'date') {
            input.value = record[field.name] ? String(record[field.name]).slice(0, 10) : '';
            return;
        }

        input.value = record[field.name] ?? '';
    });

    showFeedback('Registro cargado en el formulario.', 'success');
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const userRole = getCurrentUserRole();
    const module = state.activeModule;
    const isEditing = state.editId !== null;

    if (isEditing && !canEditRecord(module.key, userRole)) {
        showFeedback('Este módulo es de solo lectura para tu rol.', 'error');
        return;
    }

    if (!isEditing && !canCreateRecord(module.key, userRole)) {
        showFeedback('Este módulo es de solo lectura para tu rol.', 'error');
        return;
    }

    const payload = buildPayload(module);

    if (payload === null) {
        return;
    }

    const targetId = isEditing ? state.editId : payload[module.idField];
    const endpoint = isEditing ? `${module.endpoint}/${targetId}` : module.endpoint;
    const method = isEditing ? 'PUT' : 'POST';

    try {
        await apiFetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        await fetchRecords();
        await loadStats();
        resetForm();
        showFeedback(isEditing ? 'Registro actualizado correctamente.' : 'Registro creado correctamente.', 'success');
    } catch (error) {
        console.error(error);
        showFeedback('No se pudo guardar el registro. Verifica los datos.', 'error');
    }
}

function buildPayload(module) {
    const payload = {};
    const userRole = getCurrentUserRole();
    const isTicketCreateByBranch = module.key === 'ticket' && userRole === 'jefe_sucursal' && state.editId === null;
    const isTicketEditByIt = module.key === 'ticket' && userRole === 'trabajador' && state.editId !== null;

    for (const field of module.fields) {
        // Excluir campos ID en creación (autoincrement)
        if (!isEditing && isAutoIdField(field)) {
            continue;
        }

        const input = elements.recordForm.elements[field.name];
        if (!input) {
            continue;
        }

        let rawValue = String(input.value ?? '').trim();

        if (module.key === 'ticket') {
            if (field.name === 'fecha_emision' && !rawValue) {
                rawValue = new Date().toISOString().slice(0, 10);
                input.value = rawValue;
            }

            if (field.name === 'Id_usuario_it') {
                if (isTicketCreateByBranch) {
                    payload[field.name] = null;
                    continue;
                }

                if (isTicketEditByIt) {
                    payload[field.name] = authState.user?.Id_usuario ?? null;
                    continue;
                }
            }

            if (field.name === 'problema_presentado' && isTicketCreateByBranch) {
                payload[field.name] = null;
                continue;
            }

            if ((field.name === 'fecha_salida' || field.name === 'fecha_entrada') && isTicketCreateByBranch) {
                payload[field.name] = rawValue === '' ? null : rawValue;
                continue;
            }

            if (field.name === 'Id_estado_ticket' && isTicketCreateByBranch) {
                payload[field.name] = 1;
                continue;
            }
        }

        if (field.required && !rawValue) {
            if (module.key === 'ticket' && (isTicketCreateByBranch || isTicketEditByIt) && (field.name === 'problema_presentado' || field.name === 'fecha_salida' || field.name === 'fecha_entrada')) {
                payload[field.name] = null;
                continue;
            }

            showFeedback(`El campo ${field.label} es obligatorio.`, 'error');
            input.focus();
            return null;
        }

        if (field.type === 'number') {
            payload[field.name] = rawValue === '' ? null : Number(rawValue);
            continue;
        }

        if (field.type === 'boolean') {
            payload[field.name] = rawValue === '' ? null : Number(rawValue);
            continue;
        }

        payload[field.name] = rawValue;
    }

    if (module.key === 'ticket') {
        if (isTicketCreateByBranch) {
            payload.fecha_emision = payload.fecha_emision || new Date().toISOString().slice(0, 10);
            payload.Id_usuario_comun = authState.user?.Id_usuario ?? payload.Id_usuario_comun;
            payload.Id_usuario_it = null;
            payload.Id_estado_ticket = 1;
            payload.problema_presentado = payload.problema_presentado ?? null;
        }

        if (isTicketEditByIt) {
            payload.Id_usuario_it = authState.user?.Id_usuario ?? payload.Id_usuario_it;
        }
    }

    return payload;
}

async function removeRecord(id) {
    const module = state.activeModule;
    const record = state.records.find((item) => String(item[module.idField]) === String(id));
    const label = record?.[module.titleField] ?? `ID ${id}`;

    if (!window.confirm(`¿Deseas eliminar ${label}?`)) {
        return;
    }

    try {
        await apiFetch(`${API_BASE_URL}${module.endpoint}/${id}`, {
            method: 'DELETE',
        });

        await fetchRecords();
        await loadStats();
        showFeedback('Registro eliminado correctamente.', 'success');
    } catch (error) {
        console.error(error);
        showFeedback('No fue posible eliminar el registro.', 'error');
    }
}

function resetForm() {
    state.editId = null;
    elements.recordForm.reset();
    elements.formTitle.textContent = `Nuevo ${getModuleSingularLabel(state.activeModule)}`;
    resetFeedback();
}

async function refreshActiveModule() {
    await fetchRecords();
    await loadStats();
}

function setLoading(isLoading) {
    state.loading = isLoading;
    elements.refreshBtn.disabled = isLoading;
    elements.newRecordBtn.disabled = isLoading || !canCreateRecord();
    elements.connectionState.textContent = isLoading ? 'Actualizando…' : 'Conectado';
}

function updateConnectionState(success) {
    elements.connectionState.textContent = success ? 'Conectado' : 'Sin conexión';
    elements.connectionState.classList.toggle('is-error', !success);
}

function showFeedback(message, type) {
    elements.feedbackMessage.textContent = message;
    elements.feedbackMessage.className = `feedback-message ${type}`;
}

function resetFeedback() {
    elements.feedbackMessage.textContent = '';
    elements.feedbackMessage.className = 'feedback-message';
}
