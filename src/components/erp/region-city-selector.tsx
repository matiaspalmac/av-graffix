"use client";

import { useState } from "react";

const REGIONS_CITIES: Record<string, string[]> = {
    "Arica y Parinacota": ["Arica", "Putre", "General Lagos", "Camarones"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Colchane", "Camiña", "Pica", "Huara"],
    "Antofagasta": ["Antofagasta", "Calama", "Tocopilla", "Sierra Gorda", "María Elena", "Mejillones", "Taltal"],
    "Atacama": ["Copiapó", "Vallenar", "Chañaral", "Diego de Almagro", "Freirina", "Huasco", "Tierra Amarilla", "Alto del Carmen"],
    "Coquimbo": ["La Serena", "Coquimbo", "Ovalle", "Illapel", "Andacollo", "Canela", "Combarbalá", "La Higuera", "Los Vilos", "Monte Patria", "Paihuano", "Punitaqui", "Río Hurtado", "Salamanca", "Vicuña"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio", "Quillota", "Los Andes", "Calera", "Concón", "La Ligua", "Limache", "Llaillay", "Nogales", "Olmué", "Petorca", "Puchuncaví", "San Felipe", "Zapallar"],
    "Metropolitana": ["Santiago", "Puente Alto", "Maipú", "La Florida", "Las Condes", "Peñalolén", "Pudahuel", "Lo Barnechea", "Providencia", "Ñuñoa", "San Bernardo", "El Bosque", "Melipilla", "Buin", "Colina", "Talagante", "Peñaflor", "Padre Hurtado"],
    "O'Higgins": ["Rancagua", "San Fernando", "Pichilemu", "Rengo", "Chimbarongo", "Graneros", "Machalí", "Mostazal", "Nancagua", "Palmilla", "Pichidegua", "San Vicente", "Santa Cruz"],
    "Maule": ["Talca", "Curicó", "Linares", "Constitución", "Cauquenes", "Chanco", "Colbún", "Curepto", "Empedrado", "Licantén", "Longaví", "Maule", "Molina", "Parral", "Pelarco", "Pencahue", "Rauco", "Retiro", "Río Claro", "Romeral", "Sagrada Familia", "San Clemente", "San Javier", "San Rafael", "Teno", "Vichuquén", "Villa Alegre", "Yerbas Buenas"],
    "Ñuble": ["Chillán", "Chillán Viejo", "San Carlos", "Bulnes", "Cobquecura", "Coelemu", "Coihueco", "El Carmen", "Ninhue", "Ñiquén", "Pemuco", "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ranquil", "San Fabián", "San Ignacio", "San Nicolás", "Treguaco", "Yungay"],
    "Biobío": ["Concepción", "Los Ángeles", "Talcahuano", "Hualpén", "Chiguayante", "Coronel", "San Pedro de la Paz", "Lota", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Hualqui", "Lebu", "Los Álamos", "Mulchén", "Nacimiento", "Negrete", "Penco", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tirúa", "Tomé", "Tucapel", "Yumbel"],
    "Araucanía": ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol", "Victoria", "Freire", "Carahue", "Collipulli", "Cunco", "Curacautín", "Curarrehue", "Ercilla", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Lonquimay", "Los Sauces", "Lumaco", "Melipeuco", "Nueva Imperial", "Perquenco", "Pitrufquén", "Renaico", "Saavedra", "Teodoro Schmidt", "Toltén", "Traiguén", "Vilcún", "Purén"],
    "Los Ríos": ["Valdivia", "La Unión", "Los Lagos", "Corral", "Futrono", "Lago Ranco", "Lanco", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "Río Bueno"],
    "Los Lagos": ["Puerto Montt", "Osorno", "Puerto Varas", "Castro", "Ancud", "Calbuco", "Chaitén", "Cochamó", "Curaco de Vélez", "Dalcahue", "Fresia", "Frutillar", "Hualaihué", "Llanquihue", "Los Muermos", "Maullín", "Palena", "Puerto Octay", "Purranque", "Puyehue", "Queilén", "Quellón", "Quemchi", "Quinchao", "Río Negro", "San Juan de la Costa", "San Pablo"],
    "Aysén": ["Coyhaique", "Puerto Aysén", "Chile Chico", "Cisnes", "Cochrane", "Guaitecas", "Lago Verde", "O'Higgins (Aysén)", "Río Ibáñez", "Tortel"],
    "Magallanes": ["Punta Arenas", "Puerto Natales", "Puerto Williams", "Antártica", "Cabo de Hornos", "Laguna Blanca", "Primavera", "Río Verde", "San Gregorio", "Timaukel"],
};

export const REGION_NAMES = Object.keys(REGIONS_CITIES);

interface RegionCitySelectorProps {
    defaultRegion?: string;
    defaultCity?: string;
}

export function RegionCitySelector({ defaultRegion = "Araucanía", defaultCity = "Temuco" }: RegionCitySelectorProps) {
    const [selectedRegion, setSelectedRegion] = useState(defaultRegion);
    const cities = REGIONS_CITIES[selectedRegion] ?? [];

    return (
        <>
            <label className="grid gap-1 text-sm">
                <span className="text-zinc-600 dark:text-zinc-300">Región</span>
                <select
                    name="region"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all"
                >
                    {REGION_NAMES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
            </label>

            <label className="grid gap-1 text-sm">
                <span className="text-zinc-600 dark:text-zinc-300">Ciudad</span>
                <select
                    name="city"
                    defaultValue={cities.includes(defaultCity) ? defaultCity : cities[0]}
                    key={selectedRegion}
                    className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:ring-2 focus:ring-brand-500/20 transition-all"
                >
                    {cities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </label>
        </>
    );
}
