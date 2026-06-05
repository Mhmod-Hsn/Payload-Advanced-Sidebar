import type { ServerProps } from "payload";

import Nav from "./Nav.js";

export type NavWithGroupsProps = {
    groupsConfig?: Record<string, { icon: string; name: string }>;
} & ServerProps;

export const NavWithGroups = (props: NavWithGroupsProps) => {
    return <Nav {...props} groupsConfig={props.groupsConfig} />;
};

export default NavWithGroups;
