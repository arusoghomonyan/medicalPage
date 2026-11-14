const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dashboardData = {
  patient: {
    name: 'Ariana Wells',
    id: 'PT-2048',
    age: 34,
    bloodType: 'O+',
    wallet: '0x71C4...3A9',
    balance: 128.45,
    status: 'Consented',
    riskScore: 'Low'
  },
  doctor: {
    name: 'Dr. Marcus Lee',
    clinic: 'North Harbor Clinic',
    license: 'NMC-88412',
    verification: 'Verified'
  },
  records: [
    { type: 'X-Ray', file: 'thoracic_series_08.dcm', owner: 'Ariana Wells', encrypted: true, access: 'Granted', updated: '2 mins ago' },
    { type: 'Cardiology PDF', file: 'ecg_review_2026.pdf', owner: 'Ariana Wells', encrypted: true, access: 'Pending approval', updated: '14 mins ago' },
    { type: 'Lab Report', file: 'blood_panel_11.pdf', owner: 'Ariana Wells', encrypted: true, access: 'Granted', updated: '1 hour ago' }
  ],
  audit: [
    { actor: 'Dr. Marcus Lee', action: 'Requested X-ray access', status: 'Approved', time: '09:44 UTC' },
    { actor: 'Clinic Admin', action: 'Verified doctor license', status: 'Success', time: '08:18 UTC' },
    { actor: 'Ariana Wells', action: 'Consent signed', status: 'Success', time: '08:01 UTC' },
    { actor: 'System', action: 'Re-encryption status', status: 'Pending', time: '07:43 UTC' }
  ],
  tokens: {
    native: 'MOCK-ETH',
    stable: 'MOCK-USDT',
    education: 'EDU-COIN'
  }
};

const walletState = {
  connected: false,
  address: '0x71C4...3A9',
  balance: 128.45,
  network: 'Sepolia Testnet'
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'medical-access-demo' });
});

app.get('/api/dashboard', (req, res) => {
  res.json(dashboardData);
});

app.post('/api/auth/connect-wallet', (req, res) => {
  walletState.connected = true;
  walletState.balance = 128.45;

  res.json({
    success: true,
    message: 'Wallet connected successfully.',
    wallet: walletState
  });
});

app.post('/api/faucet', (req, res) => {
  const minted = {
    'MOCK-ETH': 5,
    'MOCK-USDT': 125,
    'EDU-COIN': 500
  };

  walletState.balance += 6.5;

  res.json({
    success: true,
    message: 'Mock tokens received from faucet.',
    tokens: minted,
    wallet: walletState
  });
});

app.post('/api/consent', (req, res) => {
  res.json({
    success: true,
    message: 'Patient consent signed and recorded on-chain.',
    status: 'Approved',
    txHash: '0xA9FB...2E11'
  });
});

app.post('/api/access-request', (req, res) => {
  const { patient, doctor, document } = req.body || {};

  res.json({
    success: true,
    message: 'Access request created and sent to patient wallet.',
    patient: patient || 'Ariana Wells',
    doctor: doctor || 'Dr. Marcus Lee',
    document: document || 'thoracic_series_08.dcm',
    status: 'Pending patient approval'
  });
});

app.post('/api/access-response', (req, res) => {
  const { decision = 'Approved', document = 'thoracic_series_08.dcm' } = req.body || {};

  res.json({
    success: true,
    message: `Access ${decision.toLowerCase()} for ${document}.`,
    document,
    decision,
    decrypted: decision === 'Approved' ? true : false,
    txHash: '0x3B12...9F81'
  });
});

app.get('/api/audit', (req, res) => {
  res.json(dashboardData.audit);
});

app.get('/api/tokens', (req, res) => {
  res.json({ wallet: walletState, tokens: dashboardData.tokens });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Medical access demo server running at http://localhost:${PORT}`);
});

