interface MainProps {
  children: React.ReactNode;
}

export function Main({ children }: MainProps) {
  return <main className="dashboard-main py-[30px]">{children}</main>;
}
