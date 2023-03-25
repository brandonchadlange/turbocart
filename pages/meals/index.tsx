import MenuSelect, { useMenuSelect } from "@/components/menu-select";
import PageHeader from "@/components/page-header";
import Steps from "@/components/steps";
import mutations from "@/frontend/utils/mutations";
import queries from "@/frontend/utils/queries";
import {
  AppShell,
  Button,
  Card,
  Checkbox,
  Divider,
  Drawer,
  Flex,
  Grid,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Radio,
  SegmentedControl,
  Space,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Student } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";

type BasketFormProps = {
  students: Student[];
  product?: Product;
  dates: any;
  closeDrawer: () => void;
  selectedMenu?: Menu;
};

const BasketForm = (props: BasketFormProps) => {
  const queryClient = useQueryClient();
  const { addToBasket } = mutations;
  const { product, students, selectedMenu, dates } = props;
  const [dateType, setDateType] = useState(dates.options[0].value);
  const [selectedDateIds, setSelectedDateIds] = useState<string[]>([]);

  const initialValues: any = {
    productId: product?.id,
    menuId: selectedMenu?.id,
    dateIdList: selectedDateIds,
    options: {},
    quantity: {},
  };

  product?.options?.forEach((option) => {
    if (option.type === "single") {
      initialValues.options[option.value] = option.values[0].value;
    }
  });

  students.forEach((student) => {
    initialValues.quantity[student.id] = 0;
  });

  const form = useForm({
    initialValues,
  });

  const onFormSubmit = async (data: AddToBasketRequest) => {
    data.dateIdList = selectedDateIds;

    await addToBasket(data);

    notifications.show({
      message: "Successfully added to basket!",
    });

    form.reset();
    queryClient.fetchQuery("basket");
  };

  const isAddToCartDisabled = Object.values(form.values.quantity).every(
    (e: any) => e === 0
  );

  useEffect(() => {
    if (dateType !== "custom") {
      setSelectedDateIds([dateType]);
      return;
    }

    setSelectedDateIds([]);
  }, [dateType]);

  return (
    <form onSubmit={form.onSubmit(onFormSubmit)} style={{ height: "100%" }}>
      <Stack>
        <div>
          <SegmentedControl
            size="sm"
            value={dateType}
            onChange={(e) => setDateType(e)}
            data={dates.options.map((e: any) => ({
              label: e.label,
              value: e.value,
            }))}
          />
        </div>
        {dateType === "custom" && (
          <MultiSelect
            dropdownPosition="bottom"
            label="Dates"
            placeholder="Select date"
            value={selectedDateIds}
            onChange={(e) => setSelectedDateIds(e)}
            data={dates.dates.map((date: any) => ({
              value: date.dateCode,
              label: date.weekDay + " " + date.day,
              disabled: date.disabled,
            }))}
          />
        )}
        {product?.options?.map((option) => (
          <div key={option.value}>
            {option.type === "single" && (
              <Radio.Group
                label={option.label}
                name={option.value}
                size="sm"
                {...form.getInputProps("options." + option.value)}
              >
                <Group>
                  {option.values.map((value) => (
                    <Radio
                      key={value.value}
                      value={value.value}
                      label={value.label}
                    />
                  ))}
                </Group>
              </Radio.Group>
            )}
            {option.type === "multiple" && (
              <Checkbox.Group
                label={option.label}
                size="sm"
                {...form.getInputProps("options." + option.value)}
              >
                <Group>
                  {option.values.map((value) => (
                    <Checkbox
                      size="xs"
                      key={value.value}
                      value={value.value}
                      label={value.label}
                    />
                  ))}
                </Group>
              </Checkbox.Group>
            )}
          </div>
        ))}
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
      >
        Add to Basket
      </Button>
      <Space h={100} />
    </form>
  );
};

const MealsPage = () => {
  const { fetchStudents, fetchBasketDetail, fetchDates } = queries;
  const menuSelect = useMenuSelect();
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [detailsOpened, setDetailsOpened] = useState(false);
  const studentsQuery = useQuery("students", fetchStudents);
  const basketQuery = useQuery("basket", fetchBasketDetail);
  const datesQuery = useQuery("dates", fetchDates);

  const selectItem = async (product: Product) => {
    setSelectedProduct(product);
    setDrawerOpened(true);
  };

  const students = studentsQuery.data || [];
  const basket = basketQuery.data || [];
  const dates = datesQuery.data || { options: [], dates: [] };

  const confirmAndPayDisabled = basket.length === 0;

  return (
    <AppShell header={<PageHeader />}>
      <Steps active={1} />
      <main>
        <Flex justify="center">
          <Grid columns={2} w={1000} gutter={0}>
            <Grid.Col span={1} mb="sm">
              <MenuSelect {...menuSelect} />
            </Grid.Col>
            <Grid.Col span={1} mb="sm">
              <Flex justify="end" gap="sm">
                <Button
                  variant="default"
                  onClick={() => setDetailsOpened(true)}
                >
                  Details
                </Button>
                <Button
                  color="yellow"
                  disabled={confirmAndPayDisabled}
                  component={Link}
                  href="/confirmation"
                >
                  Confirm & Pay
                </Button>
              </Flex>
            </Grid.Col>
            <Grid.Col span={2}>
              <Space h={20} />
              <Stack spacing="lg">
                {menuSelect.selectedMenu?.categories.map((category) => (
                  <div key={category.name}>
                    <Title mb="xs" size={18}>
                      {category.name}
                    </Title>
                    <Grid columns={3}>
                      {category.items.map((item) => (
                        <Grid.Col span={1} key={item.id}>
                          <Card
                            withBorder
                            onClick={() => selectItem(item)}
                            className="menu-item"
                          >
                            <Title size={14}>{item.name}</Title>
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
        </Flex>
      </main>
      <Drawer
        size="sm"
        opened={drawerOpened}
        position="right"
        onClose={() => setDrawerOpened(false)}
        title={
          <>
            <Title size={16}>{selectedProduct?.name}</Title>
            <Text size="sm" color="dimmed">
              R{selectedProduct?.priceInCents! / 100}
            </Text>
          </>
        }
      >
        <BasketForm
          students={students}
          product={selectedProduct}
          closeDrawer={() => setDrawerOpened(false)}
          selectedMenu={menuSelect.selectedMenu}
          dates={dates}
        />
      </Drawer>
      <Modal
        size="xl"
        centered
        opened={detailsOpened}
        onClose={() => setDetailsOpened(false)}
      >
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
              {basket.map((item) => (
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
      </Modal>
    </AppShell>
  );
};

export default MealsPage;