export function Total({ value }: { value: number }) {
  return (
    <span className="font-mono font-medium text-foreground tabular-nums">
      {value.toLocaleString('en-US')}
    </span>
  );
}
