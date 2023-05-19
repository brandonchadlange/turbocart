import queries from "@/frontend/utils/queries";
import { useQuery } from "react-query";

const useMenuStore = () => {
  const menuListQuery = useQuery("menu-list", queries.fetchMenus);

  return {
    menuList: menuListQuery.data || [],
  };
};

export default useMenuStore;
