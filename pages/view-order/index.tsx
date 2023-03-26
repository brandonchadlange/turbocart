import PageHeader from "@/components/page-header";
import queries from "@/frontend/utils/queries";
import {
  AppShell,
  Button,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

type PageState = "capture" | "loading" | "result";

const Loader = () => {
  return (
    <Stack>
      <video height="300px" src="searching-for-order.mp4" muted autoPlay loop />
      <Text align="center" size="lg" weight="bold">
        Please wait while we find your order
      </Text>
      <Text align="center" size="md">
        Loading...
      </Text>
    </Stack>
  );
};

const ViewOrderPage = () => {
  const { fetchOrder } = queries;
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("capture");
  const [orderNumber, setOrderNumber] = useState("");

  const fetchOrderQuery = useQuery("order", fetchOrder, {
    enabled: orderNumber.length > 0,
  });

  const form = useForm({
    initialValues: {
      orderNumber: "",
    },
  });

  useEffect(() => {
    if (router.query.reference === undefined) return;
    setOrderNumber(router.query.reference as string);
  }, [router.query.reference]);

  useEffect(() => {
    if (fetchOrderQuery.isLoading) {
      setPageState("loading");
      return;
    }

    if (fetchOrderQuery.isFetched) {
      setPageState("result");
    }
  }, [fetchOrderQuery.isLoading]);

  const onFormSubmit = ({ orderNumber }: { orderNumber: string }) => {
    router.push("/view-order?reference=" + orderNumber);
  };

  return (
    <AppShell>
      <Stack align="center" justify="stretch" mt={100}>
        {pageState === "loading" && <Loader />}
        {pageState === "capture" && (
          <div style={{ width: "400px" }}>
            <form onSubmit={form.onSubmit(onFormSubmit)}>
              <Stack>
                <Text size="md">
                  Please provide your order number below to continue
                </Text>
                <TextInput
                  {...form.getInputProps("orderNumber")}
                  placeholder="Enter your order number here"
                />
                <Button type="submit" color="yellow">
                  Find my order!
                </Button>
              </Stack>
            </form>
          </div>
        )}
        {pageState === "result" && (
          <div style={{ width: "1000px" }}>
            <Table withBorder>
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
            </Table>
          </div>
        )}
      </Stack>
    </AppShell>
  );
};

export default ViewOrderPage;
