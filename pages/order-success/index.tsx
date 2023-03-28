import { AppShell, Button, Image, Stack, Text, Title } from "@mantine/core";
import { Hammersmith_One } from "next/font/google";
import Link from "next/link";

const hammerSmithOne = Hammersmith_One({
  weight: "400",
  subsets: ["latin"],
});

const OrderSuccessPage = () => {
  return (
    <AppShell>
      <Stack align="center">
        <Image height="300px" src="success.gif" />
        {/* <video height="300px" muted autoPlay loop>
          <source src="order-success.mp4" />
        </video> */}
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
