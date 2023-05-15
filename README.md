# pg-actions-env

Testing Actions environment protections with custom deployment protection rules. 

This repo contains a simple GitHub App using [Octokit.js](https://github.com/octokit/webhooks.js/) to illustrate how an organization might implement a simple custom deployment protection rule by rejecting the deployment if the user is not a repo admin (but this could be extended to e.g. interrogate our APIs for things like specific team membership, etc.).

The app must be installed and configured and running. For development, I used ngrok to expose my localhost node.js server.

See https://github.com/octodemo/pg-actions-env/blob/main/app.js
Example approval : https://github.com/octodemo/pg-actions-env/actions/runs/4975918719
