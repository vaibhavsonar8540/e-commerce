import HeroBanner from "@/components/heroBanner";
import sellerBnr from "@/assets/seller.webp";

const SellerPage = () => {
  return (
    <div>
      <HeroBanner
        src={sellerBnr}
        altAttr="seller"
        titleAttr="seller"
        title="Grow Your Business with Our Marketplace"
        desc="Reach millions of customers, manage your products effortlessly, 
        and grow your brand with powerful seller tools and secure payments."
        btnText="Become a Seller"
        contentClass="absolute w-[20%] top-1/2 -translate-y-1/2 !left-10"
        titleClass="text-white !font-playfair font-semibold"
        descClass="text-white pt-3 pb-5 font-medium"
      />
    </div>
  );
};

export default SellerPage;
