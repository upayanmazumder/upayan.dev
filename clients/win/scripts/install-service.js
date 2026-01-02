// Simple installer that registers this Node app as a Windows service using node-windows
try {
	const Service = require("node-windows").Service;

	const svc = new Service({
		name: "UpayanDeviceClient",
		description: "Upayan device status client (Win)",
		script: require("path").join(__dirname, "..", "dist", "index.js"),
		env: [{ name: "NODE_ENV", value: "production" }],
	});

	svc.on("install", function () {
		console.log("Service installed");
		svc.start();
	});

	svc.on("alreadyinstalled", function () {
		console.log("Service already installed");
	});

	svc.install();
} catch (err) {
	console.error(
		"node-windows not available. Run `npm i node-windows` and retry."
	);
	console.error(err);
	process.exit(1);
}
