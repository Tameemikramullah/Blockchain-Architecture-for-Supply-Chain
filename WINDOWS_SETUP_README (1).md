# Supply Chain Transparency Blockchain -- Windows Setup Guide

## Overview

This guide explains how to set up the project on **Windows 10/11**.

## Prerequisites

-   Git
-   Python **3.11.x** (recommended)
-   Node.js LTS
-   PostgreSQL 18 (or compatible)
-   PowerShell

If PowerShell blocks activation:
``` powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 1. Install Git

Download: https://git-scm.com/downloads

Verify:

``` powershell
git --version
```

## 2. Install Python

Download Python 3.11.x from: https://www.python.org/downloads/

During installation check **Add Python to PATH**.

Verify:

``` powershell
python --version
```

## 3. Install Node.js

Download the LTS version: https://nodejs.org/

Verify:

``` powershell
node -v
npm -v
```

(Optional)

``` powershell
npm install -g pnpm
pnpm -v
```

## 4. Install PostgreSQL

Download: https://www.postgresql.org/download/windows/

Use the default port **5432**.

Verify the service on PowerShell as an admin:

``` powershell
Get-Service *postgres*
```
``` powershell
Get-ChildItem "C:\Program Files\PostgreSQL\18\bin\psql.exe"
```
``` powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres
```

If `psql` is not in PATH:

``` powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" --version
```

If supply_chain or wplott do not exist
``` powershell
CREATE USER wplott WITH PASSWORD 'supply2024';
```
``` powershell
CREATE DATABASE supply_chain OWNER wplott;
```
``` powershell
GRANT ALL PRIVILEGES ON DATABASE supply_chain TO wplott;
```

## 5. Clone the Repository

``` powershell
git clone <repository-url>
cd Supply-Chain-Transparency-Blockchain-main
```

## 6. Backend Setup

``` powershell
cd backend
python -m venv virtualenv
.\virtualenv\Scripts\Activate.ps1
python -m pip install --upgrade pip setuptools wheel
python -m pip install -r requirements.txt
```

> **Recommended:** Use **Python 3.11**. Python 3.13 may fail with older
> pinned dependencies.

## 7. Create PostgreSQL Database

Open SQL Shell (`psql`) and execute:

``` sql
CREATE USER wplott WITH PASSWORD 'supply2024';
CREATE DATABASE supply_chain OWNER wplott;
GRANT ALL PRIVILEGES ON DATABASE supply_chain TO wplott;
```

## 8. Configure `.env`

``` env
SECRET_KEY=<your-secret-key>
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=supply_chain
DB_USER=wplott
DB_PASSWORD=supply2024
DB_HOST=localhost
DB_PORT=5432

CELO_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
CELO_PRIVATE_KEY=<your-private-key>
CELO_CONTRACT_ADDRESS=<your-contract-address>
```

## 9. Apply Migrations

``` powershell
python manage.py migrate
```

## 10. Create a Superuser

``` powershell
python manage.py createsuperuser
```

## 11. Run the Backend

``` powershell
python manage.py runserver
```

Backend: - http://127.0.0.1:8000 - http://127.0.0.1:8000/admin

## 12. Frontend

Open another PowerShell window.

``` powershell
cd frontend
```

If using npm:

``` powershell
npm install
npm start
```

If using pnpm:

``` powershell
pnpm install
pnpm start
```

Frontend: - http://localhost:3000

## Troubleshooting

### `python` not recognized

Reinstall Python and enable **Add Python to PATH**.

### `node` or `npm` not recognized

Reinstall Node.js and restart PowerShell.

### `pip.exe` blocked

Use:

``` powershell
python -m pip install -r requirements.txt
```

### Pillow or build errors

Use Python **3.11** and recreate the virtual environment.

### `connection refused (localhost:5432)`

Ensure PostgreSQL is running:

``` powershell
Get-Service *postgres*
```

### `psql` not recognized

Run directly:

``` powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" --version
```

or add `C:\Program Files\PostgreSQL\18\bin` to PATH.

## Daily Development Workflow

Open PowerShell as Administrator:
``` powershell
Start-Service postgresql-x64-18
Get-Service postgresql-x64-18
```

Backend:

``` powershell
cd backend
.\virtualenv\Scripts\Activate.ps1
python manage.py runserver
```

Frontend:

``` powershell
cd frontend
npm start
```
