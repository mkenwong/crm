import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  SimpleGrid,
  ThemeIcon,
  Badge,
  Indicator,
  Tooltip,
} from "@mantine/core";
import {
  IconUsers,
  IconPackage,
  IconShoppingCart,
  IconChartBar,
} from "@tabler/icons-react";
import { API_URL } from "../config/env";

const features = [
  {
    icon: IconUsers,
    title: "Customer Management",
    description:
      "Track and manage your customer relationships. Store contacts, companies, and interaction history in one place.",
  },
  {
    icon: IconPackage,
    title: "Product Catalog",
    description:
      "Maintain a complete inventory of hardware products with SKUs, pricing, and real-time stock levels.",
  },
  {
    icon: IconShoppingCart,
    title: "Sales Orders",
    description:
      "Create, track, and fulfill sales orders from quote to delivery with full status visibility.",
  },
  {
    icon: IconChartBar,
    title: "Reporting",
    description:
      "Gain insights into your sales pipeline with dashboards and reports that drive smarter decisions.",
  },
];

type ApiStatus = "checking" | "online" | "offline";

function useApiStatus(intervalMs = 30_000): ApiStatus {
  const [status, setStatus] = useState<ApiStatus>("checking");

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${API_URL}/api/health`, {
          signal: AbortSignal.timeout(5_000),
        });
        setStatus(res.ok ? "online" : "offline");
      } catch {
        setStatus("offline");
      }
    };

    check();
    const id = setInterval(check, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return status;
}

const statusConfig: Record<ApiStatus, { color: string; label: string }> = {
  checking: { color: "gray", label: "Checking API..." },
  online: { color: "teal", label: "API Online" },
  offline: { color: "red", label: "API Offline" },
};

export function LandingPage() {
  const apiStatus = useApiStatus();
  const { color, label } = statusConfig[apiStatus];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 50%)",
      }}
    >
      <Container size="lg" py={80}>
        <Stack align="center" gap="xl">
          <Group gap="sm">
            <Badge size="lg" variant="light" color="blue" radius="sm">
              Hardware Factory CRM
            </Badge>
            <Tooltip label={label}>
              <Indicator
                color={color}
                size={10}
                processing={apiStatus === "checking"}
                position="middle-end"
                offset={-2}
              >
                <Badge size="lg" variant="light" color={color} radius="sm">
                  {label}
                </Badge>
              </Indicator>
            </Tooltip>
          </Group>

          <Title
            ta="center"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.2 }}
          >
            Manage your sales
            <br />
            <Text
              component="span"
              inherit
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
            >
              from factory to customer
            </Text>
          </Title>

          <Text
            size="xl"
            c="dimmed"
            ta="center"
            maw={600}
            style={{ lineHeight: 1.6 }}
          >
            A streamlined CRM built for hardware manufacturers. Track customers,
            manage inventory, process orders, and monitor performance — all in
            one place.
          </Text>

          <Group mt="md">
            <Button size="lg" radius="md">
              Get Started
            </Button>
            <Button size="lg" variant="light" radius="md">
              Learn More
            </Button>
          </Group>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" mt={80}>
          {features.map((feature) => (
            <Card
              key={feature.title}
              shadow="sm"
              padding="xl"
              radius="md"
              withBorder
            >
              <ThemeIcon size={48} radius="md" variant="light" color="blue">
                <feature.icon size={24} stroke={1.5} />
              </ThemeIcon>
              <Text size="lg" fw={600} mt="md">
                {feature.title}
              </Text>
              <Text size="sm" c="dimmed" mt="xs" style={{ lineHeight: 1.6 }}>
                {feature.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>

        <Text ta="center" c="dimmed" size="sm" mt={80}>
          &copy; {new Date().getFullYear()} HardwareCRM. Built with React,
          Mantine &amp; Express.
        </Text>
      </Container>
    </div>
  );
}
