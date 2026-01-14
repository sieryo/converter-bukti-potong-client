import { ENVIRONMENT, VERSION } from "@/lib/constants";

export default function EnvironmentView() {
  return (
    <div className=" fixed bottom-0 right-0">
      <span className=" font-normal text-lg text-gray-400">
        {ENVIRONMENT}
      </span>
      <span className=" text-[14px] px-1 text-gray-500">{VERSION}</span>
    </div>
  );
}
