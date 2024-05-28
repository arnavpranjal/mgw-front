"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import GoogleSignInButton from "../github-auth-button";
import { Icons } from "../icons";
import { Backend_URL } from "@/lib/Constants";

const formSchema = z.object({
  username: z.string().email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(4, { message: "Password Should be of atleast 6 char" }),
  otp: z.string(),
});

const resetPasswordSchema = z.object({
  xxx: z.string(),
  newpassword: z
    .string()
    .min(4, { message: "Password Should be of atleast 6 char" }),
  confirmPassword: z
    .string()
    .min(4, { message: "Password Should be of atleast 6 char" }),
  otp: z.string(),
});

type UserFormValue = z.infer<typeof formSchema>;
type ResetFormValue = z.infer<typeof resetPasswordSchema>;

export default function UserAuthForm() {
  const { setTheme } = useTheme();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [loading, setLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [otpcode, setOtp] = useState("000000");
  const [userName, setuserName] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [passwordStrengthMessage, setPasswordStrengthMessage] = useState("");

  const [alertShow, setAlertShow] = useState({
    wrongotp: false,
    wrongPassword: false,
    wrongResetOtp: false,
    confirmPassword: false,
  });

  const checkPasswordStrength = (password: any) => {
    let message = "";
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumberOrSymbol = /[0-9]|[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    if (!isLongEnough)
      message += "Password must be at least 8 characters long. ";
    if (!hasLowerCase) message += "Include at least one lowercase character. ";
    if (!hasUpperCase) message += "Include at least one uppercase character. ";
    if (!hasNumberOrSymbol)
      message += "Include at least one number or symbol. ";

    setPasswordStrengthMessage(message.trim());
  };

  const defaultValues = {
    username: "",
    password: "",
    otp: "",
    // email: "",
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const resetForm = useForm<ResetFormValue>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const sendOtp = async (name: string, email: string, otp: string) => {
    // console.log(email+"--"+"--"+otp+"--"+name);
    const res = await fetch(
      `/api/send?otp=${otp}&name=${name}&email=${email}`,
      {
        method: "GET",
      }
    );
  };

  const resendOtp = async () => {
    const res = await fetch(
      `/api/reset?otp=${otpcode}&name=${userName}&email=${resetEmail}`,
      {
        method: "GET",
      }
    );
  };

  const onSubmit = async (data: UserFormValue) => {
    if (data.otp == "") {
      const res = await fetch(Backend_URL + "/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });
      if (res.status == 401) {
        setAlertShow({ ...alertShow, wrongPassword: true });
        console.log(res.statusText);
      } else {
        const data = await res.json();
        const otp = `${Math.floor(Math.random() * 1000000 + 1)}`;
        setOtp(otp);
        setuserName(data?.user?.name);
        sendOtp(data?.user?.name, data?.user?.email, otp);
        setShowTwoFactor(true);
      }
    }

    console.log(otpcode + "==" + data.otp);
    if (otpcode === data.otp) {
      signIn("credentials", {
        username: data.username,
        password: data.password,
        callbackUrl: callbackUrl ?? "/dashboard",
      });
    } else if (otpcode != "000000") {
      setAlertShow({ ...alertShow, wrongotp: true });
      console.log(alertShow.wrongotp);
    }
  };

  const onRestPassword = async (event: any) => {
    event.preventDefault();
    console.log(event.target[0].value);
    setShowResetPassword(true);

    const otp = `${Math.floor(Math.random() * 1000000 + 1)}`;
    setOtp(otp);
    sendOtp(event.target[0].value, event.target[0].value, otp);
  };

  const onSubmit2 = async (event: any) => {
    event.preventDefault();
    console.log(event.target[1].value);
    console.log(otpcode + "==" + event.target[1].value);
    if (otpcode === event.target[1].value) {
      // confirm password check
      if (event.target[2].value == event.target[3].value) {
        const res = await fetch(Backend_URL + "/user/1", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: resetEmail,
            password: event.target[2].value,
          }),
        });
        if (res.status == 401) {
          console.log(res.statusText);
        } else {
          signIn("credentials", {
            username: resetEmail,
            password: event.target[2].value,
            callbackUrl: callbackUrl ?? "/dashboard",
          });
        }
      } else setAlertShow({ ...alertShow, confirmPassword: true });
      // confirm password check ends
    } else {
      setAlertShow({ ...alertShow, wrongResetOtp: true });
    }
  };

  useEffect(() => {
    setTheme("light");
  }, []);

  return (
    <>
      {!showForgotPass && (
        <>
          {showTwoFactor && (
            <Form {...form}>
              <div className="flex flex-col space-y-2 text-center ">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Just one more step
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter the OTP sent to the email-id {resetEmail}
                </p>
                {/* alert box */}
                {alertShow.wrongotp && (
                  <div
                    id="wrong-otp-alert"
                    className="px-1 py-1 rounded relative"
                    role="alert"
                    style={{ background: "#f2e5f7", color: "#f87171" }}
                  >
                    <span className="block sm:inline">
                      Invalid Authentication Code
                    </span>
                  </div>
                )}
              </div>
              <form
                style={{
                  marginTop: 15,
                }}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 w-full"
              >
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Authentication Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          // disabled={isPending}
                          placeholder="123456"
                        />
                      </FormControl>
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                        onClick={() => resendOtp()}
                      >
                        <a href="#">Resend Code</a>
                      </Button>
                    </FormItem>
                  )}
                />
                <Button
                  disabled={loading}
                  className="ml-auto w-full bg-black"
                  type="submit"
                >
                  {showTwoFactor ? "Confirm" : "Continue With Email"}
                </Button>
              </form>
            </Form>
          )}
          {!showTwoFactor && (
            <Form {...form}>
              <div className="flex flex-col space-y-2 text-center ">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Welcome to MergerWare
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email below to login your account
                </p>
              </div>
              {alertShow.wrongPassword && (
                <div
                  id="wrong-otp-alert"
                  className="px-1 py-1 rounded relative text-center"
                  role="alert"
                  style={{ background: "#f2e5f7", color: "#f87171" }}
                >
                  <span className="block sm:inline">
                    Invalid Email or Password!
                  </span>
                </div>
              )}
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 w-full"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          id="emailid"
                          type="text"
                          placeholder="Enter your email..."
                          disabled={loading}
                          {...field}
                          onKeyUp={(event: any) => {
                            setResetEmail(event.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your Password..."
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                        onClick={() => {
                          setShowForgotPass(true);
                        }}
                      >
                        <a href="#">Forgot Password?</a>
                      </Button>
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        style={{ float: "right" }}
                        className="px-0 font-normal"
                      >
                        <a href="https://www.mergerware.com/contact-us/">
                          Help?
                        </a>
                      </Button>
                    </FormItem>
                  )}
                />
                <Button
                  disabled={loading}
                  className="ml-auto w-full bg-black"
                  type="submit"
                >
                  {showTwoFactor ? "Confirm" : "Continue With Email"}
                </Button>
              </form>
            </Form>
          )}
        </>
      )}
      {showForgotPass && showResetPassword == false ? (
        <Form {...form}>
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Reset password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter the account&apos;s email address below and click the
              &quot;Reset My Password&quot; button
            </p>
          </div>

          <form
            onSubmit={(event) => {
              onRestPassword(event);
            }}
            className="space-y-2 w-full"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      defaultValue={resetEmail}
                      // disabled={isPending}
                      placeholder="Enter your email..."
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button disabled={loading} className="ml-auto w-full" type="submit">
              Reset My Password
            </Button>
          </form>
        </Form>
      ) : (
        showForgotPass && (
          <Form {...resetForm}>
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Change Password
              </h1>
              <p className="text-sm text-muted-foreground">
                To change password enter the OTP sent to the email-id{" "}
                {resetEmail}
              </p>
            </div>

            {alertShow.wrongResetOtp && (
              // reset otp alert
              <div
                id="wrong-otp-alert"
                className="px-1 py-1 rounded relative text-center"
                role="alert"
                style={{ background: "#f2e5f7", color: "#f87171" }}
              >
                <span className="block sm:inline">
                  Invalid Authentication Code
                </span>
              </div>
              // reset otp alert ends
            )}

            {alertShow.confirmPassword && (
              // confirm password worng alert
              <div
                id="wrong-otp-alert"
                className="px-1 py-1 rounded relative text-center"
                role="alert"
                style={{ background: "#f2e5f7", color: "#f87171" }}
              >
                <span className="block sm:inline">
                 Confirm Password does not match!
                </span>
              </div>
              // confirm password worng alert ends
            )}

            <form
              onSubmit={(event) => {
                onSubmit2(event);
              }}
              // onSubmit={resetForm.handleSubmit(onSubmit2)}
              className="space-y-2 w-full"
            >
              <FormField
                control={resetForm.control}
                name="xxx"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ display: "none" }}>
                      Authentication Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        style={{ display: "none" }}
                        {...field}
                        // disabled={isPending}
                        placeholder="Verification Code"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={resetForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authentication Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        // disabled={isPending}
                        placeholder="123456"
                        required
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={resetForm.control}
                name="newpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your Password..."
                        disabled={loading}
                        {...field}
                        onKeyUp={(e: any) =>
                          checkPasswordStrength(e.target.value)
                        }
                        required
                      />
                    </FormControl>
                    <FormMessage />
                    {passwordStrengthMessage && (
                      <div
                        className="bg-red-50 border-t border-b border-red-400 text-red-700 px-4 py-3"
                        role="alert"
                      >
                        <div className="flex">
                          <div className="py-1">
                            <svg
                              className="fill-current h-4 w-4 text-red-500 mr-2"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold">
                              Your password should have:
                            </p>
                            <ul className="list-disc pl-0 space-y-2">
                              {passwordStrengthMessage
                                .split(". ")
                                .filter(Boolean)
                                .map((rule, index) => (
                                  <li key={index} className="text-sm ">
                                    {rule}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={resetForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your Password..."
                        disabled={loading}
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={loading}
                className="ml-auto w-full"
                type="submit"
              >
                Confirm
              </Button>
            </form>
          </Form>
        )
      )}

      {/* <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full"
        >
         
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Authentication Code</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your Authentication Code..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
       
          <Button disabled={loading} className="ml-auto w-full" type="submit">
           Vefify
          </Button>

          <Button disabled={loading} className="ml-auto w-full" type="submit">
           Resend OTP
          </Button>
        </form>
      </Form> */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <GoogleSignInButton />
    </>
  );
}
