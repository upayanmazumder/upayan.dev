import Link from "next/link";
import { ColorPalette, Button, Input, Textarea, Select } from "@/components/ui";

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Link href="#color-palette">
        <h1 id="color-palette" className="p-6 text-2xl font-bold">
          Color Palette
        </h1>
      </Link>
      <ColorPalette />

      <section className="p-6">
        <h2 className="text-xl font-semibold mb-4">Primitives</h2>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button>Default</Button>
            <Button>Primary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </div>

          <div className="flex items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">
              All Button Combinations
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <Button>Default</Button>
              <Button variant="ghost">Ghost</Button>
              <Button disabled>Disabled</Button>

              <Button size="sm">Default sm</Button>
              <Button size="sm" variant="ghost">
                Ghost sm
              </Button>
              <Button size="sm" disabled>
                Disabled sm
              </Button>

              <Button size="lg">Default lg</Button>
              <Button size="lg" variant="ghost">
                Ghost lg
              </Button>
              <Button size="lg" disabled>
                Disabled lg
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Input</label>
              <Input placeholder="Type something..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Select</label>
              <Select
                options={[
                  { value: "", label: "Choose..." },
                  { value: "one", label: "One" },
                  { value: "two", label: "Two" },
                ]}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Textarea</label>
            <Textarea placeholder="Write something longer..." />
          </div>
        </div>
      </section>
    </div>
  );
}
