import Steps from "@/components/steps";
import mutations from "@/frontend/utils/mutations";
import queries from "@/frontend/utils/queries";
import { userDetailsSchema } from "@/frontend/utils/validation";
import makePaymentWithYoco from "@/payment-providers/yoco";
import {
  AppShell,
  Button,
  Card,
  Checkbox,
  Container,
  Divider,
  Flex,
  Grid,
  LoadingOverlay,
  MediaQuery,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

const attachYocoScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.yoco.com/sdk/v1/yoco-sdk-web.js";
    script.onload = resolve;
    document.head.append(script);
  });
};

type UserDetailsForm = {
  firstName: string;
  lastName: string;
  email: string;
  notes: string;
  rememberDetails: boolean;
};

const ConfirmationPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<any>();
  const router = useRouter();

  const form = useForm<UserDetailsForm>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      notes: "",
      rememberDetails: false,
    },
    validate: zodResolver(userDetailsSchema),
  });

  const {
    fetchSessionDetail,
    fetchBasketSummary,
    fetchBasketDetail,
    fetchPaymentMethods,
    fetchPaymentMethodConfig,
    fetchCanOrder,
  } = queries;
  const { placeOrder } = mutations;

  const basketSummaryQuery = useQuery("basket-summary", fetchBasketSummary);
  const basketDetailQuery = useQuery("basket-detail", fetchBasketDetail);
  const paymentMethodsQuery = useQuery("payment-methods", fetchPaymentMethods);

  const basketSummary: BasketSummary = basketSummaryQuery.data || {
    totalInCents: 0,
    items: [],
    totalItems: 0,
    totalStudents: 0,
  };

  const getFormData = async () => {
    const sessionDetail = await fetchSessionDetail();

    form.setValues({
      firstName: sessionDetail.customerFirstName,
      lastName: sessionDetail.customerLastName,
      email: sessionDetail.customerEmail,
    });

    form.setFieldValue("rememberDetails", sessionDetail.rememberDetails);
  };

  const fetchPaymentMethod = async (paymentMethodId: string) => {
    const response = await fetchPaymentMethodConfig(paymentMethodId);
    setPaymentMethod(response);
  };

  useEffect(() => {
    getFormData();
  }, []);

  useEffect(() => {
    if (paymentMethodsQuery.isLoading) return;

    if (paymentMethodsQuery.data!.length === 1) {
      fetchPaymentMethod(paymentMethodsQuery.data![0].id);
    }
  }, [paymentMethodsQuery.isLoading]);

  const basketDetail = basketDetailQuery.data || [];

  const tryPlaceOrder = async (data: any) => {
    setLoading(true);

    try {
      const { id: orderId } = await placeOrder({
        token: data.token,
        paymentMethodId: paymentMethod.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        notes: data.notes,
        rememberDetails: data.rememberDetails,
      });

      router.push("/order-success?orderId=" + orderId);
      setLoading(false);
    } catch (err: any) {
      const {
        data: { data },
        status,
      } = err.response;

      setLoading(false);

      if (status === 424) {
        notifications.show({
          title: "Failed to place order!",
          message: data.displayMessage,
          color: "red",
          autoClose: 15000,
        });

        return;
      }

      notifications.show({
        title: "Failed to place order!",
        message: "An error has occured...",
        color: "red",
      });
    }
  };

  const onFormSubmit = async (data: any) => {
    const { canOrder, items } = await fetchCanOrder();

    if (!canOrder) {
      notifications.show({
        title: "Failed to place order!",
        message: `There are ${items.length} item(s) in your basket for today which surpass our order cutoff time of 07:30. Please remove these items and try again.`,
        color: "red",
        autoClose: 15000,
      });

      return;
    }

    await attachYocoScript();

    try {
      const result = await makePaymentWithYoco({
        publicKey: paymentMethod.configuration.publicKey,
        amountInCents: basketSummary.totalInCents + 800,
      });

      tryPlaceOrder({
        token: result.id,
        ...data,
      });
    } catch (err: any) {
      const errorMessage = err.message;
      alert("error occured: " + errorMessage);
    }
  };

  return (
    <AppShell>
      <Container mx="auto" p={0} pb={60}>
        <Steps active={2} />
        <Title>Confirmation</Title>
        <Text>Enter your details and pay to place order</Text>
        <main>
          <Grid columns={2} gutter={40} mt="md">
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
                    <Textarea {...form.getInputProps("notes")} label="Notes" />
                    <Flex>
                      <Checkbox
                        my="sm"
                        label="Remember me"
                        description="Save your details for a faster checkout"
                        {...form.getInputProps("rememberDetails", {
                          type: "checkbox",
                        })}
                      />
                      {/* <Tooltip label=""></Tooltip> */}
                    </Flex>
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
                      <tr key={item.variant.id}>
                        <td>{item.variant.name}</td>
                        <td>{item.quantity}</td>
                        <td style={{ textAlign: "right" }}>
                          R{item.totalInCents / 100}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Divider my="xs" />
                <Table fontSize="sm" horizontalSpacing="md">
                  <tbody>
                    <tr>
                      <td>
                        <Text>Service fee:</Text>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <Text>R8</Text>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Text weight="bold">Total:</Text>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <Text weight="bold">
                          R{basketSummary.totalInCents / 100 + 8}
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
                          <td>{item.variant.name}</td>
                          <td>{item.dateId}</td>
                          <td>{item.menu.name}</td>
                          <td>{item.quantity}</td>
                          <td>R{item.variant.Listing.priceInCents / 100}</td>
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
      <LoadingOverlay visible={loading} overlayBlur={2} />
    </AppShell>
  );
};

export default ConfirmationPage;
