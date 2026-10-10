import requests
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

def enrich_wallet(wallet_address: str, crypto_type: str = "bitcoin") -> Optional[Dict[str, Any]]:
    """
    Queries public blockchain APIs to get transaction counts and balance.
    Falls back to realistic mock data if the API is rate-limited or fails.
    """
    if crypto_type != "bitcoin":
        # Only BTC is supported for live public API right now
        return _get_mock_wallet_data(wallet_address, crypto_type)

    try:
        # Use blockchain.info public API for Bitcoin
        url = f"https://blockchain.info/rawaddr/{wallet_address}"
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            # Blockchain.info returns values in Satoshi (1 BTC = 100,000,000 Satoshi)
            final_balance_btc = data.get("final_balance", 0) / 100000000.0
            total_received_btc = data.get("total_received", 0) / 100000000.0
            n_tx = data.get("n_tx", 0)
            
            return {
                "wallet": wallet_address,
                "currency": "BTC",
                "balance": f"{final_balance_btc:.4f} BTC",
                "total_received": f"{total_received_btc:.4f} BTC",
                "transactions": n_tx,
                "is_mock": False
            }
        else:
            logger.warning(f"Blockchain API rate-limited or failed for {wallet_address}. Falling back to mock data.")
            return _get_mock_wallet_data(wallet_address, crypto_type)
            
    except Exception as e:
        logger.error(f"Error querying Blockchain API for {wallet_address}: {e}")
        return _get_mock_wallet_data(wallet_address, crypto_type)

def _get_mock_wallet_data(wallet_address: str, crypto_type: str) -> Dict[str, Any]:
    """
    Provides realistic mock data for SIH Demo presentation.
    """
    # Deterministic mock based on the first few characters of the wallet
    if wallet_address.startswith("bc1q") or wallet_address.startswith("1A"):
        return {
            "wallet": wallet_address,
            "currency": "BTC",
            "balance": "3.4500 BTC",
            "total_received": "12.8900 BTC",
            "transactions": 42,
            "is_mock": True
        }
    elif wallet_address.startswith("0x"):
        return {
            "wallet": wallet_address,
            "currency": "ETH",
            "balance": "14.50 ETH",
            "total_received": "150.00 ETH",
            "transactions": 118,
            "is_mock": True
        }
    else:
        return {
            "wallet": wallet_address,
            "currency": "XMR" if crypto_type == "monero" else "BTC",
            "balance": "0.8500 BTC",
            "total_received": "1.2000 BTC",
            "transactions": 5,
            "is_mock": True
        }
