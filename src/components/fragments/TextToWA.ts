  export const kirimPesan = (nomorTelepon:string, pesan:string) => {
    const url = `https://wa.me/${nomorTelepon}?text=${encodeURIComponent(pesan)}`;
    window.open(url, '_blank');
  };