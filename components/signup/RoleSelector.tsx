export function RoleSelector({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (role: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">포지션 선택</p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onSelect("tutor")}
          className={`w-1/2 p-4 border rounded-xl ${
            selected === "tutor" ? "border-purple-600 bg-purple-100" : ""
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <img
              src="/signup/signup_tutor.svg"
              alt="tutor"
              className="w-20 h-20"
            />
            <span className="text-sm font-medium text-center">선생님</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => onSelect("student")}
          className={`w-1/2 p-4 border rounded-xl ${
            selected === "student" ? "border-purple-600 bg-purple-100" : ""
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <img
              src="/signup/signup_student.svg"
              alt="student"
              className="w-20 h-20"
            />
            <span className="text-sm font-medium text-center">학생</span>
          </div>
        </button>
      </div>
    </div>
  );
}
  