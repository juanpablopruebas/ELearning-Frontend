import { CourseDataSingleCourse } from "@/types";
import { useMemo, useState } from "react";
import { BiSolidChevronDown, BiSolidChevronUp } from "react-icons/bi";
import { MdOutlineOndemandVideo } from "react-icons/md";

interface CourseContentListProps {
  contentData?: CourseDataSingleCourse[];
  isDemo?: boolean;
  activeVideo?: number;
  setActiveVideo?: (index: number) => void;
}

export const CourseContentList = ({
  contentData = [],
  isDemo = false,
  activeVideo,
  setActiveVideo,
}: CourseContentListProps) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set()
  );

  const sections = useMemo(() => {
    const map = new Map<string, CourseDataSingleCourse[]>();
    contentData.forEach((item) => {
      if (!map.has(item.sectionTitle)) {
        map.set(item.sectionTitle, []);
      }
      map.get(item.sectionTitle)!.push(item);
    });
    return Array.from(map.entries()).map(([title, items]) => ({
      title,
      items,
    }));
  }, [contentData]);

  const toggleSection = (section: string) => {
    const newSet = new Set(visibleSections);
    if (newSet.has(section)) newSet.delete(section);
    else newSet.add(section);
    setVisibleSections(newSet);
  };

  let globalIndex = 0;

  return (
    <div className="space-y-6">
      {sections.map(({ title, items }) => {
        const isVisible = visibleSections.has(title);
        const sectionTotalLength = items.reduce(
          (sum, v) => sum + v.videoLength,
          0
        );
        const displayLength =
          sectionTotalLength > 60
            ? `${(sectionTotalLength / 60).toFixed(2)} hours`
            : `${sectionTotalLength} minutes`;

        return (
          <div
            key={title}
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-4"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection(title)}
            >
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                {title}
              </h2>
              <div className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400">
                <span className="text-sm">{items.length} Lessons</span>
                <span className="text-sm">· {displayLength}</span>
                {isVisible ? (
                  <BiSolidChevronUp size={20} />
                ) : (
                  <BiSolidChevronDown size={20} />
                )}
              </div>
            </div>

            {isVisible && (
              <div className="mt-4 space-y-2">
                {items.map((item) => {
                  const index = globalIndex++;
                  const isActive = index === activeVideo;
                  const itemLength =
                    item.videoLength > 60
                      ? `${(item.videoLength / 60).toFixed(2)} hours`
                      : `${item.videoLength} minutes`;

                  return (
                    <div
                      key={item._id}
                      onClick={() => {
                        if (!isDemo && setActiveVideo) {
                          setActiveVideo(index);
                        }
                      }}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 ${
                        isActive ? "bg-gray-200 dark:bg-zinc-700" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <MdOutlineOndemandVideo
                          size={24}
                          className="text-zinc-600 dark:text-zinc-400"
                        />
                        <span className="text-sm text-zinc-800 dark:text-zinc-100">
                          {item.videoTitle}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {itemLength}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
