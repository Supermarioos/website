// Ambil referensi elemen
const inputNama = document.getElementById('inputNama');
const juiceButtons = document.getElementById('juiceButtons');
const sugarButtons = document.getElementById('sugarButtons');
const milkButtons = document.getElementById('milkButtons');
const iceButtons = document.getElementById('iceButtons');

const btnAddJuiceMenu = document.getElementById('btnAddJuiceMenu');
const btnDeleteSelectedJuice = document.getElementById('btnDeleteSelectedJuice');
const newJuiceInput = document.getElementById('newJuiceInput');
const inputNewJuice = document.getElementById('inputNewJuice');
const btnSaveNewJuice = document.getElementById('btnSaveNewJuice');

const btnTambah = document.getElementById('btnTambah');
const btnSelesai = document.getElementById('btnSelesai');
const isiTabel = document.getElementById('isiTabel');

// Variabel untuk menyimpan pilihan aktif
let selectedJuice = 'Es Jeruk';
let selectedSugar = 'Normal';
let selectedMilk = 'Normal';
let selectedIce = 'Normal';

// Data menu juice (persisten ke localStorage)
let juiceMenuItems = [
    'Es Jeruk', 'Tomat', 'Nanas', 'Sirsak', 'Apel', 'Semangka', 'Stroberi', 'Jambu',
    'Melon', 'Mangga', 'Buah Naga', 'Alpukat', 'Mix'
];

const juiceMenuKey = 'mamserFreshJuiceMenu';

function saveJuiceMenu() {
    localStorage.setItem(juiceMenuKey, JSON.stringify(juiceMenuItems));
}

function loadJuiceMenu() {
    const saved = localStorage.getItem(juiceMenuKey);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                juiceMenuItems = parsed;
            }
        } catch (e) {
            console.error('Gagal memuat menu juice', e);
        }
    }
}

function renderJuiceButtons() {
    juiceButtons.innerHTML = '';
    juiceMenuItems.forEach(item => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('data-value', item);
        btn.textContent = item;
        if (item === selectedJuice) {
            btn.classList.add('active');
        }
        juiceButtons.appendChild(btn);
    });
}

// Fungsi untuk set active button
function setActiveButton(buttons, value) {
    buttons.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-value') === value) {
            btn.classList.add('active');
        }
    });
}

// Set default active menu
loadJuiceMenu();
if (!juiceMenuItems.includes(selectedJuice)) {
    selectedJuice = juiceMenuItems[0] || '';
}
renderJuiceButtons();
setActiveButton(sugarButtons, selectedSugar);
setActiveButton(milkButtons, selectedMilk);
setActiveButton(iceButtons, selectedIce);

// Event listener untuk button clicks
juiceButtons.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        selectedJuice = e.target.getAttribute('data-value');
        setActiveButton(juiceButtons, selectedJuice);
    }
});

sugarButtons.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        selectedSugar = e.target.getAttribute('data-value');
        setActiveButton(sugarButtons, selectedSugar);
    }
});

milkButtons.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        selectedMilk = e.target.getAttribute('data-value');
        setActiveButton(milkButtons, selectedMilk);
    }
});

iceButtons.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        selectedIce = e.target.getAttribute('data-value');
        setActiveButton(iceButtons, selectedIce);
    }
});

btnAddJuiceMenu.addEventListener('click', () => {
    newJuiceInput.classList.remove('hidden');
    inputNewJuice.focus();
});

btnSaveNewJuice.addEventListener('click', () => {
    const newJuice = inputNewJuice.value.trim();
    if (!newJuice) {
        alert('Masukkan nama juice baru.');
        return;
    }
    if (juiceMenuItems.includes(newJuice)) {
        alert('Menu juice sudah ada.');
        return;
    }

    juiceMenuItems.push(newJuice);
    saveJuiceMenu();
    selectedJuice = newJuice;
    renderJuiceButtons();

    newJuiceInput.classList.add('hidden');
    inputNewJuice.value = '';
});

btnDeleteSelectedJuice.addEventListener('click', () => {
    if (!selectedJuice || !juiceMenuItems.includes(selectedJuice)) {
        alert('Pilih menu juice yang ingin dihapus terlebih dahulu.');
        return;
    }

    if (juiceMenuItems.length <= 1) {
        alert('Minimal satu menu juice harus ada.');
        return;
    }

    if (!confirm(`Hapus menu "${selectedJuice}"?`)) {
        return;
    }

    juiceMenuItems = juiceMenuItems.filter(item => item !== selectedJuice);
    saveJuiceMenu();

    selectedJuice = juiceMenuItems[0] || '';
    renderJuiceButtons();
});

let orders = [];

function saveOrders() {
    localStorage.setItem('mamserFreshJuiceOrders', JSON.stringify(orders));
}

function loadOrders() {
    const savedOrders = localStorage.getItem('mamserFreshJuiceOrders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
        renderOrders();
    }
}

function renderOrders() {
    isiTabel.innerHTML = '';
    orders.forEach((order, index) => {
        const barisBaru = document.createElement('tr');
        barisBaru.classList.add('order-row');
        barisBaru.setAttribute('data-index', index);
        barisBaru.innerHTML = `
            <td>${order.nama}</td>
            <td>${order.juice}</td>
            <td>${order.sugar}</td>
            <td>${order.milk}</td>
            <td>${order.ice}</td>
        `;
        isiTabel.appendChild(barisBaru);
    });
}

document.addEventListener('DOMContentLoaded', loadOrders);

isiTabel.addEventListener('click', function(e) {
    const row = e.target.closest('.order-row');
    if (row) {
        const index = parseInt(row.getAttribute('data-index'));
        if (confirm(`Apakah Anda yakin ingin menghapus pesanan untuk "${orders[index].nama}"?`)) {
            orders.splice(index, 1);
            saveOrders();
            renderOrders();
        }
    }
});

btnTambah.addEventListener('click', function() {
    const nama = inputNama.value;
    const juice = selectedJuice;
    const sugar = selectedSugar;
    const milk = selectedMilk;
    const ice = selectedIce;

    if (nama.trim() === "") {
        alert("Silakan masukkan nama terlebih dahulu!");
        return;
    }

    const newOrder = { nama, juice, sugar, milk, ice };
    orders.push(newOrder);

    saveOrders();

    renderOrders();

    inputNama.value = "";
});


btnSelesai.addEventListener('click', function() {
    if (orders.length === 0) {
        alert('Tidak ada pesanan untuk dihapus.');
        return;
    }

    if (confirm('Apakah Anda yakin ingin menghapus semua pesanan?')) {
        orders = [];
        saveOrders();
        renderOrders();
    }
});