import { useStrategyState } from "@/frontend/providers/strategy";
import { useRouter } from "next/router";

const Page = () => {
  const { strategy } = useStrategyState();
  const router = useRouter();
  const currentPath = router.asPath.split("?")[0];

  const currentPage = strategy.pages.find(
    (e) => e.path.toLowerCase() === currentPath.toLowerCase()
  );

  if (!currentPage) {
    return <></>;
  }

  const PageComponent = currentPage!.component;

  return <PageComponent />;
};

export default Page;
