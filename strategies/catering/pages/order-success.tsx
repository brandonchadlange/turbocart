import {
  Anchor,
  AppShell,
  Button,
  Container,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Hammersmith_One } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";

const hammerSmithOne = Hammersmith_One({
  weight: "400",
  subsets: ["latin"],
});

const OrderSuccessPage = () => {
  const router = useRouter();
  const orderId = router.query.orderId as string;

  return (
    <AppShell>
      <Container size="sm">
        <Stack align="center">
          <video height="300px" muted autoPlay loop>
            <source src="success.mp4" />
          </video>
          <Title className={hammerSmithOne.className}>Success!</Title>
          <Text size="xl" maw={350} align="center" color="dimmed">
            Your payment was successful and your order has been placed.
          </Text>
          <Text weight="bold" size="lg">
            Order ID:{" "}
            <Anchor component={Link} href={`/view-order?reference=${orderId}`}>
              {orderId}
            </Anchor>
          </Text>
          <Text size="sm">
            Please check your emails for a confirmation mail
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
      </Container>
    </AppShell>
  );
};

export default OrderSuccessPage;
