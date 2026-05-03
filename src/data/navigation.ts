export interface NavItem {
  label: string;
  path: string;
}

export const navigation: NavItem[] = [
  { label: "首页", path: "/" },
  { label: "博客", path: "/blog" },
  { label: "项目", path: "/projects" },
  { label: "关于", path: "/about" },
  // Future: { label: "项目", path: "/projects" },
  // Future: { label: "简历", path: "/resume" },
  // Future: { label: "旅行", path: "/travels" },
];
