'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const productCategories = [
  {
    name: "Etiquetas Adhesivas",
    subcategories: [
      "ETIQUETAS ADHESIVAS PVC ALTA CALIDAD",
      "ETIQUETAS ADHESIVAS PVC METALIZADA",
      "ETIQUETAS ADHESIVAS PVC EFECTO ESPEJO",
      "ETIQUETAS ADHESIVAS PVC REMOVIBLES",
      "ETIQUETAS ADHESIVAS PVC PARA PISO",
      "ETIQUETA ADHESIVAS PVC SIN IMPRESIÓN",
      "ETIQUETAS ADHESIVAS SUSTENTABLES LIBRES PVC",
      "ETIQUETAS ADHESIVAS DE PAPEL",
      "ETIQUETAS ADHESIVAS DE PAPEL KRAFT"
    ]
  },
  {
    name: "Carpetas",
    subcategories: [
      "Carpetas",
      "Carpetas con Solapa"
    ]
  },
  {
    name: "Cuadernos",
    subcategories: [
      "Cuadernos Corporativos",
      "Moleskines",
    ]
  },
  {
    name: "Calendarios",
    subcategories: [
      "Calendario Mural",
      "Calendario de Escritorio",
    ]
  },
  {
    name: "Soportes Rigidos",
    subcategories: [
      "Foam",
      "Trovicel / Sintra",
      "Pai",
      "Acrilico",
      "Aluminio Compuesto",
      "Carton Panal Abeja",
      "Micro Corrugado",
    ]
  },
  {
    name: "Pendones",
    subcategories: [
      "Pendon Roller",
      "Pendon Araña X",
      "Mini Pendon Araña X",
      "Mini Pendon Tipo T",
      "Pendon Colgante",
      "Panel Araña",
      "Lienzos - Tela PVC",
    ]
  },
  {
    name: "Libros",
    subcategories: [
      "Libros Tapa Blanda",
    ]
  },
  {
    name: "Afiches",
    subcategories: [
      "Afiches Offset",
      "Afiches Digital",
    ]
  },
  {
    name: "Papeleria",
    subcategories: [
      "Hojas Corporativas",
      "Sobres",
      "Tarjetones"
    ]
  },
  {
    name: "Mas Productos",
    subcategories: [
      "Volantes",
      "Diplomas",
      "Tarjetas de Presentación",
      "Tripticos",
      "Imanes",
      "Marcos de Aluminio",
      "Posa Vasos"
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