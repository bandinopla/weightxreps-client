![Logo](https://weightxreps.net/logo.png)

# Welcome
I am thrilled to announce that I am releasing my forntend code to the community as open source. This has been a long-time goal of mine and I am excited to see the impact it will have. 

By making the code available to all, I am hoping to attract contributions from other developers that can help enhance the codebase. This will result in a stronger and more reliable code, as well as promote collaboration and creativity within the community. 

I believe that this open source release will be a great step forward for the project and I can't wait to see what the community will create with it.


# The Client
This is the code for the front-end side of http://weightxreps.net 

> Weight For Reps is a training journal logging tool to help you keep track of your weight training. Mostly orientated towards Powerlifting/Weightlifting style of training.

This is a [React App](https://reactjs.org/) that was created with [Create React App](https://create-react-app.dev/) and it uses [Apollo Client](https://www.apollographql.com/docs/react/) to comunicate with the server vía [GraphQL](https://graphql.org/). 

> If you are developing both backend and front end, clone both repos into a folder and name each folder `client` and `server`. This is required because the sever [generates code](https://the-guild.dev/graphql/codegen) and goes one level up and expect a client folder to exist... these files will be dynamically created:
    - `generated---db-introspection.json`
    - `generated---db-types-and-hooks.tsx`

---

## :coffee: Run local dev client
To run this if [you have the dev server](https://github.com/bandinopla/weightxreps-server) also running in your machine (http://localhost:4000/graphql), run:

```
npm run start
```
If you don't have a local database and want to use the real data from the site, run:

```
npm run start:production
```
:warning: NOTE: This will we the same as visiting the site weightxreps.net the data will be all real.

---

## :trophy: How to contribute?
You fork this repo, do your thing, and do a **pull request**.

---

## :hearts: Support / Donate
If you have a weightxreps.net account log in and go to the [donations page](https://weightxreps.net/donate)

If you want to donate directly, my paypal is pablo@weightxreps.net


