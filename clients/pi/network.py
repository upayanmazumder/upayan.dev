import socket
import requests

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # connect to public address to determine local interface
        s.connect(('8.8.8.8', 80))
        return s.getsockname()[0]
    except Exception:
        return None
    finally:
        s.close()

def get_public_ip():
    try:
        r = requests.get('https://api.ipify.org?format=json', timeout=5)
        return r.json().get('ip')
    except Exception:
        return None
