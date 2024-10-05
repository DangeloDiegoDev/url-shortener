'use client'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { signupSchema } from "@/app/auth"
import { useRouter } from 'next/navigation'

type FormData = {
    name: string,
    nickname: string,
    email: string,
    password: string,
    confirmPassword: string
}

export type ValidFieldNames =
    | "name"
    | "nickname"
    | "email"
    | "password"
    | "confirmPassword"

export default function Signup() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(signupSchema) })

    const onSubmit = async (data: FormData) => {
        try {
            const response = await axios.post("/api/auth/signup", data)
            const { errors } = response.data;

            // Define a mapping between server-side field names and their corresponding client-side names
            const fieldErrorMapping: Record<string, ValidFieldNames> = {
                name: "name",
                nickname: "nickname",
                email: "email",
                password: "password",
                confirmPassword: "confirmPassword"
            };

            // Show all server-side errors client-side
            for (let error in errors) {
                setError(fieldErrorMapping[error], {
                    type: "server",
                    message: errors[error],
                });
            }

            if (Object.keys(errors).length === 0) {
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            alert("Submitting form failed!");
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <label htmlFor="name" className="hover:text-red-500 cursor-pointer">Name</label>
            <input id="name" {...register("name")} className="p-1 outline-none focus:ring-2 focus:ring-red-500 rounded-sm text-black" />
            {errors.name?.message && <p>{errors.name.message}</p>}
            <label htmlFor="nickname" className="hover:text-red-500 cursor-pointer">Nickname</label>
            <input id="nickname" {...register("nickname")} className="p-1 outline-none focus:ring-2 focus:ring-red-500 rounded-sm text-black" />
            {errors.nickname?.message && <p>{errors.nickname.message}</p>}
            <label htmlFor="email" className="hover:text-red-500 cursor-pointer">Email</label>
            <input id="email" {...register("email")} className="p-1 outline-none focus:ring-2 focus:ring-red-500 rounded-sm text-black" />
            {errors.email?.message && <p>{errors.email.message}</p>}
            <label htmlFor="password" className="hover:text-red-500 cursor-pointer">Password</label>
            <input id="password" type="password" {...register("password")} className="p-1 outline-none focus:ring-2 focus:ring-red-500 rounded-sm text-black" />
            {errors.password?.message && <p>{errors.password.message}</p>}
            <label htmlFor="confirm-password" className="hover:text-red-500 cursor-pointer">Confirm password</label>
            <input id="confirm-password" type="password" {...register("confirmPassword")} className="p-1 outline-none focus:ring-2 focus:ring-red-500 rounded-sm text-black" />
            {errors.confirmPassword?.message && <p>{errors.confirmPassword.message}</p>}
            <button type="submit" className="hover:text-red-500">Sign up</button>
        </form>
    )
}