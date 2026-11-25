import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <div className="app-shell"><Sidebar /><main className="main-area"><Topbar />{children}</main></div>;
}