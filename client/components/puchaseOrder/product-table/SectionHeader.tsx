import { LucideIcon } from "lucide-react"

interface SectionHeaderProps {
  icon: LucideIcon
  title: string
}

export function SectionHeader({ icon: Icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5" />
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  )}