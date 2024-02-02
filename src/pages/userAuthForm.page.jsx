import { useContext, useRef } from "react";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png"
import { Link, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {

    const authApi = "api/auth";


    let { userAuth : { token }, setUserAuth } = useContext(UserContext);

    const userAuthThroughServer = (serverRoute, formData) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + authApi + serverRoute, formData)
        .then(({ data }) => {
            storeInSession("user", JSON.stringify(data));
            setUserAuth(data);
        }).catch(({ response }) => {
            toast.error(response.data.error)
        });
    }

    const handleSubmit = (e) => {

        e.preventDefault();

        let serverRoute = type == "sign-in" ? "/login" : "/signup";

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        // Retreieve data from form.
        let form = new FormData(formElement);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { fullname, email, password } = formData;

        // Form validation.

        if (fullname) {
            if (fullname.length < 3) {
                return toast.error("Full name must be at least 3 letters long.");
            }
        }

        if (!email.length) {
            return toast.error("Please enter email.");
        }

        if (!emailRegex.test(email)) {
            return toast.error("Please enter valid email.");
        }

        if (!password.length) {
            return toast.error("Please enter password.");
        }

        if (!passwordRegex.test(password)) {
            return toast.error("Password should be 6 to 20 characters long with at least 1 numeric, 1 lowercase and 1 uppercase letters.");
        }

        userAuthThroughServer(serverRoute, formData);

    }

    const handleGoogleAuth = (e) => {
        e.preventDefault();
        authWithGoogle()
            .then(user => {
                console.log(user);
                let serverRoute = "/google-auth"
                let formData = {
                    googleAccessToken : user.accessToken
                }
                userAuthThroughServer(serverRoute, formData);
            })
            .catch(err => {
                toast.error('Trouble logging via Google');
                return console.log(err);
            })
    }

    return (
        token ? 
        <Navigate to="/" />
        :
        <AnimationWrapper keyValue={type}>
            <section className="h-cover flex items-center justify-center">
                <Toaster
                    position="bottom-center"
                    reverseOrder={false}
                />
                <form id="formElement" className="w-[80%] max-w [400px]">
                    <h1 className="text-4xl font-galasio text-center mb-24">{type == "sign-in" ? "Sign in to your account" : "Sign up today"}</h1>
                    {
                        type != "sign-in" ?
                            <InputBox
                                name="fullname"
                                type="text"
                                placeholder="Full Name"
                                icon="fi-rr-user"
                            />
                            : ""
                    }

                    <InputBox
                        name="email"
                        type="email"
                        placeholder="Email"
                        icon="fi-rr-envelope"
                    />

                    <InputBox
                        name="password"
                        type="password"
                        placeholder="Password"
                        icon="fi-rr-key"
                    />

                    <button className="btn-dark center mt-14" type="submit" onClick={handleSubmit}>
                        {type.replace("-", " ")}
                    </button>

                    <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black" />
                        <p>OR</p>
                        <hr className="w-1/2 border-black" />
                    </div>

                    <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center md:w-[50%]" onClick={handleGoogleAuth}>
                        <img src={googleIcon} alt="Google logo" className="w-5" />
                        Continue with Google
                    </button>

                    {
                        type == "sign-in"
                            ?
                            <p className="mt-6 text-dark-grey text-xl text-center">
                                Don't have an account?
                                <Link to="/signup" className="underline text-black text-xl ml-1">
                                    Join us today.
                                </Link>
                            </p>
                            :
                            <p className="mt-6 text-dark-grey text-xl text-center">
                                Already a member?
                                <Link to="/signin" className="underline text-black text-xl ml-1">
                                    Sign in here.
                                </Link>
                            </p>
                    }

                </form>
            </section>
        </AnimationWrapper>
    );
}

export default UserAuthForm;