import { courses, Course } from "@/lib/courseData";

interface CourseSelectorProps {
  selectedCourse: Course;
  onSelect: (course: Course) => void;
}

export default function CourseSelector({ selectedCourse, onSelect }: CourseSelectorProps) {
  return (
    <div className="flex gap-2">
      {courses.map((course) => (
        <button
          key={course.id}
          onClick={() => onSelect(course)}
          className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-bold transition-all ${
            selectedCourse.id === course.id
              ? "border-primary bg-primary text-primary-foreground shadow-lg"
              : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5"
          }`}
        >
          ⛳ {course.name}
        </button>
      ))}
    </div>
  );
}
