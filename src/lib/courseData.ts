export interface CourseHole {
  hole: number;
  par: number;
}

export interface Course {
  id: string;
  name: string;
  holes: CourseHole[];
}

export const courses: Course[] = [
  {
    id: "course-a",
    name: "Course A",
    holes: [
      { hole: 1, par: 5 }, { hole: 2, par: 4 }, { hole: 3, par: 4 },
      { hole: 4, par: 3 }, { hole: 5, par: 4 }, { hole: 6, par: 5 },
      { hole: 7, par: 4 }, { hole: 8, par: 3 }, { hole: 9, par: 4 },
      { hole: 10, par: 4 }, { hole: 11, par: 5 }, { hole: 12, par: 3 },
      { hole: 13, par: 4 }, { hole: 14, par: 4 }, { hole: 15, par: 5 },
      { hole: 16, par: 4 }, { hole: 17, par: 3 }, { hole: 18, par: 4 },
    ],
  },
  {
    id: "course-b",
    name: "Course B",
    holes: [
      { hole: 1, par: 4 }, { hole: 2, par: 5 }, { hole: 3, par: 3 },
      { hole: 4, par: 4 }, { hole: 5, par: 5 }, { hole: 6, par: 4 },
      { hole: 7, par: 3 }, { hole: 8, par: 4 }, { hole: 9, par: 5 },
      { hole: 10, par: 4 }, { hole: 11, par: 3 }, { hole: 12, par: 4 },
      { hole: 13, par: 5 }, { hole: 14, par: 4 }, { hole: 15, par: 4 },
      { hole: 16, par: 3 }, { hole: 17, par: 5 }, { hole: 18, par: 4 },
    ],
  },
  {
    id: "course-c",
    name: "Course C",
    holes: [
      { hole: 1, par: 4 }, { hole: 2, par: 4 }, { hole: 3, par: 5 },
      { hole: 4, par: 4 }, { hole: 5, par: 3 }, { hole: 6, par: 4 },
      { hole: 7, par: 5 }, { hole: 8, par: 4 }, { hole: 9, par: 3 },
      { hole: 10, par: 5 }, { hole: 11, par: 4 }, { hole: 12, par: 4 },
      { hole: 13, par: 3 }, { hole: 14, par: 4 }, { hole: 15, par: 5 },
      { hole: 16, par: 4 }, { hole: 17, par: 4 }, { hole: 18, par: 3 },
    ],
  },
];

export function getTotalPar(course: Course): number {
  return course.holes.reduce((sum, h) => sum + h.par, 0);
}
