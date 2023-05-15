// FOR Illustration Purposes Only

const { App, createNodeMiddleware } = require("@octokit/app");

const app = new App({
  appId: APP_ID,
  privateKey: `-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----`,
  oauth: {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  },
  webhooks: {
    secret: WEBHOOK_SECRET,
  },
});

const middleware = createNodeMiddleware(app);

require("http").createServer(middleware).listen(3000);

app.webhooks.on(
  "deployment_protection_rule.requested",
  handleProtectionRuleRequested
);

async function handleProtectionRuleRequested({ octokit, payload }) {
  console.log(`${payload.action} for #${payload.environment}`);

  var state = "rejected";

  // Simple check against sender role
  // TODO Implement more robust checks e.g. looking for specific team membership using the Octokit SDK
  
  if (payload.sender.site_admin === true) {
    state = "approved";
    console.log("admin, allow");
  } else {
    console.log("not an  admin, reject");
  }

  // See https://docs.github.com/en/rest/actions/workflow-runs#review-custom-deployment-protection-rules-for-a-workflow-run
  try {
    await octokit.request(`POST ${payload.deployment_callback_url}`, {
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      run_id: new URL(payload.deployment_callback_url).pathname
        .split("/")
        .slice(-2)[0],
      environment_name: payload.environment,
      state: state,
      comment: "Approving via GitHub App based on user permissions.",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch (error) {
    console.log(error);
  }
}
