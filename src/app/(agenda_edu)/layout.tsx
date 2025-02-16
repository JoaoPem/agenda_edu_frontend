import Navbar from '@/components/Navbar';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const username = "Usuário Teste";

  return (
    <section>
      <Navbar />
      {children}
    </section>
  );
}