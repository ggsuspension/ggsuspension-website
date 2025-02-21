import { Search } from "lucide-react";
import { useState } from "react";

export const HeroSection = ({ data }: any) => {
  const initialData = data;
  const [filteredData, setFilteredData] = useState(initialData);

  // Fungsi untuk handle pencarian
  const handleSearch = (event: any) => {
    const term = event.target.value.toLowerCase();
    if (term.length == 0) return setFilteredData([]);
    const filtered = initialData.filter((item: any) =>
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(term)
      )
    );
    setFilteredData(filtered);
  };
  return (
    <section
      id="home"
      className="bg-orange-500 text-white py-20 rounded-b-[18%] tablet:rounded-b-[80%]"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <span className="flex items-center justify-center tablet:gap-4">
          <img className="w-[5em]" src="./shock.png" alt="" />
          <h1 className="text-4xl md:text-6xl font-bold mb-2">
            Solusi <span className="text-yellow-300 italic">SHOCK</span> Motor
            Anda
          </h1>
          </span>
          <p className="text-xl mb-8">
            Kenyamanan Berkendara Dimulai dari Suspensi yang Tepat
          </p>
          <span className="flex items-center gap-2 bg-white w-3/4 tablet:w-1/2 text-black rounded-full overflow-hidden px-4 py-1 tablet:py-2 place-self-center">
            <input
              placeholder="Cari kebutuhan Anda.."
              className="w-full"
              type="search"
              onChange={handleSearch}
            />
            <Search />
          </span>
          {filteredData&&filteredData.length>0&&<div className="">
            <h1 className="text-left text-xl font-bold mt-6">Hasil Pencarian :</h1>
            {filteredData.map((item: any, index: number) => (
              <div
                key={index}
                style={{
                  padding: "15px",
                  borderBottom: "1px solid #ddd",
                  marginBottom: "10px",
                }}
              >
                <h3 className="font-semibold">{item.category}</h3>
                <p>Tipe Motor: {item.subcategory}</p>
                <p>Bagian: {item.service}</p>
                <p>Harga: Rp {item.price.toLocaleString()}</p>
              </div>
            ))}
          </div>}
        </div>
      </div>
    </section>
  );
};
