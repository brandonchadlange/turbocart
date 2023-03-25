import dbInstance from "@/backend/db";
import {
  AppShell,
  BackgroundImage,
  Button,
  Card,
  Flex,
  Overlay,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { getCookie, setCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import WhiteLogo from "@/frontend/assets/logo-white.png";
import { Hammersmith_One } from "next/font/google";

const hammerSmithOne = Hammersmith_One({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <AppShell padding={0}>
      <BackgroundImage src="banner.jpg" h="100vh">
        <Overlay>
          <Stack align="stretch" justify="space-around" h="100%" px={60}>
            <Flex justify="space-between">
              <Flex gap="sm" w={1000} align="center">
                <Image alt="logo" src={WhiteLogo} height={30} width={30} />
                <Title
                  className={hammerSmithOne.className}
                  color="white"
                  size={30}
                >
                  Brain Fuel
                </Title>
              </Flex>
              <Flex gap="md">
                <Button color="yellow" variant="outline" radius="xl">
                  View order
                </Button>
              </Flex>
            </Flex>
            <Card w={1000} bg="transparent" p={0}>
              <Title color="white" size={80} style={{ lineHeight: "62px" }}>
                Kids Lunch? <br />
                <Text color="yellow">Sorted!</Text>
              </Title>
              <Text size={40} color="white" mt="lg" maw={500}>
                Order your childrens meals up to two weeks in advance!
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
            </Card>
          </Stack>
        </Overlay>
      </BackgroundImage>
    </AppShell>
  );
}

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   const sessionId = getCookie("session", { req, res });

//   if (sessionId === undefined) {
//     const session = await dbInstance.session.create({
//       data: {
//         createdAt: new Date(),
//       },
//     });

//     setCookie("session", session.id, { req, res });
//   }

//   return {
//     props: {},
//   };
// };
