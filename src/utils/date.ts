export function formatDate(date:any) {
    // Array nama hari dalam bahasa Indonesia, dimulai dari Minggu (indeks 0)
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    // Array nama bulan dalam bahasa Indonesia, dimulai dari Januari (indeks 0)
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    // Ambil nama hari berdasarkan indeks dari getDay() (0 = Minggu, 5 = Jumat, dll.)
    const dayName = days[date.getDay()];
    // Ambil nama bulan berdasarkan indeks dari getMonth() (0 = Januari, 4 = Mei, dll.)
    const monthName = months[date.getMonth()];
    // Ambil tanggal dan format menjadi dua digit (misalnya, 9 menjadi '09')
    const dayNumber = ('0' + date.getDate()).slice(-2);
    
    // Gabungkan dalam format: "Hari, Tanggal Bulan"
    return dayName + ', ' + dayNumber + ' ' + monthName;
}