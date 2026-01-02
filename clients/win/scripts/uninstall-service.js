try {
	const Service = require("node-windows").Service;
	const svc = new Service({
		name: "UpayanDeviceClient",
		script: require("path").join(__dirname, "..", "dist", "index.js"),
	});

	svc.on("uninstall", function () {
		console.log("Service uninstalled");
	});

	svc.on("alreadyuninstalled", function () {
		console.log("Service already uninstalled");
	});

	svc.uninstall();
} catch (err) {
	console.error(
		"node-windows not available. Run `npm i node-windows` and retry."
	);
	console.error(err);
	process.exit(1);
}
