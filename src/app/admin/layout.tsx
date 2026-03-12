import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yönetim Paneli | MedyaGem",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/uploads/c8078a63-42e2-4136-85ff-87ec4369a0f3.png",
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
