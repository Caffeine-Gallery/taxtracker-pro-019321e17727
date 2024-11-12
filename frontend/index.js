import { backend } from "declarations/backend";

// Initialize Feather icons
feather.replace();

// DOM Elements
const taxpayerForm = document.getElementById('taxpayerForm');
const searchBtn = document.getElementById('searchBtn');
const searchTid = document.getElementById('searchTid');
const recordsList = document.getElementById('recordsList');
const loading = document.getElementById('loading');

// Show/Hide loading spinner
const toggleLoading = (show) => {
    loading.classList.toggle('hidden', !show);
};

// Render taxpayer records
const renderRecords = (records) => {
    recordsList.innerHTML = records.map(record => `
        <div class="record-card">
            <h3><i data-feather="user"></i> ${record.firstName} ${record.lastName}</h3>
            <p><strong>TID:</strong> ${record.tid}</p>
            <p><strong>Address:</strong> ${record.address}</p>
        </div>
    `).join('');
    feather.replace();
};

// Load all records
const loadRecords = async () => {
    try {
        toggleLoading(true);
        const records = await backend.getAllTaxPayers();
        renderRecords(records);
    } catch (error) {
        console.error('Error loading records:', error);
    } finally {
        toggleLoading(false);
    }
};

// Add new taxpayer
taxpayerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const taxpayer = {
        tid: document.getElementById('tid').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address: document.getElementById('address').value
    };

    try {
        toggleLoading(true);
        await backend.addTaxPayer(taxpayer);
        taxpayerForm.reset();
        await loadRecords();
    } catch (error) {
        console.error('Error adding taxpayer:', error);
    } finally {
        toggleLoading(false);
    }
});

// Search taxpayer
searchBtn.addEventListener('click', async () => {
    const tid = searchTid.value.trim();
    if (!tid) {
        await loadRecords();
        return;
    }

    try {
        toggleLoading(true);
        const taxpayer = await backend.getTaxPayer(tid);
        if (taxpayer) {
            renderRecords([taxpayer]);
        } else {
            recordsList.innerHTML = '<p>No taxpayer found with this TID.</p>';
        }
    } catch (error) {
        console.error('Error searching taxpayer:', error);
    } finally {
        toggleLoading(false);
    }
});

// Initial load
loadRecords();
