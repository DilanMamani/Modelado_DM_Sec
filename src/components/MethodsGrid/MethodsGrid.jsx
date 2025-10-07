import Card from "../Card/Card";
import styles from "./MethodsGrid.module.css";

const items = [
  {
    id: "lineal",
    title: "Algoritmo Lineal",
    text:
      "Genera Xi+1 = (a·Xi + c) mod m. Usa multiplicador, incremento y un módulo para producir secuencias reproducibles."
  },
  {
    id: "multiplicativo",
    title: "Algoritmo Multiplicativo",
    text:
      "Variante sin incremento: Xi+1 = (a·Xi) mod m. Requiere elegir bien 'a' y 'm' para lograr buenos periodos."
  }/*,
  {
    id: "cuadrados",
    title: "Cuadrados Medios",
    text:
      "Eleva la semilla al cuadrado y extrae los dígitos centrales como nueva semilla; simple pero con periodo corto."
  },
  {
    id: "productos",
    title: "Productos Medios",
    text:
      "Multiplica dos semillas y toma los dígitos centrales del producto para obtener el siguiente valor."
  }*/
];

export default function MethodsGrid() {
  return (
    <section className={styles.section} id="inicio" aria-labelledby="metodos-title">
      <div className={styles.header}>
        <h1 id="metodos-title" className={styles.title}>
          Generación de Números Aleatorios
        </h1>
        <p className={styles.subtitle}>
          Los números aleatorios son clave en simulaciones, criptografía y estadística.
          Estos son algunos métodos clásicos para generarlos.
        </p>
      </div>
      <div className={styles.grid}>
        {items.map((it) => (
          <Card key={it.id} title={it.title} onClick={() => console.log(it.id)}>
            {it.text}
          </Card>
        ))}
      </div>
    </section>
  );
}
