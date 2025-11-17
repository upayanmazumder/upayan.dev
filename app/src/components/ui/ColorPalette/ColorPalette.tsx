export default function ColorPalette() {
	const blues = [
		{ name: "secondary (base)", class: "bg-secondary", text: "text-white" },
		{ name: "secondary-100", class: "bg-secondary-100", text: "text-black" },
		{ name: "secondary-200", class: "bg-secondary-200", text: "text-black" },
		{ name: "secondary-300", class: "bg-secondary-300", text: "text-white" },
		{ name: "secondary-400", class: "bg-secondary-400", text: "text-white" },
		{ name: "secondary-500", class: "bg-secondary-500", text: "text-white" },
		{ name: "secondary-600", class: "bg-secondary-600", text: "text-white" },
		{ name: "secondary-700", class: "bg-secondary-700", text: "text-white" },
	];

	const grays = [
		{ name: "grey (base)", class: "bg-grey", text: "text-white" },
		{ name: "grey-100", class: "bg-grey-100", text: "text-black" },
		{ name: "grey-200", class: "bg-grey-200", text: "text-black" },
		{ name: "grey-300", class: "bg-grey-300", text: "text-black" },
		{ name: "grey-400", class: "bg-grey-400", text: "text-white" },
		{ name: "grey-500", class: "bg-grey-500", text: "text-white" },
		{ name: "grey-600", class: "bg-grey-600", text: "text-white" },
		{ name: "grey-700", class: "bg-grey-700", text: "text-white" },
	];

	return (
		<div className="space-y-10 p-6">
			{/* Blues */}
			<div>
				<h2 className="text-lg font-semibold mb-3">Blues</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
					{blues.map((c) => (
						<div
							key={c.name}
							className={`${c.class} ${c.text} rounded-xl p-4 flex items-center justify-center font-medium`}
						>
							{c.name}
						</div>
					))}
				</div>
			</div>

			{/* Grays */}
			<div>
				<h2 className="text-lg font-semibold mb-3">Grays</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
					{grays.map((c) => (
						<div
							key={c.name}
							className={`${c.class} ${c.text} rounded-xl p-4 flex items-center justify-center font-medium`}
						>
							{c.name}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
