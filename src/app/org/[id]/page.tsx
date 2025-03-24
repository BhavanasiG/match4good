/* import Image from "next/image"; */

export default function App() {
  return (
    <>
      <section className="flex flex-col p-10 px-24">
        <div className=" relative border h-44 bg-lime-400">
          <div className="absolute bg-amber-300 h-44 w-44 border-white border-4 rounded-full top-20 left-20"></div>
        </div>
        <div className="flex flex-col border p-10 pt-32">
          <h1 className="text-xl font-semibold">Charity Name</h1>
          <div className="flex justify-between">
            <h4>Charity Location</h4>
            <h4>Date Joined: 01/03/2025</h4>
          </div>
        </div>
      </section>
      <section className="flex-col basis-full p-10 px-24">
        <div className="flex flex-col basis-full border p-10">
          <h1 className="text-xl font-semibold">Description</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
            fugit minus, blanditiis a nesciunt voluptate soluta et excepturi hic
            inventore recusandae magnam eum nihil ut facilis at quam error.
            Tempora.
          </p>
        </div>
      </section>
      <section className="flex flex-col basis-full p-10 px-24">
        <hr className="mb-10" />
        <h1 className="text-2xl font-semibold mx-auto mb-10">
          Available listings
        </h1>
        <div className="flex flex-col basis-full border p-10">
          <div className="flex justify-between">
            <h1 className="text-xl font-semibold">Description</h1>
            <p className="font-medium">Start time - End time</p>
          </div>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
            fugit minus, blanditiis a nesciunt voluptate soluta et excepturi hic
            inventore recusandae magnam eum nihil ut facilis at quam error.
            Tempora.
          </p>
        </div>
      </section>
    </>
  );
}
