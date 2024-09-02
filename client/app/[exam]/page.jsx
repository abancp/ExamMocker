import Header from "../../components/Header"
import ExamList from "../../components/Exam/ExamList"

function Jee() {

    return (
        <div>
            <Header />
            <div className="px-2 md:px-10 mt-32 flex flex-col items-center">
                <h1 className="text-3xl md:text-5xl font-light mb-5">JEE Mains Mock Tests</h1>
                <div className="w-full flex flex-col px-4">
                <ExamList/>
                </div>
            </div>
        </div>
    )
}
export default Jee
