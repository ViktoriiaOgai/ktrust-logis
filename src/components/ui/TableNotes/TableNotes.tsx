import Info from "@/assets/icons/info.svg?react";
import "./TableNotes.css";

interface TableNotesProps {
  notes?: string[];
}

export default function TableNotes({ notes = [] }: TableNotesProps) {
  if (!notes.length) return null;

  return (
    <div className="table-note">
      <Info className="table-note__icon" />

      <ul className="table-note__list">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </div>
  );
}