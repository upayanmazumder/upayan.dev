import type { StackGroup } from './types';

/** `icon` is a simple-icons export name; missing icons render a monogram. */
export const stack: StackGroup[] = [
  {
    label: 'Languages',
    items: [
      { name: 'TypeScript', icon: 'siTypescript' },
      { name: 'Go', icon: 'siGo' },
      { name: 'Python', icon: 'siPython' },
      { name: 'Java', icon: 'siOpenjdk' },
      { name: 'SQL', icon: 'siPostgresql' },
    ],
  },
  {
    label: 'Frameworks',
    items: [
      { name: 'React', icon: 'siReact' },
      { name: 'Next.js', icon: 'siNextdotjs' },
      { name: 'FastAPI', icon: 'siFastapi' },
      { name: 'Tailwind CSS', icon: 'siTailwindcss' },
    ],
  },
  {
    label: 'Data',
    items: [
      { name: 'PostgreSQL', icon: 'siPostgresql' },
      { name: 'MongoDB', icon: 'siMongodb' },
      { name: 'Redis', icon: 'siRedis' },
    ],
  },
  {
    label: 'Infrastructure',
    items: [
      { name: 'Docker', icon: 'siDocker' },
      { name: 'Kubernetes', icon: 'siKubernetes' },
      { name: 'Argo CD', icon: 'siArgo' },
      { name: 'KEDA' },
      { name: 'GitHub Actions', icon: 'siGithubactions' },
      { name: 'Terraform', icon: 'siTerraform' },
      { name: 'Linux', icon: 'siLinux' },
      { name: 'Cloudflare', icon: 'siCloudflare' },
    ],
  },
];
