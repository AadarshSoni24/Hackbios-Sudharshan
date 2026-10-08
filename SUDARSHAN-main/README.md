# Dark Web Threat Intelligence Entity Extractor

A Python threat intelligence tool for extracting cyber threat indicators (cryptocurrency wallet addresses, PGP keys, email addresses, and `.onion` links) from live dark web `.onion` services (via Tor SOCKS5 proxy) or archived local html/text datasets.

---

## ⚡ Features

- **Entity Extraction**: Automatically extracts indicators using regular expressions:
  - **Cryptocurrency Wallets**: Bitcoin (BTC), Ethereum (ETH), Monero (XMR)
  - **PGP Public Key Blocks**
  - **Email Addresses**
  - **`.onion` v3 Domains**
- **Dual Scanning Modes**:
  - **Live URL Mode (`--url`)**: Connects to `.onion` or clearnet sites via Tor SOCKS5 proxy with configurable crawl depth, page caps, cross-domain safety controls, and request throttling delays.
  - **Local Dataset Mode (`--local`)**: Recursively scans local HTML, text, JSON, CSV, and TSV dump folders.
- **Export Formats**: Outputs findings into structured **JSON** and **CSV** reports timestamped in `./output/`.

---

## 📋 Requirements & Setup

### Prerequisites
- Python 3.8+
- [Tor Service](https://www.torproject.org/) running locally on default SOCKS port `127.0.0.1:9050` (or Tor Browser on `127.0.0.1:9150` if configured).

### Installation

1. **Clone the repository:**
   ```bash
   git clone <YOUR-GITHUB-REPO-URL>
   cd Dark-Web-Scraper
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

---

## 🚀 Usage

### 1. Live Tor URL Mode

Crawl a live `.onion` service:
```bash
python Scraper.py --url "http://examplexxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.onion" --max-depth 1 --max-pages 5 --delay 2.0
```

#### Command Options for `--url`:
- `--max-depth`: Crawl depth (0 = start URL only, 1 = start URL + direct links).
- `--max-pages`: Total page limit safety cap (default: 10).
- `--delay`: Delay between requests in seconds (default: 2.0s).
- `--allow-cross-domain`: Enable following links across different domains (OpSec warning!).

### 2. Local Dataset Scan Mode

Recursively extract entities from a local directory of archived dark web dumps:
```bash
python Scraper.py --local "./data_dump"
```

---

## 🛡️ Operational Security & Disclaimer

> **Disclaimer**: This tool is designed strictly for authorized cyber threat intelligence, security research, and defensive operational security analysis. Ensure compliance with local laws and organizational policies when conducting network scans over the Tor network.
