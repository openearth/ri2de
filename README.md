# RI2DE

Ri2de is a webGIS toolkit based on global road datasets [OpenStreetMap] in combination with raster data to calculate road susceptibility [slope, distance to water among others]. The tool is designed to be flexible and configurable to be adapted to every country's road infrastructure evaluation needs.

## Development

### Getting started

* Clone the repository.
* Copy `.env.example` to `.env` and set the environment variables. Copy them from the [Netlify build configuration](https://app.netlify.com/sites/ri2de/settings/deploys#build-environment-variables) or ask your tech lead.
* Run app in development mode (`npm run dev`), see [scripts](#scripts).
* Changes on master trigger a new build and deploy to the [live environment](https://ri2de.netlify.com).

### Structure

```
dist/             <- generated app
  client/         <- generated client-side app

src/              <- source files
  client/         <- Nuxt app
    assets/       <- core files, not public
    components/   <- Vue components
    layouts/      <- base layout for pages
    pages/        <- view per route
    static/       <- public assets
  server/
    functions/    <- Netlify cloud functions
    lib/          <- shared cloud function helpers

.env              <- local environment variables
netlify.toml      <- Netlify build
nuxt.config.js    <- Nuxt app config
```

### Scripts

This project requires [Node.js](http://nodejs.org/) (>= v8) and [npm](https://npmjs.org/) (comes with Node).

After installing dependencies using `npm install` the following scripts are available:

`npm run ...` | Description
---|---
`analyze` | Analyze the bundles created during build.
`build` | Builds client, guide and server for production to `dist/`.
`dev` | Serves client app on [`http://localhost:7433`](http://localhost:2637) ("boer" in T9) with hot reloading.
`start` | Serves production version of client app from (`/dist/`) on [`http://localhost:7433`](http://localhost:2637).

## License

[GNU General Public License v3.0](license) (GNU GPLv3) © [Deltares](https://www.deltares.nl) and [De Voorhoede](https://www.voorhoede.nl)
