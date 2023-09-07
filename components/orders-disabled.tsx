import {
  AppShell,
  BackgroundImage,
  Box,
  Button,
  Flex,
  Overlay,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";

export function OrdersDisabled() {
  return (
    <AppShell padding={0}>
      <BackgroundImage src="banner.jpg" h="100vh">
        <Overlay>
          <Stack align="center" justify="center" h="100%" w="100%" px={30}>
            <Box maw="400px">
              {/* <Title color="white" size={50} style={{ lineHeight: "62px" }}>
                Kids Lunch? <br />
                <Text color="yellow">Sorted!</Text>
              </Title> */}
              <Text size={30} weight="bold" color="white" mt="lg" maw={500}>
                Online orders are currently disabled!
                <br />
                <br />
                But don't worry, we'll be back soon! 😁
              </Text>
            </Box>
          </Stack>
        </Overlay>
      </BackgroundImage>
    </AppShell>
  );
}
