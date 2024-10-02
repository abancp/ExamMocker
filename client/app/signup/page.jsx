'use client'

import axios from "axios"
import Link from "next/link"
import SERVER_URL from "../../config/serverUrl"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import useStore from "../../store/store";
import Header from "../../components/Header"

function Signup() {
  const [setIsLogin, setUsername, setAdmin] = useStore((state) => [
    state.setIsLogin,
    state.setUsername,
    state.setAdmin,
  ]);
  const router = useRouter()
  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    if (!(form[0].value && form[1].value && form[2].value && form[3].value && form[4].value && form[5].value)) {
      toast.error("Enter all values to register!")
      return
    }
    const user = {
      name: form[0].value,
      email: form[1].value,
      password: form[2].value,
      confirmPassword: form[3].value,
      DOB: form[4].value,
      state: form[5].value
    }
    axios.post(SERVER_URL + "/signup", user, { withCredentials: true }).then(({ data }) => {
      if (data.success) {
        toast.success("User registered : " + user.name)
        axios
          .get(SERVER_URL + "/validate-token", { withCredentials: true })
          .then(({ data }) => {
            if (data.success && data.claims.username) {
              setIsLogin(true);
            }
            setUsername(data.claims.username);
            setAdmin(data.claims.admin);
          });

        router.push("/")
      }
    }).catch((data) => {
      if (data?.response?.status == 401) {
        setErrMsg(data.response.data.error)
      } else {
        toast.error(data.response.data.error || "something went wrong!")
      }
    })

  }
  return (
    <div className="w-full max-h-fit min-h-screen justify-center flex pt-40 md:pt-24 p-10 items-center ">
      <Header/>
      <div className="w-[450px] md:w-[65rem] md:py-10 py-3 flex md:flex-row flex-col justify-around items-center h-[560px] md:h-fit border border-primary rounded-lg ">
        <div className="flex flex-col gap-3 ">
          <h1 className=" text-3xl font-bold font-sans">ExamMocker Signup</h1>
          <h5 className="md:block hidden">already have a account <Link className="text-blue-500" href={'/login'}> login here </Link></h5>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" action="">
          <input placeholder="Name" className="bg-transparent  p-1 rounded-lg text-lg border border-primary focus:outline-none focus:bg-primary focus:text-black focus:placeholder-gray-50" type="text" />
          <input placeholder="Email" className="bg-transparent p-1 rounded-lg text-lg border border-primary focus:outline-none focus:bg-primary focus:text-black focus:placeholder-gray-50" type="text" />
          <input placeholder="Password" className="bg-transparent p-1 rounded-lg text-lg border border-primary focus:outline-none focus:bg-primary focus:text-black focus:placeholder-gray-50" type="text" />
          <input placeholder="Confirm Password" className="bg-transparent p-1 rounded-lg text-lg border border-primary focus:outline-none focus:bg-primary focus:text-black focus:placeholder-gray-50" type="text" />
          <input placeholder="Date Of Birth" className="bg-transparent p-1 rounded-lg text-lg border border-primary focus:outline-none focus:bg-primary focus:text-black focus:placeholder-gray-50" type="date" />
          <select placeholder="State" className="bg-transparent p-1 rounded-lg text-lg border border-primary focus:outline-none focus:bg-primary focus:text-black focus:placeholder-gray-50" >
            <option selected value={null} >select State</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Odisha">Odisha</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="West Bengal">West Bengal</option>

            <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
            <option value="Daman and Diu">Daman and Diu</option>
            <option value="Lakshadweep">Lakshadweep</option>
            <option value="Delhi">Delhi</option>
            <option value="Puducherry">Puducherry</option>
            <option value="Ladakh">Ladakh</option>
            <option value="Jammu and Kashmir">Jammu and Kashmir</option>
            <option value="other">other</option>
            </select>
              <input placeholder="SUBMIT" className=" p-1 rounded-lg text-lg font-semibold border border-primary focus:outline-none outline-none  hover:bg-[#65c3e5] duration-300 cursor-pointer bg-primary text-black" value="SIGNUP" type="submit" />
            </form>
            <h5 className="md:hidden">already have a account <Link className="text-blue-500" href={'/login'}> login here </Link></h5>
          </div>
      </div>
      )
}
      export default Signup
