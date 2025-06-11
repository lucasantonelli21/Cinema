import Navbar from '../navbar/navbar';
export default function BlankLayout({ children }) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <div className="container mt-4">{children}</div>
      </main>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
    </>
  );
}
