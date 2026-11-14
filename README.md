# Medical Access Management Demo

This project is an educational, dark-theme Web3 dashboard for a secure medical data access system. It simulates:

- Patient permission management
- Doctor medical record access requests
- Clinic credential verification
- Audit logging
- Wallet connection and signature requests
- Mock token faucet and escrow visualization
- Encrypted document access through IPFS-style file links

## Features

- Deep blue / violet interface with glowing Web3 styling
- Responsive multi-section dashboard
- Patient and doctor panels
- Wallet modal with pending/success states
- Fake audit log table
- Token faucet simulation
- Back-end API endpoints for mock wallet and consent actions

## Run locally

```bash
npm install
npm start
```

Then open http://localhost:3000

## Project structure

- `server.js` – Express API server
- `public/index.html` – main UI shell
- `public/styles.css` – dashboard styling
- `public/app.js` – interaction logic and simulated flows

## Notes

This is intentionally fictional and educational. It demonstrates UI and system flow without using real medical records or blockchain transactions.
