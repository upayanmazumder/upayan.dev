import type { StackGroup } from './types';

/**
 * `icon` is a simple-icons export name; missing icons render a monogram.
 * Items come from the languages, package manifests, and infrastructure files in my GitHub repositories.
 */
export const stack: StackGroup[] = [
  {
    label: 'Languages',
    items: [
      { name: 'TypeScript', icon: 'siTypescript' },
      { name: 'Go', icon: 'siGo' },
      { name: 'Rust', icon: 'siRust' },
      { name: 'Python', icon: 'siPython' },
      { name: 'SQL', icon: 'siPostgresql' },
    ],
  },
  {
    label: 'Frameworks',
    items: [
      { name: 'React', icon: 'siReact' },
      { name: 'Next.js', icon: 'siNextdotjs' },
      { name: 'Node.js', icon: 'siNodedotjs' },
      { name: 'Tailwind CSS', icon: 'siTailwindcss' },
      { name: 'GSAP', icon: 'siGsap' },
      { name: 'Express', icon: 'siExpress' },
      { name: 'FastAPI', icon: 'siFastapi' },
    ],
  },
  {
    label: 'Data',
    items: [
      { name: 'PostgreSQL', icon: 'siPostgresql' },
      { name: 'MongoDB', icon: 'siMongodb' },
      { name: 'Redis', icon: 'siRedis' },
      { name: 'SQLite', icon: 'siSqlite' },
      { name: 'MinIO', icon: 'siMinio' },
      { name: 'Firebase', icon: 'siFirebase' },
    ],
  },
  {
    label: 'Infrastructure',
    items: [
      { name: 'Git', icon: 'siGit' },
      { name: 'Docker', icon: 'siDocker' },
      { name: 'Kubernetes', icon: 'siKubernetes' },
      { name: 'KEDA' },
      { name: 'Argo CD', icon: 'siArgo' },
      { name: 'Traefik', icon: 'siTraefikproxy' },
      { name: 'Terraform', icon: 'siTerraform' },
      { name: 'Ansible', icon: 'siAnsible' },
      { name: 'GitHub Actions', icon: 'siGithubactions' },
      { name: 'Cloudflare', icon: 'siCloudflare' },
      { name: 'Linux', icon: 'siLinux' },
    ],
  },
  {
    label: 'Observability & Security',
    items: [
      { name: 'Prometheus', icon: 'siPrometheus' },
      { name: 'Grafana', icon: 'siGrafana' },
      { name: 'Loki' },
      { name: 'OpenTelemetry', icon: 'siOpentelemetry' },
      { name: 'SOPS' },
      { name: 'Restic' },
    ],
  },
];
