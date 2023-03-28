import Steps from "@/components/steps";
import mutations from "@/frontend/utils/mutations";
import queries from "@/frontend/utils/queries";
import {
  AppShell,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  MediaQuery,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

const attachYocoScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.yoco.com/sdk/v1/yoco-sdk-web.js";
    script.onload = resolve;
    document.head.append(script);
  });
};

const ConfirmationPage = () => {
  const router = useRouter();

  const form = useForm();

  const { fetchBasketSummary, fetchBasketDetail } = queries;
  const { placeOrder } = mutations;

  const basketSummaryQuery = useQuery("basket-summary", fetchBasketSummary);
  const basketDetailQuery = useQuery("basket-detail", fetchBasketDetail);

  const basketSummary: BasketSummary = basketSummaryQuery.data || {
    totalInCents: 0,
    items: [],
    totalItems: 0,
    totalStudents: 0,
  };

  const basketDetail = basketDetailQuery.data || [];

  const onFormSubmit = async (data: any) => {
    const { firstName, lastName, email } = data;
    await attachYocoScript();

    // @ts-ignore
    const yoco = new window.YocoSDK({
      publicKey: "pk_test_ed3c54a6gOol69qa7f45",
    });

    yoco.showPopup({
      amountInCents: basketSummary.totalInCents,
      currency: "ZAR",
      name: "Checkout",
      description: "Awesome description",
      callback: function (result: any) {
        if (result.error) {
          const errorMessage = result.error.message;
          alert("error occured: " + errorMessage);
        } else {
          placeOrder(result.id, firstName, lastName, email);
          router.push("/order-success");
        }
      },
    });
  };

  return (
    <AppShell>
      <Container mx="auto" p={0} pb={60}>
        <Steps active={2} />
        <main>
          <Grid columns={2} gutter={40}>
            <Grid.Col md={1} mb="sm">
              <Card withBorder>
                <form onSubmit={form.onSubmit(onFormSubmit)}>
                  <Stack>
                    <Grid columns={2}>
                      <Grid.Col md={1}>
                        <TextInput
                          {...form.getInputProps("firstName")}
                          label="First name"
                        />
                      </Grid.Col>
                      <Grid.Col md={1}>
                        <TextInput
                          {...form.getInputProps("lastName")}
                          label="Last name"
                        />
                      </Grid.Col>
                    </Grid>
                    <TextInput
                      {...form.getInputProps("email")}
                      label="Email address"
                    />
                    <Button type="submit" color="yellow">
                      Pay now
                    </Button>
                  </Stack>
                </form>
              </Card>
            </Grid.Col>
            <Grid.Col md={1} mb="sm">
              <Card withBorder px={0} py="xs">
                <Table mt={10} horizontalSpacing="md">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th style={{ textAlign: "right" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {basketSummary.items.map((item) => (
                      <tr key={item.product.id}>
                        <td>{item.product.name}</td>
                        <td>{item.quantity}</td>
                        <td style={{ textAlign: "right" }}>
                          R{item.totalInCents / 100}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Divider my="xs" />
                <Table fontSize="lg" horizontalSpacing="md">
                  <tbody>
                    <tr>
                      <td>
                        <Text weight="bold">Total:</Text>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <Text weight="bold">
                          R{basketSummary.totalInCents / 100}
                        </Text>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Grid.Col>
            <MediaQuery smallerThan="md" styles={{ display: "none" }}>
              <Grid.Col span={2} mb="sm">
                <Card withBorder p={0}>
                  <Table fontSize="sm">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Item</th>
                        <th>Date</th>
                        <th>Period</th>
                        <th>Quantity</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {basketDetail.map((item) => (
                        <tr key={item.id}>
                          <td>{item.student.firstName}</td>
                          <td>{item.product.name}</td>
                          <td>{item.dateId}</td>
                          <td>{item.menu.name}</td>
                          <td>{item.quantity}</td>
                          <td>R{item.product.priceInCents / 100}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              </Grid.Col>
            </MediaQuery>
          </Grid>
        </main>
      </Container>
    </AppShell>
  );
};

export default ConfirmationPage;
