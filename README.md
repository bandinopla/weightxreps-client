![Logo](public/session-banner.jpg) 

<div align="center">
  <a href="https://weightxreps.net/">Home</a> | <a href="https://weightxreps.net/about">About</a> | <a href="https://weightxreps.net/changelog">Changelog</a>
</div>

# Welcome!
I am thrilled to announce 😂 that I am releasing my [backend code](https://github.com/bandinopla/weightxreps-server) and [frontend code](https://github.com/bandinopla/weightxreps-client) to the community as open source. This has been a long-time goal of mine and I am excited to see the impact it will have. 

By making the code available to all, I am hoping to attract contributions from other developers that can help enhance the codebase. This will result in a stronger and more reliable code, as well as promote collaboration and creativity within the community. 

I believe that this open source release will be a great step forward for the project and I can't wait to see what the community will create with it.


# :sparkles: The Client
This is the code for the front-end side of http://weightxreps.net 

> Weight For Reps is a training journal logging tool to help you keep track of your weight training. Mostly orientated towards Powerlifting/Weightlifting style of training.

This is a [React App](https://reactjs.org/) that was created with [Create React App](https://create-react-app.dev/) and it uses [Apollo Client](https://www.apollographql.com/docs/react/) to comunicate with the server vía [GraphQL](https://graphql.org/) using Hooks created with a [GraphQL Code Generator](https://www.npmjs.com/package/@graphql-codegen/cli) by the backend side during development.

If you are developing both backend and front end, know that the sever must[generates code](https://the-guild.dev/graphql/codegen) after modifying the gpahql schema, and the 2 files it will generate must be copyed to the client (these contain the react hooks the client use to interact with the graphql server):
    - `generated---db-introspection.json`
    - `generated---db-types-and-hooks.tsx`

---

## :coffee: Run client 
I'm using [github codespaces](https://github.com/features/codespaces) to edit the code, it uses the `.devcontainer` folder to create a dev environment ready to go. You can open this in [Visual Studio Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers) too.

1. To develop while pointing to the live website endpoint (will use real data)

```
npm run start:production
```
>:warning: This will we the same as visiting the site weightxreps.net the data will be all real because the client will point to the production graphql endpoint.

2. If you are also [running the backend](https://github.com/bandinopla/weightxreps-server), to connect to it, declare an env var (see .env.example) `REACT_APP_REMOTE_SERVER` and give it the full url to the server endpoint including the `/graphql` at the end (not just the host) and run:
```
npm run start
```

---
## :eyes: Some key stuff to know...
Some things you need to know to save you some time from understanding the source:
- `src\data\db.js` creation of the ApolloClient and endpoints.
- `src\codemirror\LogTextEditor.js` the Workout Editor (uses a custom [Code Mirror](https://codemirror.net/) mode)
- `src\componentes\journal\editor.js` React Component for the Editor
- `src\componentes\journal\jparser.js` Text parser to understandable tokens.
- `src\data\Menu.js` the data from the main menu of the site. 
- `src\session` code related to handling of the user session.
- `src\componentes\calendario.js` code for the calendar widget
- `src\componentes\weight-value.js` widget in charge of showing a weight unit and changed it depending on the user preference setting.
  

---

## :trophy: How to contribute?
If you would like to contribute, follow these steps:

1. Fork the `weightxreps-client` repository.
2. Create a new branch in your fork to make your changes.
3. Commit your changes to your new branch.
4. Push your changes to your fork on GitHub.
5. Submit a pull request from your branch to the `weightxreps-client` repository.

I will review your pull request and, if everything looks good, merge it into the main codebase.

#### Questions?

If you have any questions about contributing, feel free to open an issue in the `weightxreps-client` repository and ask.

---

## :hearts: Support / Donate
If you have a weightxreps.net account log in and go to the [donations page](https://weightxreps.net/donate)

If you want to donate directly, my paypal is pablo@weightxreps.net ..


