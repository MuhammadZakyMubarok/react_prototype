import '../product.css'

export type PackageItem = {
  id: string
  name: string
}

type Props = {
  packages: PackageItem[]
  activePackageId: string | null
  onSelect: (packageId: string) => void
}

export default function ChipsBar({ packages, activePackageId, onSelect }: Props) {
  return (
    <div className="chips">
      {packages.map((pkg) => (
        <button
          key={pkg.id}
          type="button"
          className={`chip ${activePackageId === pkg.id ? 'chip--active' : ''}`}
          onClick={() => onSelect(pkg.id)}
        >
          {pkg.name}
        </button>
      ))}
    </div>
  )
}
