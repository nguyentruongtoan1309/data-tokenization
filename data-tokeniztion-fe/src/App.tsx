import { Amplify } from "aws-amplify";
import type { WithAuthenticatorProps } from "@aws-amplify/ui-react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import config from "../../src/amplifyconfiguration.json";
import { currentSession } from "./lib/utils";
import { getRawData } from "./apis/amplify";
Amplify.configure(config, {
  API: {
    REST: {
      headers: async () => {
        return {
          Authorization: (await currentSession())?.idToken?.toString(),
        } as never;
      },
    },
  },
});

const authConfig = {
  hideSignUp: true,
};

export function App({ signOut, user }: WithAuthenticatorProps) {
  return (
    <>
      <h1>Hello {user?.username}</h1>
      <button onClick={signOut}>Sign out</button>
      <button onClick={currentSession}>Get token</button>
      <button onClick={getRawData}>Get raw data</button>
    </>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default withAuthenticator(App, authConfig);
