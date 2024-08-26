"use client";
import Header from "../components/Header";

import useOnScreen from "../hooks/useOnScreen";
import Link from "next/link";

function Page() {
  const [jeeRef, jeeIsVisible] = useOnScreen({ threshold: 0.5 });
  const [neetRef, neetIsVisible] = useOnScreen({ threshold: 0.5 });
  const [keamRef, keamIsVisible] = useOnScreen({ threshold: 0.5 });
  const [questionRef, questionIsVisible] = useOnScreen({ threshold: 0.5 });
  const [examExperienceRef, examExperienceIsVisible] = useOnScreen({
    threshold: 0.5,
  });
  const [systemRef, systemIsVisible] = useOnScreen({ threshold: 0.5 });
  return (
    <div className="p-20">
      <Header />
      <main className="w-full h-screen mt-20 md:mt-0 flex justify-center items-center p-20">
        <div className="md:flex block justify-between gap-[5rem] items-center">
          <div className="w-full md:w-1/2 ">
            <div className="shadow-[rgb(10,101,198)_250px_-20px_950px_43px]"></div>
            <h1 className="text-6xl text-white mt-34 font-semibold text-center">
              ExamMocker
            </h1>
            <p className="mt-4 text-[#aeaeae] text-center font-light">
              Take a mock test before you attend your exam and fullfil your
              dream
            </p>
            {/* <p className=" font-extralight text-wrap">You can register our mock exams and attend at your home . our exams are Computer Based Tests. For perfect exam feeling you can take a desktop or laptop for attend the exam otherwise your phone is ok for exams</p> */}
          </div>
          <div className=" mt-20 md:mt-0 ">
            <img src="exam.png" className="rounded-[2rem] w-96" alt="" />
          </div>
        </div>
      </main>

      <section
        id="exams"
        className="w-full mt-28 md:mt-16 flex px-4 md:px-40 flex-col gap-16 md:gap-10"
      >
        <div className="flex justify-center md:justify-start">
          <div className="p-3 border-[3px] rounded-[2rem] border-[#259ac4]">
            <Link href={"/jee"}>
              <div
                ref={jeeRef}
                hidden={jeeIsVisible ? false : true}
                className={`cursor-pointer bg-gradient-to-t from-[#090A0D] duration-700 ${jeeIsVisible && "shadow-[rgba(10,101,198,0.5)_0px_0px_700px_-10px]"} flex gap-3 flex-col justify-center items-center to-[#131C23] text-center rounded-lg border-[#0e2731] w-[320px] h-[350px]`}
              >
                <h1 className=" text-3xl  font-semibold">JEE Mains</h1>
                <h3 className="font-extralight ">Engineering</h3>
              </div>
            </Link>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <div className="p-3 border-[3px] rounded-[2rem] border-[#259ac4]">
            <div
              ref={neetRef}
              hidden={neetIsVisible ? false : true}
              className={`cursor-pointer bg-gradient-to-t from-[#090A0D] duration-700 ${neetIsVisible && "shadow-[rgba(10,101,198,0.5)_0px_0px_700px_-10px]"} flex gap-3 flex-col justify-center items-center to-[#131C23] text-center rounded-lg border-[#0e2731] w-[320px] h-[350px]`}
            >
              <h1 className=" text-3xl  font-semibold">NEET</h1>
              <h3 className="font-extralight ">Medical</h3>
            </div>
          </div>
        </div>
        <div className="flex  justify-center md:justify-start">
          <div className="p-3 border-[3px] rounded-[2rem] border-[#259ac4]">
            <div
              ref={keamRef}
              hidden={keamIsVisible ? false : true}
              className={`cursor-pointer bg-gradient-to-t from-[#090A0D] duration-700 ${keamIsVisible && "shadow-[rgba(10,101,198,0.5)_0px_0px_700px_-10px]"} flex gap-3 flex-col justify-center items-center to-[#131C23] text-center rounded-lg border-[#0e2731] w-[320px] h-[350px]`}
            >
              <h1 className=" text-3xl  font-semibold">KEAM</h1>
              <h3 className="font-extralight ">Engineering</h3>
            </div>
          </div>
        </div>
      </section>
      <section
        ref={questionRef}
        className="border-[3px]  border-[#259ac4] mt-48 md:mt-20 flex flex-col justify-center items-center p-5 px-10 text-xl rounded-[2rem]  w-full "
      >
        <h1 className="text-5xl text-center">Questions</h1>
        <div
          className={`${questionIsVisible && "duration-300 shadow-[rgba(10,101,198,0.3)_0px_100px_10000px_130px]"}`}
        ></div>
        <hr className="border-[#259ac4] w-96 mt-5" />
        <p className="mt-5 font-light ">
          We take immense pride in curating an extensive collection of
          high-quality mock test questions meticulously crafted by IITians and
          skilled students. Each question is designed to emulate the rigorous
          standards and complexity of esteemed Indian entrance examinations such
          as JEE, NEET, and KEAM. Our team of experts ensures that every
          question not only challenges your critical thinking and
          problem-solving skills but also mirrors the latest exam patterns and
          syllabus updates. With a focus on clarity, depth, and relevance, our
          questions provide an invaluable opportunity for aspirants to
          experience a realistic testing environment, enabling them to fine-tune
          their preparation and achieve their academic goals with confidence.{" "}
        </p>
      </section>
      <section
        ref={examExperienceRef}
        className="mt-10 border-[3px] border-[#259ac4] flex flex-col justify-center items-center p-5 px-10 text-xl rounded-[2rem]  w-full "
      >
        <h1 className="text-5xl text-center">Exam Experience</h1>
        <div
          className={`${examExperienceIsVisible && "duration-300 shadow-[rgba(10,101,198,0.3)_0px_100px_10000px_130px]"}`}
        ></div>
        <hr className="border-[#259ac4] w-96 mt-5" />
        <p className="mt-5 font-light ">
          We are committed to providing a mock test experience that is
          meticulously designed to replicate the rigor and atmosphere of actual
          entrance examinations such as JEE, NEET, and KEAM. Our mock tests are
          crafted by expert educators and IIT alumni to ensure that every
          aspect, from question complexity to time management challenges,
          closely mirrors the real exams. The realistic exam interface,
          comprehensive question pool, and detailed performance analysis help
          students acclimate to the pressure and format of the actual exams,
          ensuring they walk into their test centers with confidence and a clear
          understanding of what to expect. Our goal is to make the transition
          from preparation to examination day as seamless and stress-free as
          possible, offering students the opportunity to gauge their readiness
          and fine-tune their strategies in a setting that feels
          indistinguishably authentic.
        </p>
      </section>
      <section
        ref={systemRef}
        className="mt-10 border-[3px] border-[#259ac4] flex flex-col justify-center items-center p-5 px-10 text-xl rounded-[2rem]  w-full "
      >
        <h1 className="text-5xl text-center">System</h1>
        <div
          className={`${systemIsVisible && "duration-300 shadow-[rgba(10,101,198,0.3)_0px_100px_10000px_130px]"}`}
        ></div>
        <hr className="border-[#259ac4] w-96 mt-5" />
        <p className="mt-5 font-light ">
          Our system is meticulously designed to conduct exams securely,
          ensuring robustness and reliability. It is highly scalable and can
          accommodate a large number of users simultaneously. In cases where
          exams cannot be conducted on a single day, we use advanced algorithms
          to distribute dates and normalize results, ensuring fairness across
          all sessions. During the exam, the timer runs on our secure server,
          preventing any interruptions or manipulations. Our system continuously
          monitors and analyzes all actions, recording them with precise
          timestamps to ensure the integrity of the examination process. Should
          any system-related issues occur, we guarantee a full refund of the
          exam fee. For any questions or refund requests, our help desk is
          available to provide assistance and support, ensuring a transparent
          and user-friendly experience
        </p>
      </section>
      <footer className="text-center mt-20 h-4 text-[#259ac4]">
        Copyright (c) 2024 - ExamMocker
      </footer>
    </div>
  );
}
export default Page;
