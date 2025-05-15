import { getImages } from '@/utils/ggAPI';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getImages();
        console.log("IMAGE : ", data);
        setImages(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching images:', error);
        setError('Terjadi kesalahan saat mengambil data gambar');
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Handle image deletion
  // const handleDelete = async (id: number) => {
  //   if (window.confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
  //     try {
  //       await imageApi.delete(id);
  //       setImages(images.filter(image => image.id !== id));
  //       toast.success('Gambar berhasil dihapus');
  //     } catch (error) {
  //       console.error('Error deleting image:', error);
  //       toast.error('Terjadi kesalahan saat menghapus gambar');
  //     }
  //   }
  // };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <div className="card-header">
        <h2 className="card-title">Galeri Gambar</h2>
        <Link to="/upload" className="btn btn-primary">Upload Gambar Baru</Link>
      </div>
      
      {images.length === 0 ? (
        <div className="text-center p-5">
          <p>Belum ada gambar yang diunggah.</p>
          <Link to="/upload" className="btn btn-primary">Upload Gambar Pertama</Link>
        </div>
      ) : (
        <div className="gallery">
          {images.map((image:any) => (
            <div key={image.id} className="gallery-item">
              <img src={`http://localhost:8000/storage/${image.path}`} alt={image.path} className="gallery-img" />
              <div className="gallery-info">
                <h3 className="gallery-title">{image.title}</h3>
                <div className="gallery-actions">
                  <Link to={`/images/${image.id}`} className="btn btn-primary btn-sm">
                    Detail
                  </Link>
                  {/* <button 
                    onClick={() => handleDelete(image.id)} 
                    className="btn btn-danger btn-sm"
                  >
                    Hapus
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;