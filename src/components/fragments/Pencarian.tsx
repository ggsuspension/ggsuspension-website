import { useState } from 'react';

const MotorList = ({data}:any) => {
  // Data awal
  const initialData = data;

  // State untuk pencarian dan data yang difilter
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(initialData);

  // Fungsi untuk handle pencarian
  const handleSearch = (event:any) => {
      const term = event.target.value.toLowerCase();
      setSearchTerm(term);
      if (term.length==0) return setFilteredData([]);
    const filtered = initialData.filter((item:any) => 
      Object.values(item).some(val =>
        val?.toString().toLowerCase().includes(term)
      )
    );
    setFilteredData(filtered);    
  };

  return (
    <div>
      {/* Input pencarian */}
      <input
        type="text"
        placeholder="Cari berdasarkan kategori, subkategori, atau service..."
        value={searchTerm}
        onChange={handleSearch}
        style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
      />

      {/* Tampilan hasil */}
      <div className="motor-list">
        {filteredData.map((item:any, index:number) => (
          <div key={index} style={{
            padding: '15px',
            borderBottom: '1px solid #ddd',
            marginBottom: '10px'
          }}>
            <h3 className='font-bold'>{item.category}</h3>
            <p>Tipe Motor: {item.subcategory}</p>
            <p>Bagian: {item.service}</p>
            <p>Harga: Rp {item.price.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MotorList;