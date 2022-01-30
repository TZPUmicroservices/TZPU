import { Student } from "../Models/Student";

const fetch = require("node-fetch");

export class FetchService {
  async getStudentById(id: number) {
    const response = await fetch("http://localhost:3000/studenti?indeks=" + id);
    const data: Student[] = await response.json();
    return (await data[0]) ?? null;
  }

  async getCoursesByDay(day: string) {
    const response = await fetch("http://localhost:3000/raspored?dan=" + day);
    const data: { dan: string; casovi: string[] }[] = await response.json();
    return (await data[0]).casovi;
  }

  async getCourseTime(name: string) {
    const response = await fetch(
      "http://100.71.13.58:8081/Predmet/Prosek/" + name
    );
    const data: { ime: string; trajanje: number; brucenika: number }[] =
      await response.json();
    // const num:Promise<number>;
    return data[0];
  }

  async getClassRoom(numOfStudents: number, id: string, courseName: string) {
    await fetch("http://100.95.77.60:8080/classroomController/sendRequest", {
      method: "POST",
      body: JSON.stringify({
        requestId: id,
        studentNumber: numOfStudents,
        courseName: courseName,
        typeOfClass: "Ucionica",
      }),
      headers: { "Content-Type": "application/json" },
    });

    console.log("PODACI: " + id + "  " + courseName);
  }
}
