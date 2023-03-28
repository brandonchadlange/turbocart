import { Flex, MediaQuery, Stepper, Text } from "@mantine/core";

import {
  IconCreditCard,
  IconShoppingCart,
  IconUsers,
} from "@tabler/icons-react";
import { Hammersmith_One } from "next/font/google";

type StepsProps = {
  active: number;
};

const hammerSmithOne = Hammersmith_One({
  weight: "400",
  subsets: ["latin"],
});

const Steps = (props: StepsProps) => {
  return (
    <MediaQuery smallerThan="md" styles={{ display: "none" }}>
      <Flex justify="center" mt={40} mb={60}>
        <Stepper
          active={props.active}
          breakpoint="xs"
          color="yellow"
          size="md"
          w={1000}
        >
          <Stepper.Step
            icon={<IconUsers />}
            label={
              <Text size="lg" className={hammerSmithOne.className}>
                First step
              </Text>
            }
            description="Add students"
          ></Stepper.Step>
          <Stepper.Step
            icon={<IconShoppingCart />}
            label={
              <Text size="lg" className={hammerSmithOne.className}>
                Second step
              </Text>
            }
            description="Select meals"
          ></Stepper.Step>
          <Stepper.Step
            icon={<IconCreditCard />}
            label={
              <Text size="lg" className={hammerSmithOne.className}>
                Final step
              </Text>
            }
            description="Confirm & pay"
          ></Stepper.Step>
        </Stepper>
      </Flex>
    </MediaQuery>
  );
};

export default Steps;
