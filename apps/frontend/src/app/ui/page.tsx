import Link from "next/link";
import {
	ColorPalette,
	Button,
	Code,
	Input,
	Textarea,
	Select,
} from "@/components/ui";

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

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-2">
								Inline Code
							</label>
							<p className="text-foreground">
								Use <Code>const</Code> or <Code>let</Code> to declare variables
								in JavaScript.
							</p>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium mb-2">
									JavaScript
								</label>
								<Code block language="javascript">{`function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`}</Code>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">
									TypeScript
								</label>
								<Code block language="typescript">{`interface User {
  id: number;
  name: string;
  email: string;
}

const createUser = (data: User): User => {
  return { ...data };
};`}</Code>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">Python</label>
								<Code block language="python">{`def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))`}</Code>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">Go</label>
								<Code block language="go">{`package main

import "fmt"

func main() {
    message := "Hello, Go!"
    fmt.Println(message)
}`}</Code>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">Java</label>
								<Code block language="java">{`public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`}</Code>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">C++</label>
								<Code block language="cpp">{`#include <iostream>

int main() {
    std::cout << "Hello, C++!" << std::endl;
    return 0;
}`}</Code>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">C</label>
								<Code block language="c">{`#include <stdio.h>

int main() {
    printf("Hello, C!\\n");
    return 0;
}`}</Code>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">YAML</label>
								<Code block language="yaml">{`version: '3.8'
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production`}</Code>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">MATLAB</label>
								<Code block language="matlab">{`x = linspace(0, 2*pi, 100);
y = sin(x);
plot(x, y);
title('Sine Wave');
xlabel('x');
ylabel('sin(x)');`}</Code>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">Rust</label>
								<Code block language="rust">{`fn main() {
    let message = "Hello, Rust!";
    println!("{}", message);
}`}</Code>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">SQL</label>
								<Code block language="sql">{`SELECT users.name, orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id
WHERE orders.total > 100
ORDER BY orders.total DESC;`}</Code>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">JSON</label>
								<Code block language="json">{`{
  "name": "upayan.dev",
  "version": "5.0.0",
  "dependencies": {
    "react": "^19.0.0",
    "next": "^15.0.0"
  }
}`}</Code>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
