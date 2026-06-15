import type { ServerProps } from "payload";

import Nav from "./Nav";

export type NavWithGroupsProps = {
    animations?: boolean;
    groupsConfig?: Record<string, { icon?: string }>;
    itemsConfig?: Record<string, { icon?: string }>;
} & ServerProps;

export const NavWithGroups = (props: NavWithGroupsProps) => {
    return <Nav {...props} groupsConfig={props.groupsConfig} />;
};

export default NavWithGroups;
