from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Optional

from dotenv import load_dotenv
from eth_utils import to_checksum_address
from web3 import Web3
from web3.middleware import geth_poa_middleware


BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables early
load_dotenv(BASE_DIR / ".env")

# Optional environment configuration
SEPOLIA_RPC_URL = os.getenv(
    "SEPOLIA_RPC_URL",
    "https://sepolia.infura.io/v3/b9f15aa53202424b90c51edb5b91577f",
)
SEPOLIA_PRIVATE_KEY = os.getenv("SEPOLIA_PRIVATE_KEY", os.getenv("PRIVATE_KEY"))
SEPOLIA_CONTRACT_ADDRESS = os.getenv(
    "SEPOLIA_CONTRACT_ADDRESS",
    os.getenv("CONTRACT_ADDRESS", "0x14DAd9fb216801cb60D60f5bD5f9E203D6DC2555"),
)

# Runtime globals initialized lazily / safely
web3: Optional[Web3] = None
deployer = None
account = None
supply_chain_contract = None
supply_chain_abi = None
INIT_ERROR: Optional[str] = None


def _load_supply_chain_abi() -> Optional[list]:
    """
    Load ABI safely. Never crash Django startup if the ABI file is missing.
    """
    abi_path = BASE_DIR / "contracts" / "supply_chain_abi.json"
    try:
        with abi_path.open("r", encoding="utf-8") as f:
            abi = json.load(f)
        if not abi:
            print("Warning: Supply Chain ABI file is empty.")
            return None
        return abi
    except FileNotFoundError:
        print(f"Warning: ABI file not found at {abi_path}")
        return None
    except json.JSONDecodeError as e:
        print(f"Warning: Invalid ABI JSON in {abi_path}: {e}")
        return None
    except Exception as e:
        print(f"Warning: Failed to load ABI: {e}")
        return None


def _initialize_blockchain() -> None:
    """
    Initialize Web3 and contract safely.
    Never exits the process. If anything fails, blockchain features are disabled
    but Django can still start normally.
    """
    global web3, deployer, account, supply_chain_contract, supply_chain_abi, INIT_ERROR

    supply_chain_abi = _load_supply_chain_abi()
    if supply_chain_abi is None:
        INIT_ERROR = "ABI could not be loaded."
        return

    if not SEPOLIA_PRIVATE_KEY:
        INIT_ERROR = "SEPOLIA_PRIVATE_KEY is missing."
        print("Warning: SEPOLIA_PRIVATE_KEY not set. Blockchain features are disabled.")
        return

    try:
        candidate_web3 = Web3(Web3.HTTPProvider(SEPOLIA_RPC_URL))
        if not candidate_web3.is_connected():
            INIT_ERROR = f"Could not connect to Sepolia RPC at {SEPOLIA_RPC_URL}"
            print(f"Warning: Failed to connect to the Sepolia network at {SEPOLIA_RPC_URL}")
            return

        chain_id = candidate_web3.eth.chain_id
        if chain_id != 11155111:
            INIT_ERROR = f"Connected chain ID {chain_id} is not Sepolia (11155111)."
            print(f"Warning: Connected network is not Sepolia: chain_id={chain_id}")
            return

        # Add POA middleware for Sepolia compatibility
        candidate_web3.middleware_onion.inject(geth_poa_middleware, layer=0)

        candidate_deployer = candidate_web3.eth.account.from_key(SEPOLIA_PRIVATE_KEY)
        candidate_account = candidate_deployer

        checksum_address = to_checksum_address(SEPOLIA_CONTRACT_ADDRESS)
        candidate_contract = candidate_web3.eth.contract(
            address=checksum_address,
            abi=supply_chain_abi,
        )

        web3 = candidate_web3
        deployer = candidate_deployer
        account = candidate_account
        supply_chain_contract = candidate_contract
        INIT_ERROR = None

        print(f"Connected to Sepolia network. Address: {deployer.address}")
        print(f"Supply Chain Contract address: {supply_chain_contract.address}")

    except Exception as e:
        INIT_ERROR = str(e)
        print(f"Warning: Blockchain initialization failed: {e}")
        web3 = None
        deployer = None
        account = None
        supply_chain_contract = None


def blockchain_ready() -> bool:
    return web3 is not None and supply_chain_contract is not None and account is not None


def ensure_blockchain_ready() -> None:
    if not blockchain_ready():
        raise RuntimeError(
            f"Blockchain is not initialized. {INIT_ERROR or 'Check SEPOLIA_RPC_URL, SEPOLIA_PRIVATE_KEY, and SEPOLIA_CONTRACT_ADDRESS.'}"
        )


def add_product(product_code, name, price, location_id, initial_quantity):
    try:
        ensure_blockchain_ready()

        transaction = supply_chain_contract.functions.addProduct(
            int(product_code),
            name,
            int(price),
            location_id,
            int(initial_quantity),
        ).build_transaction(
            {
                "chainId": 11155111,
                "gas": 3_000_000,
                "gasPrice": web3.to_wei("10", "gwei"),
                "nonce": web3.eth.get_transaction_count(account.address),
            }
        )

        signed_transaction = web3.eth.account.sign_transaction(transaction, SEPOLIA_PRIVATE_KEY)
        tx_hash = web3.eth.send_raw_transaction(signed_transaction.rawTransaction)
        tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

        if tx_receipt.get("status") == 1:
            print("Product added successfully.")
            return tx_receipt

        print("Failed to add product.")
        return tx_receipt

    except Exception as e:
        print(f"Error adding product: {e}")
        return None


def update_inventory(product_code, new_quantity):
    try:
        ensure_blockchain_ready()

        transaction = supply_chain_contract.functions.updateInventory(
            int(product_code),
            int(new_quantity),
        ).build_transaction(
            {
                "chainId": 11155111,
                "gas": 3_000_000,
                "gasPrice": web3.to_wei("10", "gwei"),
                "nonce": web3.eth.get_transaction_count(account.address),
            }
        )

        signed_transaction = web3.eth.account.sign_transaction(transaction, SEPOLIA_PRIVATE_KEY)
        tx_hash = web3.eth.send_raw_transaction(signed_transaction.rawTransaction)
        tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

        if tx_receipt.get("status") == 1:
            print("Inventory updated successfully.")
            return tx_receipt

        print("Failed to update inventory.")
        return tx_receipt

    except Exception as e:
        print(f"Error updating inventory: {e}")
        return None


def get_product(product_code):
    try:
        ensure_blockchain_ready()
        return supply_chain_contract.functions.getProduct(int(product_code)).call()
    except Exception as e:
        print(f"Error retrieving product: {e}")
        return None


def get_inventory(product_code):
    try:
        ensure_blockchain_ready()
        return supply_chain_contract.functions.getInventory(int(product_code)).call()
    except Exception as e:
        print(f"Error retrieving inventory: {e}")
        return None


def get_all_products():
    try:
        ensure_blockchain_ready()

        product_count = supply_chain_contract.functions.productCount().call()
        products = []

        for i in range(product_count):
            product_code = supply_chain_contract.functions.productCodes(i).call()
            product = get_product(product_code)
            products.append(product)

        return products

    except Exception as e:
        print(f"Error retrieving all products: {e}")
        return None


# Helper functions for Django integration
def add_product_to_blockchain(product, quantity):
    try:
        return add_product(
            product.product_code,
            product.name,
            int(product.price),
            product.location.id,
            quantity,
        )
    except Exception as e:
        print(f"Error adding product to blockchain: {e}")
        return None


def update_inventory_on_blockchain(product_code, new_quantity):
    return update_inventory(product_code, new_quantity)


def get_product_from_blockchain(product_code):
    return get_product(product_code)


def get_inventory_from_blockchain(product_code):
    return get_inventory(product_code)


def get_all_products_from_blockchain():
    return get_all_products()


# Initialize safely on import, but never crash Django startup
_initialize_blockchain()


if __name__ == "__main__":
    print("Blockchain module test run")
    print(f"Connected: {blockchain_ready()}")
    if deployer:
        print(f"Deployer address: {deployer.address}")
    if supply_chain_contract:
        print(f"Supply Chain Contract address: {supply_chain_contract.address}")