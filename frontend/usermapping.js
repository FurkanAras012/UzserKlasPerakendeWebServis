// API Base URL
const BASE_URL = 'http://localhost:5186/api/v1';

// Global variables to store data
let flowUsers = [];
let tigerUsers = [];
let userMappings = [];

// DOM elements
const flowUserSelect = document.getElementById('flowUserSelect');
const tigerUserSelect = document.getElementById('tigerUserSelect');
const editTigerUserSelect = document.getElementById('editTigerUserSelect');
const mappingForm = document.getElementById('mappingForm');
const editForm = document.getElementById('editForm');
const mappingsTable = document.getElementById('mappingsTable');
const mappingCount = document.getElementById('mappingCount');
const alertContainer = document.getElementById('alertContainer');
const editModal = new bootstrap.Modal(document.getElementById('editModal'));

// Initialize the page
document.addEventListener('DOMContentLoaded', async function() {
    await loadData();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    mappingForm.addEventListener('submit', handleCreateMapping);
    editForm.addEventListener('submit', handleUpdateMapping);
}

// Load all data
async function loadData() {
    try {
        await Promise.all([
            loadFlowUsers(),
            loadTigerUsers(),
            loadUserMappings()
        ]);
    } catch (error) {
        console.error('Veri yükleme hatası:', error);
        showAlert('danger', 'Veriler yüklenirken bir hata oluştu.');
    }
}

// Load Flow users
async function loadFlowUsers() {
    try {
        const response = await fetch(`${BASE_URL}/usermapping/flowusers`);
        const result = await handleApiResponse(response);
        
        if (result.success) {
            flowUsers = result.data;
            populateFlowUserSelect();
        } else {
            throw new Error(result.message || 'Flow kullanıcıları yüklenemedi');
        }
    } catch (error) {
        console.error('Flow kullanıcıları yükleme hatası:', error);
        showAlert('danger', 'Flow kullanıcıları yüklenemedi: ' + error.message);
    }
}

// Load Tiger users
async function loadTigerUsers() {
    try {
        const response = await fetch(`${BASE_URL}/usermapping/tigerusers`);
        const result = await handleApiResponse(response);
        
        if (result.success) {
            tigerUsers = result.data;
            populateTigerUserSelects();
        } else {
            throw new Error(result.message || 'Tiger kullanıcıları yüklenemedi');
        }
    } catch (error) {
        console.error('Tiger kullanıcıları yükleme hatası:', error);
        showAlert('danger', 'Tiger kullanıcıları yüklenemedi: ' + error.message);
    }
}

// Load user mappings
async function loadUserMappings() {
    try {
        const response = await fetch(`${BASE_URL}/usermapping`);
        const result = await handleApiResponse(response);
        
        if (result.success) {
            userMappings = result.data;
            populateMappingsTable();
            updateMappingCount();
        } else {
            throw new Error(result.message || 'Kullanıcı eşleştirmeleri yüklenemedi');
        }
    } catch (error) {
        console.error('Kullanıcı eşleştirmeleri yükleme hatası:', error);
        showAlert('danger', 'Kullanıcı eşleştirmeleri yüklenemedi: ' + error.message);
    }
}

// Populate Flow user select
function populateFlowUserSelect() {
    flowUserSelect.innerHTML = '<option value="">Flow kullanıcısı seçin...</option>';
    
    flowUsers.forEach(user => {
        const option = document.createElement('option');
        option.value = user.userId;
        option.textContent = user.userName;
        flowUserSelect.appendChild(option);
    });
}

// Populate Tiger user selects
function populateTigerUserSelects() {
    const selects = [tigerUserSelect, editTigerUserSelect];
    
    selects.forEach(select => {
        select.innerHTML = '<option value="">Tiger kullanıcısı seçin...</option>';
        
        tigerUsers.forEach(user => {
            const option = document.createElement('option');
            option.value = user.userId;
            option.textContent = user.userName;
            select.appendChild(option);
        });
    });
}

// Populate mappings table
function populateMappingsTable() {
    if (userMappings.length === 0) {
        mappingsTable.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    <i class="bi bi-inbox"></i> Henüz kullanıcı eşleştirmesi bulunmuyor
                </td>
            </tr>
        `;
        return;
    }

    mappingsTable.innerHTML = '';
    
    userMappings.forEach(mapping => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <span class="badge bg-primary">${mapping.flowUserName}</span>
            </td>
            <td>
                <span class="badge bg-success">${mapping.tigerUserName}</span>
            </td>
            <td>
                <small class="text-muted">${mapping.createUser || 'Sistem'}</small>
            </td>
            <td>
                <small class="text-muted">${formatDate(mapping.createDate)}</small>
            </td>
            <td class="text-center">
                <button class="btn btn-warning btn-sm me-1" onclick="editMapping(${mapping.id})" title="Düzenle">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteMapping(${mapping.id})" title="Sil">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        mappingsTable.appendChild(row);
    });
}

// Update mapping count
function updateMappingCount() {
    mappingCount.textContent = userMappings.length;
}

// Handle create mapping form submission
async function handleCreateMapping(event) {
    event.preventDefault();
    
    const flowUserId = flowUserSelect.value;
    const tigerUserId = parseInt(tigerUserSelect.value);
    
    if (!flowUserId || !tigerUserId) {
        showAlert('warning', 'Lütfen hem Flow hem de Tiger kullanıcısı seçin.');
        return;
    }

    // Check if mapping already exists
    const existingMapping = userMappings.find(m => 
        m.flowUserId === flowUserId || m.tigerUserId === tigerUserId
    );
    
    if (existingMapping) {
        showAlert('warning', 'Bu kullanıcı zaten eşleştirilmiş.');
        return;
    }

    const saveBtn = document.getElementById('saveBtn');
    const originalText = saveBtn.innerHTML;
    
    try {
        saveBtn.innerHTML = '<i class="spinner-border spinner-border-sm me-1"></i> Kaydediliyor...';
        saveBtn.disabled = true;

        const requestData = {
            flowUserId: flowUserId,
            tigerUserId: tigerUserId,
            userId: 'SYSTEM' // You might want to get this from a logged-in user context
        };

        const response = await fetch(`${BASE_URL}/usermapping`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const result = await handleApiResponse(response);
        
        if (result.success) {
            showAlert('success', 'Kullanıcı eşleştirmesi başarıyla oluşturuldu.');
            mappingForm.reset();
            await loadUserMappings(); // Reload the mappings
        } else {
            throw new Error(result.message || 'Eşleştirme oluşturulamadı');
        }
    } catch (error) {
        console.error('Eşleştirme oluşturma hatası:', error);
        showAlert('danger', 'Eşleştirme oluşturulamadı: ' + error.message);
    } finally {
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
    }
}

// Edit mapping
function editMapping(id) {
    const mapping = userMappings.find(m => m.id === id);
    if (!mapping) {
        showAlert('danger', 'Eşleştirme bulunamadı.');
        return;
    }

    document.getElementById('editMappingId').value = mapping.id;
    document.getElementById('editFlowUser').value = mapping.flowUserName;
    editTigerUserSelect.value = mapping.tigerUserId;
    
    editModal.show();
}

// Handle update mapping
async function handleUpdateMapping(event) {
    event.preventDefault();
    await updateMapping();
}

// Update mapping
async function updateMapping() {
    const mappingId = parseInt(document.getElementById('editMappingId').value);
    const tigerUserId = parseInt(editTigerUserSelect.value);
    
    if (!tigerUserId) {
        showAlert('warning', 'Lütfen Tiger kullanıcısı seçin.');
        return;
    }

    const mapping = userMappings.find(m => m.id === mappingId);
    if (!mapping) {
        showAlert('danger', 'Eşleştirme bulunamadı.');
        return;
    }

    // Check if new Tiger user is already mapped to another Flow user
    const existingMapping = userMappings.find(m => 
        m.id !== mappingId && m.tigerUserId === tigerUserId
    );
    
    if (existingMapping) {
        showAlert('warning', 'Bu Tiger kullanıcısı zaten başka bir Flow kullanıcısı ile eşleştirilmiş.');
        return;
    }

    try {
        const requestData = {
            flowUserId: mapping.flowUserId,
            tigerUserId: tigerUserId,
            userId: 'SYSTEM' // You might want to get this from a logged-in user context
        };

        const response = await fetch(`${BASE_URL}/usermapping/${mappingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const result = await handleApiResponse(response);
        
        if (result.success) {
            showAlert('success', 'Kullanıcı eşleştirmesi başarıyla güncellendi.');
            editModal.hide();
            await loadUserMappings(); // Reload the mappings
        } else {
            throw new Error(result.message || 'Eşleştirme güncellenemedi');
        }
    } catch (error) {
        console.error('Eşleştirme güncelleme hatası:', error);
        showAlert('danger', 'Eşleştirme güncellenemedi: ' + error.message);
    }
}

// Delete mapping
async function deleteMapping(id) {
    const mapping = userMappings.find(m => m.id === id);
    if (!mapping) {
        showAlert('danger', 'Eşleştirme bulunamadı.');
        return;
    }

    const confirmMessage = `${mapping.flowUserName} - ${mapping.tigerUserName} eşleştirmesini silmek istediğinizden emin misiniz?`;
    
    if (!confirm(confirmMessage)) {
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/usermapping/${id}?userId=SYSTEM`, {
            method: 'DELETE'
        });

        const result = await handleApiResponse(response);
        
        if (result.success) {
            showAlert('success', 'Kullanıcı eşleştirmesi başarıyla silindi.');
            await loadUserMappings(); // Reload the mappings
        } else {
            throw new Error(result.message || 'Eşleştirme silinemedi');
        }
    } catch (error) {
        console.error('Eşleştirme silme hatası:', error);
        showAlert('danger', 'Eşleştirme silinemedi: ' + error.message);
    }
}

// Handle API response
async function handleApiResponse(response) {
    if (!response.ok) {
        const errorText = await response.text();
        try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.message || `HTTP ${response.status}: ${response.statusText}`);
        } catch {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    }
    
    return await response.json();
}

// Show alert message
function showAlert(type, message) {
    const alertId = 'alert-' + Date.now();
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert" id="${alertId}">
            <i class="bi bi-${getAlertIcon(type)} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    alertContainer.insertAdjacentHTML('beforeend', alertHtml);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        const alertElement = document.getElementById(alertId);
        if (alertElement) {
            const alert = bootstrap.Alert.getOrCreateInstance(alertElement);
            alert.close();
        }
    }, 5000);
}

// Get alert icon based on type
function getAlertIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'danger': return 'exclamation-triangle';
        case 'warning': return 'exclamation-triangle';
        case 'info': return 'info-circle';
        default: return 'info-circle';
    }
}

// Format date
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dateString;
    }
}

// Global functions for onclick handlers
window.editMapping = editMapping;
window.deleteMapping = deleteMapping;
window.updateMapping = updateMapping;
