import { Card, Group, Image, Text } from "@mantine/core";
import Money from "../money";
import Link from "next/link";

type MakeProductCardOptions = {
  image: {
    enabled: boolean;
  };
};

type ProductCardProps = {
  name: string;
  slug: string;
  priceInCents: number;
  imageUrl?: string;
};

const makeProductCard = (options: MakeProductCardOptions) => {
  const isImageEnabled = options.image.enabled;

  return (props: ProductCardProps) => {
    return (
      <Card
        shadow="sm"
        radius="xs"
        component={Link}
        href={"/product?slug=" + props.slug}
      >
        {isImageEnabled && (
          <Image fit="contain" height="120px" src={props.imageUrl} />
        )}
        <Group h={50} align="self-start" mt="md">
          <Text size="xs" color="gray" weight="bold" lineClamp={2}>
            {props.name}
          </Text>
        </Group>
        <Text size="lg" weight="bolder">
          <Money currency="ZAR">{props.priceInCents}</Money>
        </Text>
      </Card>
    );
  };
};

export default makeProductCard;
