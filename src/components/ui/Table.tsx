import "@/components/ui/Table.css";
import TableNotes from "@/components/ui/TableNotes/TableNotes";
import Close from "@/assets/icons/close.svg?react";

interface TableRow {
  category: string;
  price: string;
  delivery: string;
  note: string;
  hasCloseIcon?: boolean;
}

type TableProps = {
  id: string;
  title: string;
  columns?: string[];
  rows: TableRow[];
  notes: string[];
};

export default function Table({
  id,
  title,
  columns,
  rows,
  notes,
}: TableProps) {
  const tableColumns = columns || ['Категория', 'Тариф, $ / кг', 'Срок доставки*', 'Другие регионы'];

  return (
    <section id={id} className="delivery-table">
      <h2>{title}</h2>

      <table>
        <thead>
          <tr>
            {tableColumns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row.category}</td>
              <td>{row.price}</td>
              <td>{row.delivery}</td>

              <td>
                {row.hasCloseIcon ? (
                  <Close className="table-close-icon" />
                ) : (
                  row.note
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <TableNotes notes={notes} />
    </section>
  );
}