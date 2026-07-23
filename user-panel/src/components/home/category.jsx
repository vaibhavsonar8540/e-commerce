import kids from "@/assets/collection/kids-collection.webp";
import shirt from "@/assets/collection/shirt.webp";
import ethnic from "@/assets/collection/ethanic.webp";
import kitchen from "@/assets/collection/kitchen.webp";
import kurti from "@/assets/collection/kurti.webp";
import saree from "@/assets/collection/saree.webp";
import CustomImage from "../customImage";
import Link from "next/link";

const data = [
  {
    title: "Saree",
    img: saree,
    link : "/collection/women/saree"
  },
  {
    title: "Kurti",
    img: kurti,
    link : "/collection/women/kurti"
  },
  {
    title: "Casual Wear",
    img: shirt,
    link : "/collection/men/casual"
  },
  {
    title: "Ethnic Wear",
    img: ethnic,
    link : "/collection/men/ethnic-wear"
  },
  {
    title: "Kids Wear",
    img: kids,
    link : "/collection/kids"
  },
  {
    title: "Home & Kitchen",
    img: kitchen,
    link : "/collection/home-and-kitchen"
  },
];


const Category = () => {
  return (
    <div className="container mx-auto py-10 px-16">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
          >
            {/* Card */}
            <Link href={item.link} className="relative w-[200px] h-[180px] bg-light-cream rounded-t-full overflow-visible">
              <CustomImage
                srcAttr={item.img}
                altAttr={item.title}
                titleAttr={item.title}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150px] h-[210px] object-contain"
              />
            </Link>

            {/* Text */}
            <Link href={item.link} className="mt-6 text-center text-primary font-medium text-lg">
              {item.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
