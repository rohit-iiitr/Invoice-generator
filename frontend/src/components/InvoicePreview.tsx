interface Product {
  name: string;
  quantity: number;
  price: number;
}

interface InvoicePreviewProps {
  products: Product[];
  customerName: string;
  email: string;
  date: string;
}

const gstRate = 0.18;

export const InvoicePreview = ({
  products,
  customerName,
  email,
  date,
}: InvoicePreviewProps) => {
  const subTotal = products.reduce(
    (acc, p) => acc + p.price * p.quantity,
    0
  );
  const gst = subTotal * gstRate;
  const total = subTotal + gst;

  return (
    <div className="text-black p-10 font-sans w-[800px] mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Levitation <span className="text-gray-400">Infotech</span></h1>
          <p className="text-xs">INVOICE GENERATOR</p>
          <p className="text-xs text-gray-400">Sample Output</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">Date: {date}</p>
          <p className="text-sm font-medium">Email: {email}</p>
        </div>
      </header>

      <section className="bg-gradient-to-r from-zinc-800 to-black text-white p-4 rounded mb-6">
        <p className="text-lg">
          Name: <span className="text-lime-400">{customerName}</span>
        </p>
      </section>

      <table className="w-full text-left mb-6">
        <thead>
          <tr className="bg-gradient-to-r from-zinc-900 to-green-900 text-white">
            <th className="p-2">Product</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Rate</th>
            <th className="p-2">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, idx) => (
            <tr key={idx} className="bg-gray-100 even:bg-white">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.quantity}</td>
              <td className="p-2">USD {p.price}</td>
              <td className="p-2">USD {p.quantity * p.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right mb-4">
        <p>Total Charges: <strong>${subTotal}</strong></p>
        <p>GST (18%): <strong>${gst.toFixed(2)}</strong></p>
        <p className="text-xl font-bold text-blue-700">Total Amount: ₹ {total.toFixed(0)}</p>
      </div>

      <p className="text-sm text-gray-500">
        We are pleased to provide any further information you may require and look forward to assisting you with your next order.
      </p>

      <footer className="mt-10 text-xs text-gray-400">Date: {date}</footer>
    </div>
  );
};
