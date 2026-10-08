import re
import hashlib

REGEX_BTC = re.compile(r'\b(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{25,62})\b')
REGEX_ETH = re.compile(r'\b(0x[a-fA-F0-9]{40})\b')
REGEX_XMR = re.compile(r'\b([48][0-9ABa-zA-Z]{94})\b')
REGEX_EMAIL = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b')
REGEX_ONION = re.compile(r'\b([a-z2-7]{56}\.onion)\b')
REGEX_IPV4 = re.compile(r'\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b')
REGEX_PGP_BLOCK = re.compile(r'-----BEGIN PGP PUBLIC KEY BLOCK-----([\s\S]+?)-----END PGP PUBLIC KEY BLOCK-----')

def calculate_sha256(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

def extract_entities_from_text(text: str) -> dict:
    entities = {
        "btc_wallets": list(set(REGEX_BTC.findall(text))),
        "eth_wallets": list(set(REGEX_ETH.findall(text))),
        "xmr_wallets": list(set(REGEX_XMR.findall(text))),
        "emails": list(set(REGEX_EMAIL.findall(text))),
        "onion_links": list(set(REGEX_ONION.findall(text))),
        "ips": [ip for ip in list(set(REGEX_IPV4.findall(text))) if not ip.startswith(("127.", "10.", "192.168.", "0."))],
        "pgp_blocks": len(REGEX_PGP_BLOCK.findall(text))
    }
    return entities
