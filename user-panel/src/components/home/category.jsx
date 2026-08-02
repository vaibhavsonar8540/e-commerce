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
    <div className="container mx-auto pt-6 sm:pt-10 px-4 sm:px-8 md:px-12 lg:px-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-12 lg:gap-8 pt-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
          >
            {/* Card */}
            <Link 
              href={item.link} 
              className="relative w-[115px] min-[380px]:w-[135px] sm:w-[175px] md:w-[185px] lg:w-[200px] h-[100px] min-[380px]:h-[120px] sm:h-[155px] md:h-[165px] lg:h-[180px] bg-light-cream rounded-t-full overflow-visible group"
            >
              <CustomImage
                srcAttr={item.img}
                altAttr={item.title}
                titleAttr={item.title}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85px] min-[380px]:w-[100px] sm:w-[130px] md:w-[140px] lg:w-[150px] h-[120px] min-[380px]:h-[145px] sm:h-[180px] md:h-[195px] lg:h-[210px] object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Text */}
            <Link 
              href={item.link} 
              className="mt-2 sm:mt-5 md:mt-6 text-center text-primary font-medium text-xs sm:text-base lg:text-lg hover:underline"
            >
              {item.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
