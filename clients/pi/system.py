import psutil
import time
import os

def read_cpu_temp():
    # Try psutil first
    try:
        temps = psutil.sensors_temperatures()
        for k in temps:
            if temps[k]:
                return temps[k][0].current
    except Exception:
        pass

    # Fallback for Raspberry Pi
    try:
        with open('/sys/class/thermal/thermal_zone0/temp', 'r') as f:
            v = int(f.read().strip())
            return v / 1000.0
    except Exception:
        return None

def collect_system_info():
    return {
        'cpu_percent': psutil.cpu_percent(interval=0.5),
        'per_cpu': psutil.cpu_percent(interval=0.1, percpu=True),
        'cpu_temp': read_cpu_temp(),
        'memory': psutil.virtual_memory()._asdict(),
        'disk': psutil.disk_usage('/')._asdict(),
        'uptime_seconds': time.time() - psutil.boot_time(),
        'hostname': os.uname().nodename
    }
