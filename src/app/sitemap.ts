import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://robil.chatbotdev.online', // Ganti dengan domain asli Anda
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    // Anda bisa tambahkan URL lain jika ada halaman dinamis (seperti detail project)
  ]
}