import {
  AppShell,
  Card,
  Container,
  Flex,
  Grid,
  Header,
  Image,
  Stack,
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

const ProductPage = () => {
  return (
    <AppShell bg="#f4f4f4" header={<PageHeader />}>
      <Container size="md">
        <Stack>
          <Card withBorder>
            <Grid columns={12}>
              <Grid.Col span={8}>
                <Card w={200} withBorder>
                  <Image
                    fit="contain"
                    height="150px"
                    src="https://media.takealot.com/covers_images/0ebc5f8ce91345c4a23420468929d35e/s-pdpxl.file"
                  />
                </Card>
              </Grid.Col>
              <Grid.Col span={4}>
                <Title>Product Page</Title>
              </Grid.Col>
            </Grid>
          </Card>
          <Card withBorder>
            <Title>Description</Title>
          </Card>
        </Stack>
      </Container>
    </AppShell>
  );
};

export default ProductPage;
