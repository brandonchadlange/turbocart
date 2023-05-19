import Money from "@/components/money";
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
import Link from "next/link";
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

  const fetchOrderQuery = useQuery(
    ["order", orderNumber],
    () => fetchOrder(orderNumber),
    {
      enabled: orderNumber.length > 0,
    }
  );

  const form = useForm({
    initialValues: {
      orderNumber: "",
    },
  });

  useEffect(() => {
    if (router.query.reference === undefined) {
      form.reset();
      setOrderNumber("");
      return;
    }

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

  const orderItems = fetchOrderQuery.data?.orderItems || [];
  const listings = fetchOrderQuery.data?.orderItemListings || [];

  const tableData = orderItems.map((orderItem: any) => {
    const product = listings.find((e: any) => e.id === orderItem.productId);
    const { studentFirstName, studentLastName, studentGrade, menuId, dateId } =
      orderItem.batch;

    const studentName = `${studentFirstName} ${studentLastName}`;

    return (
      <tr key={orderItem.id}>
        <td>{studentName}</td>
        <td>{product.name}</td>
        <td>{dateId}</td>
        <td>{menuId}</td>
        <td>{orderItem.quantity}</td>
        <td>
          <Money currency="ZAR">
            {orderItem.pricePerItemInCents * orderItem.quantity}
          </Money>
        </td>
      </tr>
    );
  });

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
            <Button
              href="/view-order"
              component={Link}
              variant="default"
              size="xs"
              mb="sm"
            >
              Search for a different order
            </Button>
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
              <tbody>{tableData}</tbody>
            </Table>
          </div>
        )}
      </Stack>
    </AppShell>
  );
};

export default ViewOrderPage;
