# Supply Chain Transparency Blockchain

A blockchain-powered supply chain transparency platform built with **Django**, **PostgreSQL**, **React**, and **Web3/sepolia**. The system is designed to track products across the supply chain and store key actions on-chain for transparency and traceability.

## Features

- Product registration and management
- Inventory tracking
- Supply chain workflow support
- Blockchain-backed transaction recording
- Celo testnet integration
- Django admin dashboard
- REST API support
- React frontend
- PostgreSQL persistence
- Safe startup even when blockchain services are unavailable

## Tech Stack

### Backend

- Python 3
- Django 5
- Django REST Framework
- SimpleJWT
- PostgreSQL
- psycopg2 / psycopg2-binary

### Frontend

- React
- JavaScript
- pnpm / npm

### Blockchain

- Web3.py
- Celo Alfajores testnet
- Smart contract ABI integration

## Project Structure

```text
SupplyChainTransparency_Blockchain-main/
├── backend/          # Django backend
│   ├── manage.py
│   ├── supplychain/
│   ├── store/
│   ├── users/
│   ├── order_flow/
│   ├── delivery/
│   ├── contracts/
│   └── requirements.txt
├── frontend/             # React frontend
│   ├── package.json
│   └── src/
└── README.md
```

## Prerequisites

Make sure these are installed on your system:

- Python 3.10+ recommended
- Node.js and npm or pnpm
- PostgreSQL
- Git

On Ubuntu, you may also need:

```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv postgresql postgresql-contrib libpq-dev build-essential
```

## Backend Setup

### 1. Go to the backend directory

```bash
cd backend
```

### 2. Create a virtual environment

```bash
python3 -m venv virtualenv
```

### 3. Activate it

```bash
source virtualenv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

If `psycopg2` fails to build, install PostgreSQL headers first:

```bash
sudo apt install libpq-dev python3-dev build-essential
```

Then reinstall:

```bash
pip install -r requirements.txt
```

## Database Setup

This project uses PostgreSQL by default.

### Create the database and user

The Django settings expect these defaults:

- Database: `supply_chain`
- User: `wplott`
- Password: `supply2024`
- Host: `localhost`
- Port: `5432`

Create them with:

```bash
sudo -u postgres psql
```

Then run:

```sql
CREATE USER wplott WITH PASSWORD 'supply2024';
CREATE DATABASE supply_chain OWNER wplott;
GRANT ALL PRIVILEGES ON DATABASE supply_chain TO wplott;
\q
```

### Environment variables

Create a `.env` file inside the backend directory:

```env
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=supply_chain
DB_USER=wplott
DB_PASSWORD=supply2024
DB_HOST=localhost
DB_PORT=5432

CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
CELO_PRIVATE_KEY=your_private_key_here
CELO_CONTRACT_ADDRESS=0x650Fe75F1EaC682e3365F8C8348B38eF1713FD0E
```

## Migrations and Admin User

Run database migrations:

```bash
python manage.py migrate
```

Create a superuser:

```bash
python manage.py createsuperuser
```

## Run the Backend

Start the Django server:

```bash
python manage.py runserver
```

Backend URL:

```text
http://127.0.0.1:8000
```

Django admin:

```text
http://127.0.0.1:8000/admin
```

## Frontend Setup

### 1. Go to the frontend directory

```bash
cd ../frontend
```

### 2. Install dependencies

Using pnpm:

```bash
pnpm install
```

Or using npm:

```bash
npm install
```

### 3. Start the frontend

Using pnpm:

```bash
pnpm start
```

Or using npm:

```bash
npm start
```

Frontend URL:

```text
http://localhost:3000
```

## Blockchain Notes

The backend includes a blockchain integration module that:

- Loads the contract ABI from `contracts/supply_chain_abi.json`
- Connects to Celo via `CELO_RPC_URL`
- Uses `CELO_PRIVATE_KEY` to sign transactions
- Interacts with a deployed smart contract at `CELO_CONTRACT_ADDRESS`

If the Celo network is unavailable, the backend now starts normally and blockchain features remain disabled until a connection is available.

## Common Issues

### 1. `psycopg2` build error

Install PostgreSQL development libraries:

```bash
sudo apt install libpq-dev python3-dev build-essential
```

### 2. `password authentication failed`

Check the PostgreSQL user and password, then reset them if needed:

```bash
sudo -u postgres psql
```

```sql
ALTER USER wplott WITH PASSWORD 'supply2024';
```

### 3. `Please set the CELO_PRIVATE_KEY`

Add `CELO_PRIVATE_KEY` to your `.env` file.

### 4. `Failed to connect to the Celo network`

Check your `CELO_RPC_URL`, internet connection, and testnet availability.

### 5. Django starts but blockchain features fail

This usually means the contract address, private key, or RPC endpoint needs to be updated.

## Recommended Startup Order

1. Start PostgreSQL
2. Activate the Python virtual environment
3. Install backend dependencies
4. Run `python manage.py migrate`
5. Start the Django backend
6. Start the React frontend

## Example Development Workflow

```bash
# Backend
cd supplychain
source virtualenv/bin/activate
python manage.py migrate
python manage.py runserver
```

```bash
# Frontend
cd frontend
pnpm install
pnpm start
```

## License

This project is provided for educational and development purposes.

## Author

Developed for a blockchain-based supply chain transparency solution.
