import {
  AppShell,
  BackgroundImage,
  Button,
  Flex,
  Overlay,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";

export default function HomePage() {
  return (
    <AppShell padding={0}>
      <BackgroundImage src="banner.jpg" h="100vh">
        <Overlay>
          <Stack align="stretch" justify="center" h="100%" w="100%" px={30}>
            <Title color="white" size={50} style={{ lineHeight: "62px" }}>
              Kids Lunch? <br />
              <Text color="yellow">Sorted!</Text>
            </Title>
            <Text size={30} weight="bold" color="white" mt="lg" maw={500}>
              Order your childrens meals up to a week in advance!
            </Text>
            <Flex gap="md" mt={40}>
              <Button
                component={Link}
                href="/students"
                w={180}
                radius="xl"
                color="yellow"
                style={{ color: "black" }}
                size="lg"
              >
                Place order
              </Button>
            </Flex>
          </Stack>
        </Overlay>
      </BackgroundImage>
    </AppShell>
  );
}
