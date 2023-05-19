import makeProductCard from "@/components/ProductCard";
import {
  AppShell,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  Header,
  Image,
  Text,
  Title,
} from "@mantine/core";

const PageHeader = () => {
  return (
    <Header height={60} px="md">
      <Container size="md" h="100%">
        <Flex justify="space-between" align="center" h="100%">
          <Title>Test Ecom Store</Title>
        </Flex>
      </Container>
    </Header>
  );
};

const HomePage = () => {
  const ProductCard = makeProductCard({
    image: {
      enabled: true,
    },
  });

  return (
    <AppShell bg="#f4f4f4" header={<PageHeader />}>
      <Container size="md">
        <Grid columns={4}>
          <Grid.Col xs={2} sm={2} md={1} span={2}>
            <ProductCard
              name="Surprise Jumbo Egg"
              slug="surprise-jumbo-egg"
              priceInCents={14900}
              imageUrl="https://media.takealot.com/covers_images/0ebc5f8ce91345c4a23420468929d35e/s-pdpxl.file"
            />
          </Grid.Col>
          <Grid.Col xs={2} sm={2} md={1} span={2}>
            <ProductCard
              name="Nivea Men Invisible for Black & White Original 48h Deo Roll-on 6 x 50ml"
              slug="nivea-men-invisible-for-black-and-white"
              priceInCents={11900}
              imageUrl="https://media.takealot.com/covers_images/7abdb75ea8b443beaabd8daad999e295/s-pdpxl.file"
            />
          </Grid.Col>
          <Grid.Col xs={2} sm={2} md={1} span={2}>
            <ProductCard
              name="Samsung Galaxy A54 5G 256GB Dual Sim - Light Green with Buds Live"
              slug="samsung-galaxy-a54"
              priceInCents={999900}
              imageUrl="https://media.takealot.com/covers_images/7e0a246c29814625b44dd917843134d3/s-pdpxl.file"
            />
          </Grid.Col>
          <Grid.Col xs={2} sm={2} md={1} span={2}>
            <ProductCard
              name="Samsung Galaxy A54 5G 256GB Dual Sim - Light Green with Buds Live"
              slug="samsung-galaxy-a54"
              priceInCents={999900}
              imageUrl="https://media.takealot.com/covers_images/7e0a246c29814625b44dd917843134d3/s-pdpxl.file"
            />
          </Grid.Col>
        </Grid>
      </Container>
    </AppShell>
  );
};

export default HomePage;
