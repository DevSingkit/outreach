export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}