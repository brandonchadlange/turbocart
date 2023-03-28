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
import Link from "next/link";

export default function Home() {
  return (
    // <AppShell padding={0}>
    //   <BackgroundImage src="banner.jpg" h="100vh">
    //     <Overlay>
    //       <Stack align="stretch" justify="center" h="100%" w="100%" px={60}>
    //         <Flex justify="end">
    //           <Flex gap="md">
    //             <Button color="yellow" variant="outline" radius="xl">
    //               View order
    //             </Button>
    //           </Flex>
    //         </Flex>
    //         <Card w={1000} bg="transparent" p={0}>
    //           <Title color="white" size={80} style={{ lineHeight: "62px" }}>
    //             Kids Lunch? <br />
    //             <Text color="yellow">Sorted!</Text>
    //           </Title>
    //           <Text size={40} color="white" mt="lg" maw={500}>
    //             Order your childrens meals up to two weeks in advance!
    //           </Text>
    //           <Flex gap="md" mt={40}>
    //             <Button
    //               component={Link}
    //               href="/students"
    //               w={180}
    //               radius="xl"
    //               color="yellow"
    //               style={{ color: "black" }}
    //               size="lg"
    //             >
    //               Place order
    //             </Button>
    //           </Flex>
    //         </Card>
    //       </Stack>
    //     </Overlay>
    //   </BackgroundImage>
    // </AppShell>
    <AppShell padding={0}>
      <BackgroundImage src="banner.jpg" h="100vh">
        <Overlay>
          <Stack align="stretch" justify="center" h="100%" w="100%" px={30}>
            <Title color="white" size={50} style={{ lineHeight: "62px" }}>
              Kids Lunch? <br />
              <Text color="yellow">Sorted!</Text>
            </Title>
            <Text size={20} color="white" mt="lg" maw={500}>
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
          </Stack>
        </Overlay>
      </BackgroundImage>
    </AppShell>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const sessionId = getCookie("session", { req, res });
  const host = req.headers.host!;
  const merchantId = host.split(".")[0];

  if (sessionId === undefined) {
    try {
      const session = await dbInstance.session.create({
        data: {
          createdAt: new Date(),
          merchantId,
        },
      });

      setCookie("session", session.id, { req, res });
    } catch (err) {
      console.error("failed to create session: ", err);
    }
  }

  return {
    props: {},
  };
};
