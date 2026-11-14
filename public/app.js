const state = {
  walletConnected: false,
  walletAddress: '0x71C4...3A9',
  walletBalance: 128.45,
  activeView: 'overview'
};

const walletBox = document.getElementById('walletBox');
const connectWalletBtn = document.getElementById('connectWalletBtn');
const toast = document.getElementById('toast');
const modal = document.getElementById('walletModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const confirmAction = document.getElementById('confirmAction');
const rejectAction = document.getElementById('rejectAction');
const requestAccessBtn = document.getElementById('requestAccessBtn');
const consentBtn = document.getElementById('consentBtn');
const approveAccessBtn = document.getElementById('approveAccessBtn');
const faucetBtn = document.getElementById('faucetBtn');
const auditTableBody = document.getElementById('auditTableBody');
const recordList = document.getElementById('recordList');

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2600);
}

function updateWalletUI() {
  const walletText = document.getElementById('walletText');
  const walletBalance = document.getElementById('walletBalance');

  if (!state.walletConnected) {
    walletBox.innerHTML = '<button id="connectWalletBtn" class="wallet-btn">Connect Wallet</button>';
    document.getElementById('connectWalletBtn').addEventListener('click', openWalletModal);
    return;
  }

  walletBox.innerHTML = `
    <div class="wallet-summary">
      <span class="wallet-address">${state.walletAddress}</span>
      <span class="wallet-balance">${state.walletBalance.toFixed(2)} MOCK-ETH</span>
    </div>
  `;

  walletText.textContent = state.walletAddress;
  walletBalance.textContent = `${state.walletBalance.toFixed(2)} MOCK-ETH`;
}

function openWalletModal() {
  modal.classList.remove('hidden');
}

function closeWalletModal() {
  modal.classList.add('hidden');
}

async function connectWallet() {
  try {
    const response = await fetch('/api/auth/connect-wallet', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    const result = await response.json();
    if (result.success) {
      state.walletConnected = true;
      state.walletAddress = result.wallet.address;
      state.walletBalance = result.wallet.balance;
      updateWalletUI();
      showToast('Wallet connected successfully');
      closeWalletModal();
    }
  } catch (error) {
    showToast('Wallet connection failed');
  }
}

async function requestPatientAccess() {
  try {
    const payload = {
      patient: 'Ariana Wells',
      doctor: 'Dr. Marcus Lee',
      document: 'thoracic_series_08.dcm'
    };

    const response = await fetch('/api/access-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    showToast(result.message);
  } catch (error) {
    showToast('Unable to create access request');
  }
}

async function signConsent() {
  modal.classList.remove('hidden');
  const statusEl = document.querySelector('.modal-status');
  statusEl.textContent = 'Pending';
  statusEl.className = 'modal-status pending';
  showToast('Consent signing request sent');
}

async function approveConsent() {
  try {
    const response = await fetch('/api/consent', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    const result = await response.json();
    const statusEl = document.querySelector('.modal-status');
    statusEl.textContent = 'Success';
    statusEl.className = 'modal-status success';
    showToast(result.message);
    setTimeout(() => closeWalletModal(), 1200);
  } catch (error) {
    showToast('Consent signature failed');
  }
}

async function approveAccess() {
  try {
    const response = await fetch('/api/access-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision: 'Approved', document: 'thoracic_series_08.dcm' })
    });

    const result = await response.json();
    showToast(result.message);
  } catch (error) {
    showToast('Access approval failed');
  }
}

async function claimFaucet() {
  try {
    const response = await fetch('/api/faucet', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    const result = await response.json();
    state.walletBalance = result.wallet.balance;
    updateWalletUI();
    showToast(result.message);
  } catch (error) {
    showToast('Faucet request failed');
  }
}

async function renderAuditLog() {
  try {
    const response = await fetch('/api/audit');
    const logs = await response.json();
    auditTableBody.innerHTML = logs.map((log) => `
      <tr>
        <td>${log.actor}</td>
        <td>${log.action}</td>
        <td><span class="status-pill ${log.status === 'Approved' || log.status === 'Success' ? 'success' : log.status === 'Pending' ? 'warning' : 'info'}">${log.status}</span></td>
        <td>${log.time}</td>
      </tr>
    `).join('');
  } catch (error) {
    console.error(error);
  }
}

async function renderRecords() {
  try {
    const response = await fetch('/api/dashboard');
    const data = await response.json();
    recordList.innerHTML = data.records.map((record) => `
      <div class="record-item">
        <div class="record-main">
          <div class="file-icon">${record.type.split(' ')[0].charAt(0)}</div>
          <div>
            <div class="record-name">${record.file}</div>
            <div class="record-meta">${record.type} · ${record.updated}</div>
          </div>
        </div>
        <div class="record-access">
          <div class="status-pill ${record.access === 'Granted' ? 'success' : record.access === 'Pending approval' ? 'warning' : 'info'}">${record.access}</div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error(error);
  }
}

function setActiveView(view) {
  state.activeView = view;
  document.querySelectorAll('.nav-item').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === view);
  });
  document.querySelectorAll('.view').forEach((section) => {
    section.classList.toggle('active', section.id === view);
  });
}

function bindEvents() {
  document.querySelectorAll('.nav-item').forEach((button) => {
    button.addEventListener('click', () => setActiveView(button.dataset.view));
  });

  document.getElementById('connectWalletBtn')?.addEventListener('click', openWalletModal);
  closeModalBtn.addEventListener('click', closeWalletModal);
  rejectAction.addEventListener('click', closeWalletModal);
  confirmAction.addEventListener('click', approveConsent);
  requestAccessBtn.addEventListener('click', requestPatientAccess);
  consentBtn.addEventListener('click', signConsent);
  approveAccessBtn.addEventListener('click', approveAccess);
  faucetBtn.addEventListener('click', claimFaucet);
}

async function initialize() {
  bindEvents();
  updateWalletUI();
  renderAuditLog();
  renderRecords();
}

initialize();

