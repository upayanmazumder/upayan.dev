import si from "systeminformation";

export async function collectSystemInfo(topN = 10) {
	const [cpuLoad, mem, osInfo, time, processes, battery, cpuTemp, graphics] =
		await Promise.all([
			si.currentLoad(),
			si.mem(),
			si.osInfo(),
			si.time(),
			si.processes(),
			si.battery(),
			si.cpuTemperature(),
			si.graphics(),
		]);

	const top = processes.list
		.sort((a, b) => (b.cpu || 0) - (a.cpu || 0))
		.slice(0, topN)
		.map((p) => ({ pid: p.pid, name: p.name, cpu: p.cpu, mem: p.mem }));

	const gpus = (graphics.controllers || []).map((g) => ({
		model: g.model,
		vendor: g.vendor,
		temperature: g.temperatureGpu,
	}));

	return {
		cpu: {
			load: cpuLoad.currentLoad,
			cores: cpuLoad.cpus?.map((c) => c.load),
		},
		cpuTemperature: cpuTemp?.main ?? null,
		memory: {
			total: mem.total,
			free: mem.free,
			used: mem.active,
		},
		uptime: time.uptime,
		battery: {
			hasBattery: battery.hasBattery,
			percent: battery.percent,
			charging: battery.isCharging,
		},
		processes: top,
		gpus,
	};
}
