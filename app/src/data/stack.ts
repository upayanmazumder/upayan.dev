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
      { name: 'JavaScript', icon: 'siJavascript' },
      { name: 'Go', icon: 'siGo' },
      { name: 'Rust', icon: 'siRust' },
      { name: 'Python', icon: 'siPython' },
      { name: 'Java', icon: 'siOpenjdk' },
      { name: 'C++', icon: 'siCplusplus' },
      { name: 'Bash', icon: 'siGnubash' },
      { name: 'SQL', icon: 'siPostgresql' },
    ],
  },
  {
    label: 'Frameworks',
    items: [
      { name: 'React', icon: 'siReact' },
      { name: 'Next.js', icon: 'siNextdotjs' },
      { name: 'Tailwind CSS', icon: 'siTailwindcss' },
      { name: 'GSAP', icon: 'siGsap' },
      { name: 'Express', icon: 'siExpress' },
      { name: 'FastAPI', icon: 'siFastapi' },
      { name: 'Flask', icon: 'siFlask' },
      { name: 'Axum' },
      { name: 'gRPC' },
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
      { name: 'pandas', icon: 'siPandas' },
      { name: 'NumPy', icon: 'siNumpy' },
      { name: 'scikit-learn', icon: 'siScikitlearn' },
    ],
  },
  {
    label: 'Infrastructure',
    items: [
      { name: 'Docker', icon: 'siDocker' },
      { name: 'Kubernetes', icon: 'siKubernetes' },
      { name: 'Helm', icon: 'siHelm' },
      { name: 'Argo CD', icon: 'siArgo' },
      { name: 'KEDA' },
      { name: 'Traefik', icon: 'siTraefikproxy' },
      { name: 'OpenTofu', icon: 'siOpentofu' },
      { name: 'Terraform', icon: 'siTerraform' },
      { name: 'Ansible', icon: 'siAnsible' },
      { name: 'Hetzner Cloud', icon: 'siHetzner' },
      { name: 'Cloudflare', icon: 'siCloudflare' },
      { name: 'GitHub Actions', icon: 'siGithubactions' },
      { name: 'Linux', icon: 'siLinux' },
    ],
  },
  {
    label: 'Observability',
    items: [
      { name: 'Prometheus', icon: 'siPrometheus' },
      { name: 'Grafana', icon: 'siGrafana' },
      { name: 'Loki' },
      { name: 'OpenTelemetry', icon: 'siOpentelemetry' },
    ],
  },
];
