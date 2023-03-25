import { Flex, Header, Title } from "@mantine/core";
import { Hammersmith_One } from "next/font/google";
import Image from "next/image";
import HeaderLogo from "@/frontend/assets/header-logo.png";

const hammerSmithOne = Hammersmith_One({
  weight: "400",
  subsets: ["latin"],
});

const PageHeader = () => {
  return (
    <Header height={60} px="md" py={10}>
      <Flex gap="sm" mx="auto" w={1000}>
        <Image alt="logo" src={HeaderLogo} height={40} width={40} />
        <Title className={hammerSmithOne.className} color="#6DB52C">
          Brain Fuel
        </Title>
      </Flex>
    </Header>
  );
};

export default PageHeader;
