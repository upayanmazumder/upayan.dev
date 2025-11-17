import { ColorPalette } from "@/components/ui";

export default function Page() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<h1 className="p-6 text-2xl font-bold">Color Palette</h1>
			<ColorPalette />
		</div>
	);
}
