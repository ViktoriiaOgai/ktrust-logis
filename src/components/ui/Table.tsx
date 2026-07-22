import "@/components/ui/Table.css";
import TableNotes from "@/components/ui/TableNotes/TableNotes";
import Close from "@/assets/icons/close.svg?react";
import type { TableRow } from "@/data/deliveryTables";

type TableProps = {
  id: string;
  title: string;
  rows: TableRow[];
  notes: string[];
};

export default function Table({
  id,
  title,
  rows,
  notes,
}: TableProps) {
  return (
    <section id={id} className="delivery-table">
      <h2>{title}</h2>

      <table>
        <thead>
          <tr>
            <th>Категория</th>
            <th>Тариф, $ / кг</th>
            <th>Срок доставки*</th>
            <th>Другие регионы</th>
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