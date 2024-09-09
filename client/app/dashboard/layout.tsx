import Navbar from "@/components/header/navbar";
import Sidebar from "@/components/header/sidebar";
export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
         <>
    <div className="mx-auto">
    <Navbar />
    </div>
    <div className="grid grid-cols-12 overflow-hidden heighWithOutBar">
      <div className="col-span-2">
        <Sidebar/>
      </div>
      <div className="col-span-10">{children}</div>

    </div></>
    )
  }