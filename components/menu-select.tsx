import queries from "@/frontend/utils/queries";
import { Select, SelectItem } from "@mantine/core";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

type MenuSelectProps = {
  value: string;
  setValue: (value: string) => void;
  menuList: SelectItem[];
  selectedMenu: Menu | undefined;
};

const MenuSelect = ({ value, setValue, menuList }: MenuSelectProps) => {
  return (
    <Select
      value={value}
      onChange={(e) => setValue(e!)}
      w={250}
      data={menuList}
    />
  );
};

export const useMenuSelect = () => {
  const { fetchMenus } = queries;
  const [selectedMenuId, setSelectedMenuId] = useState("");

  const menusQuery = useQuery("menus", fetchMenus);
  const menus = menusQuery.data || [];

  const menuSelectItems: SelectItem[] = menus.map((menu) => ({
    value: menu.id,
    label: menu.name,
  }));

  const selectedMenu = menus.find((e) => e.id === selectedMenuId);

  useEffect(() => {
    if (menus.length > 0) {
      setSelectedMenuId(menus[0].id);
    }
  }, [menus]);

  return {
    value: selectedMenuId,
    setValue: setSelectedMenuId,
    menuList: menuSelectItems,
    selectedMenu,
  };
};

export default MenuSelect;
