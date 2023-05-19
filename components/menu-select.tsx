import { IEventEmitter } from "@/frontend/utils/event-emitter";
import queries from "@/frontend/utils/queries";
import { Select, SelectItem } from "@mantine/core";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

type MenuSelectProps = {
  value: string;
  setValue: (value: string) => void;
  menuList: SelectItem[];
  selectedMenu: any;
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

export const useMenuSelect = (props: { eventEmitter: IEventEmitter }) => {
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [selectedMenu, setSelectedMenu] = useState<Category[]>([]);

  const menusQuery = useQuery("menus", queries.fetchMenus);

  const menuItemQuery = useQuery(
    ["menu-item", selectedMenuId],
    () => queries.fetchMenuProducts(selectedMenuId),
    {
      enabled: selectedMenuId !== "",
      initialData: [],
    }
  );

  const menus = menusQuery.data || [];

  const menuSelectItems: SelectItem[] = menus.map((menu) => ({
    value: menu.id,
    label: menu.name,
  }));

  useEffect(() => {
    if (menus.length > 0) {
      setSelectedMenuId(menus[0].id);
    }
  }, [menus]);

  useEffect(() => {
    setSelectedMenu(menuItemQuery.data!);
  }, [menuItemQuery.data]);

  return {
    value: selectedMenuId,
    setValue: (value: string) => {
      setSelectedMenuId(value);
      const menu = menus.find((e) => e.id === value);
      props.eventEmitter.emit("menu-change", menu);
    },
    menuList: menuSelectItems,
    selectedMenu,
    selectedMenuId,
  };
};

export default MenuSelect;
