
const STORAGE_KEY = 'laundryDataBright'; 
let laundryItems = [];
let isEditing = false;
let currentEditId = null;

// --- 1. Fungsionalitas READ (Membaca Data dari Storage) ---
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    laundryItems = serializedData ? JSON.parse(serializedData) : [];
    renderTable();
}


function saveDataToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(laundryItems));
}


function renderTable() {
    const tableBody = document.querySelector('#data-tabel tbody');
    tableBody.innerHTML = ''; 

    if (laundryItems.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Belum ada data transaksi. Silakan tambah data baru.</td></tr>`;
        return;
    }

    laundryItems.forEach(item => {
        const row = tableBody.insertRow();
        // Menyesuaikan class status. Contoh: siap-ambil menjadi siapambil
        const statusClass = `status-${item.status.replace('-', '')}`;
        // Mengubah format tampilan status. Contoh: siap-ambil menjadi Siap Ambil
        const statusText = item.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
        // Mengubah format tampilan layanan
        const layananText = item.layanan.charAt(0).toUpperCase() + item.layanan.slice(1);

        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nama}</td>
            <td>${item.berat}</td>
            <td>${layananText}</td>
            <td>${item.parfum || '-'}</td> <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>
                <button class="edit-btn" onclick="editItem(${item.id})">Edit</button>
                <button class="delete-btn" onclick="deleteItem(${item.id})">Hapus</button>
            </td>
        `;
    });
}


document.getElementById('laundry-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const nama = document.getElementById('nama').value;
    const berat = parseInt(document.getElementById('berat').value);
    const layanan = document.getElementById('layanan').value; // Ambil nilai layanan baru
    const parfum = document.getElementById('parfum').value; // Ambil nilai parfum baru
    const status = document.getElementById('status').value;

    if (isEditing) {
        // Mode UPDATE
        updateItem(currentEditId, nama, berat, layanan, parfum, status);
    } else {
        // Mode CREATE
        const newItem = {
            id: Date.now(), 
            nama: nama,
            berat: berat,
            layanan: layanan,
            parfum: parfum,
            status: status
        };
        laundryItems.push(newItem);
        alert(`Transaksi untuk ${nama} (${layanan.toUpperCase()}) berhasil ditambahkan!`);
    }

    saveDataToStorage();
    renderTable();
    resetForm();
});


function editItem(id) {
    const itemToEdit = laundryItems.find(item => item.id === id);
    if (!itemToEdit) return;

    document.getElementById('nama').value = itemToEdit.nama;
    document.getElementById('berat').value = itemToEdit.berat;
    document.getElementById('layanan').value = itemToEdit.layanan; // Tambahan
    document.getElementById('parfum').value = itemToEdit.parfum; // Tambahan
    document.getElementById('status').value = itemToEdit.status;
    
   
    document.querySelector('#laundry-form button[type="submit"]').textContent = 'Simpan Perubahan';
    isEditing = true;
    currentEditId = id;
    
    document.querySelector('.form-section h2').textContent = '✏️ Edit Transaksi';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


function updateItem(id, nama, berat, layanan, parfum, status) {
    const itemIndex = laundryItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        laundryItems[itemIndex].nama = nama;
        laundryItems[itemIndex].berat = berat;
        laundryItems[itemIndex].layanan = layanan; 
        laundryItems[itemIndex].parfum = parfum; 
        laundryItems[itemIndex].status = status;
        alert(`Transaksi ID ${id} berhasil diperbarui!`);
    }
}


function deleteItem(id) {
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
        laundryItems = laundryItems.filter(item => item.id !== id);
        saveDataToStorage();
        renderTable();
        alert("Transaksi berhasil dihapus!");
    }
}


function resetForm() {
    document.getElementById('laundry-form').reset();
    document.querySelector('#laundry-form button[type="submit"]').textContent = 'Tambah Transaksi';
    document.querySelector('.form-section h2').textContent = '➕ Input Transaksi';
    isEditing = false;
    currentEditId = null;
}


document.addEventListener('DOMContentLoaded', loadDataFromStorage);