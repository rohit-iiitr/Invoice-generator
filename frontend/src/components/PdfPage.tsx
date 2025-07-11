import { useEffect, useRef, useState } from "react";

import html2canvas from "html2canvas";
import Navbar from "./Navbar";
import { BACKEND_URL } from "../utils/utils";
import { getProducts } from "./getProducts";


interface Product {
  name: string;
  price: number;
  quantity: number;
}

export default function PdfPage() {
  const [products, setProducts] = useState<Product[]>([]);
    const userDataString = localStorage.getItem("user");
  const userData = userDataString ? JSON.parse(userDataString) : null;
 const userId = userData?.data.user?.id;
  const pdfRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchProducts() {
      try {
        const res = await getProducts(userId);
         
      
       

        if (res?.data) {
          const filteredProducts = res.data.data.map((product: any) => ({
            name: product.name,
            price: product.rate as number,
            quantity: product.qty as number,
          }));
       
          setProducts(filteredProducts);
        }
      } catch (error) {
        console.log("Error fetching products", error);
      }
    }
    fetchProducts();
  }, []);

  const calculateTotal = () => {
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const calculateGST = () => {
    return calculateTotal() * 0.18;
  };

  const downloadPdf = async () => {
    const element = pdfRef.current;
    

     if (element) {
    // 👇 This will clean up any unsupported `oklch()` colors
    document.querySelectorAll("*").forEach((el) => {
      const style = window.getComputedStyle(el);
      if (style.color.includes("oklch")) {
        (el as HTMLElement).style.color = "#000"; // fallback color
      }
      if (style.backgroundColor.includes("oklch")) {
        (el as HTMLElement).style.backgroundColor = "#fff"; // fallback background
      }
    });

   
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");

      try {
        const response = await fetch(
         ` ${BACKEND_URL}/api/products/generate-pdf`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imgData }), // Send the Base64 image data
          }
        );

        console.log(response)

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "invoice.pdf";
          document.body.appendChild(a);
          a.click();
          a.remove();
        } else {
          console.error("Failed to generate PDF in fronted");
        }
      } catch (error) {
        console.error("Error generating PDF", error);
      }
    }
  };

  return (
    <div className="bg-black">
      {/* Navbar */}
      <Navbar
        navButton={
          <button
            onClick={downloadPdf}
            className="bg-[#CCF575] rounded-lg px-6 relative transform transition-transform duration-300 hover:-translate-x-4"
          >
            Download PDF
          </button>
        }
      />

      {/* Main content */}
      <div
        className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden min-h-[297mm]"
        id="pdf-section"
        ref={pdfRef}
      >
        <div className="border-b py-3 flex justify-center align-middle">
          <div className="w-[95%] flex justify-between items-center">
             <img src="/images/whitelo.jpg" alt="logo" className="h-12" />
             <div>
            <h1 className="text-xl font-bold">INVOICE GENERATOR</h1>
            <span className="text-xs text-gray-400">Sample Output Should be like this</span>
            </div>
           
          </div>
        </div>
        <div className="px-10 py-8">
          <div className="bg-[url('/images/banner.jpg')] bg-cover text-white rounded-xl p-6 mb-6">
            <div className="flex justify-between mb-4">
              <span>Name</span>
              <span>Date: {new Date().toLocaleDateString()}</span>
             
            </div>
           <div className="flex justify-between mb-1 ">
            <span className="text-xl font-normal  mb-1 text-[rgba(204,245,117,1)] ">
              {userData?.data.user?.name}</span>
               <span className="bg-white text-black rounded-full border-r-28px px-2 py-1 pb-1"> {userData?.data.user?.email} </span>
           </div> 
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="bg-gradient-to-r from-[#303661] to-[#263406] text-white">
                <th className="py-2 px-4 text-left rounded-l-full">Product</th>
                <th className="py-2 px-4 text-center">Qty</th>
                <th className="py-2 px-4 text-center">Rate</th>
                <th className="py-2 px-4 text-right rounded-r-full">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 ? "bg-[#FAFAFA]" : "bg-white"
                  } rounded-full my-2 shadow-lg`}
                >
                  <td className="py-2 px-4 rounded-l-full">{product.name}</td>
                  <td className="py-2 px-4 text-center">{product.quantity}</td>
                  <td className="py-2 px-4 text-center">{product.price}</td>
                  <td className="py-2 px-4 text-right rounded-r-full">
                    INR {(product.price * product.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-10">
            <div className="w-[40%] border border-[#A2A2A2] rounded-lg p-4">
              <div className="flex justify-between mb-6">
                <span className="text-[#A2A2A2]">Total Charges</span>
                <span className="text-[#A2A2A2]">
                  ₹{calculateTotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-6">
                <span className="text-[#A2A2A2]">GST (18%)</span>
                <span className="text-[#A2A2A2]">
                  ₹{calculateGST().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total Amount</span>
                <span className="text-blue-600">
                  ₹ {(calculateTotal() + calculateGST()).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-48 text-sm text-gray-600">
            <p>
              Date: <b>{new Date().toLocaleDateString()}</b>{" "}
            </p>
          </div>

          <div className="mt-32 bg-[#272833] text-white text-sm rounded-full py-3 px-14">
            <p>
              We are pleased to provide any further information you may require
              and look forward to assisting with your next order. Rest assured,
              it will receive our prompt and dedicated attention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}