import {
  AppShell,
  Button,
  Flex,
  Header,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { Hammersmith_One } from "next/font/google";
import PageHeader from "@/components/page-header";

const hammerSmithOne = Hammersmith_One({
  weight: "400",
  subsets: ["latin"],
});

const OrderSuccessPage = () => {
  return (
    <AppShell>
      <Stack align="center">
        <video height="300px" src="order-success.mp4" muted autoPlay loop />
        <Title className={hammerSmithOne.className}>Success!</Title>
        <Text size="xl" maw={300} align="center">
          Your payment was successful and your order has been placed.
        </Text>
        <Button
          className={hammerSmithOne.className}
          size="lg"
          color="yellow"
          radius="xl"
          mt="lg"
          component={Link}
          href="/"
        >
          Back to home
        </Button>
      </Stack>
    </AppShell>
  );
};

export default OrderSuccessPage;
