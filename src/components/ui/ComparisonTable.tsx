import "./ComparisonTable.css";
import type { ComparisonData } from "@/data/delivery/Comparison";

interface ComparisonTableProps {
  data: ComparisonData;
   equalColumns?: boolean;
}

export default function ComparisonTable({ 
  data,
  equalColumns = false,
}: ComparisonTableProps) {
  const { title, columns, rows } = data;
  
  return (
    <section className="comparison-section">
      <h2>{title}</h2>

      <table className={`comparison-table ${
          equalColumns ? "comparison-table--equal" : ""
        }`}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.title ?? rowIndex}>
              {row.title && <th scope="row">{row.title}</th>}

              {row.values.map((value, index) => (
                <td key={index}>
                  {Array.isArray(value) ? (
                    <ul>
                      {value.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    value
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}