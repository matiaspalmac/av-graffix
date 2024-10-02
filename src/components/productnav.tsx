'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const productCategories = [
  {
    name: "Etiquetas adhesivas",
    subcategories: [
      "Etiquetas adhesivas PVC alta calidad",
      "Etiquetas adhesivas PVC metalizada",
      "Etiquetas adhesivas PVC efecto espejo",
      "Etiquetas adhesivas PVC removibles",
      "Etiquetas adhesivas PVC para piso",
      "Etiqueta adhesivas PVC sin impresión",
      "Etiquetas adhesivas sustentables libres PVC",
      "Etiquetas adhesivas de papel",
      "Etiquetas adhesivas de papel kraft"
    ]
  },
  {
    name: "Carpetas",
    subcategories: [
      "Carpetas",
      "Carpetas con solapa"
    ]
  },
  {
    name: "Cuadernos",
    subcategories: [
      "Cuadernos corporativos",
      "Moleskines",
    ]
  },
  {
    name: "Calendarios",
    subcategories: [
      "Calendario mural",
      "Calendario de escritorio",
    ]
  },
  {
    name: "Soportes rígidos",
    subcategories: [
      "Foam",
      "Trovicel / Sintra",
      "Pai",
      "Acrílico",
      "Aluminio compuesto",
      "Cartón panal abeja",
      "Micro corrugado",
    ]
  },
  {
    name: "Pendones",
    subcategories: [
      "Pendón roller",
      "Pendón araña X",
      "Mini pendón araña X",
      "Mini pendón tipo T",
      "Pendón colgante",
      "Panel araña",
      "Lienzos - tela PVC",
    ]
  },
  {
    name: "Libros",
    subcategories: [
      "Libros tapa blanda",
    ]
  },
  {
    name: "Afiches",
    subcategories: [
      "Afiches offset",
      "Afiches digital",
    ]
  },
  {
    name: "Papelería",
    subcategories: [
      "Hojas corporativas",
      "Sobres",
      "Tarjetones"
    ]
  },
  {
    name: "Más productos",
    subcategories: [
      "Volantes",
      "Diplomas",
      "Tarjetas de presentación",
      "Trípticos",
      "Imanes",
      "Marcos de aluminio",
      "Posa vasos"
    ]
  }
]

export default function ProductNav() {
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  return (
    <nav className="bg-gray-100 py-4">
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap justify-center space-x-4">
          {productCategories.map((category) => (
            <li key={category.name} className="relative group">
              <button
                className="flex items-center space-x-1 hover:text-red-600 transition-colors"
                onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)}
              >
                <span>{category.name}</span>
                {openCategory === category.name ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openCategory === category.name && (
                <ul className="absolute z-10 left-0 mt-2 w-64 bg-white shadow-lg rounded-md py-2">
                  {category.subcategories.map((subcategory) => (
                    <li key={subcategory}>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-100 transition-colors">
                        {subcategory}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}