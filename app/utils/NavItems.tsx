import Link from "next/link";

const navItemArray = [
  { name: "Home", url: "/" },
  { name: "Courses", url: "/courses" },
  { name: "About", url: "/about" },
  { name: "Policy", url: "/policy" },
  { name: "FAQ", url: "/faq" },
];

type NavItemsType = {
  activeItem: string | null;
};

export const NavItems = ({ activeItem }: NavItemsType) => {
  return (
    <div
      className={
        "flex flex-col h-60 items-center justify-around md:flex-row md:space-x-6"
      }
    >
      {navItemArray.map((item) => (
        <Link href={item.url} key={item.name}>
          <span
            className={`cursor-pointer text-lg font-medium flex flex-col ${
              activeItem === item.url
                ? "text-blue-500"
                : "text-black dark:text-white hover:text-blue-500"
            }`}
          >
            {item.name}
          </span>
        </Link>
      ))}
    </div>
  );
};
