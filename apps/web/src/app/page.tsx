import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Divider,
} from '@heroui/react';

const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Analysis',
    description: 'Intelligent job description parsing and skill gap identification.',
    phase: 'Phase 2',
  },
  {
    icon: '📄',
    title: 'Smart Resume Tailoring',
    description: 'Automatically adapt your resume for each job application.',
    phase: 'Phase 3',
  },
  {
    icon: '✉️',
    title: 'Cover Letter Generator',
    description: 'Generate compelling, personalized cover letters in seconds.',
    phase: 'Phase 3',
  },
  {
    icon: '📊',
    title: 'Application Tracker',
    description: 'Track every application stage from bookmarked to offered.',
    phase: 'Phase 4',
  },
];

const stack = [
  { label: 'Next.js 15', color: 'default' as const },
  { label: 'TypeScript', color: 'primary' as const },
  { label: 'Hero UI', color: 'secondary' as const },
  { label: 'Tailwind CSS', color: 'success' as const },
  { label: 'Express.js', color: 'warning' as const },
  { label: 'Turborepo', color: 'danger' as const },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar
        isBordered
        classNames={{
          base: 'bg-background/70 backdrop-blur-md',
        }}
      >
        <NavbarBrand>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI Job Copilot
          </span>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Chip color="success" variant="dot" size="sm">
              Phase 1 Complete
            </Chip>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Hero Section */}
      <main className="container mx-auto max-w-5xl px-6 py-20">
        <div className="text-center mb-16">
          <Chip color="primary" variant="flat" className="mb-4">
            🚀 Monorepo Foundation · Phase 1
          </Chip>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            AI Job Application Copilot
          </h1>
          <p className="text-xl text-default-500 max-w-2xl mx-auto leading-relaxed">
            Your intelligent assistant for crafting tailored job applications, analyzing job
            descriptions, and accelerating your career growth.
          </p>
          <div className="flex gap-4 justify-center mt-8 flex-wrap">
            {stack.map(item => (
              <Chip key={item.label} color={item.color} variant="flat" size="sm">
                {item.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="border-none bg-gradient-to-br from-primary/10 to-primary/5">
            <CardBody className="p-5">
              <p className="text-sm text-default-500 mb-1">Frontend</p>
              <p className="text-2xl font-bold text-primary">Running</p>
              <p className="text-xs text-default-400 mt-1">Next.js + Hero UI ✓</p>
            </CardBody>
          </Card>
          <Card className="border-none bg-gradient-to-br from-secondary/10 to-secondary/5">
            <CardBody className="p-5">
              <p className="text-sm text-default-500 mb-1">API Server</p>
              <p className="text-2xl font-bold text-secondary">Port 4000</p>
              <p className="text-xs text-default-400 mt-1">Express + TypeScript ✓</p>
            </CardBody>
          </Card>
          <Card className="border-none bg-gradient-to-br from-success/10 to-success/5">
            <CardBody className="p-5">
              <p className="text-sm text-default-500 mb-1">Monorepo</p>
              <p className="text-2xl font-bold text-success">Active</p>
              <p className="text-xs text-default-400 mt-1">Turborepo + npm workspaces ✓</p>
            </CardBody>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-2">Planned Features</h2>
          <p className="text-center text-default-500 text-sm mb-8">
            Upcoming phases of the AI Job Application Copilot
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map(feature => (
              <Card
                key={feature.title}
                className="border border-default-100 hover:border-primary/50 transition-colors duration-200"
              >
                <CardHeader className="pb-2 flex gap-3 items-start">
                  <span className="text-2xl">{feature.icon}</span>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{feature.title}</p>
                      <Chip size="sm" variant="flat" color="primary" className="text-xs">
                        {feature.phase}
                      </Chip>
                    </div>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="pt-3">
                  <p className="text-sm text-default-500">{feature.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Health Check CTA */}
        <div className="text-center">
          <Card className="inline-block border border-default-100 max-w-md">
            <CardBody className="p-6">
              <p className="text-sm text-default-500 mb-3">Verify the API is running</p>
              <Button
                as="a"
                href="http://localhost:4000/api/health"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                variant="flat"
                size="sm"
              >
                GET /api/health →
              </Button>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
