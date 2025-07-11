import React, { useState } from "react";

interface Product {
  name: string;
  price: number;
  quantity: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const addProduct = () => {
    if (!name || !price || !quantity) return;
    setProducts([
      ...products,
      {
        name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
      },
    ]);
    setName("");
    setPrice("");
    setQuantity("");
  };

  const subTotal = products.reduce(
    (acc, prod) => acc + prod.price * prod.quantity,
    0
  );
  const gstRate = 0.18;
  const totalWithGST = subTotal + subTotal * gstRate;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white px-10 py-6">
      <header className="flex justify-between items-center mb-8">
        <div className="text-2xl font-semibold">levitation <span className="text-gray-400">infotech</span></div>
        <button className="bg-lime-400 text-black px-4 py-1 rounded">Logout</button>
      </header>

      <h1 className="text-4xl font-bold mb-2">Add Products</h1>
      <p className="text-gray-400 mb-6">
        This is basic login page which is used for levitation assignment purpose.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Enter the product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-zinc-800 text-white px-4 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Enter the price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="bg-zinc-800 text-white px-4 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Enter the Qty"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="bg-zinc-800 text-white px-4 py-2 rounded"
        />
      </div>

      <button
        onClick={addProduct}
        className="bg-lime-400 text-black px-6 py-2 rounded mb-6"
      >
        Add Product ➕
      </button>

      <div className="bg-white text-black rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white text-black">
            <tr>
              <th className="px-4 py-2">Product name ⬆</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Quantity ⬇</th>
              <th className="px-4 py-2">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2 italic">{prod.name}</td>
                <td className="px-4 py-2">{prod.price}</td>
                <td className="px-4 py-2">{prod.quantity}</td>
                <td className="px-4 py-2">INR {prod.price * prod.quantity}</td>
              </tr>
            ))}
            <tr className="border-t">
              <td colSpan={3} className="px-4 py-2 font-semibold">
                Sub-Total
              </td>
              <td className="px-4 py-2">INR {totalWithGST.toFixed(1)}</td>
            </tr>
            <tr className="border-t">
              <td colSpan={3} className="px-4 py-2 font-semibold">
                Incl + GST 18%
              </td>
              <td className="px-4 py-2">INR {totalWithGST.toFixed(1)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <button className="bg-lime-400 text-black px-8 py-2 rounded">
          Generate PDF Invoice
        </button>
      </div>
    </div>
  );
}