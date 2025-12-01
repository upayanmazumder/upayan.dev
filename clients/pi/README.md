# Raspberry Pi device-status client (Python)

This client uses `psutil` and `requests`. Place configuration at `/etc/pi-client/config.json` with `deviceId`, `token`, and `apiHost`.

Install dependencies:

```bash
sudo apt update
sudo apt install -y python3-pip
pip3 install psutil requests
```

Run (development):

```bash
python3 clients/pi/client.py
```

Systemd service (example named `pi-client.service`) is provided in the repo.
