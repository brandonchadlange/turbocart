import dbInstance from "@/backend/db";
import getMerchantId from "@/backend/utility/get-merchant-id";
import { useStrategyState } from "@/frontend/providers/strategy";
import { isbot } from "isbot";
import { getCookie, setCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

export default function Home() {
  const { strategy } = useStrategyState();
  const router = useRouter();
  const currentPath = router.asPath;

  const currentPage = strategy.pages.find(
    (e) => e.path.toLowerCase() === currentPath.toLowerCase()
  );

  if (!currentPage) {
    return <></>;
  }

  const PageComponent = currentPage!.component;

  return <PageComponent />;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userAgent = req.headers["user-agent"] || "";

  if (isbot(userAgent)) {
    return {
      props: {},
    };
  }

  const sessionId = getCookie("session", { req, res });
  const merchantId = getMerchantId(req.headers);

  if (sessionId === undefined) {
    try {
      const session = await dbInstance.session.create({
        data: {
          createdAt: new Date(),
          merchantId,
        },
      });

      setCookie("session", session.id, { req, res });
    } catch (err) {
      console.error("failed to create session: ", err);
    }
  } else {
    const existingSession = await dbInstance.session.findFirst({
      where: {
        id: sessionId!.toString(),
      },
    });

    if (existingSession === null) {
      try {
        const session = await dbInstance.session.create({
          data: {
            createdAt: new Date(),
            merchantId,
          },
        });

        setCookie("session", session.id, { req, res });
      } catch (err) {
        console.error("failed to create session: ", err);
      }
    }
  }

  return {
    props: {},
  };
};
