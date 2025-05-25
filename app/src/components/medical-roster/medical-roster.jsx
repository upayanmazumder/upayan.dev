"use client";

import React, { useState } from "react";
import styles from "./medical-roster.module.css";

const shifts = [
  "Morning - 1",
  "Morning - 2",
  "Evening - 1",
  "Evening - 2",
  "Female - OPD",
  "Male - OPD",
  "Night Duty",
];

const getDateRange = (start, end) => {
  const dates = [];
  let current = new Date(start);
  const last = new Date(end);
  while (current <= last) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const getAvailableDoctorsPerDate = (doctorNames, daysOff, date) => {
  return doctorNames.filter((doc) => !daysOff[doc]?.includes(date));
};

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const DoctorRoster = () => {
  const [step, setStep] = useState(1);
  const [numDoctors, setNumDoctors] = useState(shifts.length + 1);
  const [doctorNames, setDoctorNames] = useState([]);
  const [currentDoctor, setCurrentDoctor] = useState(0);
  const [daysOff, setDaysOff] = useState({});
  const [closedShifts, setClosedShifts] = useState({});
  const [roster, setRoster] = useState([]);
  const [dateList] = useState(getDateRange("2024-04-01", "2024-05-31"));
  const [error, setError] = useState("");
  const [showDiscardLeaves, setShowDiscardLeaves] = useState(false);

  const canTakeDayOff = (doctorIdx, date) => {
    const name = doctorNames[doctorIdx];
    const simulatedDaysOff = {
      ...daysOff,
      [name]: [...(daysOff[name] || []), date],
    };
    const available = getAvailableDoctorsPerDate(
      doctorNames,
      simulatedDaysOff,
      date
    );
    const openShifts = shifts.filter((shift) => !closedShifts[date]?.[shift]);
    return available.length >= openShifts.length;
  };

  const handleNameInput = (index, name) => {
    const updated = [...doctorNames];
    updated[index] = name;
    setDoctorNames(updated);
  };

  const handleDayOffToggle = (date) => {
    const name = doctorNames[currentDoctor];
    if (!canTakeDayOff(currentDoctor, date)) {
      setError(
        "Cannot take this day off: not enough doctors to cover all open shifts."
      );
      setTimeout(() => setError(""), 2000);
      return;
    }
    setDaysOff((prev) => {
      const currentDays = new Set(prev[name] || []);
      currentDays.has(date) ? currentDays.delete(date) : currentDays.add(date);
      return { ...prev, [name]: Array.from(currentDays) };
    });
  };

  const handleClosedShiftToggle = (date, shift) => {
    setClosedShifts((prev) => {
      const prevDay = prev[date] || {};
      return {
        ...prev,
        [date]: { ...prevDay, [shift]: !prevDay[shift] },
      };
    });
  };

  const tryGenerateRoster = (ignoreLeaves = false) => {
    const result = [];
    let errorFound = false;
    let doctorOrder = shuffle(doctorNames);

    let prevNightDoctors = new Set();

    dateList.forEach((date) => {
      const assignedDoctors = new Set();
      const dailyRoster = { date };

      const forcedDayOff = {};
      prevNightDoctors.forEach((doc) => {
        forcedDayOff[doc] = true;
      });

      const availableDoctors = doctorOrder.filter(
        (doc) =>
          (!ignoreLeaves ? !daysOff[doc]?.includes(date) : true) &&
          !forcedDayOff[doc]
      );

      const shiftsToday = shuffle(shifts);
      let usedDoctors = new Set();
      let todayNightDoctors = new Set();

      shiftsToday.forEach((shift) => {
        if (closedShifts[date]?.[shift]) {
          dailyRoster[shift] = "Closed";
          return;
        }
        const candidates = availableDoctors.filter(
          (doc) => !usedDoctors.has(doc)
        );
        if (candidates.length > 0) {
          const assigned =
            candidates[Math.floor(Math.random() * candidates.length)];
          dailyRoster[shift] = assigned;
          usedDoctors.add(assigned);
          if (shift === "Night Duty") todayNightDoctors.add(assigned);
        } else {
          dailyRoster[shift] = "⚠️";
          errorFound = true;
        }
      });

      // Fix: Always show all doctors with holiday on that day
      const holidayDoctors = doctorNames.filter(
        (doc) =>
          !Object.values(dailyRoster).includes(doc) &&
          (!ignoreLeaves ? !daysOff[doc]?.includes(date) : true) &&
          !forcedDayOff[doc]
      );
      dailyRoster["Holiday"] =
        holidayDoctors.length > 0 ? holidayDoctors.join(", ") : "None";

      Object.keys(forcedDayOff).forEach((doc) => {
        if (!Object.values(dailyRoster).includes(doc)) {
          if (dailyRoster["Holiday"] === "None")
            dailyRoster["Holiday"] = doc + " (Night Off)";
          else dailyRoster["Holiday"] += `, ${doc} (Night Off)`;
        }
      });

      result.push(dailyRoster);
      prevNightDoctors = todayNightDoctors;
      doctorOrder = [...doctorOrder.slice(1), doctorOrder[0]];
    });

    if (errorFound) {
      return false;
    }
    setRoster(result);
    setStep(6);
    return true;
  };

  const generateRoster = () => {
    const possible = tryGenerateRoster(false);
    if (!possible) {
      setShowDiscardLeaves(true);
    }
  };

  const discardLeavesAndGenerate = () => {
    setShowDiscardLeaves(false);
    tryGenerateRoster(true);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🩺 Doctor Roster Generator</h2>
      {error && <div className={styles.error}>{error}</div>}

      {showDiscardLeaves && (
        <div
          style={{
            background: "rgba(30,30,30,0.95)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#222",
              padding: "2rem",
              borderRadius: "12px",
              boxShadow: "0 2px 16px #000a",
              minWidth: 320,
              color: "#fff",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#ff5252", marginBottom: 16 }}>
              Unable to generate schedule with current leaves.
            </h3>
            <p style={{ marginBottom: 24 }}>
              Would you like to discard all leaves and try allocating again?
            </p>
            <button
              className={styles.button}
              style={{ marginRight: 12 }}
              onClick={discardLeavesAndGenerate}
            >
              Discard Leaves & Try
            </button>
            <button
              className={styles.button}
              style={{ background: "#555", color: "#fff" }}
              onClick={() => setShowDiscardLeaves(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className={styles.inputStep}>
          <label className={styles.subtitle}>
            Enter Number of Doctors (must be at least {shifts.length + 1}):
          </label>
          <input
            type="number"
            min={shifts.length + 1}
            className={styles.inputField}
            value={numDoctors}
            onChange={(e) => setNumDoctors(Number(e.target.value))}
          />
          <button
            className={styles.button}
            onClick={() => {
              setDoctorNames(new Array(Number(numDoctors)).fill(""));
              setStep(2);
            }}
            disabled={numDoctors < shifts.length + 1}
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className={styles.nameInputStep}>
          <h3 className={styles.subtitle}>Enter Names of Doctors</h3>
          {doctorNames.map((name, idx) => (
            <input
              key={idx}
              placeholder={`Doctor ${idx + 1}`}
              className={styles.nameInput}
              value={name}
              onChange={(e) => handleNameInput(idx, e.target.value)}
            />
          ))}
          <button
            className={styles.button}
            onClick={() => {
              const initialDaysOff = {};
              doctorNames.forEach((doc) => (initialDaysOff[doc] = []));
              setDaysOff(initialDaysOff);
              setCurrentDoctor(0);
              setStep(3);
            }}
            disabled={
              doctorNames.some((n) => !n.trim()) ||
              new Set(doctorNames.map((n) => n.trim())).size !==
                doctorNames.length
            }
            title={
              doctorNames.some((n) => !n.trim())
                ? "All names must be filled"
                : new Set(doctorNames.map((n) => n.trim())).size !==
                  doctorNames.length
                ? "Names must be unique"
                : ""
            }
          >
            Next
          </button>
        </div>
      )}

      {step === 3 && (
        <div className={styles.closedShiftStep}>
          <h3 className={styles.subtitle}>
            Mark Closed Shifts (Days & Shifts)
          </h3>
          <div className={styles.calendar}>
            {dateList.map((date) => (
              <div key={date} style={{ marginBottom: "1rem" }}>
                <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                  {date}
                </div>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}
                >
                  {shifts.map((shift) => {
                    const isClosed = closedShifts[date]?.[shift];
                    return (
                      <button
                        key={shift}
                        className={`${styles.dateButton} ${
                          isClosed ? styles.selected : ""
                        }`}
                        onClick={() => handleClosedShiftToggle(date, shift)}
                        type="button"
                      >
                        {shift}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <button className={styles.button} onClick={() => setStep(4)}>
            Next
          </button>
        </div>
      )}

      {step === 4 && (
        <div className={styles.daysOffStep}>
          <h3 className={styles.subtitle}>
            Select Days Off for {doctorNames[currentDoctor]}
          </h3>
          <div className={styles.calendar}>
            {dateList.map((date) => {
              const isSelected =
                daysOff[doctorNames[currentDoctor]]?.includes(date);
              const canTake = canTakeDayOff(currentDoctor, date);
              return (
                <button
                  key={date}
                  className={`${styles.dateButton} ${
                    isSelected ? styles.selected : ""
                  } ${!canTake ? styles.disabled : ""}`}
                  onClick={() => canTake && handleDayOffToggle(date)}
                  disabled={!canTake}
                  title={
                    !canTake
                      ? "Not enough doctors to cover all open shifts"
                      : ""
                  }
                >
                  {date}
                </button>
              );
            })}
          </div>
          <button
            className={styles.button}
            onClick={() => {
              if (currentDoctor < doctorNames.length - 1) {
                setCurrentDoctor(currentDoctor + 1);
              } else {
                setStep(5);
              }
            }}
          >
            {currentDoctor < doctorNames.length - 1 ? "Next Doctor" : "Done"}
          </button>
        </div>
      )}

      {step === 5 && (
        <div className={styles.generateStep}>
          <h3 className={styles.subtitle}>✅ All Set!</h3>
          <button className={styles.button} onClick={generateRoster}>
            Generate Roster
          </button>
        </div>
      )}

      {step === 6 && (
        <div className={styles.tableWrapper}>
          <h3 className={styles.subtitle}>📋 Final Roster</h3>
          <table className={styles.rosterTable}>
            <thead>
              <tr>
                <th>Date</th>
                {shifts.map((s) => (
                  <th key={s}>{s}</th>
                ))}
                <th>Holiday</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.date}</td>
                  {shifts.map((s) => (
                    <td key={s}>{row[s]}</td>
                  ))}
                  <td>{row.Holiday}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorRoster;
