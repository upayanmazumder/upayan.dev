import json
import time
import requests
from system import collect_system_info
from network import get_local_ip, get_public_ip

CONFIG_PATH = '/etc/pi-client/config.json'

def load_config():
    try:
        with open(CONFIG_PATH, 'r') as f:
            return json.load(f)
    except Exception:
        # fallback to repo config for development
        try:
            with open('clients/pi/config.json', 'r') as f:
                return json.load(f)
        except Exception:
            raise

def send_update(cfg, status):
    url = cfg.get('apiHost', 'https://<MY_API>').rstrip('/') + '/device/update'
    headers = {'Authorization': f"Bearer {cfg.get('token','')}", 'Content-Type': 'application/json'}
    try:
        r = requests.post(url, json={'deviceId': cfg.get('deviceId',''), 'status': status}, headers=headers, timeout=10)
        r.raise_for_status()
    except Exception as e:
        print('send_update failed:', e)

def main():
    cfg = load_config()
    interval = cfg.get('intervalSeconds', 60)
    while True:
        try:
            sys = collect_system_info()
            net = {'local': get_local_ip(), 'public': get_public_ip()}
            payload = {
                'timestamp': time.time(),
                'system': sys,
                'network': net
            }
            send_update(cfg, payload)
        except Exception as e:
            print('Main loop error:', e)
        time.sleep(interval)

if __name__ == '__main__':
    main()
