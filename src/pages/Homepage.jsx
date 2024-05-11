import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import GetAPI from "../utilities/GetAPI";
import { PostAPI } from "../utilities/PostAPI";
import { IoIosSearch } from "react-icons/io";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BASE_URL } from "../utilities/URL";
import { error_toaster, success_toaster } from "../utilities/Toaster";
import Loader from "../components/Loader";

export default function Homepage() {
  const location = useLocation().pathname;
  const navigate = useNavigate();
  const { data } = GetAPI("category/view");
  const [activeTab, setActiveTab] = useState("All");
  console.log("🚀 ~ Homepage ~ activeTab:", activeTab);
  const products = GetAPI("item/view-all");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [search, setSearch] = useState();
  const searchFunc = async (e) => {
    e.preventDefault();
    if (search === "") {
      info_toaster("Please Search Some Text");
    } else {
      let res = await PostAPI("item/search", {
        search: search,
      });
      if (res?.data?.status === "1") {
        success_toaster("Search Data");
        localStorage.setItem("searchData", JSON.stringify(res?.data?.data));
        navigate("/search");
      } else {
        error_toaster(res?.data?.mesage);
      }
    }
  };
  return data.length === 0 ? (
    <Loader />
  ) : (
    <>
      <Header />
      <section>
        <div className="bg-heroSectionBg bg-no-repeat bg-cover w-full h-[80vh] flex justify-center items-center">
          <div className="space-y-6 w-[87%] md:w-[50%] mx-auto">
            <h2 className="text-4xl text-white text-center font-medium">
              3D Models for Professionals
            </h2>
            <form onSubmit={searchFunc} className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="search"
                name="search"
                id="search"
                placeholder="Search the world best 3D model collection"
                className="w-full mx-auto h-14 bg-[#082835] rounded-full pl-6 outline-none border-none text-white"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-full bg-white w-28 h-10 absolute top-2 right-2 hover:text-[#fe8133] duration-200"
              >
                <IoIosSearch />
                <span>Search</span>
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white w-11/12 md:w-3/5 m-auto flex justify-between flex-wrap items-center py-10 cursor-pointer">
          {data?.data?.map((cat, index) => (
            <Link
              to={`category/${(cat?.slug).toString().toLowerCase()}`}
              className="flex flex-col justify-center gap-3"
              key={index}
            >
              <img
                src={`/images/categories/${cat?.slug}.webp`}
                alt={cat?.name}
                className="w-10 h-10 md:w-16 md:h-16 m-auto object-cover"
              />
              <h2 className="text-sm md:text-base uppercase text-center">
                {cat.name}
              </h2>
            </Link>
          ))}
        </div>

        <div className="bg-[#082835]">
          <div className="w-[75%] m-auto pt-5 pb-2 flex justify-center flex-wrap items-center gap-x-10 gap-y-5 border-b border-gray-400">
            <button
              className={` ${
                activeTab === "All" ? "text-white" : "text-gray-400"
              }`}
              onClick={() => handleTabClick("All")}
            >
              All
            </button>
            {data?.data?.map((cat, index) => (
              <button
                key={index}
                className={` ${
                  activeTab === `${cat?.name}` ? "text-white" : "text-gray-400"
                }`}
                onClick={() => handleTabClick(`${cat?.name}`)}
              >
                {cat?.name}
              </button>
            ))}
          </div>

          <div className="pt-10 pb-20 w-[85%] m-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 cursor-pointer">
            {activeTab === "All" && (
              <>
                {products?.data?.data?.map((prod, index) => (
                  <Link
                    className="relative [&>div]:hover:block [&>div:last-child]:hover:bottom-2 [&>div:last-child]:hover:animate-bounce"
                    to={`/product-details/${prod?.slug}`}
                    key={index}
                  >
                    <ul class="absolute top-3 left-4 z-10 flex flex-wrap items-center gap-3">
                      {prod?.itemAttributes?.map((attr, index) => (
                        <li
                          key={index}
                          class="bg-yellow-100 text-yellow-800 text-[10px] md:text-xs font-medium px-1 md:px-2.5 py-0.5 rounded"
                        >
                          {attr?.value}
                        </li>
                      ))}
                    </ul>

                    <img
                      src={`${BASE_URL}${prod?.thumbnail}`}
                      alt={prod?.name}
                      className="h-full w-full rounded-2xl object-cover hover:scale-105 duration-500"
                    />
                    <div className="bg-blue-400 uppercase text-center py-2 text-white rounded-b-md absolute w-full -bottom-20 hidden">
                      {prod?.name}
                    </div>
                  </Link>
                ))}
              </>
            )}
            {activeTab === "3DS Max" && (
              <>
                {products?.data?.data
                  ?.filter((prod) => prod.category.name === activeTab)
                  .map((prod, index) => (
                    <Link
                      className="relative [&>div]:hover:block [&>div:last-child]:hover:bottom-2 [&>div:last-child]:hover:animate-bounce"
                      to={`/product-details/${prod?.slug}`}
                      key={index}
                    >
                      <ul class="absolute top-3 left-4 z-10 flex flex-wrap items-center gap-3">
                        {prod?.itemAttributes?.map((attr, index) => (
                          <li
                            key={index}
                            class="bg-yellow-100 text-yellow-800 text-[10px] md:text-xs font-medium px-1 md:px-2.5 py-0.5 rounded"
                          >
                            {attr?.value}
                          </li>
                        ))}
                      </ul>

                      <img
                        src={`${BASE_URL}${prod?.thumbnail}`}
                        alt={prod?.name}
                        className="h-full w-full rounded-2xl object-cover hover:scale-105 duration-500"
                      />
                      <div className="bg-blue-400 uppercase text-center py-2 text-white rounded-b-md absolute w-full -bottom-20 hidden">
                        {prod?.name}
                      </div>
                    </Link>
                  ))}
                {(!products?.data?.data ||
                  products?.data?.data?.filter(
                    (prod) => prod.category.name === activeTab
                  ).length === 0) && (
                  <div className="text-center mt-4 text-white">
                    No products in this category.
                  </div>
                )}
              </>
            )}
            {activeTab === "Sketchup" && (
              <>
                {products?.data?.data
                  ?.filter((prod) => prod.category.name === activeTab)
                  .map((prod, index) => (
                    <Link
                      className="relative [&>div]:hover:block [&>div:last-child]:hover:bottom-2 [&>div:last-child]:hover:animate-bounce"
                      to={`/product-details/${prod?.slug}`}
                      key={index}
                    >
                      <ul class="absolute top-3 left-4 z-10 flex flex-wrap items-center gap-3">
                        {prod?.itemAttributes?.map((attr, index) => (
                          <li
                            key={index}
                            class="bg-yellow-100 text-yellow-800 text-[10px] md:text-xs font-medium px-1 md:px-2.5 py-0.5 rounded"
                          >
                            {attr?.value}
                          </li>
                        ))}
                      </ul>

                      <img
                        src={`${BASE_URL}${prod?.thumbnail}`}
                        alt={prod?.name}
                        className="h-full w-full rounded-2xl object-cover hover:scale-105 duration-500"
                      />
                      <div className="bg-blue-400 uppercase text-center py-2 text-white rounded-b-md absolute w-full -bottom-20 hidden">
                        {prod?.name}
                      </div>
                    </Link>
                  ))}
                {(!products?.data?.data ||
                  products?.data?.data?.filter(
                    (prod) => prod.category.name === activeTab
                  ).length === 0) && (
                  <div className="text-center mt-4 text-white">
                    No products in this category.
                  </div>
                )}
              </>
            )}
            {activeTab === "Lumion" && (
              <>
                {products?.data?.data
                  ?.filter((prod) => prod.category.name === activeTab)
                  .map((prod, index) => (
                    <Link
                      className="relative [&>div]:hover:block [&>div:last-child]:hover:bottom-2 [&>div:last-child]:hover:animate-bounce"
                      to={`/product-details/${prod?.slug}`}
                      key={index}
                    >
                      <ul class="absolute top-3 left-4 z-10 flex flex-wrap items-center gap-3">
                        {prod?.itemAttributes?.map((attr, index) => (
                          <li
                            key={index}
                            class="bg-yellow-100 text-yellow-800 text-[10px] md:text-xs font-medium px-1 md:px-2.5 py-0.5 rounded"
                          >
                            {attr?.value}
                          </li>
                        ))}
                      </ul>

                      <img
                        src={`${BASE_URL}${prod?.thumbnail}`}
                        alt={prod?.name}
                        className="h-full w-full rounded-2xl object-cover hover:scale-105 duration-500"
                      />
                      <div className="bg-blue-400 uppercase text-center py-2 text-white rounded-b-md absolute w-full -bottom-20 hidden">
                        {prod?.name}
                      </div>
                    </Link>
                  ))}
                {(!products?.data?.data ||
                  products?.data?.data?.filter(
                    (prod) => prod.category.name === activeTab
                  ).length === 0) && (
                  <div className="text-center mt-4 text-white">
                    No products in this category.
                  </div>
                )}
              </>
            )}
            {activeTab === "Photoshop" && (
              <>
                {products?.data?.data
                  ?.filter((prod) => prod.category.name === activeTab)
                  .map((prod, index) => (
                    <Link
                      className="relative [&>div]:hover:block [&>div:last-child]:hover:bottom-2 [&>div:last-child]:hover:animate-bounce"
                      to={`/product-details/${prod?.slug}`}
                      key={index}
                    >
                      <ul class="absolute top-3 left-4 z-10 flex flex-wrap items-center gap-3">
                        {prod?.itemAttributes?.map((attr, index) => (
                          <li
                            key={index}
                            class="bg-yellow-100 text-yellow-800 text-[10px] md:text-xs font-medium px-1 md:px-2.5 py-0.5 rounded"
                          >
                            {attr?.value}
                          </li>
                        ))}
                      </ul>

                      <img
                        src={`${BASE_URL}${prod?.thumbnail}`}
                        alt={prod?.name}
                        className="h-full w-full rounded-2xl object-cover hover:scale-105 duration-500"
                      />
                      <div className="bg-blue-400 uppercase text-center py-2 text-white rounded-b-md absolute w-full -bottom-20 hidden">
                        {prod?.name}
                      </div>
                    </Link>
                  ))}
                {(!products?.data?.data ||
                  products?.data?.data?.filter(
                    (prod) => prod.category.name === activeTab
                  ).length === 0) && (
                  <div className="text-center mt-4 text-white">
                    No products in this category.
                  </div>
                )}
              </>
            )}
            {activeTab === "Textures" && (
              <>
                {products?.data?.data
                  ?.filter((prod) => prod.category.name === activeTab)
                  .map((prod, index) => (
                    <Link
                      className="relative [&>div]:hover:block [&>div:last-child]:hover:bottom-2 [&>div:last-child]:hover:animate-bounce"
                      to={`/product-details/${prod?.slug}`}
                      key={index}
                    >
                      <ul class="absolute top-3 left-4 z-10 flex flex-wrap items-center gap-3">
                        {prod?.itemAttributes?.map((attr, index) => (
                          <li
                            key={index}
                            class="bg-yellow-100 text-yellow-800 text-[10px] md:text-xs font-medium px-1 md:px-2.5 py-0.5 rounded"
                          >
                            {attr?.value}
                          </li>
                        ))}
                      </ul>

                      <img
                        src={`${BASE_URL}${prod?.thumbnail}`}
                        alt={prod?.name}
                        className="h-full w-full rounded-2xl object-cover hover:scale-105 duration-500"
                      />
                      <div className="bg-blue-400 uppercase text-center py-2 text-white rounded-b-md absolute w-full -bottom-20 hidden">
                        {prod?.name}
                      </div>
                    </Link>
                  ))}
                {(!products?.data?.data ||
                  products?.data?.data?.filter(
                    (prod) => prod.category.name === activeTab
                  ).length === 0) && (
                  <div className="text-center mt-4 text-white">
                    No products in this category.
                  </div>
                )}
              </>
            )}
          </div>
          <div>
            <h2 className="text-white text-4xl font-medium w-[85%] m-auto">
              Complete Confidence
            </h2>

            <div className="pt-10 pb-10 lg:pb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 w-[90%] lg:w-[80%] m-auto">
              <div className="flex items-center gap-5 lg:gap-10">
                <div className="bg-white bg-opacity-10 w-32 h-32 flex items-center justify-center rounded-full">
                  <img
                    src="/images/price.webp"
                    alt="price"
                    className="w-14 h-14"
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="text-2xl text-white font-medium">
                    Best Price Guarantee
                  </h4>
                  <p className="text-gray-400 max-w-md">
                    Buy with confidence - we guarantee that you won't find any
                    model on our site selling for a lower price on any other
                    marketplace.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5 lg:gap-10">
                <div className="bg-white bg-opacity-10 w-32 h-32 flex items-center justify-center rounded-full">
                  <img
                    src="/images/return.webp"
                    alt="price"
                    className="w-14 h-14"
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="text-2xl text-white font-medium">
                    Simple Returns
                  </h4>
                  <p className="text-gray-400 max-w-md">
                    Did you purchase a model that doesn’t work for you? No
                    problem, we’ll give you a quick refund or store credit so
                    you can find a model that works for your project.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5 lg:gap-10">
                <div className="bg-white bg-opacity-10 w-32 h-32 flex items-center justify-center rounded-full">
                  <img
                    src="/images/support.webp"
                    alt="price"
                    className="w-14 h-14"
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="text-2xl text-white font-medium">
                    24/7 Support
                  </h4>
                  <p className="text-gray-400 max-w-md">
                    We’re here to help when you need us. Professionals are ready
                    to assist you every hour of every day with your 3D model
                    purchase via chat or support ticket.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5 lg:gap-10">
                <div className="bg-white bg-opacity-10 w-32 h-32 flex items-center justify-center rounded-full">
                  <img
                    src="/images/protection.webp"
                    alt="price"
                    className="w-14 h-14"
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="text-2xl text-white font-medium">
                    World Class Protection
                  </h4>
                  <p className="text-gray-400 max-w-md">
                    TurboSquid leads the industry with up to $1,000,000 in
                    indemnification available on your 3D model purchases. If
                    there’s ever any problem with the purchase, we’ll be there
                    to help.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
