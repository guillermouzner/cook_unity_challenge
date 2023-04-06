"use client";
import {useState} from "react";

interface Event {
  id: string;
  title: string;
}

type Schedule = Map<string, Map<string, Event>>;

export default function HomePage() {
  const [date, setDate] = useState<Date>(() => new Date());

  const [schedule, setSchedule] = useState<Schedule>(() => new Map());

  function handleMonthChange(offset: number) {
    const draft = new Date(date);

    draft.setMonth(date.getMonth() + offset);

    setDate(draft);
  }

  function handleNewEvent(key: string) {
    const draft = new Map(schedule);

    if (!draft.has(key)) {
      draft.set(key, new Map());
    }

    const day = draft.get(key)!;
    const id = String(+new Date());
    const title = window.prompt("Evento");

    if (!title) return;

    day.set(id, {
      id,
      title,
    });

    setSchedule(draft);
  }

  function handleDeleteEvent(key: string, id: string) {
    const draft = new Map(schedule);
    const day = draft.get(key)!;

    day.delete(id);

    setSchedule(draft);
  }

  return (
    <main className="flex flex-col items-center my-8 gap-4">
      <nav className="flex gap-4">
        <button onClick={() => handleMonthChange(-1)}>←</button>
        {date.toLocaleString("es-AR", {month: "long", year: "numeric"})}
        <button onClick={() => handleMonthChange(1)}>→</button>
      </nav>

      <div className="grid grid-cols-7 gap-4">
        {Array.from({length: 7}, (_, i) => (
          <div key={i}>
            {new Date(date.getFullYear(), date.getMonth(), i + 1).toLocaleString("es-AR", {
              weekday: "long",
            })}
          </div>
        ))}

        {Array.from(
          {length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()},
          (_, i) => {
            const key = `${date.getFullYear()}/${date.getMonth()}/${i + 1}`;

            const events = schedule.get(key);

            return (
              <div
                key={i}
                className={`border rounded-lg p-1 w-36 h-36 overflow-y-auto`}
                onClick={() => handleNewEvent(key)}
              >
                {i + 1}
                {events && (
                  <div className="flex flex-col gap-4 items-start">
                    {Array.from(events.values()).map((event) => (
                      <div
                        key={event.id}
                        className="bg-gray-600 rounded-md text-xs p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent(key, event.id);
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          },
        )}
      </div>
    </main>
  );
}
