import { useSignIn } from "@clerk/clerk-react";
import { Button } from "./ui/button";

const SignInOAuthButtons = () => {
  const { signIn, isLoaded } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  const signInWithGoogle = () => {
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/auth-callback",
    });
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <Button
        onClick={signInWithGoogle}
        variant="secondary"
        className="w-full text-white border-zinc-200 h-11 flex gap-2"
      >
        <img src="/google.png" alt="Google" className="size-5" />
        Continue with Google
      </Button>
    </div>
  );
};
export default SignInOAuthButtons;
