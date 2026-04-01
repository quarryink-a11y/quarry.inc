export function Template1Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-white text-black dark:bg-black dark:text-white">
      {children}
    </div>
  );
}
