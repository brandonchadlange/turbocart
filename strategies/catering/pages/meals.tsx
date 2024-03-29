import MenuSelect, { useMenuSelect } from "@/components/menu-select";
import Steps from "@/components/steps";
import useEventEmitter from "@/frontend/utils/event-emitter";
import mutations from "@/frontend/utils/mutations";
import queries from "@/frontend/utils/queries";
import {
  ActionIcon,
  Affix,
  AppShell,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Drawer,
  Flex,
  Grid,
  Group,
  MediaQuery,
  Modal,
  MultiSelect,
  NumberInput,
  Radio,
  Space,
  Stack,
  Table,
  Text,
  Title,
  Transition,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useViewportSize } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Student } from "@prisma/client";
import { IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";

type BasketFormProps = {
  students: Student[];
  listing?: Listing;
  dates: any;
  closeDrawer: () => void;
  selectedMenuId: string;
};

const BasketForm = (props: BasketFormProps) => {
  const queryClient = useQueryClient();
  const { addToBasket } = mutations;
  const { listing, students, selectedMenuId, dates, closeDrawer } = props;
  const [selectedDateIds, setSelectedDateIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const listingDetailQuery = useQuery(
    ["listing-detail", listing],
    () => queries.fetchListing(listing!.id),
    {
      enabled: listing !== undefined,
    }
  );

  const listingDetail = listingDetailQuery.data;

  useEffect(() => {
    const selectedDate = dates.dates.filter((e: any) => e.status === "today");
    setSelectedDateIds([...selectedDate.map((e: any) => e.dateCode)]);
  }, []);

  const initialValues: any = {
    productId: listing?.id,
    variantId: "",
    menuId: selectedMenuId,
    dateIdList: selectedDateIds,
    options: {},
    quantity: {},
  };

  students.forEach((student) => {
    initialValues.quantity[student.id] = 0;
  });

  const form = useForm({
    initialValues,
  });

  useEffect(() => {
    if (listingDetail === undefined) {
      return;
    }

    form.setFieldValue("variantId", listingDetail.variants[0]?.id || "");
  }, [listingDetail]);

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    data.dateIdList = selectedDateIds;

    await addToBasket(data);

    notifications.show({
      message: "Successfully added to basket!",
    });

    form.reset();
    closeDrawer();
    setLoading(false);
    queryClient.fetchQuery("basket");
  };

  const hasMultipleVariants = listingDetail?.variants.length > 1;

  const isAddToCartDisabled =
    Object.values(form.values.quantity).every((e: any) => e === 0) ||
    selectedDateIds.length === 0;

  return (
    <form onSubmit={form.onSubmit(onFormSubmit)} style={{ height: "100%" }}>
      <Stack>
        <Text color="dark" size="sm">
          {props.listing?.description}
        </Text>
        <MultiSelect
          dropdownPosition="bottom"
          label="Dates"
          placeholder="Select date"
          value={selectedDateIds}
          onChange={(e) => setSelectedDateIds(e)}
          data={dates.dates.map((date: any) => ({
            value: date.dateCode,
            label: date.weekDay + " " + date.day,
            disabled: date.status === "complete",
          }))}
        />
        {hasMultipleVariants && (
          <Radio.Group
            label="Options"
            size="sm"
            {...form.getInputProps("variantId")}
          >
            <Group>
              {listingDetail?.variants.map((variant: any) => (
                <Radio
                  key={variant.id}
                  value={variant.id}
                  label={
                    <table style={{ width: "100%" }}>
                      <tr>
                        <td>{variant.name}</td>
                        <td>
                          <Badge size="sm" radius="sm">
                            + R{variant.additionalFeeInCents / 100}
                          </Badge>
                        </td>
                      </tr>
                    </table>
                  }
                />
              ))}
            </Group>
          </Radio.Group>
        )}
      </Stack>
      <Stack spacing="xs" mt="xl">
        {students.map((student) => (
          <div key={student.id}>
            <Flex justify="space-between" align="center">
              <Text>{student.firstName}</Text>
              <NumberInput
                {...form.getInputProps("quantity." + student.id)}
                size="xs"
                w={60}
                min={0}
              />
            </Flex>
            <Divider mt="xs" />
          </div>
        ))}
      </Stack>
      <Button
        disabled={isAddToCartDisabled}
        type="submit"
        color="yellow"
        fullWidth
        mt="md"
        loading={loading}
      >
        Add to Basket
      </Button>
      <Space h={100} />
    </form>
  );
};

const MealsPage = () => {
  const menuFilter = defineFilter("menu");
  const categoryFilter = defineFilter("category");
  console.log(menuFilter.values);
  console.log(categoryFilter.values);

  const eventEmitter = useEventEmitter();

  eventEmitter.on("menu-change", (menu: Menu) => {
    console.log(menu);
  });

  const { width } = useViewportSize();
  const { fetchStudents, fetchBasketDetail, fetchDates } = queries;
  const { removeFromBasket } = mutations;
  const menuSelect = useMenuSelect({ eventEmitter });
  const [selectedListing, setSelectedListing] = useState<Listing>();
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [detailsOpened, setDetailsOpened] = useState(false);

  const studentsQuery = useQuery("students", fetchStudents);
  const basketQuery = useQuery("basket", fetchBasketDetail);
  const datesQuery = useQuery("dates", fetchDates);

  const selectItem = async (listing: Listing) => {
    setSelectedListing(listing);
    setDrawerOpened(true);
  };

  const students = studentsQuery.data || [];
  const basket = basketQuery.data || [];
  const dates = datesQuery.data || { options: [], dates: [] };

  const confirmAndPayDisabled = basket.length === 0;

  const removeItemFromBasket = async (basketItemId: string) => {
    await removeFromBasket(basketItemId);
    basketQuery.refetch();
  };

  const isMobile = width < 700;

  return (
    <AppShell>
      <Container mx="auto" p={0} pb={60}>
        <Steps active={1} />
        <Title>Menu</Title>
        <Text>Add meals to your cart to continue</Text>
        <main>
          <Grid columns={2} gutter={0} mt="md">
            <Grid.Col md={1} mb="sm">
              <Flex justify="space-between">
                <MenuSelect {...menuSelect} />
                <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                  <Button
                    variant="default"
                    onClick={() => setDetailsOpened(true)}
                  >
                    Details
                  </Button>
                </MediaQuery>
              </Flex>
            </Grid.Col>
            <Grid.Col span={1} mb="sm">
              <MediaQuery smallerThan="md" styles={{ display: "none" }}>
                <Flex justify="end" gap="sm">
                  <Button
                    color="yellow"
                    disabled={confirmAndPayDisabled}
                    component={Link}
                    href="/confirmation"
                  >
                    Confirm & Pay
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => setDetailsOpened(true)}
                  >
                    Details
                  </Button>
                </Flex>
              </MediaQuery>
            </Grid.Col>
            <Grid.Col span={2}>
              <Space h={20} />
              <Stack spacing="lg">
                {menuSelect.selectedMenu.map((category) => (
                  <div key={category.id}>
                    <Title mb="xs" size={18}>
                      {category.name}
                    </Title>
                    <Grid columns={3}>
                      {category.items.map((item: any) => (
                        <Grid.Col md={1} key={item.id}>
                          <Card
                            withBorder
                            onClick={() => selectItem(item)}
                            className="menu-item"
                          >
                            <Title size={14}>{item.name}</Title>
                            <Text color="dark" size="xs">
                              {item.description}
                            </Text>
                            <Text size="sm" color="dimmed">
                              R{item.priceInCents / 100}
                            </Text>
                          </Card>
                        </Grid.Col>
                      ))}
                    </Grid>
                  </div>
                ))}
              </Stack>
            </Grid.Col>
          </Grid>
        </main>
      </Container>
      <Drawer
        size="sm"
        opened={drawerOpened}
        position="right"
        onClose={() => setDrawerOpened(false)}
        title={
          <>
            <Title size={16}>{selectedListing?.name}</Title>
            <Text size="sm" color="dimmed">
              R{selectedListing?.priceInCents! / 100}
            </Text>
          </>
        }
      >
        <BasketForm
          students={students}
          listing={selectedListing}
          closeDrawer={() => setDrawerOpened(false)}
          selectedMenuId={menuSelect.selectedMenuId}
          dates={dates}
        />
      </Drawer>
      <Modal
        title={<Title>My Basket</Title>}
        fullScreen={isMobile}
        size="xl"
        centered
        opened={detailsOpened}
        onClose={() => setDetailsOpened(false)}
      >
        {!isMobile && (
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {basket.map((item) => (
                  <tr key={item.id}>
                    <td>{item.student.firstName}</td>
                    <td>{item.variant.name}</td>
                    <td>{item.dateId}</td>
                    <td>{item.menu.name}</td>
                    <td>{item.quantity}</td>
                    <td>
                      R
                      {(item.variant.Listing.priceInCents +
                        item.variant.additionalFeeInCents) /
                        100}
                    </td>
                    <td>
                      <ActionIcon onClick={() => removeItemFromBasket(item.id)}>
                        <IconTrash />
                      </ActionIcon>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}
        {isMobile && (
          <Stack spacing="xs">
            {basket.map((item) => (
              <Card key={item.id} withBorder>
                <Flex justify="space-between">
                  <Stack spacing={0}>
                    <Text size="sm">Student: {item.student.firstName}</Text>
                    <Text size="sm">Date: {item.dateId}</Text>
                    <Text size="sm">Period: {item.menu.name}</Text>
                  </Stack>
                  <ActionIcon onClick={() => removeItemFromBasket(item.id)}>
                    <IconTrash />
                  </ActionIcon>
                </Flex>
                <Flex justify="space-between" mt="sm">
                  <Text>
                    {item.quantity} x {item.variant.name} @ R
                    {item.variant.Listing.priceInCents / 100}
                  </Text>
                  <Text>
                    R{(item.variant.Listing.priceInCents / 100) * item.quantity}
                  </Text>
                </Flex>
              </Card>
            ))}
          </Stack>
        )}
      </Modal>
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <Affix position={{ bottom: 0, left: 0 }} w="100%">
          <Group p="md">
            <Transition transition="slide-up" mounted={basket.length > 0}>
              {(transitionStyles) => (
                <Button
                  component={Link}
                  href="/confirmation"
                  size="md"
                  color="yellow"
                  style={transitionStyles}
                  fullWidth
                  // onClick={() => scrollTo({ y: 0 })}
                >
                  Confirm & Pay
                </Button>
              )}
            </Transition>
          </Group>
        </Affix>
      </MediaQuery>
    </AppShell>
  );
};

function defineFilter(filterId: string) {
  const filterQuery = useQuery(["filter", filterId], () =>
    queries.fetchFilterValues(filterId)
  );

  return {
    values: filterQuery.data || [],
  };
}

export default MealsPage;
