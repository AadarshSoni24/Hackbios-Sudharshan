import os
import shodan
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# Shodan API Key (Can be set in .env)
# For hackathon demo purposes, if this is empty, we will use realistic mock data
SHODAN_API_KEY = os.environ.get("SHODAN_API_KEY", "")

try:
    api = shodan.Shodan(SHODAN_API_KEY) if SHODAN_API_KEY else None
except Exception:
    api = None

def enrich_ip_with_shodan(ip_address: str) -> Optional[Dict[str, Any]]:
    """
    Queries Shodan API to get real-world location and ISP for an IP address.
    Falls back to realistic mock data if API key is not present (for demo purposes).
    """
    if not ip_address:
        return None

    # Hackathon Demo / Mock Data fallback
    # If we don't have a valid API key, we simulate the Shodan response
    # to demonstrate the De-anonymization capability.
    if not api:
        logger.warning(f"No Shodan API Key found. Returning mock Shodan data for {ip_address}")
        return _get_mock_shodan_data(ip_address)

    try:
        # Live Shodan API Call
        host = api.host(ip_address)
        return {
            "ip_str": host.get("ip_str"),
            "isp": host.get("isp", "Unknown ISP"),
            "org": host.get("org", "Unknown Org"),
            "country_name": host.get("country_name", "Unknown Country"),
            "city": host.get("city", "Unknown City"),
            "ports": host.get("ports", []),
            "hostnames": host.get("hostnames", []),
            "asn": host.get("asn", ""),
            "vulns": host.get("vulns", []),
            "is_mock": False
        }
    except shodan.APIError as e:
        logger.error(f"Shodan API Error for IP {ip_address}: {e}")
        # Fallback to mock on API error (e.g. rate limit, invalid key)
        return _get_mock_shodan_data(ip_address)
    except Exception as e:
        logger.error(f"Unexpected error querying Shodan: {e}")
        return None

def _get_mock_shodan_data(ip_address: str) -> Dict[str, Any]:
    """
    Provides realistic mock data for SIH Demo presentation.
    """
    # Deterministic mock based on IP prefix for variety
    if ip_address.startswith("185.") or ip_address.startswith("192."):
        return {
            "ip_str": ip_address,
            "isp": "DigitalOcean, LLC",
            "org": "DigitalOcean, LLC",
            "country_name": "Germany",
            "city": "Frankfurt",
            "ports": [22, 80, 443],
            "hostnames": [f"vps-{ip_address.replace('.', '-')}.digitalocean.com"],
            "asn": "AS14061",
            "vulns": ["CVE-2014-0160"], # Heartbleed
            "is_mock": True
        }
    elif ip_address.startswith("45.") or ip_address.startswith("104."):
        return {
            "ip_str": ip_address,
            "isp": "Cloudflare, Inc.",
            "org": "Cloudflare",
            "country_name": "United States",
            "city": "San Francisco",
            "ports": [80, 443, 8080],
            "hostnames": [],
            "asn": "AS13335",
            "vulns": [],
            "is_mock": True
        }
    else:
        return {
            "ip_str": ip_address,
            "isp": "Hostinger International",
            "org": "Hostinger",
            "country_name": "Russia",
            "city": "Moscow",
            "ports": [22, 80, 3306],
            "hostnames": ["server1.hostinger.ru"],
            "asn": "AS47583",
            "vulns": ["CVE-2021-44228"], # Log4j
            "is_mock": True
        }
